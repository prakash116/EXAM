"use client";

import { AlertTriangle } from "lucide-react";
import { Language } from "@/types/exam";
import { t } from "@/lib/i18n";

interface SubmitConfirmationProps {
  open: boolean;
  language?: Language;
  unansweredNumbers?: number[];
  onContinue: () => void;
  onSubmit: () => void;
}

export default function SubmitConfirmation({
  open,
  language = "en",
  unansweredNumbers = [],
  onContinue,
  onSubmit,
}: SubmitConfirmationProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-confirmation-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-charcoal/60 p-3 sm:p-4"
    >
      <div className="w-full min-w-0 max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-100">
            <AlertTriangle className="h-6 w-6 text-gold-600" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="submit-confirmation-title" className="text-wrap-safe text-lg font-bold text-charcoal">
              {t(language, "confirmTitle")}
            </h2>
            <p className="text-wrap-safe mt-1.5 text-sm leading-relaxed text-gray-600">
              {t(language, "confirmBody")}
            </p>
            {unansweredNumbers.length > 0 && (
              <p
                role="alert"
                className="text-wrap-safe mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium leading-relaxed text-red-800"
              >
                {t(language, "confirmSkippedWarning", {
                  count: unansweredNumbers.length,
                  list: unansweredNumbers.join(", "),
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            {t(language, "continueExam")}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2"
          >
            {t(language, "submitExam")}
          </button>
        </div>
      </div>
    </div>
  );
}
