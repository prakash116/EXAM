"use client";

import { ClipboardList } from "lucide-react";
import { Language } from "@/types/exam";
import { t } from "@/lib/i18n";

interface ExamInstructionsProps {
  totalQuestions: number;
  passingPercentage: number;
  language?: Language;
}

export default function ExamInstructions({
  totalQuestions,
  passingPercentage,
  language = "en",
}: ExamInstructionsProps) {
  const instructions = [
    t(language, "instTotal", { total: totalQuestions }),
    t(language, "instOptions"),
    t(language, "instMarks"),
    t(language, "instPassing", { passing: passingPercentage }),
    t(language, "instNavigate"),
    t(language, "instAnswerAll"),
    t(language, "instNoChange"),
    t(language, "instResult"),
  ];

  return (
    <section
      aria-labelledby="exam-instructions-heading"
      className="min-w-0 rounded-xl border border-gold-200 bg-gold-50 p-4 sm:p-5"
    >
      <h2
        id="exam-instructions-heading"
        className="text-wrap-safe mb-3 flex min-w-0 items-center gap-2 text-base font-bold text-charcoal"
      >
        <ClipboardList className="h-5 w-5 text-gold-600" aria-hidden="true" />
        {t(language, "instructionsTitle")}
      </h2>
      <ol className="text-wrap-safe list-decimal space-y-1.5 pl-5 text-sm text-gray-700">
        {instructions.map((instruction) => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}
