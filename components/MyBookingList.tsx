// /components/MyBookingList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu cho Talent (người được book)
interface TalentProfile {
    full_name: string | null;
    avatar_url: string | null;
}

// Định nghĩa kiểu dữ liệu cho một Booking từ phía Client
interface MyBooking {
    id: string;
    created_at: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    talent: TalentProfile | null;
}

interface MyBookingListProps {
    initialBookings: MyBooking[] | null;
}

export default function MyBookingList({ initialBookings }: MyBookingListProps) {
    const [bookings, setBookings] = useState<MyBooking[]>(initialBookings || []);

    // useEffect để cập nhật lại bookings khi initialBookings thay đổi
    useEffect(() => {
        setBookings(initialBookings || []);
    }, [initialBookings]);

    if (bookings.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Bạn chưa gửi yêu cầu booking nào.</p>;
    }

    return (
        <div className="space-y-6">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border text-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        {/* Hiển thị thông tin Talent */}
                        <div className="flex items-center gap-4">
                            <Image
                                src={booking.talent?.avatar_url || '/default-avatar.png'}
                                alt={booking.talent?.full_name || 'Talent'}
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-lg">{booking.talent?.full_name || 'Talent'}</p>
                                <p className="text-sm text-gray-500">
                                    Đã gửi: {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                        {/* Trạng thái */}
                        <div className="flex-shrink-0">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>
                    {/* Nút Nhắn tin */}
                    <div className="mt-6 flex justify-end">
                        {booking.status === 'confirmed' && (
                            <Link href={`/chat/${booking.id}`} className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                                Nhắn tin với Talent
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}