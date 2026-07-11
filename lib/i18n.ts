import { Language, OptionKey, Question } from "@/types/exam";

const STRINGS = {
  en: {
    // Exam screen
    questionOf: "Question {current} of {total}",
    answeredCount: "{count} answered",
    unansweredCount: "{count} unanswered",
    progressLabel: "Progress: {answered} / {total} answered",
    previous: "Previous",
    next: "Next",
    submitExam: "Submit Examination",
    questionsPanel: "Questions",
    legendCurrent: "Current question",
    legendAnswered: "Answered",
    legendUnanswered: "Not answered",
    answerAllWarning: "Please answer all questions before submitting.",
    unansweredList: "Unanswered question(s): {list}",
    confirmTitle: "Submit Examination?",
    confirmBody:
      "Are you sure you want to submit your examination? You will not be able to change your answers after submission.",
    confirmSkippedWarning:
      "You have {count} unanswered question(s): {list}. They will be counted as incorrect.",
    continueExam: "Continue Examination",
    // Result screen
    pass: "PASS",
    fail: "FAIL",
    score: "Score",
    candidateName: "Candidate Name",
    candidateRole: "Candidate Role",
    examination: "Examination",
    submittedOn: "Submitted On",
    totalQuestions: "Total Questions",
    correctAnswers: "Correct Answers",
    incorrectAnswers: "Incorrect Answers",
    unansweredQuestions: "Unanswered Questions",
    marksObtained: "Marks Obtained",
    passingPercentage: "Passing Percentage",
    unansweredNote:
      "Unanswered questions are counted as incorrect for scoring purposes.",
    reviewHeading: "Detailed Answer Review",
    questionN: "Question {n}",
    correct: "Correct",
    incorrect: "Incorrect",
    notAnswered: "Not Answered",
    notAnsweredText: "Not answered",
    yourAnswer: "Your answer:",
    correctAnswerLabel: "Correct answer:",
    explanation: "Explanation:",
    // Performance messages
    perfExcellent: "Excellent Performance",
    perfVeryGood: "Very Good Performance",
    perfGood: "Good Performance",
    perfNeedsImprovement: "Needs Improvement",
    // Candidate instructions
    instructionsTitle: "Candidate Instructions",
    instTotal: "The examination contains {total} multiple-choice questions.",
    instOptions: "Each question has four options and only one correct answer.",
    instMarks: "Each correct answer carries 1 mark. There is no negative marking.",
    instPassing: "You need at least {passing}% to pass the examination.",
    instNavigate:
      "You can move between questions using the Previous / Next buttons or the question navigation panel.",
    instAnswerAll:
      "You may skip any question if you wish. Unanswered questions will be counted as incorrect.",
    instNoChange: "After final submission you cannot change your answers.",
    instResult: "Your result will be shown immediately after submission.",
  },
  hi: {
    // Exam screen
    questionOf: "प्रश्न {current} / {total}",
    answeredCount: "{count} उत्तर दिए",
    unansweredCount: "{count} शेष",
    progressLabel: "प्रगति: {answered} / {total} उत्तर दिए",
    previous: "पिछला",
    next: "अगला",
    submitExam: "परीक्षा जमा करें",
    questionsPanel: "प्रश्न",
    legendCurrent: "वर्तमान प्रश्न",
    legendAnswered: "उत्तर दिया गया",
    legendUnanswered: "उत्तर नहीं दिया",
    answerAllWarning: "कृपया जमा करने से पहले सभी प्रश्नों के उत्तर दें।",
    unansweredList: "अनुत्तरित प्रश्न: {list}",
    confirmTitle: "परीक्षा जमा करें?",
    confirmBody:
      "क्या आप वाकई अपनी परीक्षा जमा करना चाहते हैं? जमा करने के बाद आप अपने उत्तर नहीं बदल पाएँगे।",
    confirmSkippedWarning:
      "आपके {count} प्रश्न अनुत्तरित हैं: {list}। इन्हें गलत माना जाएगा।",
    continueExam: "परीक्षा जारी रखें",
    // Result screen
    pass: "उत्तीर्ण (PASS)",
    fail: "अनुत्तीर्ण (FAIL)",
    score: "स्कोर",
    candidateName: "उम्मीदवार का नाम",
    candidateRole: "उम्मीदवार की भूमिका",
    examination: "परीक्षा",
    submittedOn: "जमा करने का समय",
    totalQuestions: "कुल प्रश्न",
    correctAnswers: "सही उत्तर",
    incorrectAnswers: "गलत उत्तर",
    unansweredQuestions: "अनुत्तरित प्रश्न",
    marksObtained: "प्राप्त अंक",
    passingPercentage: "उत्तीर्ण प्रतिशत",
    unansweredNote: "अनुत्तरित प्रश्नों को अंक गणना में गलत माना जाता है।",
    reviewHeading: "विस्तृत उत्तर समीक्षा",
    questionN: "प्रश्न {n}",
    correct: "सही",
    incorrect: "गलत",
    notAnswered: "उत्तर नहीं दिया",
    notAnsweredText: "उत्तर नहीं दिया",
    yourAnswer: "आपका उत्तर:",
    correctAnswerLabel: "सही उत्तर:",
    explanation: "व्याख्या:",
    // Performance messages
    perfExcellent: "उत्कृष्ट प्रदर्शन",
    perfVeryGood: "बहुत अच्छा प्रदर्शन",
    perfGood: "अच्छा प्रदर्शन",
    perfNeedsImprovement: "सुधार की आवश्यकता",
    // Candidate instructions
    instructionsTitle: "उम्मीदवार निर्देश",
    instTotal: "परीक्षा में {total} बहुविकल्पीय प्रश्न हैं।",
    instOptions: "प्रत्येक प्रश्न के चार विकल्प हैं और केवल एक उत्तर सही है।",
    instMarks: "प्रत्येक सही उत्तर 1 अंक का है। कोई नकारात्मक अंकन नहीं है।",
    instPassing: "उत्तीर्ण होने के लिए कम से कम {passing}% अंक आवश्यक हैं।",
    instNavigate:
      "आप पिछला / अगला बटन या प्रश्न नेविगेशन पैनल से प्रश्नों के बीच जा सकते हैं।",
    instAnswerAll:
      "आप चाहें तो कोई भी प्रश्न छोड़ (skip) सकते हैं। अनुत्तरित प्रश्न गलत माने जाएँगे।",
    instNoChange: "अंतिम रूप से जमा करने के बाद आप अपने उत्तर नहीं बदल सकते।",
    instResult: "जमा करने के तुरंत बाद आपका परिणाम दिखाया जाएगा।",
  },
} as const;

export type TranslationKey = keyof (typeof STRINGS)["en"];

/** Translates a UI string, replacing {placeholders} with the given values. */
export function t(
  language: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  let text: string = STRINGS[language][key] ?? STRINGS.en[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Question text in the chosen language, falling back to English. */
export function getQuestionText(question: Question, language: Language): string {
  return language === "hi" && question.questionHi
    ? question.questionHi
    : question.question;
}

/** Option text in the chosen language, falling back to English. */
export function getOptionText(
  question: Question,
  key: OptionKey,
  language: Language
): string {
  return language === "hi" && question.optionsHi
    ? question.optionsHi[key]
    : question.options[key];
}

/** Explanation in the chosen language, falling back to English. */
export function getExplanationText(
  question: Question,
  language: Language
): string | undefined {
  return language === "hi" && question.explanationHi
    ? question.explanationHi
    : question.explanation;
}

/** Performance message key for a percentage (used with t()). */
export function getPerformanceKey(percentage: number): TranslationKey {
  if (percentage >= 90) return "perfExcellent";
  if (percentage >= 75) return "perfVeryGood";
  if (percentage >= 60) return "perfGood";
  return "perfNeedsImprovement";
}
