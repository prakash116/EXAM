"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Award,
  BookOpen,
  FileSpreadsheet,
  Loader2,
  Play,
  RotateCcw,
  Settings,
  Trash2,
} from "lucide-react";
import {
  ExamConfig,
  ExamSession,
  PublicExamInfo,
  StoredResult,
} from "@/types/exam";
import {
  clearSession,
  loadExamConfig,
  loadLastResult,
  loadSession,
  resetApplication,
  saveExamConfig,
} from "@/lib/localStorage";
import { fetchPublicExams, loadPublicExam } from "@/lib/publicExams";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [lastResult, setLastResult] = useState<StoredResult | null>(null);
  const [publicExams, setPublicExams] = useState<PublicExamInfo[]>([]);
  const [startingExamId, setStartingExamId] = useState<string | null>(null);
  const [publicExamError, setPublicExamError] = useState<string | null>(null);

  useEffect(() => {
    setExam(loadExamConfig());
    setSession(loadSession());
    setLastResult(loadLastResult());
    setMounted(true);
    fetchPublicExams().then(setPublicExams);
  }, []);

  const handleStartPublicExam = async (info: PublicExamInfo) => {
    if (session?.status === "in_progress") {
      const confirmed = window.confirm(
        "An examination is already in progress. Starting a new examination will discard it. Continue?\n\nएक परीक्षा पहले से चल रही है। नई परीक्षा शुरू करने से वह हट जाएगी। जारी रखें?"
      );
      if (!confirmed) return;
    }

    setPublicExamError(null);
    setStartingExamId(info.id);
    try {
      const { config, errors } = await loadPublicExam(info);
      if (!config) {
        setPublicExamError(
          `"${info.title}" could not be loaded: ${errors.join(" ")}`
        );
        return;
      }
      saveExamConfig(config);
      clearSession();
      router.push("/register");
    } finally {
      setStartingExamId(null);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset Application?\n\nThis will permanently delete the examination, uploaded questions, candidate details, answers and results stored on this device."
    );
    if (!confirmed) return;
    resetApplication();
    setExam(null);
    setSession(null);
    setLastResult(null);
  };

  if (!mounted) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" aria-label="Loading" />
      </div>
    );
  }

  const hasActiveExam = session?.status === "in_progress";
  const hasResult = session?.status === "submitted" || Boolean(lastResult);

  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-8 rounded-2xl bg-charcoal p-8 text-center text-white shadow-card">
        <h1 className="text-2xl font-extrabold text-gold-400 sm:text-3xl">
          Welcome to RestoCare Academy
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
          Upload an Excel or CSV question sheet, create an examination and let
          candidates take the test and see their result instantly — all on this
          device, no server required.
        </p>
      </section>

      {publicExams.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-charcoal">
            <BookOpen className="h-5 w-5 text-gold-600" aria-hidden="true" />
            Available Examinations / उपलब्ध परीक्षाएँ
          </h2>

          {publicExamError && (
            <p
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {publicExamError}
            </p>
          )}

          <div className="space-y-3">
            {publicExams.map((info) => {
              const isActive = exam?.sourceId === info.id;
              const isStarting = startingExamId === info.id;
              return (
                <div
                  key={info.id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-charcoal">
                      {info.title}
                      {isActive && (
                        <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-800">
                          Active
                        </span>
                      )}
                    </h3>
                    {info.description && (
                      <p className="mt-1 text-sm text-gray-600">{info.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartPublicExam(info)}
                    disabled={startingExamId !== null}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isStarting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isStarting ? "Loading…" : "Take Exam / परीक्षा दें"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {exam ? (
        <section className="mb-6 rounded-xl border border-gold-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Active Examination
          </p>
          <h2 className="mt-1 text-xl font-bold text-charcoal">{exam.title}</h2>
          {exam.description && (
            <p className="mt-1 text-sm text-gray-600">{exam.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {exam.questions.length} questions · Passing percentage:{" "}
            {exam.passingPercentage}%
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(hasActiveExam ? "/exam" : "/register")}
              className="flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {hasActiveExam ? "Resume Examination" : "Take Examination"}
            </button>
            {hasResult && (
              <Link
                href="/result"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                View Last Result
              </Link>
            )}
          </div>
        </section>
      ) : publicExams.length === 0 ? (
        <section className="mb-6 rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center shadow-card">
          <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-gold-500" aria-hidden="true" />
          <h2 className="text-lg font-bold text-charcoal">No examination created yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
            Go to the Examination Setup page to upload a question sheet and
            create your first examination.
          </p>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/setup"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-card transition-colors hover:border-gold-400"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-100">
            <Settings className="h-5 w-5 text-gold-700" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold text-charcoal">
              Examination Setup
            </span>
            <span className="block text-xs text-gray-500">
              Upload questions and create an examination
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-card transition-colors hover:border-red-400"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold text-charcoal">
              Reset Application
            </span>
            <span className="block text-xs text-gray-500">
              Clear all stored examination data from this device
            </span>
          </span>
        </button>
      </div>

      {lastResult && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-charcoal">
            <RotateCcw className="h-4 w-4 text-gold-600" aria-hidden="true" />
            Latest Result
          </h3>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{lastResult.candidate.fullName}</span>{" "}
            ({lastResult.candidate.role}) scored{" "}
            <span className="font-semibold">
              {Math.round(lastResult.result.percentage)}%
            </span>{" "}
            in “{lastResult.examTitle}” —{" "}
            <span
              className={`font-bold ${
                lastResult.result.passed ? "text-green-700" : "text-red-700"
              }`}
            >
              {lastResult.result.passed ? "PASS" : "FAIL"}
            </span>
          </p>
        </section>
      )}
    </div>
  );
}
