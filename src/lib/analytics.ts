import type { SessionResults, WPMSample } from '../context/SessionContext';

const IDEAL_WPM_MIN = 120;
const IDEAL_WPM_MAX = 150;

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function calculateScriptAccuracy(script: string, transcript: string): number {
  const scriptWords = normalize(script);
  const spokenWords = normalize(transcript);
  if (scriptWords.length === 0 || spokenWords.length === 0) return 0;

  let j = 0;
  let matched = 0;
  for (let i = 0; i < scriptWords.length && j < spokenWords.length; i++) {
    while (j < spokenWords.length) {
      if (spokenWords[j] === scriptWords[i]) {
        matched++;
        j++;
        break;
      }
      j++;
    }
  }

  return Math.round((matched / scriptWords.length) * 100);
}

export function computeResults(data: {
  duration: number;
  script: string;
  transcript: string;
  words: string[];
  fillerWords: Record<string, number>;
  totalFillers: number;
  wpmSamples: WPMSample[];
  eyeContactPercent: number;
  hasEyeTracking: boolean;
}): SessionResults {
  const { duration, script, transcript, words, fillerWords, totalFillers, wpmSamples, eyeContactPercent, hasEyeTracking } = data;

  const averageWPM = duration > 0
    ? Math.round((words.length / duration) * 60)
    : 0;

  let paceScore = 100;
  if (averageWPM > 0) {
    if (averageWPM < IDEAL_WPM_MIN) {
      paceScore -= Math.min(40, (IDEAL_WPM_MIN - averageWPM) * 2);
    } else if (averageWPM > IDEAL_WPM_MAX) {
      paceScore -= Math.min(40, (averageWPM - IDEAL_WPM_MAX) * 2);
    }

    const wpmValues = wpmSamples.map(s => s.wpm).filter(v => v > 0);
    if (wpmValues.length > 2) {
      const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
      const variance = wpmValues.reduce((a, b) => a + (b - mean) ** 2, 0) / wpmValues.length;
      const cv = Math.sqrt(variance) / (mean || 1);
      paceScore -= Math.min(20, cv * 50);
    }
  }
  paceScore = Math.max(0, Math.round(paceScore));

  const eyeContactScore = Math.round(eyeContactPercent);

  const fillersPerMinute = duration > 0 ? (totalFillers / (duration / 60)) : 0;
  let fillerScore = 100;
  if (fillersPerMinute > 0) {
    fillerScore -= Math.min(80, fillersPerMinute * 12);
  }
  fillerScore = Math.max(0, Math.round(fillerScore));

  const scriptAccuracy = calculateScriptAccuracy(script, transcript);

  const overallScore = hasEyeTracking
    ? Math.round(paceScore * 0.25 + eyeContactScore * 0.25 + fillerScore * 0.25 + scriptAccuracy * 0.25)
    : Math.round(paceScore * 0.35 + fillerScore * 0.35 + scriptAccuracy * 0.3);

  const tips = generateTips({ averageWPM, eyeContactPercent, fillerWords, totalFillers, fillersPerMinute, hasEyeTracking, scriptAccuracy });

  return {
    duration,
    transcript,
    fillerWords,
    totalFillers,
    wpmSamples,
    averageWPM,
    eyeContactPercent,
    overallScore,
    paceScore,
    eyeContactScore,
    fillerScore,
    scriptAccuracy,
    tips,
    hasEyeTracking,
  };
}

function generateTips(data: {
  averageWPM: number;
  eyeContactPercent: number;
  fillerWords: Record<string, number>;
  totalFillers: number;
  fillersPerMinute: number;
  hasEyeTracking: boolean;
  scriptAccuracy: number;
}): string[] {
  const tips: string[] = [];

  if (data.averageWPM > IDEAL_WPM_MAX) {
    tips.push(`You averaged ${data.averageWPM} WPM \u2014 try slowing down to 120\u2013150 WPM. Pause briefly between key points to let your audience absorb the information.`);
  } else if (data.averageWPM > 0 && data.averageWPM < IDEAL_WPM_MIN) {
    tips.push(`Your pace was ${data.averageWPM} WPM, which is a bit slow. Try speaking with more energy \u2014 aim for 120\u2013150 WPM for confident delivery.`);
  } else if (data.averageWPM >= IDEAL_WPM_MIN) {
    tips.push(`Great pacing at ${data.averageWPM} WPM! You\u2019re right in the ideal range. Keep this natural rhythm.`);
  }

  if (data.hasEyeTracking) {
    if (data.eyeContactPercent < 50) {
      tips.push(`Eye contact was at ${data.eyeContactPercent}% \u2014 try memorizing key transitions and looking up at your audience more frequently.`);
    } else if (data.eyeContactPercent < 75) {
      tips.push(`Eye contact at ${data.eyeContactPercent}% \u2014 good effort! Push past 75% by glancing at notes only for key words.`);
    } else {
      tips.push(`Excellent eye contact at ${data.eyeContactPercent}%! Strong audience engagement throughout.`);
    }
  }

  if (data.scriptAccuracy < 50) {
    tips.push(`Script accuracy was ${data.scriptAccuracy}% \u2014 try practicing your script a few more times to improve recall. Focus on key phrases and transitions.`);
  } else if (data.scriptAccuracy < 80) {
    tips.push(`Good script recall at ${data.scriptAccuracy}%. You\u2019re hitting the main points \u2014 keep rehearsing to nail the exact wording.`);
  } else if (data.scriptAccuracy > 0) {
    tips.push(`Excellent script accuracy at ${data.scriptAccuracy}%! You know your material well.`);
  }

  if (data.totalFillers > 0) {
    const topFiller = Object.entries(data.fillerWords).sort((a, b) => b[1] - a[1])[0];
    if (topFiller) {
      tips.push(`You used \u201c${topFiller[0]}\u201d ${topFiller[1]} time${topFiller[1] > 1 ? 's' : ''}. Try replacing fillers with a brief pause \u2014 silence sounds more confident than \u201cum.\u201d`);
    }
  } else {
    tips.push(`No filler words detected \u2014 impressive! Clean speech makes you sound more prepared and confident.`);
  }

  return tips.slice(0, 4);
}
