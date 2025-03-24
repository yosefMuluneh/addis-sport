"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subCities = [
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

interface ClubFormProps {
  club: {
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
  };
  onChange: (field: string, value: string) => void;
  readOnlyFields?: string[];
}

export default function ClubForm({
  club,
  onChange,
  readOnlyFields = [],
}: ClubFormProps) {
  const translations = {
    sportCode: "የስፖርት ኮድ",
    sportName: "የስፖርት ስም",
    clubCode: "የክለብ ኮድ",
    clubName: "የክለብ ስም",
    subCity: "ክፍለ ከተማ",
    district: "ወረዳ",
    phone: "ስልክ",
    registrationYear: "የተመዘገበበት ዓመት",
    sportNameEn: "የስፖርት ስም (እንግሊዝኛ)",
    clubNameEn: "የክለብ ስም (እንግሊዝኛ)",
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={translations.sportCode}
        value={club.sportCode}
        onChange={(e) => onChange("sportCode", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("sportCode")}
      />
      <Input
        placeholder={translations.sportName}
        value={club.sportName}
        onChange={(e) => onChange("sportName", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("sportName")}
      />
      <Input
        placeholder={translations.clubCode}
        value={club.clubCode}
        onChange={(e) => onChange("clubCode", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("clubCode")}
      />
      <Input
        placeholder={translations.clubName}
        value={club.clubName}
        onChange={(e) => onChange("clubName", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("clubName")}
      />
      <Select
        value={club.subCity}
        onValueChange={(value) => onChange("subCity", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={translations.subCity} />
        </SelectTrigger>
        <SelectContent>
          {subCities.map((subCity) => (
            <SelectItem key={subCity.en} value={subCity.en}>
              {subCity.am}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder={translations.district}
        value={club.district || ""}
        onChange={(e) => onChange("district", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("district")}
      />
      <Input
        placeholder={translations.phone}
        value={club.phone || ""}
        onChange={(e) => onChange("phone", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("phone")}
      />
      <Input
        placeholder={translations.registrationYear}
        value={club.registrationYear}
        onChange={(e) => onChange("registrationYear", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("registrationYear")}
      />
      <Input
        placeholder={translations.sportNameEn}
        value={club.sportNameEn || ""}
        onChange={(e) => onChange("sportNameEn", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("sportNameEn")}
      />
      <Input
        placeholder={translations.clubNameEn}
        value={club.clubNameEn || ""}
        onChange={(e) => onChange("clubNameEn", e.target.value)}
        className="text-lg"
        disabled={readOnlyFields.includes("clubNameEn")}
      />
    </div>
  );
}