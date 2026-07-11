"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Send, User } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import QuestionNavigator from "@/components/QuestionNavigator";
import SubmitConfirmation from "@/components/SubmitConfirmation";
import { ExamConfig, ExamSession, OptionKey, Question } from "@/types/exam";
import { calculateResult } from "@/lib/examCalculator";
import { t } from "@/lib/i18n";
import {
  loadExamConfig,
  loadSession,
  saveLastResult,
  saveSession,
} from "@/lib/localStorage";

export default function ExamPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedExam = loadExamConfig();
    const storedSession = loadSession();

    if (!storedExam) {
      router.replace("/setup");
      return;
    }
    if (!storedSession) {
      router.replace("/register");
      return;
    }
    if (storedSession.status === "submitted") {
      router.replace("/result");
      return;
    }

    setExam(storedExam);
    setSession(storedSession);
    setMounted(true);
  }, [router]);

  const questions: Question[] = useMemo(() => {
    if (!exam || !session) return [];
    const byId = new Map(exam.questions.map((q) => [q.id, q]));
    return session.questionIds
      .map((id) => byId.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [exam, session]);

  const updateSession = useCallback((updater: (prev: ExamSession) => ExamSession) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveSession(next);
      return next;
    });
  }, []);

  const handleSelect = (questionId: string, option: OptionKey) => {
    updateSession((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: option },
    }));
  };

  const handleNavigate = (index: number) => {
    updateSession((prev) => ({ ...prev, currentIndex: index }));
  };

  if (!mounted || !exam || !session || questions.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" aria-label="Loading" />
      </div>
    );
  }

  const lang = session.candidate.language || "en";
  const currentIndex = Math.min(session.currentIndex, questions.length - 1);
  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => session.answers[q.id]).length;
  const unansweredNumbers = questions
    .map((q, index) => (session.answers[q.id] ? null : index + 1))
    .filter((n): n is number => n !== null);

  // Candidates may skip questions — submission is always allowed; the
  // confirmation modal warns about any unanswered questions.
  const handleSubmitClick = () => setShowConfirmation(true);

  const handleFinalSubmit = () => {
    const result = calculateResult(
      questions,
      session.answers,
      exam.passingPercentage
    );
    const submittedAt = new Date().toISOString();
    const finalSession: ExamSession = {
      ...session,
      status: "submitted",
      result,
      submittedAt,
    };
    saveSession(finalSession);
    saveLastResult({
      candidate: session.candidate,
      examTitle: exam.title,
      result,
      submittedAt,
    });
    router.push("/result");
  };

  return (
    <div className="w-full min-w-0">
      {/* Sticky exam header (desktop) */}
      <div className="mb-5 min-w-0 rounded-xl bg-white p-4 shadow-card sm:sticky sm:top-[68px] sm:z-30 sm:mb-6 sm:p-5">
        <div className="mb-3 flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-wrap-safe text-base font-bold text-charcoal sm:text-lg">
              {exam.title}
            </h1>
            <p className="text-wrap-safe mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-600 sm:text-sm">
              <User className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
              <span className="min-w-0">
                {session.candidate.fullName} · {session.candidate.role}
              </span>
            </p>
          </div>
          <div className="min-w-0 text-left text-xs text-gray-600 sm:text-right sm:text-sm">
            <p className="font-bold text-charcoal">
              {t(lang, "questionOf", {
                current: currentIndex + 1,
                total: questions.length,
              })}
            </p>
            <p className="text-wrap-safe">
              <span className="font-semibold text-green-700">
                {t(lang, "answeredCount", { count: answeredCount })}
              </span>
              {" · "}
              <span className="font-semibold text-red-600">
                {t(lang, "unansweredCount", { count: unansweredNumbers.length })}
              </span>
            </p>
          </div>
        </div>
        <ProgressBar
          answered={answeredCount}
          total={questions.length}
          language={lang}
        />
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6">
        <div className="min-w-0">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            selected={session.answers[currentQuestion.id]}
            language={lang}
            onSelect={(option) => handleSelect(currentQuestion.id, option)}
          />

          <div className="mt-5 flex min-w-0 items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {t(lang, "previous")}
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => handleNavigate(currentIndex + 1)}
                className="flex min-w-0 items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 sm:px-5"
              >
                {t(lang, "next")}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitClick}
                className="flex min-w-0 items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 sm:px-5"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {t(lang, "submitExam")}
              </button>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <QuestionNavigator
            questions={questions}
            answers={session.answers}
            currentIndex={currentIndex}
            language={lang}
            onNavigate={handleNavigate}
          />

          <button
            type="button"
            onClick={handleSubmitClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-5 py-3 text-sm font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {t(lang, "submitExam")}
          </button>
        </div>
      </div>

      <SubmitConfirmation
        open={showConfirmation}
        language={lang}
        unansweredNumbers={unansweredNumbers}
        onContinue={() => setShowConfirmation(false)}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
}
