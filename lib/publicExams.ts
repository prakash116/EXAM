import { ExamConfig, PublicExamInfo } from "@/types/exam";
import { parseQuestionBuffer } from "./excelParser";
import { DEFAULT_PASSING_PERCENTAGE } from "./examCalculator";

export interface PublicExamLoadResult {
  config: ExamConfig | null;
  errors: string[];
}

/**
 * Reads the list of exams bundled with the deployment from
 * /exams/exams.json. Returns an empty list when the manifest is
 * missing or invalid (the app then falls back to admin upload only).
 */
export async function fetchPublicExams(): Promise<PublicExamInfo[]> {
  try {
    const response = await fetch("/exams/exams.json", { cache: "no-store" });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    const exams = (data as { exams?: unknown })?.exams;
    if (!Array.isArray(exams)) return [];
    return exams.filter(
      (exam): exam is PublicExamInfo =>
        typeof exam === "object" &&
        exam !== null &&
        typeof (exam as PublicExamInfo).id === "string" &&
        typeof (exam as PublicExamInfo).title === "string" &&
        typeof (exam as PublicExamInfo).file === "string"
    );
  } catch {
    return [];
  }
}

/**
 * Downloads and parses one bundled exam sheet from /public/exams,
 * returning a ready-to-use ExamConfig or the validation errors.
 */
export async function loadPublicExam(
  info: PublicExamInfo
): Promise<PublicExamLoadResult> {
  let buffer: ArrayBuffer;
  try {
    const response = await fetch(`/exams/${encodeURIComponent(info.file)}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        config: null,
        errors: [`Could not load "${info.file}" (HTTP ${response.status}).`],
      };
    }
    buffer = await response.arrayBuffer();
  } catch {
    return {
      config: null,
      errors: ["Network error while loading the examination sheet."],
    };
  }

  const parsed = parseQuestionBuffer(buffer);
  if (parsed.errors.length > 0 || parsed.questions.length === 0) {
    const messages = parsed.errors.map(
      (error) => `${error.row ? `Row ${error.row}: ` : ""}${error.message}`
    );
    return {
      config: null,
      errors: messages.length > 0 ? messages : ["The sheet contains no valid questions."],
    };
  }

  return {
    config: {
      title: info.title,
      description: info.description ?? "",
      passingPercentage: info.passingPercentage ?? DEFAULT_PASSING_PERCENTAGE,
      questions: parsed.questions,
      createdAt: new Date().toISOString(),
      sourceId: info.id,
    },
    errors: [],
  };
}
