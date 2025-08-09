// /app/auth/page.tsx
'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    return (
        <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '100px' }}>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                redirectTo={`${siteUrl}/auth/callback`}
            // XÓA DÒNG NÀY ĐI: emailRedirectTo={`${siteUrl}/dashboard/profile`}
            />
        </div>
    );
}