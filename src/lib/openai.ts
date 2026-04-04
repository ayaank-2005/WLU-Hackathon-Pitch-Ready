const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PROXY_URL = '/api/chat';
const MODEL = 'openai/gpt-oss-20b';

async function chatCompletion(apiKey: string, messages: { role: string; content: string }[], temperature = 0.7): Promise<string> {
  const useProxy = !apiKey;
  const url = useProxy ? PROXY_URL : GROQ_URL;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!useProxy) headers['Authorization'] = `Bearer ${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: 1024 }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

export async function generateQuestions(
  apiKey: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
  count: number,
): Promise<string[]> {
  const prompt = `You are an expert interviewer. Generate exactly ${count} interview questions for a candidate applying for the role of "${jobTitle}"${company ? ` at ${company}` : ''}.

${jobDescription ? `Here is the job description:\n\n${jobDescription}\n\n` : ''}${company ? `Consider ${company}'s culture, values, and what they typically look for in candidates.\n\n` : ''}Create a balanced mix of:
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

export async function generateNextQuestion(
  apiKey: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
  previousQA: { question: string; answer: string; followUpAnswer?: string }[],
  questionsRemaining: number,
): Promise<string> {
  const qaHistory = previousQA
    .map((qa, i) => {
      let entry = `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`;
      if (qa.followUpAnswer) entry += `\nFollow-up answer: ${qa.followUpAnswer}`;
      return entry;
    })
    .join('\n\n');

  const prompt = `You are an expert interviewer conducting a live interview for a "${jobTitle}" position${company ? ` at ${company}` : ''}.

${jobDescription ? `Job Description:\n${jobDescription.slice(0, 1500)}\n\n` : ''}Here is the interview so far:

${qaHistory}

Based on the candidate's responses so far, generate the next interview question. The question should:
- Build on themes, strengths, or gaps from the candidate's previous answers
- Probe deeper into areas where the candidate was vague or could elaborate
- Be relevant to the role${company ? ` and ${company}'s expectations` : ''}
- Not repeat any previously asked question
- ${questionsRemaining <= 2 ? 'This is near the end — make it impactful, forward-looking, or a strong closing question.' : 'Maintain a good mix of behavioral, technical, situational, and cultural-fit questions.'}

Return ONLY the question text, no numbering, no quotes, no other text.`;

  const raw = await chatCompletion(apiKey, [{ role: 'user', content: prompt }], 0.7);
  return raw.replace(/^["'\d.\)]+\s*/, '').replace(/["']$/g, '').trim();
}

export async function evaluateAnswer(
  apiKey: string,
  question: string,
  answer: string,
  jobTitle: string,
  company?: string,
  jobDescription?: string,
): Promise<AnswerEvaluation> {
  const prompt = `You are an expert interview coach evaluating a candidate's answer for a "${jobTitle}" position${company ? ` at ${company}` : ''}.

${jobDescription ? `Relevant job context:\n${jobDescription.slice(0, 800)}\n\n` : ''}Question asked: "${question}"

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

  const raw = await chatCompletion(apiKey, [{ role: 'user', content: prompt }], 0.6);

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found');
    return JSON.parse(match[0]) as string[];
  } catch {
    return raw.split('\n').filter(l => l.trim().length > 10).map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["'-]\s*/, '').trim()).filter(Boolean).slice(0, 5);
  }
}

export interface InterviewTipAnswer {
  question: string;
  answer: string;
  feedback?: string;
  followUp?: string;
  followUpAnswer?: string;
}

export async function generateInterviewTips(
  apiKey: string,
  data: {
    jobTitle: string;
    company: string;
    roleType: string;
    jobDescription: string;
    answers: InterviewTipAnswer[];
    averageWPM: number;
    eyeContactPercent: number;
    fillerWords: Record<string, number>;
    totalFillers: number;
    duration: number;
    hasEyeTracking: boolean;
    overallScore: number;
    interviewScore: number;
  },
): Promise<string[]> {
  const fillerSummary = Object.entries(data.fillerWords)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([w, c]) => `"${w}" (${c}x)`)
    .join(', ') || 'none';

  const qaBlock = data.answers
    .map((a, i) => {
      const parts = [
        `Q${i + 1}: ${a.question.slice(0, 500)}`,
        `Answer: ${(a.answer || '(no answer)').slice(0, 1200)}`,
      ];
      if (a.feedback) parts.push(`Prior feedback given in-session: ${a.feedback.slice(0, 400)}`);
      if (a.followUp) parts.push(`Follow-up Q: ${a.followUp.slice(0, 400)}`);
      if (a.followUpAnswer) parts.push(`Follow-up answer: ${a.followUpAnswer.slice(0, 800)}`);
      return parts.join('\n');
    })
    .join('\n\n---\n\n');

  const jd = data.jobDescription.trim().slice(0, 1500);

  const prompt = `You are an expert interview coach. A candidate just finished a mock interview practice session. Give 4-5 holistic coaching tips that tie together their answers, delivery, and presence.

ROLE CONTEXT:
- Target role: "${data.jobTitle}"${data.company ? ` at ${data.company}` : ''}
- Role type: ${data.roleType}
${jd ? `\nJob description excerpt:\n"""\n${jd}\n"""\n` : ''}

QUESTIONS AND THEIR ANSWERS (what they actually said):
${qaBlock || '(No Q&A recorded)'}

DELIVERY METRICS (same session):
- Duration: ${Math.floor(data.duration / 60)}m ${data.duration % 60}s
- Interview content score (app heuristic): ${data.interviewScore}/100
- Overall delivery score: ${data.overallScore}/100
- Average pace: ${data.averageWPM} WPM (ideal for interviews: roughly 120-150)
- Filler words: ${data.totalFillers} total — ${fillerSummary}
${data.hasEyeTracking ? `- Estimated eye contact toward camera: ${data.eyeContactPercent}%` : '- Eye tracking: not used or unavailable'}

Instructions:
1. Reference specific themes from their answers where possible (strengths and gaps).
2. Mention delivery when relevant (pace, fillers, eye contact) — not generic platitudes.
3. Suggest 1-2 concrete improvements for their next real interview.
4. Keep each tip 1-2 sentences.

Return ONLY a JSON array of 4-5 tip strings, no markdown or other text.
Example: ["You answered X well but Y was vague — add metrics next time.", "..."]`;

  const raw = await chatCompletion(apiKey, [{ role: 'user', content: prompt }], 0.55);

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
