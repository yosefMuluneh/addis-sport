"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Table from "@/components/Table";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/signin");
    fetch("/api/clubs")
      .then((res) => res.json())
      .then(setData);
  }, [status]);

  const filteredData = data.filter(
    (item: any) =>
      item.clubCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
  );

  const handleAddAdmin = async () => {
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAdmin),
    });
    if (res.ok) {
      console.log("Admin creation successful:", await res.json());
      setNewAdmin({ username: "", password: "" });
    } else {
      console.error("Admin creation failed:", res.statusText);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Sports Club Directory</h1>
            <div className="flex gap-2">
              {session?.user.role === "admin" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Admin</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Admin</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Username"
                        value={newAdmin.username}
                        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      />
                      <Button onClick={handleAddAdmin}>Create Admin</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                Sign Out
              </Button>
            </div>
          </div>
          <Input
            placeholder="Search by Club Code or Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 max-w-md"
          />
          <Table data={filteredData} userRole={session?.user.role || "user"} setData={setData} />
        </CardContent>
      </Card>
    </div>
  );
}