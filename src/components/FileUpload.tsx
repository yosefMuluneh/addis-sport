"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  onFilesChange: (filePaths: string[]) => void;
  existingFiles: string[];
}

export default function FileUpload({
  onFilesChange,
  existingFiles,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { filePaths } = await res.json();
        onFilesChange([...existingFiles, ...filePaths]);
        setFiles([]); // Clear the file input
      } else {
        console.error("File upload failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleRemove = (filePath: string) => {
    onFilesChange(existingFiles.filter((path) => path !== filePath));
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="text-lg"
        />
        {files.length > 0 && (
          <div className="mt-2">
            <p>የተመረጡ ፋይሎች:</p> {/* "Selected Files:" */}
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Button onClick={handleUpload} disabled={files.length === 0}>
        ፋይሎችን ጫን {/* "Upload Files" */}
      </Button>
      {existingFiles.length > 0 && (
        <div>
          <p>የተጫኑ ፋይሎች:</p> {/* "Uploaded Files:" */}
          <ul>
            {existingFiles.map((filePath, index) => (
              <li key={index} className="flex items-center gap-2">
                <a href={filePath} target="_blank" rel="noopener noreferrer">
                  {filePath.split("/").pop()}
                </a>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(filePath)}
                >
                  አስወግድ {/* "Remove" */}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}