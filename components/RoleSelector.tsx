// /components/RoleSelector.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function RoleSelector({ userId }: { userId: string }) {
    const supabase = createClient();
    const router = useRouter();
    const [role, setRole] = useState<'talent' | 'client' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSaveRole = async () => {
        if (!role) {
            toast.error('Vui lòng chọn vai trò của bạn.');
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', userId);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Cập nhật vai trò thành công!');
            router.refresh(); // Tải lại trang để nhận state mới
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto my-10 p-8 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2">Chào mừng bạn đến với TalentBook!</h2>
            <p className="text-center text-gray-600 mb-6">Để tiếp tục, vui lòng chọn vai trò của bạn:</p>
            <div className="flex gap-4 mb-6">
                <div onClick={() => setRole('talent')} className={`flex-1 p-6 border-2 rounded-lg cursor-pointer text-center ${role === 'talent' ? 'border-blue-600 bg-blue-50' : ''}`}>
                    <span className="text-4xl">👩‍🎤</span>
                    <p className="font-semibold mt-2">Tôi là Talent</p>
                    <p className="text-sm text-gray-500">(Người mẫu, Diễn viên, MC...)</p>
                </div>
                <div onClick={() => setRole('client')} className={`flex-1 p-6 border-2 rounded-lg cursor-pointer text-center ${role === 'client' ? 'border-blue-600 bg-blue-50' : ''}`}>
                    <span className="text-4xl">🏢</span>
                    <p className="font-semibold mt-2">Tôi là Doanh nghiệp</p>
                    <p className="text-sm text-gray-500">(Agency, Nhà tuyển dụng...)</p>
                </div>
            </div>
            <button onClick={handleSaveRole} disabled={loading || !role} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Đang lưu...' : 'Xác nhận và Tiếp tục'}
            </button>
        </div>
    );
}