import * as XLSX from "xlsx";

interface SampleRow {
  Question: string;
  "Option A": string;
  "Option B": string;
  "Option C": string;
  "Option D": string;
  "Correct Answer": string;
  Explanation: string;
  Role: string;
  "Question (Hindi)": string;
  "Option A (Hindi)": string;
  "Option B (Hindi)": string;
  "Option C (Hindi)": string;
  "Option D (Hindi)": string;
  "Explanation (Hindi)": string;
}

const SAMPLE_ROWS: SampleRow[] = [
  {
    Question: "What temperature range is suitable for storing chilled food?",
    "Option A": "0–5°C",
    "Option B": "10–15°C",
    "Option C": "20–25°C",
    "Option D": "30–35°C",
    "Correct Answer": "A",
    Explanation: "Chilled food should normally be stored between 0°C and 5°C to slow bacterial growth.",
    Role: "Chef",
    "Question (Hindi)": "ठंडा (chilled) भोजन संग्रहण के लिए कौन-सा तापमान उपयुक्त है?",
    "Option A (Hindi)": "0–5°C",
    "Option B (Hindi)": "10–15°C",
    "Option C (Hindi)": "20–25°C",
    "Option D (Hindi)": "30–35°C",
    "Explanation (Hindi)": "ठंडा भोजन सामान्यतः 0°C से 5°C के बीच रखना चाहिए ताकि बैक्टीरिया की वृद्धि धीमी रहे।",
  },
  {
    Question: "What is the temperature danger zone for bacterial growth in food?",
    "Option A": "-18°C to 0°C",
    "Option B": "0°C to 5°C",
    "Option C": "5°C to 60°C",
    "Option D": "75°C to 100°C",
    "Correct Answer": "C",
    Explanation: "Bacteria multiply fastest between 5°C and 60°C, so food should not be held in this range.",
    Role: "Chef",
    "Question (Hindi)": "भोजन में बैक्टीरिया वृद्धि का डेंजर ज़ोन (खतरनाक तापमान सीमा) कौन-सा है?",
    "Option A (Hindi)": "-18°C से 0°C",
    "Option B (Hindi)": "0°C से 5°C",
    "Option C (Hindi)": "5°C से 60°C",
    "Option D (Hindi)": "75°C से 100°C",
    "Explanation (Hindi)": "5°C से 60°C के बीच बैक्टीरिया सबसे तेज़ बढ़ते हैं, इसलिए भोजन इस सीमा में नहीं रखना चाहिए।",
  },
  {
    Question: "What does FIFO stand for in stock rotation?",
    "Option A": "Fast In, Fast Out",
    "Option B": "First In, First Out",
    "Option C": "Fresh In, Frozen Out",
    "Option D": "Final Inventory For Orders",
    "Correct Answer": "Option B",
    Explanation: "FIFO means older stock is used before newer stock to reduce spoilage and waste.",
    Role: "All",
    "Question (Hindi)": "स्टॉक रोटेशन में FIFO का क्या अर्थ है?",
    "Option A (Hindi)": "फास्ट इन, फास्ट आउट",
    "Option B (Hindi)": "फर्स्ट इन, फर्स्ट आउट (पहले आया, पहले उपयोग)",
    "Option C (Hindi)": "फ्रेश इन, फ्रोज़न आउट",
    "Option D (Hindi)": "फाइनल इन्वेंटरी फॉर ऑर्डर्स",
    "Explanation (Hindi)": "FIFO का अर्थ है पुराना स्टॉक पहले उपयोग करना, ताकि खराबी और बर्बादी कम हो।",
  },
  {
    Question: "What is the main purpose of colour-coded cleaning cloths in housekeeping?",
    "Option A": "To make the trolley look organised",
    "Option B": "To match the hotel branding",
    "Option C": "To reduce laundry costs",
    "Option D": "To prevent cross-contamination between different areas",
    "Correct Answer": "To prevent cross-contamination between different areas",
    Explanation: "Colour coding ensures cloths used in bathrooms are never used on food-contact or guest surfaces.",
    Role: "Housekeeping",
    "Question (Hindi)": "हाउसकीपिंग में रंग-कोडित सफाई कपड़ों का मुख्य उद्देश्य क्या है?",
    "Option A (Hindi)": "ट्रॉली को व्यवस्थित दिखाने के लिए",
    "Option B (Hindi)": "होटल की ब्रांडिंग से मेल के लिए",
    "Option C (Hindi)": "लॉन्ड्री खर्च कम करने के लिए",
    "Option D (Hindi)": "विभिन्न क्षेत्रों के बीच क्रॉस-कंटैमिनेशन रोकने के लिए",
    "Explanation (Hindi)": "रंग कोडिंग से बाथरूम में उपयोग हुए कपड़े कभी भोजन या अतिथि सतहों पर उपयोग नहीं होते।",
  },
  {
    Question: "From which side of the guest should cleared plates generally be removed in formal service?",
    "Option A": "From the guest's right side",
    "Option B": "From the guest's left side",
    "Option C": "From across the table",
    "Option D": "From behind the guest's chair",
    "Correct Answer": "A",
    Explanation: "In classical service, soiled plates are usually cleared from the guest's right side.",
    Role: "Waiter",
    "Question (Hindi)": "औपचारिक सेवा में जूठी प्लेटें सामान्यतः अतिथि की किस ओर से हटानी चाहिए?",
    "Option A (Hindi)": "अतिथि की दाईं ओर से",
    "Option B (Hindi)": "अतिथि की बाईं ओर से",
    "Option C (Hindi)": "मेज़ के दूसरी ओर से",
    "Option D (Hindi)": "अतिथि की कुर्सी के पीछे से",
    "Explanation (Hindi)": "शास्त्रीय सेवा में जूठी प्लेटें आमतौर पर अतिथि की दाईं ओर से हटाई जाती हैं।",
  },
  {
    Question: "What is the minimum recommended duration for washing hands with soap and water?",
    "Option A": "5 seconds",
    "Option B": "20 seconds",
    "Option C": "2 seconds",
    "Option D": "1 minute of rinsing without soap",
    "Correct Answer": "B",
    Explanation: "Hands should be lathered and scrubbed for at least 20 seconds before rinsing.",
    Role: "All",
    "Question (Hindi)": "साबुन और पानी से हाथ धोने की न्यूनतम अनुशंसित अवधि क्या है?",
    "Option A (Hindi)": "5 सेकंड",
    "Option B (Hindi)": "20 सेकंड",
    "Option C (Hindi)": "2 सेकंड",
    "Option D (Hindi)": "बिना साबुन 1 मिनट धोना",
    "Explanation (Hindi)": "धोने से पहले हाथों को कम से कम 20 सेकंड तक साबुन से रगड़ना चाहिए।",
  },
];

/** Generates and downloads the sample Excel question sheet. */
export function downloadSampleExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_ROWS);
  worksheet["!cols"] = [
    { wch: 70 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 45 },
    { wch: 16 },
    { wch: 80 },
    { wch: 14 },
    { wch: 70 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 45 },
    { wch: 80 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  XLSX.writeFile(workbook, "RestoCare_Sample_Question_Sheet.xlsx");
}
