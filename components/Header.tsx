// /components/Header.tsx
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    TalentBook
                </Link>
                {/* Navigation */}
                <nav className="space-x-6">
                    <Link href="/search" className="text-gray-600 hover:text-blue-600">Tìm kiếm</Link>
                    <Link href="/dashboard/profile" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                    <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Đăng nhập</Link>
                </nav>
            </div>
        </header>
    );
}