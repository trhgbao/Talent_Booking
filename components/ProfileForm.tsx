// /components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Database } from 'types/types_db'; // Import kiểu Database

// Trích xuất kiểu Profile từ types_db.ts để đảm bảo nhất quán
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileFormProps {
    user: User;
    profile: Profile | null; // ProfileForm sẽ nhận kiểu Profile đã được chuẩn hóa
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const supabase = createClient();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [height, setHeight] = useState(profile?.height || '');
    const [city, setCity] = useState(profile?.city || ''); // Thêm state cho city
    const [bio, setBio] = useState(profile?.bio || '');     // Thêm state cho bio
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                height: height,
                city: city,
                bio: bio,
                // Không có 'weight' ở đây
            })
            .eq('id', user.id);

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật hồ sơ thành công!');
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
                <label htmlFor="fullName">Họ và tên</label>
                <input id="fullName" type="text" value={fullName || ''} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="height">Chiều cao (cm)</label>
                <input id="height" type="number" value={height || ''} onChange={(e) => setHeight(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="city">Thành phố</label>
                <input id="city" type="text" value={city || ''} onChange={(e) => setCity(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="bio">Giới thiệu</label>
                <textarea id="bio" value={bio || ''} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full mt-1 p-2 border rounded-md" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}