# RestoCare Academy — Online Examination System

A frontend-only online MCQ examination system built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **SheetJS (xlsx)** and **Lucide React** icons. All data is stored in React state and browser Local Storage — no backend, database or external API.

## Features

- Admin uploads an `.xlsx`, `.xls` or `.csv` question sheet
- Full sheet validation with clear, row-level error messages
- Sample Excel template download
- Candidate registration with role selection (role-based question filtering)
- Exam screen with progress bar, question navigator, previous/next navigation
- Candidates may skip questions; the confirmation modal warns about unanswered questions (counted as incorrect)
- Instant result with pass/fail card, circular score indicator and performance message
- Detailed answer review with correct/incorrect indicators and explanations
- Print / Save-as-PDF result, retake, and reset options
- Exam state survives page refresh via Local Storage

## Folder Structure

```text
exam/
├── app/
│   ├── layout.tsx            # Root layout with header/footer
│   ├── page.tsx              # Home page
│   ├── globals.css           # Tailwind + print styles
│   ├── setup/page.tsx        # Examination setup (admin)
│   ├── register/page.tsx     # Candidate registration
│   ├── exam/page.tsx         # Examination screen
│   └── result/page.tsx       # Result + answer review
├── components/
│   ├── Header.tsx
│   ├── FileUploader.tsx
│   ├── ExamInstructions.tsx
│   ├── CandidateForm.tsx
│   ├── QuestionCard.tsx
│   ├── QuestionNavigator.tsx
│   ├── ProgressBar.tsx
│   ├── SubmitConfirmation.tsx
│   ├── ResultSummary.tsx
│   └── AnswerReview.tsx
├── lib/
│   ├── excelParser.ts        # Reads + validates uploaded sheets
│   ├── answerNormalizer.ts   # Normalizes Correct Answer values to A/B/C/D
│   ├── examCalculator.ts     # Scoring, performance message, role filtering
│   ├── localStorage.ts       # Typed Local Storage helpers
│   └── sampleExcel.ts        # Sample Excel template generator
├── types/
│   └── exam.ts               # Shared TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

## Installation

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
cd exam
npm install
```

This installs: `next`, `react`, `react-dom`, `xlsx`, `lucide-react`, plus dev dependencies `typescript`, `tailwindcss`, `postcss`, `autoprefixer` and the type packages.

## Running Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Production build:

```bash
npm run build
npm start
```

## Question Sheet Format

The **first worksheet** of the uploaded file is read. Column headers are case-insensitive and extra spaces are trimmed.

| Question | Option A | Option B | Option C | Option D | Correct Answer | Explanation | Role |
| -------- | -------- | -------- | -------- | -------- | -------------- | ----------- | ---- |
| What temperature is suitable for storing chilled food? | 0–5°C | 10–15°C | 20–25°C | 30–35°C | A | Chilled food should normally be stored between 0°C and 5°C. | Chef |

**Required columns:** Question, Option A, Option B, Option C, Option D, Correct Answer
**Optional columns:** Explanation, Role, Difficulty, Category

**Optional Hindi columns (for the bilingual exam):** `Question (Hindi)`, `Option A (Hindi)`, `Option B (Hindi)`, `Option C (Hindi)`, `Option D (Hindi)`, `Explanation (Hindi)`. Candidates choose English or Hindi on the registration page; when Hindi columns exist, questions, options and explanations are shown in Hindi (with English as fallback for any missing translation).

**Accepted Correct Answer values:** `A`, `B`, `C`, `D` (any case), `Option A` … `Option D`, or the exact option text.

**Role column:** questions with a specific role (e.g. `Chef`, `Housekeeping`, `Waiter`) are shown only to candidates with that role. Use `All` (or leave blank) for questions available to every candidate. When no question has a role value, everyone sees all questions.

## How to Upload a Question Sheet

1. Open the app and go to **Examination Setup**.
2. (Optional) Click **Download Sample Excel Template** to get a ready-made example file.
3. Enter the examination title, description and passing percentage (default 60%).
4. Drag & drop your `.xlsx`, `.xls` or `.csv` file, or click **Browse File**.
5. Fix any validation errors listed (row numbers are shown) and re-upload if needed.
6. Review the question preview, then click **Create Examination**.
7. The candidate registration page opens — enter name and role, then **Start Examination**.

## Bundled Exams (public/exams) — for Deployment

For deployments where many candidates open the site directly, exam sheets can be **bundled with the app** instead of uploaded by an admin on each device:

```text
public/
└── exams/
    ├── exams.json                    # list of available exams
    ├── tandoor-continental-50.xlsx   # exam sheet(s)
    └── ...add more .xlsx sheets here
```

`exams.json` format:

```json
{
  "exams": [
    {
      "id": "tandoor-continental-50",
      "title": "Chef MCQ Test — Tandoor & Continental",
      "description": "50 questions in English and Hindi.",
      "file": "tandoor-continental-50.xlsx",
      "passingPercentage": 60
    }
  ]
}
```

**To add a new exam:** copy its `.xlsx` file into `public/exams/` and add an entry to `exams.json` (unique `id`, the exact `file` name, title, optional description and passing percentage). Redeploy — the home page automatically lists every exam in the manifest, and candidates pick one, register and take it. Sheets are validated with the same rules as uploaded files.

The admin upload page (`/setup`) still works as before for ad-hoc exams.

## Deployment

The app is fully static/client-side (no server code), so it deploys anywhere Next.js runs:

- **Vercel** (easiest): push the `exam/` folder to a Git repository and import it at vercel.com — no configuration needed.
- **Netlify**: build command `npm run build`, publish with the Next.js runtime.
- **Own server**: `npm run build && npm start` (serves on port 3000).

Each candidate's answers and results are stored in their own browser's Local Storage, so any number of candidates can take exams simultaneously — nothing is shared between devices.

## Local Storage Keys

| Key | Contents |
| --- | -------- |
| `restocare_exam_config` | Examination title, description, passing %, all questions |
| `restocare_exam_session` | Candidate details, selected answers, progress, result |
| `restocare_last_result` | Latest submitted result summary |

Use the **Reset Application** button on the home page to clear everything.
