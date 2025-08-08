// /app/talent/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import BookingTrigger from '@/components/BookingTrigger';

// ... (Giữ nguyên các interface đã tạo ở các bước trước)
interface PortfolioItem {
    id: number; file_url: string; title: string | null;
}
type Props = {
    params: { id: string };
};

export default async function TalentDetailPage({ params }: Props) {
    // ... (Giữ nguyên phần code lấy dữ liệu)
    const supabase = createClient();
    const talentId = params.id;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: talentProfile } = await supabase.from('profiles').select('*').eq('id', talentId).single();
    const { data: portfolioItems } = await supabase.from('portfolios').select('*').eq('talent_id', talentId);

    if (!talentProfile) return <p>Talent not found.</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* === Cột trái: Thông tin chính === */}
                <aside className="w-full md:w-1/3 lg:w-1/4">
                    <div className="sticky top-8">
                        <div className="relative w-48 h-48 mx-auto md:w-full md:h-auto md:aspect-square mb-6">
                            <Image
                                src={talentProfile.avatar_url || '/default-avatar.png'}
                                alt={talentProfile.full_name || 'Talent'}
                                fill
                                className="rounded-full md:rounded-lg object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-center md:text-left">{talentProfile.full_name}</h1>
                        <p className="text-center md:text-left text-gray-600 mb-4">Người mẫu & Diễn viên</p>

                        <div className="space-y-2 text-gray-700 mb-6">
                            <p><strong>Chiều cao:</strong> {talentProfile.height || 'N/A'} cm</p>
                            <p><strong>Cân nặng:</strong> {talentProfile.weight || 'N/A'} kg</p>
                            <p><strong>Thành phố:</strong> {talentProfile.city || 'N/A'}</p>
                        </div>

                        <BookingTrigger
                            talentId={talentProfile.id}
                            talentName={talentProfile.full_name}
                            currentUser={user}
                        />
                    </div>
                </aside>

                {/* === Cột phải: Giới thiệu & Portfolio === */}
                <main className="w-full md:w-2/3 lg:w-3/4">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Giới thiệu</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {talentProfile.bio || 'Talent này chưa có phần giới thiệu.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Portfolio</h2>
                        {(!portfolioItems || portfolioItems.length === 0) ? (
                            <p>Talent này chưa cập nhật portfolio.</p>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {portfolioItems.map((item: PortfolioItem) => (
                                    <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={item.file_url}
                                            alt={item.title || 'Portfolio Image'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}