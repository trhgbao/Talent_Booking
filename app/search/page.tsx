// /app/search/page.tsx

import { createClient } from '@/lib/supabase/server';
import TalentCard from '@/components/TalentCard'; // Import TalentCard
// import SearchFilters from '@/components/SearchFilters'; // Sau này bạn sẽ tạo component này

// Định nghĩa props chuẩn cho trang
type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

// Kiểu dữ liệu cho một talent trong kết quả tìm kiếm
interface TalentSearchResult {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    height: number | null; // Mặc dù card không hiển thị, chúng ta vẫn cần nó để lọc
}

export default async function SearchPage({ searchParams }: Props) {
    const supabase = createClient();

    // Lấy các tham số từ URL
    const searchTerm = searchParams.q as string | undefined;
    const city = searchParams.city as string | undefined;
    const min_height = searchParams.min_height as string | undefined;

    let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, height')
        .eq('role', 'talent');

    // Sửa lại logic query để kết hợp các điều kiện
    if (searchTerm) {
        // Tìm kiếm trên cả 2 cột 'full_name' và 'city'
        // Cú pháp or() yêu cầu các điều kiện phải được nhóm lại
        query = query.or(`full_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
    }

    if (city) {
        query = query.eq('city', city);
    }
    if (min_height) {
        query = query.gte('height', Number(min_height));
    }

    const { data: talents, error } = await query.returns<TalentSearchResult[]>();

    if (error) {
        console.error('Lỗi truy vấn Supabase:', error);
        return <div className="p-8"><p>Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.</p></div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                {searchTerm ? `Kết quả cho "${searchTerm}"` : 'Khám phá Talent'}
            </h1>

            {/* TODO: Thêm component Bộ lọc <SearchFilters /> ở đây */}

            {(!talents || talents.length === 0) ? (
                <div className="text-center py-10">
                    <p className="text-lg">Không tìm thấy talent nào phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                    {/* Tái sử dụng TalentCard để hiển thị kết quả */}
                    {talents.map((talent) => (
                        <TalentCard key={talent.id} talent={talent} />
                    ))}
                </div>
            )}
        </div>
    );
}