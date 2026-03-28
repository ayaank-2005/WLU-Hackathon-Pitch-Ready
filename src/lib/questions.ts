import type { RoleType } from '../context/SessionContext';

interface QuestionEntry {
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'cultural_fit';
  roles: RoleType[];
}

const QUESTION_BANK: QuestionEntry[] = [
  // ── Behavioral ──
  { question: "Tell me about a time you had to meet a tight deadline. How did you handle it?", category: "behavioral", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Describe a situation where you had to work with someone you disagreed with. What happened?", category: "behavioral", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Give me an example of a time you showed leadership, even if you weren't the official leader.", category: "behavioral", roles: ["general", "product_management", "marketing", "consulting"] },
  { question: "Tell me about a project you're most proud of. What was your role and what was the outcome?", category: "behavioral", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Describe a time you failed at something. What did you learn from it?", category: "behavioral", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Tell me about a time you had to persuade someone to see things your way.", category: "behavioral", roles: ["general", "product_management", "marketing", "consulting", "finance"] },
  { question: "Give an example of when you had to adapt quickly to a change you didn't expect.", category: "behavioral", roles: ["general", "software_engineering", "product_management", "consulting"] },
  { question: "Describe a situation where you went above and beyond what was expected.", category: "behavioral", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },

  // ── Technical (Software Engineering) ──
  { question: "Walk me through how you would design a URL shortener from scratch.", category: "technical", roles: ["software_engineering"] },
  { question: "Tell me about the most complex technical problem you've solved. How did you approach debugging it?", category: "technical", roles: ["software_engineering", "data_science"] },
  { question: "How do you decide between building a feature quickly versus building it the 'right' way?", category: "technical", roles: ["software_engineering"] },
  { question: "Explain a recent technology or framework you learned. Why did you choose to learn it?", category: "technical", roles: ["software_engineering", "data_science"] },
  { question: "How would you handle a production outage that's affecting users right now?", category: "technical", roles: ["software_engineering"] },

  // ── Technical (Product Management) ──
  { question: "How would you prioritize features for a product with limited engineering resources?", category: "technical", roles: ["product_management"] },
  { question: "Walk me through how you'd define success metrics for a new feature launch.", category: "technical", roles: ["product_management"] },
  { question: "A key metric dropped 15% this week. Walk me through how you'd investigate.", category: "technical", roles: ["product_management", "data_science"] },

  // ── Technical (Data Science) ──
  { question: "Describe a time you had to clean and prepare a messy dataset. What was your approach?", category: "technical", roles: ["data_science"] },
  { question: "How would you explain a complex model's predictions to a non-technical stakeholder?", category: "technical", roles: ["data_science"] },
  { question: "Walk me through how you'd design an A/B test for a new feature.", category: "technical", roles: ["data_science", "product_management"] },

  // ── Technical (Marketing) ──
  { question: "How would you measure the ROI of a brand awareness campaign?", category: "technical", roles: ["marketing"] },
  { question: "Walk me through your process for developing a go-to-market strategy for a new product.", category: "technical", roles: ["marketing", "product_management"] },

  // ── Technical (Finance / Consulting) ──
  { question: "Walk me through a DCF analysis. When would you use it versus comparable analysis?", category: "technical", roles: ["finance"] },
  { question: "A client's revenue has been declining for three years. How would you structure your analysis?", category: "technical", roles: ["consulting", "finance"] },
  { question: "How would you size the market for electric scooter rentals in a mid-size city?", category: "technical", roles: ["consulting", "product_management"] },

  // ── Technical (Design) ──
  { question: "Walk me through your design process from initial brief to final handoff.", category: "technical", roles: ["design"] },
  { question: "How do you handle feedback that you fundamentally disagree with?", category: "technical", roles: ["design", "general"] },
  { question: "Describe how you'd approach a redesign of an existing feature that users are complaining about.", category: "technical", roles: ["design"] },

  // ── Situational ──
  { question: "If you joined a team and realized the current approach to a project was flawed, what would you do?", category: "situational", roles: ["general", "software_engineering", "product_management", "consulting"] },
  { question: "Imagine your manager asks you to take on a task that's outside your job description. How do you respond?", category: "situational", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "You discover a teammate has been taking credit for your work. How do you handle it?", category: "situational", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "You're given two equally urgent tasks from two different managers. What do you do?", category: "situational", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "A client is unhappy with the deliverable your team produced. How do you handle the conversation?", category: "situational", roles: ["consulting", "marketing", "design", "general"] },

  // ── Cultural Fit ──
  { question: "What kind of work environment helps you do your best work?", category: "cultural_fit", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Why are you interested in this role and this company specifically?", category: "cultural_fit", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Where do you see yourself in three to five years?", category: "cultural_fit", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "What motivates you outside of a paycheck?", category: "cultural_fit", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
  { question: "Tell me about a hobby or side project that you're passionate about.", category: "cultural_fit", roles: ["general", "software_engineering", "product_management", "marketing", "finance", "consulting", "data_science", "design"] },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectQuestions(roleType: RoleType, count: number): string[] {
  const eligible = QUESTION_BANK.filter(q => q.roles.includes(roleType));

  const behavioral = shuffle(eligible.filter(q => q.category === 'behavioral'));
  const technical = shuffle(eligible.filter(q => q.category === 'technical'));
  const situational = shuffle(eligible.filter(q => q.category === 'situational'));
  const cultural = shuffle(eligible.filter(q => q.category === 'cultural_fit'));

  const result: string[] = [];

  // Distribute: ~30% behavioral, ~30% technical, ~20% situational, ~20% cultural fit
  const slices = [
    { pool: behavioral, ratio: 0.3 },
    { pool: technical, ratio: 0.3 },
    { pool: situational, ratio: 0.2 },
    { pool: cultural, ratio: 0.2 },
  ];

  for (const { pool, ratio } of slices) {
    const take = Math.max(1, Math.round(count * ratio));
    result.push(...pool.slice(0, take).map(q => q.question));
  }

  // Trim to exact count or pad from remaining if needed
  if (result.length > count) {
    return shuffle(result).slice(0, count);
  }

  if (result.length < count) {
    const used = new Set(result);
    const remaining = shuffle(eligible.filter(q => !used.has(q.question)));
    for (const q of remaining) {
      if (result.length >= count) break;
      result.push(q.question);
    }
  }

  return shuffle(result);
}
