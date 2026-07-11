import * as XLSX from "xlsx";
import {
  ParseResult,
  Question,
  ValidationError,
} from "@/types/exam";
import { normalizeCorrectAnswer } from "./answerNormalizer";

const REQUIRED_COLUMNS: { key: string; label: string }[] = [
  { key: "question", label: "Question" },
  { key: "optiona", label: "Option A" },
  { key: "optionb", label: "Option B" },
  { key: "optionc", label: "Option C" },
  { key: "optiond", label: "Option D" },
  { key: "correctanswer", label: "Correct Answer" },
];

const SUPPORTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

export function isSupportedFile(fileName: string): boolean {
  const lowered = fileName.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => lowered.endsWith(ext));
}

function toCellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/**
 * Canonicalizes a header so matching is case-insensitive and tolerant of
 * spacing/punctuation: "Option A (Hindi)" -> "optionahindi".
 */
function canonicalHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Maps every cell to a canonical header key with trimmed text values. */
function normalizeRow(row: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const header = canonicalHeader(key);
    if (header && normalized[header] === undefined) {
      normalized[header] = toCellText(value);
    }
  }
  return normalized;
}

let idCounter = 0;

function generateQuestionId(index: number): string {
  idCounter += 1;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `q-${index + 1}-${crypto.randomUUID()}`;
  }
  return `q-${index + 1}-${Date.now()}-${idCounter}`;
}

/**
 * Parses an uploaded .xlsx / .xls / .csv file into questions.
 * Reads the first worksheet, validates every row and returns the
 * valid questions together with all validation errors.
 */
export async function parseQuestionFile(file: File): Promise<ParseResult> {
  if (!isSupportedFile(file.name)) {
    return {
      questions: [],
      errors: [
        {
          message: `Unsupported file format. Please upload a ${SUPPORTED_EXTENSIONS.join(
            ", "
          )} file.`,
        },
      ],
    };
  }

  const buffer = await file.arrayBuffer();
  return parseQuestionBuffer(buffer);
}

/**
 * Parses raw spreadsheet bytes (e.g. a sheet fetched from /public/exams)
 * using the same validation rules as an uploaded file.
 */
export function parseQuestionBuffer(buffer: ArrayBuffer): ParseResult {
  const errors: ValidationError[] = [];

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return {
      questions: [],
      errors: [{ message: "The file could not be read. It may be corrupted or password protected." }],
    };
  }

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { questions: [], errors: [{ message: "The uploaded file does not contain any worksheet." }] };
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
  });

  if (rawRows.length === 0) {
    return { questions: [], errors: [{ message: "The sheet is empty. Please add at least one question row." }] };
  }

  const rows = rawRows.map(normalizeRow);

  // Header validation (case-insensitive)
  const headers = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => headers.add(key)));

  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.has(column.key));
  if (missingColumns.length > 0) {
    return {
      questions: [],
      errors: [
        {
          message: `Missing required column(s): ${missingColumns
            .map((c) => c.label)
            .join(", ")}.`,
        },
      ],
    };
  }

  const questions: Question[] = [];
  const seenQuestions = new Map<string, number>();

  rows.forEach((row, index) => {
    // +2 => header row is row 1, data starts at row 2
    const rowNumber = index + 2;
    const questionText = row["question"] ?? "";
    const options = {
      A: row["optiona"] ?? "",
      B: row["optionb"] ?? "",
      C: row["optionc"] ?? "",
      D: row["optiond"] ?? "",
    };
    const rawCorrect = row["correctanswer"] ?? "";

    const isRowEmpty =
      !questionText &&
      !options.A &&
      !options.B &&
      !options.C &&
      !options.D &&
      !rawCorrect;
    if (isRowEmpty) return; // silently skip fully blank rows

    if (!questionText) {
      errors.push({ row: rowNumber, message: "Question text is missing." });
      return;
    }

    const missingOptions = (["A", "B", "C", "D"] as const).filter(
      (key) => !options[key]
    );
    if (missingOptions.length > 0) {
      errors.push({
        row: rowNumber,
        message: `Question has fewer than four options (missing Option ${missingOptions.join(
          ", Option "
        )}).`,
      });
      return;
    }

    if (!rawCorrect) {
      errors.push({ row: rowNumber, message: "Correct answer is missing." });
      return;
    }

    const correctAnswer = normalizeCorrectAnswer(rawCorrect, options);
    if (!correctAnswer) {
      errors.push({
        row: rowNumber,
        message: `Correct answer "${rawCorrect}" does not match any available option. Use A, B, C, D, "Option A"–"Option D" or the exact option text.`,
      });
      return;
    }

    const duplicateKey = questionText.toLowerCase().replace(/\s+/g, " ");
    const firstRow = seenQuestions.get(duplicateKey);
    if (firstRow !== undefined) {
      errors.push({
        row: rowNumber,
        message: `Duplicate question. The same question already appears in row ${firstRow}.`,
      });
      return;
    }
    seenQuestions.set(duplicateKey, rowNumber);

    // Optional Hindi translations ("Question (Hindi)", "Option A (Hindi)", …)
    const hindiOptions = {
      A: row["optionahindi"] ?? "",
      B: row["optionbhindi"] ?? "",
      C: row["optionchindi"] ?? "",
      D: row["optiondhindi"] ?? "",
    };
    const hasAllHindiOptions =
      hindiOptions.A && hindiOptions.B && hindiOptions.C && hindiOptions.D;

    questions.push({
      id: generateQuestionId(index),
      question: questionText,
      options,
      correctAnswer,
      explanation: row["explanation"] || undefined,
      role: row["role"] || undefined,
      difficulty: row["difficulty"] || undefined,
      category: row["category"] || undefined,
      questionHi: row["questionhindi"] || undefined,
      optionsHi: hasAllHindiOptions ? hindiOptions : undefined,
      explanationHi: row["explanationhindi"] || undefined,
    });
  });

  if (questions.length === 0 && errors.length === 0) {
    errors.push({ message: "No valid question rows were found in the sheet." });
  }

  return { questions, errors };
}
