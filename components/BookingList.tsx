// /components/BookingList.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Bước 1: Thêm lại các interface đã bị xóa
interface ClientProfile {
    full_name: string | null;
    avatar_url: string | null;
}

interface Booking {
    id: string;
    created_at: string;
    start_date: string;
    notes: string | null;
    status: 'pending' | 'confirmed' | 'cancelled';
    client: ClientProfile | null;
}

interface BookingListProps {
    initialBookings: Booking[] | null;
}

// Bước 2: Áp dụng interface vào props của component
export default function BookingList({ initialBookings }: BookingListProps) {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[] | null>(initialBookings);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
        setLoadingId(bookingId);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId)
                .select(`id, created_at, start_date, notes, status, client:client_id(full_name, avatar_url)`)
                .single();

            if (error) throw error;

            if (data) {
                const updatedBooking = data as unknown as Booking;
                setBookings(currentBookings => {
                    if (!currentBookings) return [updatedBooking];
                    return currentBookings.map(b => (b.id === bookingId ? updatedBooking : b));
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                alert('Cập nhật thất bại: ' + err.message);
            }
        } finally {
            setLoadingId(null);
        }
    };

    if (!bookings || bookings.length === 0) {
        return <p>Bạn chưa có yêu cầu booking nào.</p>;
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                    {/* ... Phần JSX giữ nguyên ... */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">Từ: {booking.client?.full_name || 'Không rõ'}</p>
                            <p className="text-sm text-gray-600">Ngày yêu cầu: {new Date(booking.start_date).toLocaleDateString()}</p>
                            <p className="mt-2 text-gray-800">Ghi chú: {booking.notes}</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                }`}>{booking.status}</span>
                        </div>
                    </div>
                    {booking.status === 'pending' && (
                        <div className="mt-4 flex gap-4 justify-end">
                            <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} disabled={loadingId === booking.id} className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-400">Từ chối</button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} disabled={loadingId === booking.id} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400">{loadingId === booking.id ? 'Đang xử lý...' : 'Chấp nhận'}</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}