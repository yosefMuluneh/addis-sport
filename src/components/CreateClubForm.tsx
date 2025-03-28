"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

interface CreateClubFormProps {
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  language: "en" | "am";
  translations: {
    en: { [key: string]: string };
    am: { [key: string]: string };
  };
  subCities: { en: string; am: string }[];
  clubCodes: string[];
  clubNames: string[];
}

export default function CreateClubForm({
  setData,
  language,
  translations,
  subCities,
  clubCodes,
  clubNames,
}: CreateClubFormProps) {
  const [formData, setFormData] = useState({
    sportCode: "",
    sportName: "",
    clubCode: "",
    clubName: "",
    subCity: "",
    district: "",
    phone: "",
    registrationYear: "",
    sportNameEn: "",
    clubNameEn: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let documentPath = "[]";

      // Upload files if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          setSuccess(false);
          setResponseMessage("Failed to upload files");
          throw new Error("Failed to upload files");
        }

        const { filePaths } = await uploadRes.json();
        documentPath = JSON.stringify(filePaths);
        setSuccess(true);
        setResponseMessage("Files uploaded successfully");
      }

      // Create the club with the uploaded file paths
      const existingClubCode = clubCodes.find((code) => code === formData.clubCode);
      const existingClubName = clubNames.find((name) => name === formData.clubName);
      if (existingClubCode || existingClubName) {
        setSuccess(false);
        setResponseMessage("Club code or name already exists");
        return;
      }
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, documentPath }),
      });

      if (res.ok) {
        const newClub = await res.json();
        setData((prev) => [...prev, newClub]);
        setFormData({
          sportCode: "",
          sportName: "",
          clubCode: "",
          clubName: "",
          subCity: "",
          district: "",
          phone: "",
          registrationYear: "",
          sportNameEn: "",
          clubNameEn: "",
        });
        setFiles([]);
        setSuccess(true);
        setResponseMessage("Club created successfully");
      } else {
        setSuccess(false);
        setResponseMessage("Failed to create club");
        console.error("Failed to create club:", res.statusText);
      }
    } catch (error) {
      setSuccess(false);
      setResponseMessage("Failed to create club");
      console.error("Error creating club:", error);
    } finally {
      setUploading(false);
    }
    setTimeout(() => {
      setResponseMessage("");
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder={translations[language].sportCode}
        value={formData.sportCode}
        onChange={(e) => setFormData({ ...formData, sportCode: e.target.value })}
      />
      <Input
        placeholder={translations[language].sportName}
        value={formData.sportName}
        onChange={(e) => setFormData({ ...formData, sportName: e.target.value })}
      />
      <Input
        placeholder={translations[language].clubCode}
        value={formData.clubCode}
        onChange={(e) => setFormData({ ...formData, clubCode: e.target.value })}
      />
      <Input
        placeholder={translations[language].clubName}
        value={formData.clubName}
        onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
      />
      <Select
        value={formData.subCity}
        onValueChange={(value) => setFormData({ ...formData, subCity: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder={translations[language].subCity} />
        </SelectTrigger>
        <SelectContent>
          {subCities.map((city) => (
            <SelectItem key={city.en} value={city.en}>
              {city[language]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder={translations[language].district}
        value={formData.district}
        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
      />
      <Input
        placeholder={translations[language].phone}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <Input
        placeholder={translations[language].registrationYear}
        value={formData.registrationYear}
        onChange={(e) => setFormData({ ...formData, registrationYear: e.target.value })}
      />
      
      <div>
        <Label htmlFor="files" className="block text-sm font-medium text-foreground">
          {translations[language].documents || "Upload Documents"}
        </Label>
        <Input
          id="files"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 cursor-pointer"
        />
        {files.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : translations[language].create}
      </Button>
      {responseMessage && (
        <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>{responseMessage}</p>
      )}
    </form>
  );
}