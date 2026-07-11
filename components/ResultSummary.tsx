"use client";

import { Award, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { Candidate, ExamResult, Language } from "@/types/exam";
import { getPerformanceKey, t } from "@/lib/i18n";

interface ResultSummaryProps {
  candidate: Candidate;
  examTitle: string;
  result: ExamResult;
  submittedAt?: string;
  language?: Language;
}

function CircularPercentage({
  percentage,
  passed,
  scoreLabel,
}: {
  percentage: number;
  passed: boolean;
  scoreLabel: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative h-36 w-36" role="img" aria-label={`${scoreLabel} ${percentage}%`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          className="stroke-gray-200"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={passed ? "stroke-green-500" : "stroke-red-500"}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-charcoal">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs font-medium text-gray-500">{scoreLabel}</span>
      </div>
    </div>
  );
}

export default function ResultSummary({
  candidate,
  examTitle,
  result,
  submittedAt,
  language = "en",
}: ResultSummaryProps) {
  const passed = result.passed;

  const stats = [
    { label: t(language, "totalQuestions"), value: result.totalQuestions },
    { label: t(language, "correctAnswers"), value: result.correctAnswers },
    { label: t(language, "incorrectAnswers"), value: result.incorrectAnswers },
    { label: t(language, "unansweredQuestions"), value: result.unansweredAnswers },
    {
      label: t(language, "marksObtained"),
      value: `${result.marksObtained} / ${result.totalQuestions}`,
    },
    { label: t(language, "passingPercentage"), value: `${result.passingPercentage}%` },
  ];

  return (
    <section
      aria-labelledby="result-heading"
      className={`overflow-hidden rounded-2xl border-2 shadow-card ${
        passed ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 text-white ${
          passed ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {passed ? (
          <CheckCircle2 className="h-7 w-7 shrink-0" aria-hidden="true" />
        ) : (
          <XCircle className="h-7 w-7 shrink-0" aria-hidden="true" />
        )}
        <div>
          <h2 id="result-heading" className="text-xl font-extrabold tracking-wide">
            {passed ? t(language, "pass") : t(language, "fail")}
          </h2>
          <p className="flex items-center gap-1.5 text-sm text-white/90">
            <Award className="h-4 w-4" aria-hidden="true" />
            {t(language, getPerformanceKey(result.percentage))}
          </p>
        </div>
      </div>

      <div className="grid gap-6 bg-white/70 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <CircularPercentage
            percentage={result.percentage}
            passed={passed}
            scoreLabel={t(language, "score")}
          />
        </div>

        <div>
          <dl className="mb-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3 sm:block">
              <dt className="font-medium text-gray-500">{t(language, "candidateName")}</dt>
              <dd className="font-bold text-charcoal">{candidate.fullName}</dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="font-medium text-gray-500">{t(language, "candidateRole")}</dt>
              <dd className="font-bold text-charcoal">{candidate.role}</dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="font-medium text-gray-500">{t(language, "examination")}</dt>
              <dd className="font-bold text-charcoal">{examTitle}</dd>
            </div>
            {submittedAt && (
              <div className="flex justify-between gap-3 sm:block">
                <dt className="font-medium text-gray-500">{t(language, "submittedOn")}</dt>
                <dd className="font-bold text-charcoal">
                  {new Date(submittedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center"
              >
                <p className="text-lg font-extrabold text-charcoal">{stat.value}</p>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.unansweredAnswers > 0 && (
        <p className="flex items-center gap-2 border-t border-gray-200 bg-white/70 px-6 py-3 text-xs text-gray-600">
          <CircleHelp className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t(language, "unansweredNote")}
        </p>
      )}
    </section>
  );
}
