export const runtime = 'nodejs';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};

interface Talent {
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

    let query = supabase.from('profiles').select('*').eq('role', 'talent');

    if (city) {
        query = query.eq('city', city);
    }
    if (min_height) {
        query = query.gte('height', Number(min_height));
    }

    const { data: talents } = await query;

    return (
        <div>
            <h1>Search Results</h1>
            {talents?.map((talent: Talent) => (
                <div key={talent.id}>
                    <Link href={`/talent/${talent.id}`}>
                        <Image src={talent.avatar_url!} alt={talent.full_name!} width={100} height={100} />
                        <h2>{talent.full_name}</h2>
                    </Link>
                </div>
            ))}
        </div>
    );
}