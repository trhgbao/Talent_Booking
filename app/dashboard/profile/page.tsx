// app/dashboard/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth'); // N?u ch?a ??ng nh?p, ?� v? trang auth
    }

    // L?y th�ng tin profile c?a user ?ang ??ng nh?p
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(); // .single() ?? l?y 1 object thay v� 1 array

    if (error && error.code !== 'PGRST116') { // PGRST116 l� l?i kh�ng t�m th?y d�ng n�o, c� th? b? qua
        console.error('Error fetching profile:', error);
    }

    return (
        <div>
            <h1>Ch?nh s?a h? s?</h1>
            <ProfileForm user={user} profile={profile} />
            {/* ? ?�y b?n c� th? th�m ph?n upload portfolio */}
        </div>
    );
}