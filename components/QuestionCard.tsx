"use client";

import { Language, OPTION_KEYS, OptionKey, Question } from "@/types/exam";
import { getOptionText, getQuestionText, t } from "@/lib/i18n";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected?: OptionKey;
  language: Language;
  onSelect: (option: OptionKey) => void;
}

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  language,
  onSelect,
}: QuestionCardProps) {
  const groupName = `question-${question.id}`;

  return (
    <div className="rounded-xl bg-white p-5 shadow-card sm:p-7">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
        {t(language, "questionOf", { current: index + 1, total })}
      </p>
      <h2 className="mb-5 text-lg font-semibold leading-relaxed text-charcoal sm:text-xl">
        {getQuestionText(question, language)}
      </h2>

      <fieldset>
        <legend className="sr-only">
          {t(language, "questionOf", { current: index + 1, total })}
        </legend>
        <div className="space-y-3">
          {OPTION_KEYS.map((key) => {
            const isSelected = selected === key;
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3.5 transition-colors ${
                  isSelected
                    ? "border-gold-500 bg-gold-50"
                    : "border-gray-200 bg-white hover:border-gold-300 hover:bg-gold-50/40"
                }`}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={key}
                  checked={isSelected}
                  onChange={() => onSelect(key)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-gold-600"
                />
                <span className="text-sm leading-relaxed text-gray-800 sm:text-base">
                  <span className="mr-2 font-bold text-charcoal">{key}.</span>
                  {getOptionText(question, key, language)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
