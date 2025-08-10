// /app/dashboard/onboarding/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function OnboardingPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'talent' | 'client' | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
        };
        getUser();
    }, []);

    const handleSaveRole = async () => {
        if (!role || !user) {
            toast.error('Vui lòng chọn vai trò của bạn.');
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', user.id);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật vai trò thành công! Đang chuyển hướng...');
            // Chuyển hướng đến dashboard chính sau khi chọn xong
            window.location.href = '/dashboard/profile';
        }
        setLoading(false);
    };

    if (!user) return <div>Đang tải...</div>; // Chờ lấy thông tin user

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md mx-auto my-10 p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center mb-2">Chào mừng bạn đến với TalentBook!</h2>
                <p className="text-center text-gray-600 mb-6">Để tiếp tục, vui lòng chọn vai trò của bạn:</p>
                <div className="flex gap-4 mb-6">
                    <div onClick={() => setRole('talent')} className={`flex-1 p-6 border-2 rounded-lg cursor-pointer text-center transition-all ${role === 'talent' ? 'border-blue-600 bg-blue-50 scale-105' : 'hover:border-gray-400'}`}>
                        <span className="text-4xl">👩‍🎤</span>
                        <p className="font-semibold mt-2">Tôi là Talent</p>
                        <p className="text-sm text-gray-500">(Người mẫu, Diễn viên, MC...)</p>
                    </div>
                    <div onClick={() => setRole('client')} className={`flex-1 p-6 border-2 rounded-lg cursor-pointer text-center transition-all ${role === 'client' ? 'border-blue-600 bg-blue-50 scale-105' : 'hover:border-gray-400'}`}>
                        <span className="text-4xl">🏢</span>
                        <p className="font-semibold mt-2">Tôi là Doanh nghiệp</p>
                        <p className="text-sm text-gray-500">(Agency, Nhà tuyển dụng...)</p>
                    </div>
                </div>
                <button onClick={handleSaveRole} disabled={loading || !role} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                    {loading ? 'Đang lưu...' : 'Xác nhận và Tiếp tục'}
                </button>
            </div>
        </div>
    );
}