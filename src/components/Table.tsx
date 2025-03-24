"use client";

import { Table, TableHeader, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableHeaderComponent from "./TableHeader";
import TableRowComponent from "./TableRow";
import CreateClubForm from "./CreateClubForm";
import Pagination from "./Pagination";
import { useTableLogic, subCities, TableData } from "@/lib/useTableLogic"; // Import TableData

interface TableProps {
  data: TableData[]; // Use TableData directly
  setData: React.Dispatch<React.SetStateAction<TableData[]>>;
}

export default function TableComponent({ data, setData }: TableProps) {
  const {
    sortConfig,
    requestSort,
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    language,
    setLanguage,
    translations,
  } = useTableLogic(data);

  // Explicitly type headers with keyof TableData
  const headers: { key: keyof TableData | "actions"; label: string }[] = [
    { key: "sportCode", label: translations[language].sportCode },
    { key: "sportName", label: translations[language].sportName },
    { key: "clubCode", label: translations[language].clubCode },
    { key: "clubName", label: translations[language].clubName },
    { key: "subCity", label: translations[language].subCity },
    { key: "district", label: translations[language].district },
    { key: "phone", label: translations[language].phone },
    { key: "documentPath", label: translations[language].documentPath },
    { key: "actions", label: "" }, // Custom key for actions
  ];
  return (
    <div className="w-full bg-background rounded-xl shadow-md border border-border dark:bg-gray-800 dark:border-blue-900">
      <div className="flex justify-between p-4">
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            {translations[language].create}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations[language].create}</DialogTitle>
            </DialogHeader>
            <CreateClubForm
              setData={setData}
              language={language}
              translations={translations}
              subCities={subCities}
            />
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => setLanguage(language === "en" ? "am" : "en")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {language === "en" ? "አማርኛ" : "English"}
        </Button>
      </div>
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <Table className="w-full">
          <TableHeader>
            <TableHeaderComponent
              headers={headers}
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRowComponent
                key={item.clubCode}
                item={item}
                headers={headers}
                language={language}
                translations={translations}
                subCities={subCities}
                setData={setData}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}