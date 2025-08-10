// /app/search/page.tsx

import { createClient } from '@/lib/supabase/server';
import TalentCard from '@/components/TalentCard';
import SearchFilters from '@/components/SearchFilters'; // Import bộ lọc mới

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

interface TalentSearchResult {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
}

export default async function SearchPage({ searchParams }: Props) {
    const supabase = createClient();

    // Lấy các tham số lọc từ URL
    const fullName = searchParams.full_name as string | undefined;
    const city = searchParams.city as string | undefined;
    const minHeight = searchParams.min_height as string | undefined;

    let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city') // Chỉ lấy các cột cần cho card
        .eq('role', 'talent');

    // Xây dựng câu query dựa trên các tham số có trong URL
    if (fullName) {
        query = query.ilike('full_name', `%${fullName}%`);
    }
    if (city) {
        query = query.ilike('city', `%${city}%`);
    }
    if (minHeight) {
        query = query.gte('height', Number(minHeight));
    }

    const { data: talents, error } = await query.returns<TalentSearchResult[]>();

    if (error) {
        console.error('Lỗi truy vấn Supabase:', error);
        return <div className="p-8"><p>Đã xảy ra lỗi khi tìm kiếm.</p></div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Khám phá Talent</h1>

            {/* Đặt component bộ lọc ở đây */}
            <SearchFilters />

            {(!talents || talents.length === 0) ? (
                <div className="text-center py-10">
                    <p className="text-lg">Không tìm thấy talent nào phù hợp với điều kiện của bạn.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                    {talents.map((talent) => (
                        <TalentCard key={talent.id} talent={talent} />
                    ))}
                </div>
            )}
        </div>
    );
}