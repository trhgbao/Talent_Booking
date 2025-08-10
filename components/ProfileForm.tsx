// /components/ProfileForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Database } from 'types/types_db';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

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
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [height, setHeight] = useState<number | ''>('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setCity(profile.city || '');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || null);
            setHeight(profile.height || '');
        }
    }, [profile]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploadingAvatar(true);
            const toastId = toast.loading('Đang xử lý ảnh...');

            const file = event.target.files[0];
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const fileExt = compressedFile.name.split('.').pop();
            const filePath = `${user.id}-${Date.now()}.${fileExt}`;

            toast.loading('Đang tải ảnh lên...', { id: toastId });
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, compressedFile);
            if (uploadError) throw uploadError;

            // Xóa ảnh cũ (nếu có) để tiết kiệm dung lượng
            if (profile?.avatar_url) {
                const oldFilePath = profile.avatar_url.split('/avatars/')[1];
                await supabase.storage.from('avatars').remove([oldFilePath]);
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);

            // Cập nhật ngay vào CSDL
            const { error: dbError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
            if (dbError) throw dbError;

            toast.success('Cập nhật ảnh đại diện thành công!', { id: toastId });
            router.refresh();

        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = "";
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            city: city,
            bio: bio,
            ...(profile?.role === 'talent' && { height: height || null }),
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật thông tin thành công!');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* ----- GIAO DIỆN UPLOAD AVATAR ----- */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                        src={avatarUrl || '/default-avatar.png'}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        // Thêm key để React re-render lại ảnh khi URL thay đổi
                        key={avatarUrl}
                    />
                </div>
                <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors">
                    {uploadingAvatar ? 'Đang tải...' : 'Đổi ảnh'}
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploadingAvatar}
                    className="hidden"
                    ref={avatarInputRef}
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={user?.email || ''} disabled className="w-full mt-1 p-2 border rounded-md bg-gray-100" />
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

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}