// /components/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

// Định nghĩa kiểu cho vai trò
type Role = 'talent' | 'client';

export default function SignUpForm() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<Role>('talent'); // Mặc định là 'talent'
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Đây là phần quan trọng: gửi dữ liệu bổ sung
                data: {
                    full_name: fullName,
                    role: role,
                }
            }
        });

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Đã gửi email xác thực. Vui lòng kiểm tra hộp thư của bạn!');
            // Bạn có thể thêm logic chuyển hướng ở đây nếu cần
        }
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-6">
            {/* Ô chọn vai trò */}
            <div className="flex gap-4">
                <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer w-1/2" style={{ borderColor: role === 'talent' ? '#2563EB' : '#E5E7EB' }}>
                    <input type="radio" name="role" value="talent" checked={role === 'talent'} onChange={() => setRole('talent')} className="h-4 w-4 text-blue-600" />
                    <span>Tôi là Talent</span>
                </label>
                <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer w-1/2" style={{ borderColor: role === 'client' ? '#2563EB' : '#E5E7EB' }}>
                    <input type="radio" name="role" value="client" checked={role === 'client'} onChange={() => setRole('client')} className="h-4 w-4 text-blue-600" />
                    <span>Tôi là Doanh nghiệp</span>
                </label>
            </div>

            {/* Các ô input khác */}
            <div>
                <label htmlFor="fullName">Họ và tên</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="password">Mật khẩu</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full mt-1 p-2 border rounded-md" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
        </form>
    );
}