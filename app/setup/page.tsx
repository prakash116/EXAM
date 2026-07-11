"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FilePlus2,
  Info,
  Loader2,
} from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { ExamConfig, ParseResult } from "@/types/exam";
import { parseQuestionFile } from "@/lib/excelParser";
import { downloadSampleExcel } from "@/lib/sampleExcel";
import { DEFAULT_PASSING_PERCENTAGE } from "@/lib/examCalculator";
import {
  clearSession,
  loadExamConfig,
  saveExamConfig,
} from "@/lib/localStorage";

export default function SetupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [existingExam, setExistingExam] = useState<ExamConfig | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingPercentage, setPassingPercentage] = useState(
    DEFAULT_PASSING_PERCENTAGE
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setExistingExam(loadExamConfig());
    setMounted(true);
  }, []);

  const handleFileSelected = async (file: File) => {
    setParsing(true);
    setFileName(file.name);
    try {
      const result = await parseQuestionFile(file);
      setParseResult(result);
    } catch {
      setParseResult({
        questions: [],
        errors: [{ message: "An unexpected error occurred while reading the file." }],
      });
    } finally {
      setParsing(false);
    }
  };

  const handleClear = () => {
    setFileName(null);
    setParseResult(null);
  };

  const hasErrors = (parseResult?.errors.length ?? 0) > 0;
  const questionCount = parseResult?.questions.length ?? 0;
  const canCreate = !parsing && questionCount > 0 && !hasErrors;

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError("Examination title is required.");
      return;
    }
    setTitleError(null);
    if (!parseResult || !canCreate) return;

    const config: ExamConfig = {
      title: title.trim(),
      description: description.trim(),
      passingPercentage:
        Number.isFinite(passingPercentage) && passingPercentage >= 1 && passingPercentage <= 100
          ? passingPercentage
          : DEFAULT_PASSING_PERCENTAGE,
      questions: parseResult.questions,
      createdAt: new Date().toISOString(),
    };

    saveExamConfig(config);
    clearSession(); // any previous candidate session belongs to the old exam
    router.push("/register");
  };

  if (!mounted) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" aria-label="Loading" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold text-charcoal">Examination Setup</h1>
      <p className="mt-1 text-sm text-gray-600">
        Administrator section — upload a question sheet and create the examination.
      </p>

      {existingExam && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gray-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          An examination “{existingExam.title}” ({existingExam.questions.length}{" "}
          questions) already exists. Creating a new examination will replace it.
        </p>
      )}

      <div className="mt-6 space-y-6">
        {/* Exam details */}
        <section className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="mb-4 text-base font-bold text-charcoal">
            1. Examination Details
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="examTitle" className="mb-1 block text-sm font-medium text-gray-700">
                Examination Title <span className="text-red-600">*</span>
              </label>
              <input
                id="examTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chef Skill Assessment — Tandoor & Continental"
                className={inputClass}
                aria-invalid={Boolean(titleError)}
              />
              {titleError && (
                <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                  {titleError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="examDescription" className="mb-1 block text-sm font-medium text-gray-700">
                Examination Description
              </label>
              <textarea
                id="examDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Short description shown to candidates before they start."
                className={inputClass}
              />
            </div>
            <div className="max-w-xs">
              <label htmlFor="passingPercentage" className="mb-1 block text-sm font-medium text-gray-700">
                Passing Percentage
              </label>
              <input
                id="passingPercentage"
                type="number"
                min={1}
                max={100}
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">Default: 60%</p>
            </div>
          </div>
        </section>

        {/* Upload */}
        <section className="rounded-xl bg-white p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-charcoal">
              2. Upload Question Sheet
            </h2>
            <button
              type="button"
              onClick={downloadSampleExcel}
              className="flex items-center gap-2 rounded-lg border border-gold-300 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-800 transition-colors hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Sample Excel Template
            </button>
          </div>

          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
            <p className="mb-1 font-bold text-charcoal">Upload instructions</p>
            <ul className="list-disc space-y-0.5 pl-5">
              <li>
                Required columns: <strong>Question, Option A, Option B, Option C,
                Option D, Correct Answer</strong>
              </li>
              <li>
                Optional columns: <strong>Explanation, Role, Difficulty, Category</strong>
              </li>
              <li>
                The Correct Answer column accepts <strong>A / B / C / D</strong>,{" "}
                <strong>Option A – Option D</strong>, or the <strong>exact option
                text</strong>.
              </li>
              <li>
                Use the Role column (e.g. Chef, Housekeeping, Waiter) to target
                questions to specific roles; use <strong>All</strong> for every candidate.
              </li>
              <li>Only the first worksheet of the file is read.</li>
            </ul>
          </div>

          <FileUploader
            fileName={fileName}
            parsing={parsing}
            onFileSelected={handleFileSelected}
            onClear={handleClear}
          />

          {/* Validation errors */}
          {parseResult && hasErrors && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4"
            >
              <p className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {parseResult.errors.length} validation issue
                {parseResult.errors.length === 1 ? "" : "s"} found — fix the sheet
                and upload again
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                {parseResult.errors.map((error, index) => (
                  <li key={index}>
                    {error.row ? `Row ${error.row}: ` : ""}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {parseResult && questionCount > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                Uploaded question preview — {questionCount} valid question
                {questionCount === 1 ? "" : "s"}
              </p>
              <div className="max-h-80 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="sticky top-0 bg-charcoal text-white">
                    <tr>
                      <th className="px-3 py-2 font-semibold">#</th>
                      <th className="px-3 py-2 font-semibold">Question</th>
                      <th className="px-3 py-2 font-semibold">Correct</th>
                      <th className="px-3 py-2 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {parseResult.questions.map((question, index) => (
                      <tr key={question.id} className="align-top">
                        <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                        <td className="px-3 py-2 text-gray-800">{question.question}</td>
                        <td className="px-3 py-2">
                          <span className="rounded bg-green-100 px-1.5 py-0.5 font-bold text-green-800">
                            {question.correctAnswer}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {question.role ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-base font-bold text-charcoal transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          <FilePlus2 className="h-5 w-5" aria-hidden="true" />
          Create Examination
          {questionCount > 0 && !hasErrors ? ` (${questionCount} questions)` : ""}
        </button>
        {!canCreate && (
          <p className="text-center text-xs text-gray-500">
            {hasErrors
              ? "Resolve all validation errors before creating the examination."
              : "Upload a valid question sheet to enable this button."}
          </p>
        )}
      </div>
    </div>
  );
}
