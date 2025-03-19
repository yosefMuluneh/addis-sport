"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TableProps {
  data: {
    sportCode: string;
    sportName: string;
    clubCode: string;
    clubName: string;
    subCity: string;
    district: string;
    phone: string;
  }[];
  userRole: "admin" | "user";
  setData: React.Dispatch<React.SetStateAction<TableProps["data"]>>;
}

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

export default function TableComponent({ data, userRole, setData }: TableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableProps["data"][0]; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState<"en" | "am">("en");
  const [newEntry, setNewEntry] = useState({
    sportCode: "", sportName: "", clubCode: "", clubName: "", subCity: "", district: "", phone: ""
  });
  const [editEntry, setEditEntry] = useState<TableProps["data"][0] | null>(null);
  const itemsPerPage = 5;

  const requestSort = (key: keyof TableProps["data"][0]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    return sortConfig.direction === "asc"
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        edit: "Edit",
        delete: "Delete",
        create: "Create New Entry",
      },
      am: {
        sportCode: "ስፖርት ኮድ",
        sportName: "ስፖርት ስም",
        clubCode: "ክለብ ኮድ",
        clubName: "ክለብ ስም",
        subCity: "ክፍለ ከተማ",
        district: "ወረዳ",
        phone: "ስልክ",
        edit: "አስተካክል",
        delete: "ሰርዝ",
        create: "አዲስ መግቢያ ፍጠር",
      },
    }),
    []
  );

  const headers = useMemo(
    () =>
      [
        { key: "sportCode", label: translations[language].sportCode },
        { key: "sportName", label: translations[language].sportName },
        { key: "clubCode", label: translations[language].clubCode },
        { key: "clubName", label: translations[language].clubName },
        { key: "subCity", label: translations[language].subCity },
        { key: "district", label: translations[language].district },
        { key: "phone", label: translations[language].phone },
      ].concat(userRole === "admin" ? [{ key: "actions", label: "" }] : []),
    [language, userRole]
  );
  

  const getMinWidth = (label: string) => {
    const baseWidth = 60;
    const charWidth = 8;
    const sortIndicatorWidth = sortConfig ? 16 : 0;
    return `${baseWidth + label.length * charWidth + sortIndicatorWidth}px`;
  };

  const handleCreate = async () => {
    const res = await fetch("/api/clubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });
    if (res.ok) {
      const newClub = await res.json();
      setData((prev) => [...prev, newClub]);
      setNewEntry({ sportCode: "", sportName: "", clubCode: "", clubName: "", subCity: "", district: "", phone: "" });
    }
  };

  const handleUpdate = async () => {
    if (editEntry) {
      const res = await fetch("/api/clubs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEntry),
      });
      if (res.ok) {
        const updatedClub = await res.json();
        setData((prev) =>
          prev.map((item) => (item.clubCode === updatedClub.clubCode ? updatedClub : item))
        );
        setEditEntry(null);
      }
    }
  };

  const handleDelete = async (clubCode: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const res = await fetch("/api/clubs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubCode }),
      });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.clubCode !== clubCode));
      }
    }
  };

  const cityName = (city: string) =>{
    if (language === "am"){
        const theName = subCities.filter((town)=> town.en == city)
        return theName[0].am
    }
    return city
  }
  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between p-4">
        {userRole === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>{translations[language].create}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{translations[language].create}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder={translations[language].sportCode}
                  value={newEntry.sportCode}
                  onChange={(e) => setNewEntry({ ...newEntry, sportCode: e.target.value })}
                />
                <Input
                  placeholder={translations[language].sportName}
                  value={newEntry.sportName}
                  onChange={(e) => setNewEntry({ ...newEntry, sportName: e.target.value })}
                />
                <Input
                  placeholder={translations[language].clubCode}
                  value={newEntry.clubCode}
                  onChange={(e) => setNewEntry({ ...newEntry, clubCode: e.target.value })}
                />
                <Input
                  placeholder={translations[language].clubName}
                  value={newEntry.clubName}
                  onChange={(e) => setNewEntry({ ...newEntry, clubName: e.target.value })}
                />
                <Select
                  value={newEntry.subCity}
                  onValueChange={(value) => setNewEntry({ ...newEntry, subCity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translations[language].subCity} />
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
                  value={newEntry.district}
                  onChange={(e) => setNewEntry({ ...newEntry, district: e.target.value })}
                />
                <Input
                  placeholder={translations[language].phone}
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                />
                <Button onClick={handleCreate}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          onClick={() => setLanguage(language === "en" ? "am" : "en")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
        >
          {language === "en" ? "አማርኛ" : "English"}
        </Button>
      </div>
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              {headers.map((header) => (
                <TableHead
                  key={header.key}
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wide cursor-pointer transition-colors duration-200"
                  style={{ minWidth: getMinWidth(header.label) }}
                  onClick={
                    header.key !== "actions"
                      ? () => requestSort(header.key as keyof TableProps["data"][0])
                      : undefined
                  }
                >
                  <span
                    className={`inline-block ${
                      sortConfig?.key === header.key ? "text-blue-600" : ""
                    } hover:text-blue-500`}
                  >
                    {header.label}
                    {sortConfig?.key === header.key && (
                      <span className="ml-1 text-blue-600">
                        {sortConfig.direction === "asc" ? "▴" : "▾"}
                      </span>
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.clubCode}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[0].label) }}
                >
                  {item.sportCode}
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[1].label) }}
                >
                  {item.sportName}
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[2].label) }}
                >
                  {item.clubCode}
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[3].label) }}
                >
                  {item.clubName}
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[4].label) }}
                >
                  {cityName(item.subCity) }
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[5].label) }}
                >
                  {item.district}
                </TableCell>
                <TableCell
                  className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700"
                  style={{ minWidth: getMinWidth(headers[6].label) }}
                >
                  {item.phone}
                </TableCell>
                {userRole === "admin" && (
                  <TableCell className="px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-sm text-gray-700">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => setEditEntry(item)}
                        >
                          {translations[language].edit}
                        </Button>
                      </DialogTrigger>
                      {editEntry && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Entry</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder={translations[language].sportCode}
                              value={editEntry.sportCode}
                              onChange={(e) => setEditEntry({ ...editEntry, sportCode: e.target.value })}
                            />
                            <Input
                              placeholder={translations[language].sportName}
                              value={editEntry.sportName}
                              onChange={(e) => setEditEntry({ ...editEntry, sportName: e.target.value })}
                            />
                            <Input
                              placeholder={translations[language].clubCode}
                              value={editEntry.clubCode}
                              disabled
                            />
                            <Input
                              placeholder={translations[language].clubName}
                              value={editEntry.clubName}
                              onChange={(e) => setEditEntry({ ...editEntry, clubName: e.target.value })}
                            />
                            <Select
                              value={editEntry.subCity}
                              onValueChange={(value) => setEditEntry({ ...editEntry, subCity: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={translations[language].subCity} />
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
                              value={editEntry.district}
                              onChange={(e) => setEditEntry({ ...editEntry, district: e.target.value })}
                            />
                            <Input
                              placeholder={translations[language].phone}
                              value={editEntry.phone}
                              onChange={(e) => setEditEntry({ ...editEntry, phone: e.target.value })}
                            />
                            <Button onClick={handleUpdate}>Save</Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.clubCode)}
                    >
                      {translations[language].delete}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <Button
          disabled={currentPage * itemsPerPage >= data.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}