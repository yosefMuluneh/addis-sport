// @/lib/api.ts
export const uploadFilesAndUpdateClub = async (
    clubId: string,
    currentDocs: string[],
    newFiles: File[],
    editEntry: any
  ): Promise<any> => {
    console.log("Inside uploadFilesAndUpdateClub:", { clubId, currentDocs, newFiles });
  
    let documentPath = currentDocs;
  
    // Upload new files if any
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("files", file));
      console.log("Uploading files to /api/upload...");
  
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error("Upload failed:", errorData);
        throw new Error(errorData.error || "Failed to upload files");
      }
  
      const { filePaths } = await uploadRes.json();
      console.log("Uploaded file paths:", filePaths);
      documentPath = [...currentDocs, ...filePaths];
    }
  
    // Update club
    console.log("Updating club at /api/clubs/", clubId, "with documentPath:", documentPath);
    const res = await fetch(`/api/clubs/${clubId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editEntry, documentPath: JSON.stringify(documentPath) }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Update failed:", errorData);
      throw new Error(errorData.error || "Failed to update club");
    }
  
    const updatedClub = await res.json();
    console.log("Club updated:", updatedClub);
    return updatedClub;
  };