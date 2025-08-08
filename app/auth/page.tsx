// app/auth/page.tsx
'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
    const supabase = createClient();

    return (
        <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '100px' }}>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'github']} // Tùy ch?n: cho phép ??ng nh?p b?ng MXH
                redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
            />
        </div>
    );
}