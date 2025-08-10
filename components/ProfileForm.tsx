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
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setCity(profile.city || '');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('profiles').update({
            full_name: fullName,
            city: city,
            bio: bio,
            avatar_url: avatarUrl,
        }).eq('id', user.id);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật hồ sơ thành công!');
            router.refresh(); // Làm mới trang để Header cập nhật avatar
        }
        setLoading(false);
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploadingAvatar(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Bạn phải chọn một ảnh để upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) throw uploadError;

            // Lấy URL công khai và cập nhật state
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            toast.success('Upload ảnh đại diện thành công!');

        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
                <label htmlFor="avatar">Ảnh đại diện</label>
                <input type="file" id="avatar" accept="image/*" onChange={uploadAvatar} disabled={uploadingAvatar} />
                {uploadingAvatar && <p>Đang tải ảnh lên...</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user.email} disabled className="w-full mt-1 p-2 border rounded-md bg-gray-100" />
            </div>
            <div>
                <label htmlFor="fullName">Họ và tên</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="city">Thành phố</label>
                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="bio">Giới thiệu</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}