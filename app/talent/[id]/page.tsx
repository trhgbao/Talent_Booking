// /app/talent/[id]/page.tsx - PHIÊN BẢN SỬA LỖI VÀ HOÀN CHỈNH

import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import BookingTrigger from '@/components/BookingTrigger';

type Props = {
    params: { id: string };
};

interface PortfolioItem {
    id: number;
    file_url: string | null;
    title: string | null;
}

export default async function TalentDetailPage({ params }: Props) {
    const supabase = createClient();
    const talentId = params.id;

    // 1. Lấy thông tin người dùng đang đăng nhập (nếu có)
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Lấy profile của người dùng đang đăng nhập để kiểm tra quyền
    let currentUserProfile = null;
    if (user) {
        const { data } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
        currentUserProfile = data;
    }

    // 3. Định nghĩa các điều kiện rõ ràng
    const isClient = currentUserProfile?.role === 'client';
    const isProfileComplete = !!currentUserProfile?.full_name; // Dấu !! để chuyển thành boolean
    const canBook = user && isClient && isProfileComplete;

    // 4. Lấy thông tin của talent đang được xem
    const { data: talentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', talentId)
        .single();

    const { data: portfolioItems, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('talent_id', talentId);

    if (profileError || !talentProfile) {
        console.error("Lỗi lấy thông tin talent:", profileError);
        return <p className="p-8">Không thể tìm thấy thông tin talent.</p>;
    }

    // --- Bắt đầu phần Render ---
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <aside className="w-full md:w-1/3 lg:w-1/4">
                    <div className="sticky top-8">
                        {/* ... (Phần hiển thị avatar, tên, chiều cao... giữ nguyên) ... */}
                        <div className="relative w-48 h-48 mx-auto md:w-full md:h-auto md:aspect-square mb-6">
                            <Image
                                src={talentProfile.avatar_url || '/default-avatar.png'}
                                alt={talentProfile.full_name || 'Talent'}
                                fill
                                className="rounded-full md:rounded-lg object-cover border-4 border-white shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-center md:text-left">{talentProfile.full_name}</h1>
                        <p className="text-center md:text-left text-gray-600 mb-4">Người mẫu & Diễn viên</p>
                        <div className="space-y-2 text-gray-700 mb-6">
                            <p><strong>Chiều cao:</strong> {talentProfile.height || 'N/A'} cm</p>
                            <p><strong>Thành phố:</strong> {talentProfile.city || 'N/A'}</p>
                        </div>

                        {/* --- LOGIC HIỂN THỊ NÚT BOOKING ĐÃ SỬA LẠI --- */}
                        {canBook ? (
                            // Nếu đủ điều kiện, hiển thị nút Booking
                            <BookingTrigger
                                talentId={talentProfile.id}
                                talentName={talentProfile.full_name}
                                currentUser={user}
                            />
                        ) : (
                            // Nếu không đủ điều kiện, hiển thị thông báo tương ứng
                            <div className="mt-6 p-3 bg-gray-100 rounded-md text-center text-sm text-gray-600">
                                {!user && 'Vui lòng đăng nhập để booking.'}
                                {user && !isClient && 'Chỉ tài khoản Doanh nghiệp mới có thể booking.'}
                                {user && isClient && !isProfileComplete && 'Vui lòng hoàn tất hồ sơ của bạn để bắt đầu booking.'}
                            </div>
                        )}
                    </div>
                </aside>
                <main className="w-full md:w-2/3 lg:w-3/4">
                    {/* ... (Phần hiển thị Giới thiệu và Portfolio giữ nguyên) ... */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Giới thiệu</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {talentProfile.bio || 'Talent này chưa có phần giới thiệu.'}
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Portfolio</h2>
                        {(!portfolioItems || portfolioItems.length === 0) ? (
                            <p>Talent này chưa cập nhật portfolio.</p>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {portfolioItems.map((item: PortfolioItem) => {
                                    if (!item.file_url) return null;
                                    return (
                                        <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={item.file_url}
                                                alt={item.title || 'Portfolio Image'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}