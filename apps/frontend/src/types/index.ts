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
  skills?: string[];
  modules: Module[];
  totalLessons: number;
  totalXp: number;
  estimatedHours: number;
}

export interface YearTopic {
  label: string;
  count: number;
}

export interface YearSummary {
  totalCases: number;
  topTopics: YearTopic[];
}

export type CaseCategory =
  | 'marking'
  | 'egais'
  | 'errors'
  | 'nomenclature'
  | 'cash'
  | 'reports'
  | 'pricing'
  | 'integration';

export interface YearlyCase {
  id: string;
  title: string;
  request?: string;
  product: string;
  category: CaseCategory;
  tags: string[];
  count?: number;
  instructionId?: string;
  courseId?: string;
  lessonId?: string;
}

export interface YearMonth {
  month: string;
  label: string;
  monthLabel?: string;
  count?: number;
  totalRequests?: number;
  planned?: boolean;
  courseId?: string;
  summary?: YearSummary;
  cases?: YearlyCase[];
}

export interface YearlyCases {
  year: number;
  months: YearMonth[];
}

export interface InstructionStep {
  title: string;
  body: string;
}

export interface CommonError {
  error: string;
  reason: string;
  solution: string;
}

export interface Instruction {
  id: string;
  title: string;
  description: string;
  product: string;
  tags: string[];
  steps: InstructionStep[];
  commonErrors: CommonError[];
  sourceCaseIds: string[];
  courseId: string;
  lessonId: string;
  stub?: boolean;
}
