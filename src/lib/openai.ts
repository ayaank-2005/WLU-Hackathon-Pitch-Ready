const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

async function chatCompletion(apiKey: string, messages: { role: string; content: string }[], temperature = 0.7): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: 1024 }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

export async function generateQuestions(
  apiKey: string,
  jobTitle: string,
  jobDescription: string,
  count: number,
): Promise<string[]> {
  const prompt = `You are an expert interviewer. Generate exactly ${count} interview questions for a candidate applying for the role of "${jobTitle}".

${jobDescription ? `Here is the job description:\n\n${jobDescription}\n\n` : ''}Create a balanced mix of:
- Behavioral questions (using STAR method)
- Technical/role-specific questions
- Situational questions
- Cultural fit questions

Return ONLY a JSON array of strings, no other text. Example: ["Question 1?", "Question 2?"]`;

  const raw = await chatCompletion(apiKey, [{ role: 'user', content: prompt }], 0.8);

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found');
    return JSON.parse(match[0]) as string[];
  } catch {
    return raw.split('\n').filter(l => l.trim().endsWith('?')).map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).slice(0, count);
  }
}

export interface AnswerEvaluation {
  quality: 'good' | 'needs_improvement';
  feedback: string;
  followUp?: string;
}

export async function evaluateAnswer(
  apiKey: string,
  question: string,
  answer: string,
  jobTitle: string,
): Promise<AnswerEvaluation> {
  const prompt = `You are an expert interview coach evaluating a candidate's answer for a "${jobTitle}" position.

Question asked: "${question}"

Candidate's answer: "${answer}"

Evaluate the answer and respond with ONLY a JSON object (no markdown, no other text):
{
  "quality": "good" or "needs_improvement",
  "feedback": "1-2 sentence constructive feedback",
  "followUp": "A brief follow-up question if the answer was vague, incomplete, or could use more depth. Omit this field if the answer was solid."
}`;

  const raw = await chatCompletion(apiKey, [{ role: 'user', content: prompt }], 0.5);

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found');
    return JSON.parse(match[0]) as AnswerEvaluation;
  } catch {
    return {
      quality: answer.split(/\s+/).length > 20 ? 'good' : 'needs_improvement',
      feedback: 'Answer received. Try to provide specific examples and quantify your impact where possible.',
    };
  }
}

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

async function geminiGenerate(apiKey: string, prompt: string): Promise<string> {
  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    }

    lastError = await res.text();
    if (res.status === 403 || res.status === 401) {
      throw new Error(`Gemini auth error: ${lastError}`);
    }
  }

  throw new Error(`Gemini API error: ${lastError}`);
}

export async function generatePresentationTips(
  apiKey: string,
  data: {
    script: string;
    transcript: string;
    averageWPM: number;
    eyeContactPercent: number;
    fillerWords: Record<string, number>;
    totalFillers: number;
    duration: number;
    hasEyeTracking: boolean;
    scriptAccuracy: number;
  },
): Promise<string[]> {
  const fillerSummary = Object.entries(data.fillerWords)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([w, c]) => `"${w}" (${c}x)`)
    .join(', ') || 'none';

  const prompt = `You are an expert public speaking coach. A student just finished rehearsing a presentation. Analyze their performance and give 4-5 specific, actionable coaching tips.

ORIGINAL SCRIPT:
"""
${data.script.slice(0, 2000)}
"""

WHAT THEY ACTUALLY SAID (transcript):
"""
${data.transcript.slice(0, 2000)}
"""

METRICS:
- Duration: ${Math.floor(data.duration / 60)}m ${data.duration % 60}s
- Average speaking pace: ${data.averageWPM} WPM (ideal: 120-150)
- Script accuracy: ${data.scriptAccuracy}% of script words spoken in order
- Filler words: ${data.totalFillers} total — ${fillerSummary}
${data.hasEyeTracking ? `- Eye contact: ${data.eyeContactPercent}%` : '- Eye tracking: not used'}

Analyze the CONTENT of their transcript compared to the script. Look for:
1. Weak or missing opening hook
2. Poor word choices, vague language, or lack of confidence
3. Missing key points from the script
4. Awkward transitions or rambling sections
5. Filler word patterns (when they tend to appear)
6. Pacing issues (too fast, too slow, inconsistent)
7. Closing strength — did they end with impact?

Return ONLY a JSON array of 4-5 tip strings. Each tip should be 1-2 sentences, specific to what they said, and actionable. Do not include generic advice — reference their actual words when possible.

Example format: ["Your opening lacked a hook...", "You said 'like' 8 times..."]`;

  const raw = await geminiGenerate(apiKey, prompt);

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found');
    return JSON.parse(match[0]) as string[];
  } catch {
    return raw.split('\n').filter(l => l.trim().length > 10).map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["'-]\s*/, '').trim()).filter(Boolean).slice(0, 5);
  }
}

export function evaluateAnswerHeuristic(question: string, answer: string): AnswerEvaluation {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\d/.test(answer);
  const hasSpecifics = /\b(specifically|for example|instance|because|result|achieved|improved|led|managed|built|created|designed)\b/i.test(answer);

  if (wordCount < 15) {
    return {
      quality: 'needs_improvement',
      feedback: 'Your answer was quite short. Try to elaborate with a specific example using the STAR method (Situation, Task, Action, Result).',
    };
  }

  if (wordCount < 40 && !hasSpecifics) {
    return {
      quality: 'needs_improvement',
      feedback: 'Good start, but try to include more concrete details. Mention specific actions you took and measurable outcomes.',
    };
  }

  if (hasSpecifics && hasNumbers) {
    return {
      quality: 'good',
      feedback: 'Strong answer with specific details and quantifiable results. Well structured!',
    };
  }

  if (hasSpecifics || wordCount > 60) {
    return {
      quality: 'good',
      feedback: 'Good depth in your answer. Consider adding a specific metric or number to make your impact even clearer.',
    };
  }

  return {
    quality: 'needs_improvement',
    feedback: 'Decent answer. Try to use the STAR method: describe the Situation, your Task, the Action you took, and the Result.',
  };
}
