"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Percent } from "lucide-react";
import CandidateForm from "@/components/CandidateForm";
import ExamInstructions from "@/components/ExamInstructions";
import { Candidate, ExamConfig, ExamSession, Language } from "@/types/exam";
import { filterQuestionsByRole } from "@/lib/examCalculator";
import { loadExamConfig, loadSession, saveSession } from "@/lib/localStorage";

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedExam = loadExamConfig();
    if (!storedExam) {
      router.replace("/setup");
      return;
    }
    const session = loadSession();
    if (session?.status === "in_progress") {
      router.replace("/exam");
      return;
    }
    setExam(storedExam);
    setMounted(true);
  }, [router]);

  const roleQuestionCount = useMemo(() => {
    if (!exam) return 0;
    if (!selectedRole) return exam.questions.length;
    return filterQuestionsByRole(exam.questions, selectedRole).length;
  }, [exam, selectedRole]);

  const noQuestionsForRole = Boolean(selectedRole) && roleQuestionCount === 0;

  const handleStart = (candidate: Candidate) => {
    if (!exam) return;
    const questions = filterQuestionsByRole(exam.questions, candidate.role);
    if (questions.length === 0) return;

    const session: ExamSession = {
      candidate,
      questionIds: questions.map((q) => q.id),
      answers: {},
      status: "in_progress",
      currentIndex: 0,
      startedAt: new Date().toISOString(),
    };
    saveSession(session);
    router.push("/exam");
  };

  if (!mounted || !exam) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="mb-6 rounded-2xl bg-charcoal p-6 text-white shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
          Examination
        </p>
        <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">{exam.title}</h1>
        {exam.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {exam.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2 rounded-lg bg-charcoal-light px-3 py-2">
            <BookOpen className="h-4 w-4 text-gold-400" aria-hidden="true" />
            {selectedRole
              ? `${roleQuestionCount} question${roleQuestionCount === 1 ? "" : "s"} for “${selectedRole}”`
              : `${exam.questions.length} total questions`}
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-charcoal-light px-3 py-2">
            <Percent className="h-4 w-4 text-gold-400" aria-hidden="true" />
            Passing percentage: {exam.passingPercentage}%
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-card">
          <CandidateForm
            onStart={handleStart}
            onRoleChange={setSelectedRole}
            onLanguageChange={setSelectedLanguage}
            startDisabled={noQuestionsForRole}
            startDisabledMessage={
              noQuestionsForRole
                ? `No questions are available for the role “${selectedRole}”. Please select a different role or update the question sheet.`
                : undefined
            }
          />
        </div>

        <ExamInstructions
          totalQuestions={roleQuestionCount}
          passingPercentage={exam.passingPercentage}
          language={selectedLanguage}
        />
      </div>
    </div>
  );
}
