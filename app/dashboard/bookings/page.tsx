// app/dashboard/bookings/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BookingList from '@/components/BookingList';

export default async function BookingsDashboardPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth');
    }

    // Query mạnh mẽ của Supabase:
    // Lấy tất cả bookings của talent này, ĐỒNG THỜI lấy luôn thông tin của người gửi (client)
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
      *,
      client:profiles!client_id (full_name, avatar_url)
    `)
        .eq('talent_id', user.id)
        .order('created_at', { ascending: false }); // Sắp xếp job mới nhất lên đầu

    if (error) {
        console.error("Lỗi lấy danh sách booking:", error);
        return <div>Có lỗi xảy ra khi tải dữ liệu.</div>
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Quản lý Booking</h1>
            <BookingList initialBookings={bookings} />
        </div>
    );
}