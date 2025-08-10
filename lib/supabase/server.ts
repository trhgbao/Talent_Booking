// /lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from 'types/types_db' // Đảm bảo đường dẫn này đúng

export const createClient = () => {
    const cookieStore = cookies()

    return createServerClient<Database>( // Thêm <Database> ở đây
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Bỏ qua lỗi nếu gọi từ Server Component
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Bỏ qua lỗi nếu gọi từ Server Component
                    }
                },
            },
        }
    )
}