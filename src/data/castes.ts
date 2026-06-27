export interface CasteData {
  en: string
  mr: string
  subCastes: { en: string; mr: string }[]
}

export const CASTES: Record<string, CasteData> = {
  MARATHA: {
    en: "Maratha",
    mr: "मराठा",
    subCastes: [
      { en: "Jadhav", mr: "जाधव" },
      { en: "Pawar", mr: "पवार" },
      { en: "Gaikwad", mr: "गायकवाड" },
      { en: "Shinde", mr: "शिंदे" },
      { en: "More", mr: "मोरे" },
      { en: "Chavan", mr: "चव्हाण" },
      { en: "Deshmukh", mr: "देशमुख" },
      { en: "Patil", mr: "पाटील" },
      { en: "Salunkhe", mr: "सळुंखे" },
      { en: "Kadam", mr: "कदम" },
      { en: "Mohite", mr: "मोहिते" },
      { en: "Mahajan", mr: "महाजन" },
      { en: "Ghadge", mr: "घडगे" },
      { en: "Bhosale", mr: "भोसले" },
      { en: "Sawant", mr: "सावंत" },
      { en: "Dabhade", mr: "दाभाडे" },
    ],
  },
  LEVA_PATIL: {
    en: "Leva Patil",
    mr: "लेवा पाटील",
    subCastes: [
      { en: "Patil", mr: "पाटील" },
      { en: "Deshmukh", mr: "देशमुख" },
      { en: "Chaudhari", mr: "चौधरी" },
    ],
  },
  KUNBI: {
    en: "Kunbi",
    mr: "कुणबी",
    subCastes: [
      { en: "Kunbi (Maratha)", mr: "कुणबी (मराठा)" },
      { en: "Kadu Kunbi", mr: "काडू कुणबी" },
    ],
  },
  MALI: {
    en: "Mali",
    mr: "माळी",
    subCastes: [
      { en: "Phul Mali", mr: "फुल माळी" },
      { en: "Bag Mali", mr: "बाग माळी" },
      { en: "Jire Mali", mr: "जिरे माळी" },
    ],
  },
  BRAHMIN: {
    en: "Brahmin",
    mr: "ब्राह्मण",
    subCastes: [
      { en: "Deshastha Brahmin", mr: "देशस्थ ब्राह्मण" },
      { en: "Konkanastha (Chitpavan)", mr: "कोकणस्थ (चित्पावन)" },
      { en: "Karhade Brahmin", mr: "कार्हाडे ब्राह्मण" },
      { en: "Devrukhe Brahmin", mr: "देवरुखे ब्राह्मण" },
    ],
  },
  DHANGAR: {
    en: "Dhangar",
    mr: "धनगर",
    subCastes: [
      { en: "Hatkar", mr: "हटकर" },
      { en: "Kannade", mr: "कन्नडे" },
      { en: "Unnikankan", mr: "उन्नीकांकण" },
    ],
  },
  SUTAR: {
    en: "Sutar",
    mr: "सुतार",
    subCastes: [
      { en: "Sutar (Jangid)", mr: "सुतार (जांगीड)" },
      { en: "Sutar (Panchal)", mr: "सुतार (पंचाळ)" },
    ],
  },
  LOHAR: {
    en: "Lohar",
    mr: "लोहार",
    subCastes: [
      { en: "Panchal Lohar", mr: "पंचाळ लोहार" },
    ],
  },
  SONAR: {
    en: "Sonar",
    mr: "सोनार",
    subCastes: [
      { en: "Daivadnya", mr: "दैवज्ञ" },
      { en: "Panchal Sonar", mr: "पंचाळ सोनार" },
    ],
  },
  TELI: {
    en: "Teli",
    mr: "तेली",
    subCastes: [],
  },
  SHIMPI: {
    en: "Shimpi",
    mr: "शिंपी",
    subCastes: [
      { en: "Namdev Shimpi", mr: "नामदेव शिंपी" },
      { en: "Sinh Shimpi", mr: "सिंह शिंपी" },
    ],
  },
  NHAVI: {
    en: "Nhavi",
    mr: "न्हावी",
    subCastes: [],
  },
  PARIT: {
    en: "Parit",
    mr: "परिट",
    subCastes: [],
  },
  KUMBHAR: {
    en: "Kumbhar",
    mr: "कुंभार",
    subCastes: [],
  },
  CHAMBHAR: {
    en: "Chambhar",
    mr: "चांभार",
    subCastes: [],
  },
  MAHAR: {
    en: "Mahar",
    mr: "महार",
    subCastes: [],
  },
  MANG: {
    en: "Mang (Matang)",
    mr: "मांग (मातंग)",
    subCastes: [],
  },
  DHOBI: {
    en: "Dhobi",
    mr: "धोबी",
    subCastes: [],
  },
  KOLI: {
    en: "Koli",
    mr: "कोळी",
    subCastes: [
      { en: "Koli Dhor", mr: "कोळी धोर" },
      { en: "Koli Mahadev", mr: "कोळी महादेव" },
      { en: "Malhar Koli", mr: "मल्हार कोळी" },
    ],
  },
  BHIL: {
    en: "Bhil",
    mr: "भिल",
    subCastes: [
      { en: "Bhil Garasia", mr: "भिल गरासिया" },
      { en: "Bhil Katariya", mr: "भिल कटारिया" },
    ],
  },
  VANJARI: {
    en: "Vanjari (Banjara)",
    mr: "वंजारी (बंजारा)",
    subCastes: [],
  },
  GOSAVI: {
    en: "Gosavi (Goswami)",
    mr: "गोसावी (गोस्वामी)",
    subCastes: [],
  },
  GAVALI: {
    en: "Gavali",
    mr: "गवळी",
    subCastes: [],
  },
  AHIRE: {
    en: "Ahire",
    mr: "आहिर",
    subCastes: [],
  },
  BAGUL: {
    en: "Bagul",
    mr: "बागुल",
    subCastes: [],
  },
  PANCHAL: {
    en: "Panchal",
    mr: "पंचाळ",
    subCastes: [
      { en: "Sutar (Panchal)", mr: "सुतार (पंचाळ)" },
      { en: "Lohar (Panchal)", mr: "लोहार (पंचाळ)" },
      { en: "Sonar (Panchal)", mr: "सोनार (पंचाळ)" },
      { en: "Kasar (Panchal)", mr: "कासार (पंचाळ)" },
    ],
  },
  WANI: {
    en: "Wani (Marwari)",
    mr: "वाणी (मारवाडी)",
    subCastes: [],
  },
  LINGAYAT: {
    en: "Lingayat",
    mr: "लिंगायत",
    subCastes: [],
  },
  RAJPUT: {
    en: "Rajput",
    mr: "राजपूत",
    subCastes: [],
  },
  SALVI: {
    en: "Salvi",
    mr: "साळवी",
    subCastes: [],
  },
  KASAR: {
    en: "Kasar",
    mr: "कासार",
    subCastes: [],
  },
  BUDDHIST: {
    en: "Buddhist (Navayan)",
    mr: "बौद्ध (नवयान)",
    subCastes: [],
  },
  SIKH: {
    en: "Sikh",
    mr: "शीख",
    subCastes: [],
  },
  CHRISTIAN: {
    en: "Christian",
    mr: "ख्रिश्चन",
    subCastes: [],
  },
  JAIN: {
    en: "Jain",
    mr: "जैन",
    subCastes: [
      { en: "Digambar Jain", mr: "दिगंबर जैन" },
      { en: "Shwetambar Jain", mr: "श्वेतांबर जैन" },
    ],
  },
  MUSLIM: {
    en: "Muslim",
    mr: "मुस्लिम",
    subCastes: [
      { en: "Sunni", mr: "सुन्नी" },
      { en: "Shia", mr: "शिया" },
      { en: "Momin (Ansari)", mr: "मोमीन (अन्सारी)" },
      { en: "Pathan", mr: "पठाण" },
      { en: "Shaikh", mr: "शेख" },
      { en: "Syed", mr: "सय्यद" },
    ],
  },
  OTHER: {
    en: "Other",
    mr: "इतर",
    subCastes: [],
  },
}

