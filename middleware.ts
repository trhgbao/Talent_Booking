// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from 'types/types_db';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => request.cookies.get(name)?.value,
                set: (name, value, options) => {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({ request: { headers: request.headers } });
                    response.cookies.set({ name, value, ...options });
                },
                remove: (name, options) => {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({ request: { headers: request.headers } });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Logic chuyển hướng mới
    if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();

        // Chưa có role -> đến trang onboarding
        if (!profile?.role && request.nextUrl.pathname !== '/dashboard/onboarding') {
            return NextResponse.redirect(new URL('/dashboard/onboarding', request.url));
        }

        // Đã có role nhưng chưa điền tên -> bắt ở lại trang profile
        if (profile?.role && !profile.full_name && request.nextUrl.pathname !== '/dashboard/profile') {
            const redirectUrl = new URL('/dashboard/profile', request.url);
            redirectUrl.searchParams.set('welcome', 'true'); // Thêm param để hiển thị thông báo
            return NextResponse.redirect(redirectUrl);
        }
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'], // Middleware này chỉ chạy cho các trang trong dashboard
};