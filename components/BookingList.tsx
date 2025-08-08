// components/BookingList.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function BookingList({ initialBookings }) {
    const supabase = createClient();
    const [bookings, setBookings] = useState(initialBookings);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
        setLoadingId(bookingId); // Hiển thị loading cho đúng booking đang xử lý

        try {
            const { data, error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId)
                .select() // Yêu cầu trả về dữ liệu đã được cập nhật
                .single();

            if (error) throw error;

            // Cập nhật lại list booking trên UI mà không cần tải lại trang
            setBookings(currentBookings =>
                currentBookings.map(b => (b.id === bookingId ? data : b))
            );

        } catch (err) {
            alert('Cập nhật thất bại: ' + (err as Error).message);
        } finally {
            setLoadingId(null);
        }
    };

    if (!bookings || bookings.length === 0) {
        return <p>Bạn chưa có yêu cầu booking nào.</p>
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">
                                Từ: {booking.client.full_name}
                            </p>
                            <p className="text-sm text-gray-600">
                                Ngày yêu cầu: {new Date(booking.start_date).toLocaleDateString()}
                            </p>
                            <p className="mt-2 text-gray-800">Ghi chú: {booking.notes}</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                }`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>
                    {/* Chỉ hiển thị nút nếu status là 'pending' */}
                    {booking.status === 'pending' && (
                        <div className="mt-4 flex gap-4 justify-end">
                            <button
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                disabled={loadingId === booking.id}
                                className="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-400"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                disabled={loadingId === booking.id}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                            >
                                {loadingId === booking.id ? 'Đang xử lý...' : 'Chấp nhận'}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}