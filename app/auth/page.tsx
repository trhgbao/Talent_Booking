'use client'
import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function LoginPage() {
    const supabase = createClient()

    return (
        <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '100px' }}>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''}
            />
        </div>
    )
}