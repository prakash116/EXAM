"use client";

import { Language, OptionKey, Question } from "@/types/exam";
import { t } from "@/lib/i18n";

interface QuestionNavigatorProps {
  questions: Question[];
  answers: Record<string, OptionKey>;
  currentIndex: number;
  language: Language;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  language,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <nav
      aria-label="Question navigation"
      className="min-w-0 rounded-xl bg-white p-4 shadow-card"
    >
      <h3 className="mb-3 text-sm font-bold text-charcoal">
        {t(language, "questionsPanel")}
      </h3>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = Boolean(answers[question.id]);

          let stateClass =
            "border-gray-300 bg-white text-gray-600 hover:border-gold-400";
          let stateLabel = t(language, "legendUnanswered");
          if (isCurrent) {
            stateClass = "border-charcoal bg-charcoal text-gold-400";
            stateLabel = t(language, "legendCurrent");
          } else if (isAnswered) {
            stateClass = "border-green-500 bg-green-100 text-green-800 hover:bg-green-200";
            stateLabel = t(language, "legendAnswered");
          }

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onNavigate(index)}
              aria-label={`${t(language, "questionN", { n: index + 1 })}, ${stateLabel}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`h-10 w-full max-w-10 justify-self-center rounded-lg border-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 ${stateClass}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded border-2 border-charcoal bg-charcoal" aria-hidden="true" />
          {t(language, "legendCurrent")}
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded border-2 border-green-500 bg-green-100" aria-hidden="true" />
          {t(language, "legendAnswered")}
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded border-2 border-gray-300 bg-white" aria-hidden="true" />
          {t(language, "legendUnanswered")}
        </p>
      </div>
    </nav>
  );
}
