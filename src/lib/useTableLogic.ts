import { useState, useMemo } from "react";

export interface TableData {
  id: string;
  sportCode: string;
  sportName: string;
  clubCode: string;
  clubName: string;
  subCity: string;
  district: string | null;
  phone: string | null;
  registrationYear: string;
  sportNameEn: string | null;
  clubNameEn: string | null;
  documentPath: string;
}



// src/lib/useTableLogic.ts
export interface TableRowProps {
  item: TableData;
  headers: { key: keyof TableData | "actions"; label: string }[]; // Added "actions"
  language: "en" | "am";
  translations: any;
  subCities: { en: string; am: string }[];
  setData: React.Dispatch<React.SetStateAction<any>>;
}
export const subCities = [
  { en: "Addis Ketema", am: "አዲስ ከተማ" },
  { en: "Akaky Kaliti", am: "አቃቂ ቃሊቲ" },
  { en: "Arada", am: "አራዳ" },
  { en: "Bole", am: "ቦሌ" },
  { en: "Gulele", am: "ጉለሌ" },
  { en: "Kirkos", am: "ቂርቆስ" },
  { en: "Kolfe Keranio", am: "ኮልፌ ቀራንዮ" },
  { en: "Lideta", am: "ልደታ" },
  { en: "Nifas Silk-Lafto", am: "ንፋስ ስልክ-ላፍቶ" },
  { en: "Yeka", am: "የካ" },
  { en: "Lemi Kura", am: "ለሚ ኩራ" },
];

export const useTableLogic = (data: TableData[]) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableData;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState<"en" | "am">("am");
  const itemsPerPage = 6;

  const translations = useMemo(
    () => ({
      en: {
        sportCode: "Sport Code",
        sportName: "Sport Name",
        clubCode: "Club Code",
        clubName: "Club Name",
        subCity: "Sub City",
        district: "District",
        phone: "Phone",
        registrationYear: "Registration Year",
        documentPath: "Documents",
        uploadNewDocuments: "Upload New Documents",
        uploading: "Uploading...",
        existingDocuments: "Existing Documents",
        edit: "Edit",
        editEntry: "Edit Entry",
        delete: "Delete",
        create: "Create New Entry",
        view: "View",
      },
      am: {
        sportCode: "የስፖርት ኮድ",
        sportName: "የስፖርት ስም",
        clubCode: "የክለብ ኮድ",
        clubName: "የክለብ ስም",
        subCity: "ክፍለ ከተማ",
        district: "ወረዳ",
        phone: "ስልክ",
        registrationYear: "የተመዘገበበት ዓመት",
        documentPath: "ሰነዶች",
        uploadNewDocuments: "አዲስ ሰነዶች አስገባ",
        documents: "ሰነዶች",
        noDocuments: "ምንም ሰነዶች የሉም",
        existingDocuments: "ሰነዶች",
        uploading: "ሰነዶች እየጫነ ነው...",
        edit: "አስተካክል",
        editEntry: "ክለብ አስተካክል",
        delete: "ሰርዝ",
        create: "አዲስ መግቢያ ፍጠር",
        update: "አስተካክል",
        remove: "አጥፋ",
        view: "ይመልከቱ",
      },
    }),
    []
  );

  const requestSort = (key: string) => {
    // Ensure key is a valid TableData key
    if (!(key in data[0])) return; // Silently ignore invalid keys
    const typedKey = key as keyof TableData; // Type assertion after check

    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === typedKey &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: typedKey, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    return sortConfig.direction === "asc"
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    sortConfig,
    requestSort,
    sortedData,
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    language,
    setLanguage,
    translations,
    itemsPerPage,
  };
};