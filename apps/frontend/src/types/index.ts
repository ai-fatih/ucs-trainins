/* ===== School / Online Learning Types ===== */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  commentary: string;
}

export interface SprintStatement {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

export interface ChainStep {
  text: string;
  explanation?: string;
}

export interface CaseOption {
  text: string;
  correct: boolean;
  hint?: string;
}

export interface CaseStep {
  id: string;
  situation: string;
  question: string;
  options: CaseOption[];
  commentary: string;
}

export type LessonActivityType = 'quiz' | 'sprint' | 'match' | 'chain' | 'case';

export interface LessonActivity {
  type: LessonActivityType;
  intro?: string;
  quiz?: { questions: QuizQuestion[] };
  sprint?: { statements: SprintStatement[] };
  match?: { pairs: MatchPair[] };
  chain?: { title: string; steps: ChainStep[] };
  caseStudy?: { steps: CaseStep[] };
}

export interface TrainerResult {
  score: number;
  total: number;
  misses: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  activity: LessonActivity;
  durationMinutes: number;
  xpReward: number;
  stub?: boolean;
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
