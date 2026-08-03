/* ===== School / Online Learning Types ===== */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  commentary: string;
}

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

export interface Scenario {
  id: string;
  title: string;
  steps: string[];
}

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  startStep: string;
  steps: DecisionStep[];
}

export interface DecisionStep {
  id: string;
  question: string;
  choices: DecisionChoice[];
}

export interface DecisionChoice {
  text: string;
  next: string;
  correct: boolean;
  hint: string;
}

export type LessonActivityType = 'quiz' | 'sprint' | 'match' | 'chain' | 'case';

export interface LessonActivity {
  type: LessonActivityType;
  questionId?: string;
  matchPairIds?: string[];
  scenarioId?: string;
  decisionTreeId?: string;
  sprintQuestionIds?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  activity: LessonActivity;
  durationMinutes: number;
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  colorFrom: string;
  colorTo: string;
  modules: Module[];
  totalLessons: number;
  totalXp: number;
  estimatedHours: number;
}

export interface MonthlyCase {
  id: string;
  title: string;
  product: string;
  tags: string[];
  situation: string;
  symptoms: string[];
  diagnostics: string[];
  rootCause: string;
  solution: string[];
  prevention: string[];
  decisionTreeId: string;
  trainerLessonId: string;
}

export interface MonthlyCases {
  month: string;
  monthLabel: string;
  summary: {
    totalCases: number;
    topTopics: { label: string; count: number }[];
  };
  cases: MonthlyCase[];
}