export const CASTE_ENUM_MAP: Record<string, string> = {
  MARATHA: "MARATHA",
  LEVA_PATIL: "LEVA_PATIL",
  KUNBI: "KUNBI",
  MALI: "MALI",
  BRAHMIN: "BRAHMIN",
  DHANGAR: "DHANGAR",
  SUTAR: "SUTAR",
  LOHAR: "LOHAR",
  SONAR: "SONAR",
  TELI: "TELI",
  SHIMPI: "SHIMPI",
  NHAVI: "NHAVI",
  PARIT: "PARIT",
  KUMBHAR: "KUMBHAR",
  CHAMBHAR: "CHAMBHAR",
  MAHAR: "MAHAR",
  MANG: "MANG",
  DHOBI: "DHOBI",
  KOLI: "KOLI",
  BHIL: "BHIL",
  VANJARI: "VANJARI",
  GOSAVI: "GOSAVI",
  GAVALI: "GAVALI",
  AHIRE: "AHIRE",
  BAGUL: "BAGUL",
  PANCHAL: "PANCHAL",
  WANI: "WANI",
  LINGAYAT: "LINGAYAT",
  RAJPUT: "RAJPUT",
  SALVI: "SALVI",
  KASAR: "KASAR",
  BUDDHIST: "BUDDHIST",
  SIKH: "SIKH",
  CHRISTIAN: "CHRISTIAN",
  JAIN: "JAIN",
  MUSLIM: "MUSLIM",
  OTHER: "OTHER",
}
