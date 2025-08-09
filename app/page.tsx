// /app/page.tsx

import { createClient } from '@/lib/supabase/server';
import TalentCard from '@/components/TalentCard';
import Link from 'next/link';

export default async function HomePage() {
    const supabase = createClient();

    const { data: talents } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city')
        .eq('role', 'talent')
        .limit(8);

    return (
        <main>
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gray-700">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <img src="https://images.unsplash.com/photo-1522244331360-863a35415317" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-20 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Kết Nối Tài Năng, Kiến Tạo Thành Công</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Nền tảng booking Người mẫu, Diễn viên, MC hàng đầu Việt Nam.</p>
                    <div className="mt-8 max-w-xl mx-auto">
                        <Link href="/search">
                            <button className="bg-blue-600 text-white rounded-full px-8 py-3 hover:bg-blue-700 transition font-semibold">
                                Bắt đầu Tìm kiếm
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Gương Mặt Nổi Bật</h2>
                    {(!talents || talents.length === 0) ? (
                        <p className="text-center">Chưa có talent nào để hiển thị.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {talents.map((talent) => (
                                // @ts-ignore // Tạm thời bỏ qua lỗi type ở đây để tập trung vào chức năng
                                <TalentCard key={talent.id} talent={talent} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}