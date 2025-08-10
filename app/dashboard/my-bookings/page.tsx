// /app/dashboard/my-bookings/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MyBookingList from '@/components/MyBookingList'; // Component mới cho Client

export default async function MyBookingsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth');

    // Lấy booking mà Client này đã gửi, và thông tin của Talent được book
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`*, talent:talent_id (full_name, avatar_url)`)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Booking của tôi</h1>
            <p className="text-gray-500 mb-8">Theo dõi trạng thái các yêu cầu booking bạn đã gửi.</p>
            <MyBookingList initialBookings={bookings as any} />
        </div>
    );
}