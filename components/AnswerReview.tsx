"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import { Language, OptionKey, Question } from "@/types/exam";
import {
  getExplanationText,
  getOptionText,
  getQuestionText,
  t,
} from "@/lib/i18n";

interface AnswerReviewProps {
  questions: Question[];
  answers: Record<string, OptionKey>;
  language?: Language;
}

export default function AnswerReview({
  questions,
  answers,
  language = "en",
}: AnswerReviewProps) {
  return (
    <section aria-labelledby="answer-review-heading">
      <h2 id="answer-review-heading" className="text-wrap-safe mb-4 text-lg font-bold text-charcoal">
        {t(language, "reviewHeading")}
      </h2>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctAnswer;
          const isUnanswered = !selected;
          const explanation = getExplanationText(question, language);

          return (
            <article
              key={question.id}
              className={`min-w-0 rounded-xl border-2 bg-white p-4 shadow-card sm:p-5 ${
                isCorrect ? "border-green-300" : "border-red-300"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-500">
                  {t(language, "questionN", { n: index + 1 })}
                </p>
                {isCorrect ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {t(language, "correct")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    {isUnanswered
                      ? t(language, "notAnswered")
                      : t(language, "incorrect")}
                  </span>
                )}
              </div>

              <h3 className="text-wrap-safe mb-4 text-base font-semibold leading-relaxed text-charcoal">
                {getQuestionText(question, language)}
              </h3>

              <div className="space-y-2 text-sm">
                <p
                  className={`text-wrap-safe rounded-lg px-3 py-2.5 font-medium sm:px-4 ${
                    isCorrect
                      ? "bg-green-50 text-green-900"
                      : "bg-red-50 text-red-900"
                  }`}
                >
                  <span className="mr-1 font-bold">{t(language, "yourAnswer")}</span>
                  {isUnanswered
                    ? t(language, "notAnsweredText")
                    : `${selected}. ${getOptionText(question, selected, language)}`}
                </p>
                <p className="text-wrap-safe rounded-lg bg-green-50 px-3 py-2.5 font-medium text-green-900 sm:px-4">
                  <span className="mr-1 font-bold">
                    {t(language, "correctAnswerLabel")}
                  </span>
                  {question.correctAnswer}.{" "}
                  {getOptionText(question, question.correctAnswer, language)}
                </p>
              </div>

              {explanation && (
                <p className="text-wrap-safe mt-3 flex min-w-0 items-start gap-2 rounded-lg bg-gold-50 px-3 py-3 text-sm leading-relaxed text-gray-700 sm:px-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="font-bold text-charcoal">
                      {t(language, "explanation")}{" "}
                    </span>
                    {explanation}
                  </span>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
