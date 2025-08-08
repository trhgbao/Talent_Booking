// app/search/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

// Bước 1: Định nghĩa kiểu dữ liệu cho object talent
type TalentProfile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    height: number | null;
};

export default async function SearchPage({ searchParams }: {
    searchParams: { city?: string; min_height?: string };
}) {
    const supabase = createClient();
    const { city, min_height } = searchParams;

    let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, height')
        .eq('role', 'talent');

    if (city) {
        query = query.eq('city', city);
    }
    if (min_height) {
        query = query.gte('height', Number(min_height));
    }

    // TypeScript giờ sẽ hiểu `talents` là một mảng TalentProfile[] hoặc null
    const { data: talents, error } = await query;

    return (
        <div>
            <h1>Tìm kiếm Talent</h1>
            {/* Ở đây bạn sẽ có các ô filter để người dùng chọn */}
            {/* ... */}
            <div className="talent-grid">
                {/* Bước 2: Áp dụng type vào tham số của hàm map */}
                {talents?.map((talent: TalentProfile) => (
                    <Link href={`/talent/${talent.id}`} key={talent.id}>
                        <div>
                            {/* Giờ đây, khi bạn gõ `talent.`, VS Code sẽ gợi ý các thuộc tính! */}
                            <img src={talent.avatar_url || ''} alt={talent.full_name || 'Talent'} width={150} />
                            <p>{talent.full_name}</p>
                            <p>{talent.city} - {talent.height} cm</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}