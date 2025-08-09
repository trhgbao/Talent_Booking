// /app/search/page.tsx

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

// Định nghĩa props chuẩn cho trang
type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

// Bước 1: Cập nhật interface để khớp 100% với các cột bạn cần
interface TalentSearchResult {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    height: number | null;
}

export default async function SearchPage({ searchParams }: Props) {
    const supabase = createClient();
    const city = searchParams?.city as string;
    const min_height = searchParams?.min_height as string;

    // Bước 2: Cập nhật câu select để khớp 100% với interface
    // Chúng ta chỉ lấy những cột cần thiết cho trang tìm kiếm.
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

    // Bước 3: Thêm .returns<TalentSearchResult[]>() để "dạy" TypeScript
    // về kiểu dữ liệu trả về, giúp tránh lỗi không tương thích.
    const { data: talents, error } = await query.returns<TalentSearchResult[]>();

    // Bước 4: Xử lý lỗi từ Supabase một cách rõ ràng
    if (error) {
        console.error('Lỗi truy vấn Supabase:', error);
        return <div className="p-8"><p>Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.</p></div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Kết quả tìm kiếm</h1>

            {(!talents || talents.length === 0) ? (
                <p>Không tìm thấy talent nào phù hợp.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {/* Bây giờ talent đã có kiểu chính xác, không cần ép kiểu nữa */}
                    {talents.map((talent) => (
                        <div key={talent.id}>
                            <Link href={`/talent/${talent.id}`}>
                                <Image
                                    src={talent.avatar_url || '/default-avatar.png'}
                                    alt={talent.full_name || 'Talent'}
                                    width={200}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                                <h2 className="font-bold mt-2">{talent.full_name}</h2>
                                <p className="text-sm text-gray-600">{talent.city} - {talent.height}cm</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}