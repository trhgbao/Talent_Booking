// /components/BookingTrigger.tsx
'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // Import useRouter

interface BookingTriggerProps {
    talentId: string;
    talentName: string | null;
    currentUser: User | null;
}

export default function BookingTrigger({ talentId, talentName, currentUser }: BookingTriggerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter(); // Khởi tạo router

    const handleBookingClick = () => {
        if (!currentUser) {
            // Nếu chưa đăng nhập, chuyển hướng đến trang auth
            alert('Vui lòng đăng nhập để thực hiện chức năng này.');
            router.push('/auth');
        } else {
            // Nếu đã đăng nhập, mở modal
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <button
                onClick={handleBookingClick} // Gọi hàm xử lý mới
                className="mt-6 w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700"
            >
                Gửi yêu cầu Booking
            </button>

            {currentUser && ( // Chỉ render Modal nếu đã đăng nhập
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    talentId={talentId}
                    talentName={talentName || 'Talent'}
                    currentUser={currentUser}
                />
            )}
        </>
    );
}