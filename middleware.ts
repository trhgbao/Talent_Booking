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
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        // Nếu đã đăng nhập, vào dashboard nhưng chưa có role -> chuyển đến trang chọn role
        if (!profile?.role && request.nextUrl.pathname !== '/dashboard/onboarding') {
            return NextResponse.redirect(new URL('/dashboard/onboarding', request.url));
        }
        // Nếu đã có role mà lại vào trang chọn role -> chuyển về dashboard chính
        if (profile?.role && request.nextUrl.pathname === '/dashboard/onboarding') {
            return NextResponse.redirect(new URL('/dashboard/profile', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'], // Middleware này chỉ chạy cho các trang trong dashboard
};