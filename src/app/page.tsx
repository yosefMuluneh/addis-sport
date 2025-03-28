"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Table from "@/components/Table";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { User2 } from "lucide-react";
import Link from "next/link";
import { TableData } from "@/lib/useTableLogic";

export default function Page() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<TableData[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/signin");
    if (status === "authenticated") {
      fetch("/api/clubs")
        .then((res) => res.json())
        .then(setData)
        .catch((error) => console.error("Error fetching clubs:", error));
    }
  }, [status]);

  const filteredData = data.filter(
    (item: TableData) =>
      item.clubCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone && item.phone.includes(searchTerm) ||
      item.clubName.toLowerCase().includes(searchTerm.toLowerCase()))

  );

  if (status === "loading") return <div>በመጫን ላይ...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full mx-auto  min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 p-6 lg:p-10 flex items-center justify-center">
      <Card className="dark:bg-gradient-to-br dark:from-gray-800 dark:via-indigo-800 dark:to-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              የስፖርት ክለቦች ዝርዝር
            </h1>
            <div className="flex gap-2 items-center">
              <Link
                href='/admin'
                className="p-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                title="Admin Profile"
              >
                <User2 className="w-6 h-6" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <Input
            placeholder="በክለብ ኮድ ወይም በክለብ ስም ወይም ስልክ ቁጥር ፈልግ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 max-w-md text-lg"
          />
          <Table data={filteredData} setData={setData} />
        </CardContent>
      </Card>
    </div>
  );
}