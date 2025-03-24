"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {  TableData } from "@/lib/useTableLogic";


export default function ClubDetails({ params }: { params: Promise<{ id: string }> }) {
  const [club, setClub] = useState<TableData>();

  const resolvedParams = use(params); // Next.js 15's use hook for params
  const id = resolvedParams.id;
  const router = useRouter();
 

  useEffect(() => {
    fetch(`/api/clubs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(setClub)
      .catch((error) => {
        console.error("Error fetching clubs:", error);
        throw error;
      });
  }, [id]);

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
  const goBack = () => {
    router.back();
  };
  

  const documents = parseDocumentPath(club?.documentPath);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6 lg:p-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl"
      >
        <Card className="relative bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
          {/* Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent pointer-events-none" />

          <CardHeader className="relative p-6 border-b border-gray-700/50">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4">
                
                  <ArrowLeft onClickCapture={goBack} size={30} color="white" className="cursor-pointer" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {club?.clubName}
                </h1>
              </div>
              <span className="text-sm text-gray-400 font-medium bg-gray-700/50 px-3 py-1 rounded-full">
                {club?.clubCode}
              </span>
             
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Club Details Section */}
              <div className="space-y-5">
                <DetailItem label="Sport" value={club?.sportName} highlight />
                <DetailItem label="Sport Code" value={club?.sportCode} />
                <DetailItem label="Sub City" value={club?.subCity} />
                <DetailItem label="District" value={club?.district || "N/A"} />
                <DetailItem label="Phone" value={club?.phone || "N/A"} />
                <DetailItem label="Registration" value={club?.registrationYear} />
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full" />
                  Documents
                </h2>
                {documents && documents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {documents.map((path: any, index: any) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, rotate: 1 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group"
                      >
                        <Link href={path} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={path}
                            alt={`document-${index}`}
                            width={150}
                            height={100}
                            className="rounded-lg object-cover w-full h-full shadow-md group-hover:shadow-xl transition-shadow duration-200 border border-gray-600/50"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-medium">View</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No documents available</p>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Enhanced DetailItem component
interface DetailItemProps {
  label: any;
  value: any;
  highlight?: boolean;
}

function DetailItem({ label, value, highlight = false }: DetailItemProps) {
  return (
    <motion.div
      className="flex items-center gap-3 py-2 group"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span
        className={`font-semibold ${
          highlight ? "text-blue-400" : "text-gray-300"
        } group-hover:text-white transition-colors duration-200`}
      >
        {label }:
      </span>
      <span className="text-gray-100 font-medium">{value}</span>
    </motion.div>
  );
}