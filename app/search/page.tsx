// app/search/page.tsx

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

interface Talent {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    height: number | null;
}

// Thay vì tạo một interface riêng, chúng ta sẽ định nghĩa kiểu trực tiếp trong hàm
export default async function SearchPage({
    searchParams
}: {
    searchParams: { city?: string; min_height?: string }
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

    const { data: talents } = await query;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Tìm kiếm Talent</h1>

            {(!talents || talents.length === 0) ? (
                <p>Không tìm thấy talent nào phù hợp.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {talents.map((talent: Talent) => (
                        <Link href={`/talent/${talent.id}`} key={talent.id} className="block group">
                            <div className="border rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                                <Image
                                    src={talent.avatar_url || '/default-avatar.png'}
                                    alt={talent.full_name || 'Talent Avatar'}
                                    width={200}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-3">
                                    <p className="font-bold truncate">{talent.full_name || 'Chưa có tên'}</p>
                                    <p className="text-sm text-gray-600">
                                        {talent.city || 'N/A'} - {talent.height ? `${talent.height} cm` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}