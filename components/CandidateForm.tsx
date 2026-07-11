"use client";

import { useState, type FormEvent } from "react";
import { Languages, Play, User } from "lucide-react";
import { Candidate, Language } from "@/types/exam";

export const ROLE_OPTIONS = [
  "Chef",
  "Tandoor Chef",
  "Continental Chef",
  "Chinese Chef",
  "Housekeeping",
  "Food and Beverage Service",
  "Waiter",
  "Kitchen Helper",
  "Other",
] as const;

interface CandidateFormProps {
  onStart: (candidate: Candidate) => void;
  onRoleChange?: (role: string) => void;
  onLanguageChange?: (language: Language) => void;
  startDisabled?: boolean;
  startDisabledMessage?: string;
}

interface FormErrors {
  fullName?: string;
  role?: string;
  customRole?: string;
  email?: string;
  mobile?: string;
}

export default function CandidateForm({
  onStart,
  onRoleChange,
  onLanguageChange,
  startDisabled = false,
  startDisabledMessage,
}: CandidateFormProps) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    onLanguageChange?.(value);
  };

  const resolveRole = (selected: string, custom: string) =>
    selected === "Other" ? custom.trim() : selected;

  const handleRoleChange = (value: string) => {
    setRole(value);
    onRoleChange?.(resolveRole(value, customRole));
  };

  const handleCustomRoleChange = (value: string) => {
    setCustomRole(value);
    if (role === "Other") onRoleChange?.(value.trim());
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required. Blank spaces are not a valid name.";
    }
    if (!role) {
      nextErrors.role = "Please select your role.";
    } else if (role === "Other" && !customRole.trim()) {
      nextErrors.customRole = "Please enter your role.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (mobile.trim() && !/^[+\d][\d\s-]{6,14}$/.test(mobile.trim())) {
      nextErrors.mobile = "Please enter a valid mobile number.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onStart({
      fullName: fullName.trim(),
      mobile: mobile.trim() || undefined,
      email: email.trim() || undefined,
      role: resolveRole(role, customRole),
      language,
    });
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40";

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-4">
      <h2 className="text-wrap-safe flex min-w-0 items-center gap-2 text-base font-bold text-charcoal">
        <User className="h-5 w-5 text-gold-600" aria-hidden="true" />
        Candidate Information
      </h2>

      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          className={inputClass}
          aria-invalid={Boolean(errors.fullName)}
        />
        {errors.fullName && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g. 98765 43210"
            className={inputClass}
            aria-invalid={Boolean(errors.mobile)}
          />
          {errors.mobile && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {errors.mobile}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email Address <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rahul@example.com"
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
          Role <span className="text-red-600">*</span>
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.role)}
        >
          <option value="">Select your role…</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.role && (
          <p role="alert" className="mt-1 text-xs font-medium text-red-600">
            {errors.role}
          </p>
        )}
      </div>

      {role === "Other" && (
        <div>
          <label htmlFor="customRole" className="mb-1 block text-sm font-medium text-gray-700">
            Enter Your Role <span className="text-red-600">*</span>
          </label>
          <input
            id="customRole"
            type="text"
            value={customRole}
            onChange={(e) => handleCustomRoleChange(e.target.value)}
            placeholder="e.g. Bakery Chef"
            className={inputClass}
            aria-invalid={Boolean(errors.customRole)}
          />
          {errors.customRole && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {errors.customRole}
            </p>
          )}
        </div>
      )}

      <fieldset className="min-w-0">
        <legend className="text-wrap-safe mb-1.5 flex min-w-0 items-center gap-1.5 text-sm font-medium text-gray-700">
          <Languages className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Examination Language / परीक्षा की भाषा{" "}
          <span className="text-red-600">*</span>
        </legend>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {(
            [
              { value: "en", label: "English" },
              { value: "hi", label: "हिंदी (Hindi)" },
            ] as { value: Language; label: string }[]
          ).map((option) => (
            <label
              key={option.value}
              className={`text-wrap-safe flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                language === option.value
                  ? "border-gold-500 bg-gold-50 text-charcoal"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gold-300"
              }`}
            >
              <input
                type="radio"
                name="examLanguage"
                value={option.value}
                checked={language === option.value}
                onChange={() => handleLanguageChange(option.value)}
                className="h-4 w-4 shrink-0 accent-gold-600"
              />
              <span className="min-w-0">{option.label}</span>
            </label>
          ))}
        </div>
        <p className="text-wrap-safe mt-1 text-xs text-gray-500">
          Questions and instructions will be shown in the selected language.
          / प्रश्न और निर्देश चुनी गई भाषा में दिखाए जाएँगे।
        </p>
      </fieldset>

      {startDisabled && startDisabledMessage && (
        <p role="alert" className="text-wrap-safe rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {startDisabledMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={startDisabled}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-base font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        Start Examination
      </button>
    </form>
  );
}
