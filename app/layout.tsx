// /app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast'; // Import Toaster một lần duy nhất

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
                {/* Thêm Header, Toaster, và Footer vào đúng vị trí */}
                <Header />

                {/* Đặt Toaster ngay trong body để nó hiển thị trên cùng */}
                <Toaster position="top-center" />

                <main>{children}</main>

                <Footer />
            </body>
        </html>
    );
}