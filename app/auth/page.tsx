// app/auth/page.tsx
'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
    const supabase = createClient();

    const getURL = () => {
        let url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
        url = url.includes('http') ? url : `https://${url}`;
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    return (
        <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '100px' }}>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'github']}
                redirectTo={`${getURL()}auth/callback`}
            />
        </div>
    );
}