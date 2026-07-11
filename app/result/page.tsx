"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  FilePlus2,
  Home,
  Loader2,
  Printer,
  RotateCcw,
} from "lucide-react";
import AnswerReview from "@/components/AnswerReview";
import ResultSummary from "@/components/ResultSummary";
import { ExamConfig, ExamSession, Question } from "@/types/exam";
import {
  clearSession,
  loadExamConfig,
  loadSession,
  saveSession,
} from "@/lib/localStorage";

export default function ResultPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);

  useEffect(() => {
    const storedExam = loadExamConfig();
    const storedSession = loadSession();

    if (!storedExam) {
      router.replace("/setup");
      return;
    }
    if (!storedSession || storedSession.status !== "submitted" || !storedSession.result) {
      router.replace(storedSession ? "/exam" : "/register");
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

  if (!mounted || !exam || !session || !session.result) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" aria-label="Loading" />
      </div>
    );
  }

  const handlePrint = () => window.print();

  const handleRetake = () => {
    const confirmed = window.confirm(
      "Retake Examination?\n\nYour previous answers will be cleared and the same examination will start again."
    );
    if (!confirmed) return;
    const retakeSession: ExamSession = {
      ...session,
      answers: {},
      status: "in_progress",
      currentIndex: 0,
      startedAt: new Date().toISOString(),
      submittedAt: undefined,
      result: undefined,
    };
    saveSession(retakeSession);
    router.push("/exam");
  };

  const handleStartNew = () => {
    clearSession();
    router.push("/register");
  };

  const actionButtonClass =
    "flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="print-area space-y-6">
        {/* Print-only letterhead */}
        <div className="hidden print:block">
          <h1 className="text-xl font-extrabold">RestoCare Academy</h1>
          <p className="text-sm text-gray-600">
            Online Examination System — Result Sheet
          </p>
          <hr className="my-3" />
        </div>

        <ResultSummary
          candidate={session.candidate}
          examTitle={exam.title}
          result={session.result}
          submittedAt={session.submittedAt}
          language={session.candidate.language || "en"}
        />

        <div className="no-print flex flex-wrap gap-3">
          <button type="button" onClick={handlePrint} className={actionButtonClass}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print Result
          </button>
          <button type="button" onClick={handlePrint} className={actionButtonClass}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Result as PDF
          </button>
          <button type="button" onClick={handleRetake} className={actionButtonClass}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retake Examination
          </button>
          <button type="button" onClick={handleStartNew} className={actionButtonClass}>
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
            Start New Examination
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className={actionButtonClass}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Return to Home
          </button>
        </div>
        <p className="no-print text-xs text-gray-500">
          Tip: “Download Result as PDF” opens the browser print dialog — choose
          “Save as PDF” as the destination.
        </p>

        <AnswerReview
          questions={questions}
          answers={session.answers}
          language={session.candidate.language || "en"}
        />
      </div>
    </div>
  );
}
