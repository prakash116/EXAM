"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileSpreadsheet, Loader2, Trash2, UploadCloud } from "lucide-react";

interface FileUploaderProps {
  fileName: string | null;
  parsing: boolean;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

export default function FileUploader({
  fileName,
  parsing,
  onFileSelected,
  onClear,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFileSelected(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // allow re-uploading the same file
    event.target.value = "";
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive
            ? "border-gold-500 bg-gold-50"
            : "border-gray-300 bg-white hover:border-gold-400 hover:bg-gold-50/50"
        }`}
      >
        {parsing ? (
          <>
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-gold-500" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-700">Reading question sheet…</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-10 w-10 text-gold-500" aria-hidden="true" />
            <p className="text-sm font-semibold text-charcoal">
              Drag and drop your question sheet here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: .xlsx, .xls, .csv
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
            >
              Browse File
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          className="sr-only"
          aria-label="Upload question sheet"
        />
      </div>

      {fileName && !parsing && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
            <span className="truncate font-medium">{fileName}</span>
          </span>
          <button
            type="button"
            onClick={onClear}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear Uploaded Sheet
          </button>
        </div>
      )}
    </div>
  );
}
