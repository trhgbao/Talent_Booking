// /app/page.tsx

import { createClient } from '@/lib/supabase/server';
import TalentCard from '@/components/TalentCard';

export default async function HomePage() {
    const supabase = createClient();

    // Lấy 8 talent ngẫu nhiên để hiển thị
    const { data: talents } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city') // Lấy các trường cần thiết
        .eq('role', 'talent')
        .limit(8);

    return (
        <main>
            {/* === Hero Section === */}
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-gray-700">
                {/* Ảnh nền */}
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                {/* Bạn có thể thay ảnh này bằng một ảnh đẹp hơn */}
                <img src="https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?q=80&w=1223&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background" className="absolute inset-0 w-full h-full object-cover" />

                {/* Nội dung */}
                <div className="relative z-20 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Kết Nối Tài Năng, Kiến Tạo Thành Công
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Nền tảng booking Người mẫu, Diễn viên, MC.
                    </p>
                    {/* Thanh tìm kiếm (chỉ là giao diện, chưa có chức năng) */}
                    <div className="mt-8 max-w-xl mx-auto">
                        <div className="flex items-center bg-white rounded-full shadow-lg p-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, lĩnh vực..."
                                className="w-full bg-transparent px-4 py-2 text-gray-900 focus:outline-none"
                            />
                            <button className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 transition">
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* === Featured Talents Section === */}
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