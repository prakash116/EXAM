import { OPTION_KEYS, OptionKey, Question } from "@/types/exam";

/**
 * Normalizes a raw "Correct Answer" cell value into an option key (A/B/C/D).
 *
 * Supported formats:
 *  - "A", "b", "C", "d"            -> letter
 *  - "Option A", "option b"        -> letter
 *  - Exact option text (trimmed, case-insensitive) -> matching letter
 *
 * Returns null when the value cannot be matched to any option.
 */
export function normalizeCorrectAnswer(
  raw: string,
  options: Question["options"]
): OptionKey | null {
  const value = raw.trim();
  if (!value) return null;

  const letterMatch = value.match(/^(?:option\s*)?([a-d])$/i);
  if (letterMatch) {
    return letterMatch[1].toUpperCase() as OptionKey;
  }

  const lowered = value.toLowerCase();
  for (const key of OPTION_KEYS) {
    if (options[key].trim().toLowerCase() === lowered) {
      return key;
    }
  }

  return null;
}
