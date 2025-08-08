// app/talent/[id]/page.tsx
export const runtime = 'nodejs';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import BookingTrigger from '@/components/BookingTrigger';

// Định nghĩa kiểu cho các props theo cách chuẩn nhất
type Props = {
    params: { id: string };
};

interface PortfolioItem {
    id: number;
    file_url: string;
    title: string | null;
}

export default async function TalentDetailPage({ params }: Props) {
    const supabase = createClient();
    const talentId = params.id;

    const { data: { user } } = await supabase.auth.getUser();

    const { data: talentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', talentId)
        .single();

    const { data: portfolioItems } = await supabase
        .from('portfolios')
        .select('id, file_url, title')
        .eq('talent_id', talentId);

    if (!talentProfile) {
        return <div className="p-8">Không tìm thấy talent.</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
                <Image
                    src={talentProfile.avatar_url || '/default-avatar.png'}
                    alt={talentProfile.full_name || 'Talent Avatar'}
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                    <h1 className="text-4xl font-bold">{talentProfile.full_name}</h1>
                    <p className="text-lg text-gray-600">Chiều cao: {talentProfile.height} cm | Thành phố: {talentProfile.city}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Giới thiệu</h2>
                <p className="text-gray-700">{talentProfile.bio}</p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioItems?.map((item: PortfolioItem) => (
                        <div key={item.id} className="rounded-lg overflow-hidden">
                            <Image
                                src={item.file_url}
                                alt={item.title || 'Portfolio item'}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <BookingTrigger
                talentId={talentProfile.id}
                talentName={talentProfile.full_name}
                currentUser={user}
            />
        </div>
    );
}