// /app/dashboard/bookings/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BookingList from '@/components/BookingList'; // Chúng ta sẽ tạo component này

export default async function BookingsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth');

    // Lấy tất cả bookings của talent này, và thông tin của người gửi (client)
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`*, client:client_id (full_name, avatar_url)`)
        .eq('talent_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Yêu cầu Booking</h1>
            <BookingList initialBookings={bookings as any} />
        </div>
    );
}