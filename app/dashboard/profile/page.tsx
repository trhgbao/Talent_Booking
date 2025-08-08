// app/dashboard/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth'); // N?u ch?a ??ng nh?p, ?á v? trang auth
    }

    // L?y thông tin profile c?a user ?ang ??ng nh?p
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(); // .single() ?? l?y 1 object thay vì 1 array

    if (error && error.code !== 'PGRST116') { // PGRST116 là l?i không tìm th?y dòng nào, có th? b? qua
        console.error('Error fetching profile:', error);
    }

    return (
        <div>
            <h1>Ch?nh s?a h? s?</h1>
            <ProfileForm user={user} profile={profile} />
            {/* ? ?ây b?n có th? thêm ph?n upload portfolio */}
        </div>
    );
}