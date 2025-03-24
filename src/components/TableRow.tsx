import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import EditClubForm from "./EditClubForm";
import Image from "next/image";
import { XIcon, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TableRowProps } from "@/lib/useTableLogic";

export default function TableRowComponent({
  item,
  headers,
  language,
  translations,
  subCities,
  setData,
}: TableRowProps) {
  const [editEntry, setEditEntry] = useState(item);
  const [isImageCardOpen, setIsImageCardOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [popDeleteMessage, setPopDeleteMessage] = useState(false);

  const parseDocumentPath = (path: any) => {
    if (typeof path === "object") {
      let correctedPath = JSON.stringify(path);
      correctedPath = JSON.parse(correctedPath);
      console.log("correctedPath",typeof correctedPath, correctedPath);
      return correctedPath;
    }
    if (typeof path === "string") {
      return JSON.parse(path);
    }
    return [];
  };

  const [existingDocuments, setExistingDocuments] = useState<string[]>(
    parseDocumentPath(item.documentPath)
  );

  const uploadFilesAndUpdateClub = async (id: string, currentDocs: string[], newFiles: File[]) => {
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

    const res = await fetch(`/api/clubs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editEntry, documentPath }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update club");
    }

    return res.json();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const updatedClub = await uploadFilesAndUpdateClub(editEntry.id, existingDocuments, files);
      setSuccess(true);
      setResponseMessage("Club updated successfully");
      setData((prev: any) => prev.map((d: any) => (d.id === editEntry.id ? updatedClub : d)));
      setExistingDocuments(parseDocumentPath(updatedClub.documentPath));
      setFiles([]);
      setReadyToUpload(false);
    } catch (error: any) {
      console.error("Error updating club:", error);
      setSuccess(false);
      setResponseMessage(`Error updating club: ${error.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(translations[language].confirmDelete || "Are you sure you want to delete this entry?")) {
      try {
        const documentPaths = parseDocumentPath(item.documentPath);
        if (documentPaths.length > 0) {
          await fetch("/api/uploads", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePaths: documentPaths }),
          });
        }

        const res = await fetch(`/api/clubs/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setSuccess(false);
          setPopDeleteMessage(true);
          setResponseMessage("Failed to delete club");
          throw new Error("Failed to delete club");
        }
        setData((prev: any) => prev.filter((d: any) => d.id !== id));
        setSuccess(true);
        setPopDeleteMessage(true);
        setResponseMessage("Club deleted successfully");
      } catch (error: any) {
        console.error("Error deleting club:", error);
      }
    }
    setTimeout(() => setPopDeleteMessage(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const cityName = (subCity: string) => {
    const city = subCities.find((c) => c.en === subCity || c.am === subCity);
    return city ? city[language] : subCity;
  };

  return (
    <TableRow className="border-b border-border dark:border-gray-700 hover:bg-muted transition-colors duration-150">
      {headers.map((header, idx) => (
        <TableCell
          key={header.key}
          className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-base text-foreground"
          style={{ minWidth: header.label.length * 10 + 60 }}
        >
          {header.key === "subCity" ? (
            cityName(item.subCity)
          ) : header.key === "actions" ? (
            <div>
              <Link href={`/clubs/${item.id}`}>
                <Button variant="outline" size="sm" className="mr-2">
                  {translations[language].view}
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 mr-2">
                  {translations[language].edit}
                </DialogTrigger>
                {editEntry && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{translations[language].editEntry || "Edit Entry"}</DialogTitle>
                    </DialogHeader>
                    <EditClubForm
                      editEntry={editEntry}
                      setEditEntry={setEditEntry}
                      setData={setData}
                      language={language}
                      translations={translations}
                      subCities={subCities}
                    />
                  </DialogContent>
                )}
              </Dialog>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                {translations[language].delete}
              </Button>
              {popDeleteMessage && (
                <div className="bg-black/50 shadow border-none fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                  <Card className="flex flex-col">
                    <CardHeader className="sticky top-0 z-10 p-4 mt-0 flex justify-between items-center shadow-lg">
                      <CardTitle className="text-2xl">{translations[language].delete}</CardTitle>
                      <XIcon onClick={() => setPopDeleteMessage(false)} className="cursor-pointer" />
                    </CardHeader>
                    <CardContent className="flex-1 p-6 overflow-y-auto">
                      <p className={`${success ? "text-green-500" : "text-red-500"}`}>
                        {responseMessage}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : header.key === "documentPath" ? (
            existingDocuments.length > 0 ? (
              <div onClick={() => setIsImageCardOpen(true)}>
                <div className="relative w-16 pb-8 cursor-pointer">
                  {existingDocuments.slice(0, 2).map((path, index) => (
                    <Image
                      key={index}
                      src={path}
                      alt={`document-${index}`}
                      width={60}
                      height={60}
                      className="absolute object-cover rounded shadow-sm hover:opacity-90 transition-opacity w-[50px] h-[30px]"
                      style={{ left: `${index * 4}px`, top: `${index * 4}px`, zIndex: index }}
                    />
                  ))}
                </div>
                {isImageCardOpen && (
                  <div className="bg-black/50 shadow border-none fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <Card className="w-[95vw] h-[90vh] flex flex-col">
                      <CardHeader className="sticky top-0 z-10 p-4 mt-0 flex justify-between items-center shadow-lg">
                        <CardTitle className="text-2xl">{translations[language].documents}</CardTitle>
                        <XIcon onClickCapture={()=>setIsImageCardOpen(false)} onClick={() => setIsImageCardOpen(false)} className="cursor-pointer" />
                      </CardHeader>
                      <CardContent className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                          {existingDocuments.map((path, index) => (
                            <div key={index} className="w-full flex justify-center">
                              <Image
                                src={path}
                                alt={`document-${index}`}
                                width={1200}
                                height={800}
                                className="object-contain rounded-lg shadow-lg max-h-[70vh] w-auto"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Upload onClick={() => setReadyToUpload(true)} className="cursor-pointer" />
                {readyToUpload && (
                  <div className="bg-black/50 shadow border-none fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <Card className="flex flex-col">
                      <CardHeader className="sticky top-0 z-10 p-4 mt-0 flex justify-between items-center shadow-lg">
                        <CardTitle className="text-2xl">{translations[language].documents}</CardTitle>
                        <XIcon onClick={() => setReadyToUpload(false)} className="cursor-pointer" />
                      </CardHeader>
                      <CardContent className="flex-1 p-6 overflow-y-auto">
                        <form onSubmit={handleUpload} className="space-y-4">
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
                          <Button type="submit" disabled={uploading || !files.length}>
                            {uploading ? "Uploading..." : translations[language].upload || "Upload"}
                          </Button>
                          {responseMessage && (
                            <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                              {responseMessage}
                            </p>
                          )}
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )
          ) : (
            item[header.key] || "N/A"
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}