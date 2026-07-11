"use client";

import { Language } from "@/types/exam";
import { t } from "@/lib/i18n";

interface ProgressBarProps {
  answered: number;
  total: number;
  language?: Language;
}

export default function ProgressBar({
  answered,
  total,
  language = "en",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600">
        <span>{t(language, "progressLabel", { answered, total })}</span>
        <span>{percentage}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Examination progress"
      >
        <div
          className="h-full rounded-full bg-gold-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
