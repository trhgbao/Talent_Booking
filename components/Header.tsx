// /components/Header.tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import UserMenu from './UserMenu'; // Import component mới

export default async function Header() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        // Nếu user đã đăng nhập, lấy thêm thông tin profile của họ
        const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        profile = userProfile;
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">TalentBook</Link>
                <nav className="space-x-6 flex items-center">
                    <Link href="/search" className="text-gray-600 hover:text-blue-600">Tìm kiếm</Link>

                    {user ? (
                        // Nếu đã đăng nhập, hiển thị UserMenu
                        <UserMenu user={user} profile={profile} />
                    ) : (
                        // Nếu chưa, hiển thị nút Đăng nhập
                        <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Đăng nhập
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}