// /app/page.tsx

import { createClient } from '@/lib/supabase/server';
import TalentCard from '@/components/TalentCard';
import SearchForm from '@/components/SearchForm';

// Định nghĩa kiểu cho talent để truyền vào TalentCard
// Kiểu này cần phải khớp với props của TalentCard.tsx
interface TalentForCard {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    city: string | null;
    category?: string; // category là tùy chọn
}

export default async function HomePage() {
    const supabase = createClient();

    const { data: talents, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city') // Chỉ lấy các cột cần thiết
        .eq('role', 'talent')
        .limit(8)
        .returns<TalentForCard[]>();

    if (error) {
        console.error('Lỗi lấy dữ liệu trang chủ:', error);
    }

    return (
        <main>
            {/* --- Hero Section --- */}
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gray-700">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img src="https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?q=80&w=1223&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-20 p-4 w-full">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Kết Nối Tài Năng, Kiến Tạo Thành Công
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Nền tảng booking Người mẫu, Diễn viên, MC.
                    </p> {/* Đặt SearchForm bên trong Hero Section */}
                </div>
            </section>

            {/* --- Featured Talents Section --- */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Gương Mặt Nổi Bật</h2>
                    {(!talents || talents.length === 0) ? (
                        <p className="text-center">Chưa có talent nào để hiển thị.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {talents.map((talent) => (
                                <TalentCard key={talent.id} talent={talent} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}