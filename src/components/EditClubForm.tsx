import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface EditClubFormProps {
  editEntry: any;
  setEditEntry: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  language: "en" | "am";
  translations: any;
  subCities: { en: string; am: string }[];
}

export default function EditClubForm({
  editEntry,
  setEditEntry,
  setData,
  language,
  translations,
  subCities,
}: EditClubFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [uploading, setUploading] = useState(false);

  const parseDocumentPath = (path: any) => {
    if (typeof path === "object") {
      const correctedPath = JSON.stringify(path);
      return JSON.parse(correctedPath);
    }
    if (typeof path === "string") {
      return JSON.parse(path);
    }
    return [];
  };

  const [existingDocuments, setExistingDocuments] = useState<string[]>(
    parseDocumentPath(editEntry.documentPath)
  );

  const uploadFilesAndUpdateClub = async (clubId: string, currentDocs: string[], newFiles: File[], entry: any) => {
    let documentPath = currentDocs;

    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("files", file));

      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || "Failed to upload files");
      }

      const { filePaths } = await uploadRes.json();
      documentPath = [...currentDocs, ...filePaths];
    }

    const res = await fetch(`/api/clubs/${clubId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, documentPath }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update club");
    }

    setEditEntry({...entry, documentPath})

    return res.json();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingDocument = async (path: string) => {
    try {
      const response = await fetch("/api/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePaths: [path] }),
      });

      if (!response.ok) throw new Error("Failed to delete file");

      const updatedDocuments = existingDocuments.filter((doc) => doc !== path);
      const updatedClub = await uploadFilesAndUpdateClub(editEntry.id, updatedDocuments, [], editEntry);
      setExistingDocuments(updatedDocuments);
      setEditEntry(updatedClub);
      setData((prev: any) => prev.map((d: any) => (d.id === editEntry.id ? updatedClub : d)));
      setSuccess(true);
      setResponseMessage("Document removed successfully");
    } catch (error: any) {
      console.error("Error removing document:", error);
      setSuccess(false);
      setResponseMessage(`Failed to remove document: ${error.message}`);
    } finally {
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const updatedClub = await uploadFilesAndUpdateClub(editEntry.id, existingDocuments, files, editEntry);
      setSuccess(true);
      setResponseMessage("Club updated successfully");
      setData((prev: any) => prev.map((d: any) => (d.id === editEntry.id ? updatedClub : d)));
      setExistingDocuments(parseDocumentPath(updatedClub.documentPath));
      setFiles([]);
      setEditEntry(updatedClub);
    } catch (error: any) {
      console.error("Error updating club:", error);
      setSuccess(false);
      setResponseMessage(`Error updating club: ${error.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder={translations[language].sportCode}
        value={editEntry.sportCode}
        onChange={(e) => setEditEntry({ ...editEntry, sportCode: e.target.value })}
        className="text-lg"
      />
      <Input
        placeholder={translations[language].sportName}
        value={editEntry.sportName}
        onChange={(e) => setEditEntry({ ...editEntry, sportName: e.target.value })}
        className="text-lg"
      />
      <Input
        placeholder={translations[language].clubCode}
        value={editEntry.clubCode}
        onChange={(e) => setEditEntry({ ...editEntry, clubCode: e.target.value })}
        className="text-lg"
      />
      <Input
        placeholder={translations[language].clubName}
        value={editEntry.clubName}
        onChange={(e) => setEditEntry({ ...editEntry, clubName: e.target.value })}
        className="text-lg"
      />
      <Select
        value={editEntry.subCity}
        onValueChange={(value) => setEditEntry({ ...editEntry, subCity: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder={editEntry.subCity} />
        </SelectTrigger>
        <SelectContent>
          {subCities.map((subCity) => (
            <SelectItem key={subCity.en} value={subCity.en}>
              {language === "en" ? subCity.en : subCity.am}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input 
        placeholder={translations[language].district}
        value={editEntry.district || ""}
        onChange={(e) => setEditEntry({ ...editEntry, district: e.target.value })}
        className="text-lg"
      />
      <Input
        placeholder={translations[language].phone}
        value={editEntry.phone || ""}
        onChange={(e) => setEditEntry({ ...editEntry, phone: e.target.value })}
        className="text-lg"
      />
      <div>
        <Label htmlFor="existing-documents" className="block text-sm font-medium text-foreground">
          {translations[language].documents || "Existing Documents"}
        </Label>
        {existingDocuments.length > 0 ? (
          <div className="mt-2 list-disc pl-5 flex gap-3 flex-wrap">
            {existingDocuments.map((path, index) => (
              <div
                key={index}
                className="relative text-blue-600 dark:text-blue-400 hover:underline bg-black/50 p-1 hover:bg-black/20 hover:cursor-pointer group"
              >
                <Image
                  src={path}
                  alt={`document-${index}`}
                  width={30}
                  height={40}
                  className="w-[40px] h-[60px] hover:cursor-pointer"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleRemoveExistingDocument(path)}
                >
                  <X className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer" aria-label="Remove document" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {translations[language].noDocuments || "No Documents"}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="files" className="block text-sm font-medium text-foreground">
          {translations[language].uploadNewDocuments || "Upload New Documents"}
        </Label>
        <Input
          id="files"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
        {files.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="flex gap-3 items-center">
                {file.name}{" "}
                <X onClick={() => handleRemoveFile(index)} className="cursor-pointer" color="red" />
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : translations[language].update}
      </Button>
      {responseMessage && (
        <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>{responseMessage}</p>
      )}
    </form>
  );
}