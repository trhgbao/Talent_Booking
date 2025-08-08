// components/ProfileForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Giả sử bạn truyền user và profile vào component này
export default function ProfileForm({ user, profile }) {
    const supabase = createClient();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [height, setHeight] = useState(profile?.height || '');
    // ... thêm các state khác cho weight, city, bio...
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').update({
                full_name: fullName,
                height: height,
                // ... các trường khác
            }).eq('id', user.id); // Chỉ cập nhật profile của chính user này

            if (error) throw error;
            alert('Cập nhật hồ sơ thành công!');
        } catch (error) {
            alert('Lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdateProfile}>
            <div>
                <label htmlFor="fullName">Họ và tên</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="height">Chiều cao (cm)</label>
                <input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            {/* ... các input khác ... */}
            <button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}