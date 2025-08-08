// /components/TalentCard.tsx

import Image from 'next/image';
import Link from 'next/link';

// Định nghĩa cấu trúc dữ liệu mà Card sẽ nhận vào
interface TalentCardProps {
    talent: {
        id: string;
        avatar_url: string | null;
        full_name: string | null;
        category?: string; 
        city: string | null;
    };
}

export default function TalentCard({ talent }: TalentCardProps) {
    return (
        <Link href={`/talent/${talent.id}`} className="block group">
            <div className="w-full overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative w-full aspect-[4/5]"> 
                    <Image
                        src={talent.avatar_url || '/default-avatar.png'} 
                        alt={talent.full_name || 'Talent'}
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                </div>

                <div className="p-3">
                    <p className="font-bold text-md truncate">{talent.full_name || 'Chưa có tên'}</p>
                    {talent.category && (
                        <p className="text-sm text-gray-600">{talent.category}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{talent.city || 'Chưa rõ'}</p>
                </div>
            </div>
        </Link>
    );
}