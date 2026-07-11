export type OptionKey = "A" | "B" | "C" | "D";

export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export type Language = "en" | "hi";

export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
  explanation?: string;
  role?: string;
  difficulty?: string;
  category?: string;
  /** Optional Hindi translations (from "… (Hindi)" columns in the sheet) */
  questionHi?: string;
  optionsHi?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanationHi?: string;
}

export interface ExamConfig {
  title: string;
  description: string;
  passingPercentage: number;
  questions: Question[];
  createdAt: string;
  /** Set when the exam was loaded from a bundled sheet in /public/exams */
  sourceId?: string;
}

/** An exam listed in public/exams/exams.json (bundled with the deployment) */
export interface PublicExamInfo {
  id: string;
  title: string;
  description?: string;
  file: string;
  passingPercentage?: number;
}

export interface Candidate {
  fullName: string;
  mobile?: string;
  email?: string;
  role: string;
  /** Examination language chosen by the candidate (defaults to English) */
  language: Language;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredAnswers: number;
  marksObtained: number;
  percentage: number;
  passingPercentage: number;
  passed: boolean;
}

export type SessionStatus = "in_progress" | "submitted";

export interface ExamSession {
  candidate: Candidate;
  questionIds: string[];
  answers: Record<string, OptionKey>;
  status: SessionStatus;
  currentIndex: number;
  startedAt: string;
  submittedAt?: string;
  result?: ExamResult;
}

export interface StoredResult {
  candidate: Candidate;
  examTitle: string;
  result: ExamResult;
  submittedAt: string;
}

export interface ValidationError {
  row?: number;
  message: string;
}

export interface ParseResult {
  questions: Question[];
  errors: ValidationError[];
}
