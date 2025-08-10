// /components/ProfileForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Database } from 'types/types_db';
import { useRouter } from 'next/navigation';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileFormProps {
    user: User;
    profile: Profile | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [height, setHeight] = useState<number | ''>(''); // State cho chiều cao
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setCity(profile.city || '');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || '');
            setHeight(profile.height || ''); // Gán giá trị chiều cao
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = {
            id: user.id,
            full_name: fullName,
            city: city,
            bio: bio,
            avatar_url: avatarUrl,
            // Chỉ cập nhật chiều cao nếu là talent
            ...(profile?.role === 'talent' && { height: height || null }),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật hồ sơ thành công!');
            router.refresh();
        }
        setLoading(false);
    };

    // ... (code uploadAvatar giữ nguyên)

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* ... (các trường avatar, email, full_name, city, bio giữ nguyên) */}
            <div>
                <label htmlFor="fullName">Họ và tên</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="..." />
            </div>
            <div>
                <label htmlFor="city">Thành phố</label>
                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="..." />
            </div>
            <div>
                <label htmlFor="bio">Giới thiệu</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="..." />
            </div>

            {/* ----- LOGIC MỚI: CHỈ HIỂN THỊ CHIỀU CAO CHO TALENT ----- */}
            {profile?.role === 'talent' && (
                <div>
                    <label htmlFor="height">Chiều cao (cm)</label>
                    <input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full ...">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}