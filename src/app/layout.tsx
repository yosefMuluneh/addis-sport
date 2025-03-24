import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import { ThemeProvider } from "@/lib/theme-provider";


export const metadata: Metadata = {
  title: "Addis Sport",
  description: "Addis Ababa Sports Club Directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am">
      <body
      >
        <ThemeProvider>
        <ClientSessionProvider>
        {children}

        </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
