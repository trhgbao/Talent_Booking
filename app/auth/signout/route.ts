// /app/auth/signout/route.ts
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        await supabase.auth.signOut();
        revalidatePath('/', 'layout'); // Làm mới toàn bộ layout
    }

    // Chuyển hướng về trang chủ sau khi đăng xuất
    return NextResponse.redirect(new URL('/', req.url), {
        status: 302,
    });
}