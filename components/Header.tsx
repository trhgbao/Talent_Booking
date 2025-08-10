// /components/Header.tsx

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // Dùng server client

export default async function Header() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    TalentBook
                </Link>
                {/* Navigation */}
                <nav className="space-x-6 flex items-center">
                    <Link href="/search" className="text-gray-600 hover:text-blue-600">Tìm kiếm</Link>

                    {user ? (
                        // --- Giao diện KHI ĐÃ ĐĂNG NHẬP ---
                        <>
                            <Link href="/dashboard/profile" className="text-gray-600 hover:text-blue-600">
                                Dashboard
                            </Link>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-gray-600 hover:text-blue-600">
                                    Đăng xuất
                                </button>
                            </form>
                        </>
                    ) : (
                        // --- Giao diện KHI CHƯA ĐĂNG NHẬP ---
                        <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Đăng nhập
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}