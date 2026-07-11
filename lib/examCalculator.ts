import { ExamResult, OptionKey, Question } from "@/types/exam";

export const DEFAULT_PASSING_PERCENTAGE = 60;

/**
 * Calculates the final examination result.
 * percentage = (correctAnswers / totalQuestions) * 100
 */
export function calculateResult(
  questions: Question[],
  answers: Record<string, OptionKey>,
  passingPercentage: number
): ExamResult {
  const totalQuestions = questions.length;

  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredAnswers = 0;

  for (const question of questions) {
    const selected = answers[question.id];
    if (!selected) {
      unansweredAnswers += 1;
    } else if (selected === question.correctAnswer) {
      correctAnswers += 1;
    } else {
      incorrectAnswers += 1;
    }
  }

  const percentage =
    totalQuestions > 0
      ? Math.round(((correctAnswers / totalQuestions) * 100) * 100) / 100
      : 0;

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredAnswers,
    marksObtained: correctAnswers,
    percentage,
    passingPercentage,
    passed: percentage >= passingPercentage,
  };
}

export function getPerformanceMessage(percentage: number): string {
  if (percentage >= 90) return "Excellent Performance";
  if (percentage >= 75) return "Very Good Performance";
  if (percentage >= 60) return "Good Performance";
  return "Needs Improvement";
}

/**
 * Filters questions for the candidate's role.
 * - Questions without a role value, or with role "All", are available to everyone.
 * - Questions with a specific role are shown only to candidates with that role
 *   (case-insensitive comparison).
 * - When no question in the sheet has a role at all, every question is included.
 */
export function filterQuestionsByRole(
  questions: Question[],
  candidateRole: string
): Question[] {
  const hasRoleColumn = questions.some((q) => q.role && q.role.trim() !== "");
  if (!hasRoleColumn) return questions;

  const role = candidateRole.trim().toLowerCase();
  return questions.filter((q) => {
    const questionRole = (q.role ?? "").trim().toLowerCase();
    return questionRole === "" || questionRole === "all" || questionRole === role;
  });
}
