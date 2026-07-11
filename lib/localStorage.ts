import { ExamConfig, ExamSession, StoredResult } from "@/types/exam";

const KEYS = {
  exam: "restocare_exam_config",
  session: "restocare_exam_session",
  lastResult: "restocare_last_result",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function load<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function save<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked; the app keeps working from memory.
  }
}

function remove(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadExamConfig(): ExamConfig | null {
  return load<ExamConfig>(KEYS.exam);
}

export function saveExamConfig(config: ExamConfig): void {
  save(KEYS.exam, config);
}

export function clearExamConfig(): void {
  remove(KEYS.exam);
}

export function loadSession(): ExamSession | null {
  return load<ExamSession>(KEYS.session);
}

export function saveSession(session: ExamSession): void {
  save(KEYS.session, session);
}

export function clearSession(): void {
  remove(KEYS.session);
}

export function loadLastResult(): StoredResult | null {
  return load<StoredResult>(KEYS.lastResult);
}

export function saveLastResult(result: StoredResult): void {
  save(KEYS.lastResult, result);
}

/** Clears every piece of application data from Local Storage. */
export function resetApplication(): void {
  remove(KEYS.exam);
  remove(KEYS.session);
  remove(KEYS.lastResult);
}
