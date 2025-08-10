// /app/dashboard/profile/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import ImageUploader from '@/components/ImageUploader';
import RoleSelector from '@/components/RoleSelector';
import { Database } from 'types/types_db'; // Bước 1: Import kiểu Database

// Bước 2: Tạo một kiểu tiện ích từ Database
// Nó sẽ tự động lấy ra kiểu của một dòng trong bảng 'profiles'
type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function ProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth');
    }

    // Bước 3: Sử dụng .returns<Profile | null>() để "dạy" TypeScript
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        //.returns<Profile | null>() // <-- Thêm dòng này
        .single();

    // Nếu không có profile hoặc profile chưa có role, hiển thị trang chọn vai trò
    if (!profile || !profile.role) {
        return <RoleSelector userId={user.id} />;
    }

    // Nếu đã có vai trò, hiển thị dashboard tương ứng
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            {profile.role === 'talent' ? (
                // --- Giao diện cho TALENT ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                        {/* Bây giờ prop 'profile' sẽ có kiểu dữ liệu đúng */}
                        <ProfileForm user={user} profile={profile} />
                    </div>
                    <div className="md:col-span-2">
                        {/* Phần quản lý portfolio ở đây */}
                        {/* <PortfolioManager userId={user.id} /> */}
                    </div>
                </div>
            ) : (
                // --- Giao diện cho CLIENT ---
                <div>
                    <h2 className="text-xl font-semibold">Chào mừng Doanh nghiệp!</h2>
                    <p>Các tính năng dành cho bạn đang được phát triển.</p>
                </div>
            )}
        </div>
    );
}