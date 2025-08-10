// /app/dashboard/profile/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import RoleSelector from '@/components/RoleSelector';
import PortfolioManager from '@/components/PortfolioManager'; // Import component quản lý portfolio
import { Database } from 'types/types_db';
import Link from 'next/link';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function ProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 1. Nếu chưa có role, bắt buộc chọn role
    if (!profile || !profile.role) {
        return <RoleSelector userId={user.id} />;
    }

    // 2. Nếu đã có role, hiển thị dashboard
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Hồ sơ của bạn</h1>

            {profile.role === 'talent' && (
                // --- GIAO DIỆN CHO TALENT ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                        <ProfileForm user={user} profile={profile} />
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Quản lý Portfolio</h2>
                        <p className="text-sm text-gray-500 mb-4">Tải lên các hình ảnh và video đẹp nhất của bạn để thu hút nhà tuyển dụng.</p>
                        <PortfolioManager userId={user.id} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Quản lý Booking</h2>
                        <p className="text-sm text-gray-500 mb-4">Xem và phản hồi các yêu cầu booking từ khách hàng.</p>
                        <Link href="/dashboard/bookings" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                            Xem Yêu cầu Booking
                        </Link>
                    </div>
                </div>
            )}

            {profile.role === 'client' && (
                // --- GIAO DIỆN CHO CLIENT ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4">Thông tin Doanh nghiệp</h2>
                        <ProfileForm user={user} profile={profile} />
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Quản lý Portfolio</h2>
                        <PortfolioManager userId={user.id} />
                    </div>
                    <div className="md:col-span-3">
                        <h2 className="text-xl font-semibold mb-4">Quản lý Booking</h2>
                        <p className="text-sm text-gray-500 mb-4">Xem lại lịch sử và trạng thái các yêu cầu booking bạn đã gửi.</p>
                        <Link href="/dashboard/my-bookings" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                            Xem Booking của tôi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}