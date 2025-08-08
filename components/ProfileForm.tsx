// components/ProfileForm.tsx
'use client';

import { useState } from 'react'; // Đã xóa useEffect không sử dụng
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Bước 1: Tạo một kiểu (type) để mô tả cấu trúc của một profile
// (Bạn có thể thêm các trường khác nếu có trong CSDL)
type Profile = {
    id: string;
    full_name: string | null;
    height: number | null;
    // ... thêm các trường khác như weight, city, bio...
};

// Bước 2: Tạo một interface để định nghĩa các props cho component
interface ProfileFormProps {
    user: User;           // user là một đối tượng User từ Supabase
    profile: Profile | null; // profile có thể là đối tượng Profile hoặc null
}

// Bước 3: Áp dụng interface vào component
export default function ProfileForm({ user, profile }: ProfileFormProps) {
    const supabase = createClient();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [height, setHeight] = useState(profile?.height || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id, // upsert cần id để biết nên update hay insert
                full_name: fullName,
                height: height,
                updated_at: new Date().toISOString(), // Thêm trường này nếu có trong CSDL
            }).select();

            if (error) throw error;
            alert('Cập nhật hồ sơ thành công!');
        } catch (error) {
            if (error instanceof Error) {
                alert('Lỗi: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                </label>
                <input
                    id="fullName"
                    type="text"
                    value={fullName || ''}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Chiều cao (cm)
                </label>
                <input
                    id="height"
                    type="number"
                    value={height || ''}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            {/* Thêm các input khác cho weight, city... ở đây nếu cần */}
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}