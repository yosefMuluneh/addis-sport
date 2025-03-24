import { TableHead, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableHeaderProps {
  headers: { key: string; label: string }[];
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
}

export default function TableHeaderComponent({
  headers,
  sortConfig,
  requestSort,
}: TableHeaderProps) {
  return (
    <TableRow>
      {headers.map((header) => (
        <TableHead
          key={header.key}
          onClick={() => header.key !== "actions" && requestSort(header.key)}
          className={`px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 text-base font-semibold text-foreground cursor-pointer hover:bg-muted transition-colors duration-150 ${
            header.key === "actions" ? "cursor-default" : ""
          }`}
          style={{ minWidth: header.label.length * 10 + 60 }}
        >
          <div className="flex items-center gap-2">
            {header.label}
            {sortConfig?.key === header.key && header.key !== "actions" ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            ) : null}
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
}