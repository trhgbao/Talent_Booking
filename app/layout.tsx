// /app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Import
import Footer from "@/components/Footer"; // Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TalentBook",
    description: "Nền tảng booking talent hàng đầu",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={inter.className}>
                <Header /> {/* Thêm Header */}
                <main>{children}</main>
                <Footer /> {/* Thêm Footer */}
            </body>
        </html>
    );
}