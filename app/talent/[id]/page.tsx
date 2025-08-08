// app/talent/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase'; // Dòng này đã đúng
import BookingTrigger from '@/components/BookingTrigger';

// BƯỚC 1: SỬ DỤNG "Database" ĐỂ TẠO RA TYPE CHO PORTFOLIO ITEM
// Cảnh báo "Database is never read" sẽ biến mất ngay khi bạn thêm dòng này
type PortfolioItem = Database['public']['Tables']['portfolios']['Row'];

export default async function TalentDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const talentId = params.id;

    const { data: { user } } = await supabase.auth.getUser();

    // ... code lấy talentProfile của bạn ...
    const { data: talentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', talentId)
        .single();

    // ... code lấy portfolioItems của bạn ...
    const { data: portfolioItems } = await supabase
        .from('portfolios')
        .select('*')
        .eq('talent_id', talentId);

    if (!talentProfile) {
        return <div>Không tìm thấy talent.</div>;
    }

    return (
        <div>
            <img src={talentProfile.avatar_url ?? ''} alt={talentProfile.full_name ?? ''} width={150} />
            <h1>{talentProfile.full_name}</h1>
            <p>Chiều cao: {talentProfile.height} cm</p>
            <p>Thành phố: {talentProfile.city}</p>
            <p>Giới thiệu: {talentProfile.bio}</p>

            <h2>Portfolio</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* BƯỚC 2: ÁP DỤNG TYPE VÀO HÀM MAP */}
                {portfolioItems?.map((item: PortfolioItem) => (
                    <div key={item.id}>
                        <img src={item.file_url ?? '#'} alt={item.title ?? 'Portfolio Image'} width={200} />
                    </div>
                ))}
            </div>
            <BookingTrigger
                talentId={talentProfile.id}
                talentName={talentProfile.full_name}
                currentUser={user}
            />
        </div>
    );
}