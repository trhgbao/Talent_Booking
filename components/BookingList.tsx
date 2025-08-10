// /components/BookingList.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu cho Client (người gửi)
interface ClientProfile {
    full_name: string | null;
    avatar_url: string | null;
}

// Định nghĩa kiểu dữ liệu cho một Booking
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

export default function BookingList({ initialBookings }: BookingListProps) {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
        setLoadingId(bookingId);
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)
            .select('*, client:client_id (full_name, avatar_url)')
            .single();

        if (error) {
            toast.error(error.message);
        } else {
            toast.success(`Đã ${newStatus === 'confirmed' ? 'chấp nhận' : 'từ chối'} yêu cầu.`);
            setBookings(current => current.map(b => (b.id === bookingId ? data : b)));
        }
        setLoadingId(null);
    };

    // useEffect để cập nhật lại bookings khi initialBookings thay đổi (nếu trang refresh)
    useEffect(() => {
        setBookings(initialBookings || []);
    }, [initialBookings]);

    if (bookings.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Bạn chưa có yêu cầu booking nào.</p>;
    }

    return (
        <div className="space-y-6">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border text-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        {/* Thông tin Client */}
                        <div className="flex items-center gap-4">
                            <Image
                                src={booking.client?.avatar_url || '/default-avatar.png'}
                                alt={booking.client?.full_name || 'Client'}
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-lg">{booking.client?.full_name || 'Khách hàng ẩn danh'}</p>
                                <p className="text-sm text-gray-500">
                                    Đã gửi: {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>

                        {/* Trạng thái Booking */}
                        <div className="flex-shrink-0">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {booking.status === 'pending' ? 'Chờ xác nhận' :
                                    booking.status === 'confirmed' ? 'Đã chấp nhận' : 'Đã từ chối'}
                            </span>
                        </div>
                    </div>

                    {/* Chi tiết yêu cầu */}
                    <div className="mt-4 border-t pt-4">
                        <p><strong>Ngày mong muốn:</strong> {new Date(booking.start_date).toLocaleDateString('vi-VN')}</p>
                        <p className="mt-2"><strong>Ghi chú:</strong></p>
                        <p className="text-gray-600 pl-2 border-l-2 ml-1 italic">
                            {booking.notes || 'Không có ghi chú.'}
                        </p>
                    </div>

                    {/* Các nút hành động */}
                    <div className="mt-6 flex gap-4 justify-end">
                        {booking.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                    disabled={loadingId === booking.id}
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 disabled:bg-gray-400"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                    disabled={loadingId === booking.id}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    Chấp nhận
                                </button>
                            </>
                        )}
                        {booking.status === 'confirmed' && (
                            <Link href={`/chat/${booking.id}`} className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                                Nhắn tin với Client
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}