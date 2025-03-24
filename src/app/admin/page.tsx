
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Save, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [adminData, setAdminData] = useState({
    username: session?.user?.name || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  if (status === "unauthenticated") redirect("/auth/signin");
  if (status === "loading") return <div>በመጫን ላይ...</div>;

  const handleUpdateAdmin = async () => {
    try {
      const res = await fetch("/api/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: session?.user?.id, // Assuming your session includes an admin ID
          username: adminData.username,
          password: adminData.password || undefined, // Only send password if changed
        }),
      });

      if (res.ok) {
        setMessage("መረጃ ተዘምኗል!");
        setIsSuccess(true);
        setAdminData((prev) => ({ ...prev, password: "" })); // Clear password field
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "መረጃ ማዘመን አልተሳካም");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      setMessage("የተሳሳተ ነገር ተከስቷል");
      setIsSuccess(false);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 shadow-lg rounded-xl">
          <CardHeader>
            <ArrowLeft   onClickCapture={()=>router.back()} className="cursor-pointer" color="white" size={30} />
            <CardTitle className="text-2xl font-bold text-white text-center">
              የአስተዳዳሪ መገለጫ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-gray-300">
                  የተጠቃሚ ስም
                </label>
                <Input
                  value={adminData.username}
                  onChange={(e) =>
                    setAdminData({ ...adminData, username: e.target.value })
                  }
                  className="mt-1 text-lg bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="የተጠቃሚ ስም አስገባ"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">
                  አዲስ የይለፍ ቃል (ከፈለጉ)
                </label>
                <Input
                  type="password"
                  value={adminData.password}
                  onChange={(e) =>
                    setAdminData({ ...adminData, password: e.target.value })
                  }
                  className="mt-1 text-lg bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="አዲስ የይለፍ ቃል አስገባ"
                />
              </div>
            </motion.div>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-sm text-center ${
                  isSuccess ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </motion.p>
            )}

            <motion.div
              className="flex gap-4 justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button
                onClick={handleUpdateAdmin}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                መረጃ አስቀምጥ
              </Button>
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="outline"
                className="flex-1 border-gray-600 hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ውጣ
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}