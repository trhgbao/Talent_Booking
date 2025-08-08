// components/BookingModal.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Định nghĩa các props mà component này sẽ nhận
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void; // Hàm để đóng modal
    talentId: string;    // ID của talent được book
    talentName: string;  // Tên của talent để hiển thị
    currentUser: User | null; // User đang đăng nhập
}

export default function BookingModal({ isOpen, onClose, talentId, talentName, currentUser }: BookingModalProps) {
    const supabase = createClient();
    const [notes, setNotes] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentUser) {
            setError('Bạn cần phải đăng nhập để thực hiện chức năng này.');
            return;
        }
        if (!bookingDate) {
            setError('Vui lòng chọn ngày booking.');
            return;
        }

        setIsLoading(true);

        try {
            const { error: insertError } = await supabase.from('bookings').insert({
                talent_id: talentId,
                client_id: currentUser.id,
                start_date: bookingDate,
                notes: notes,
                status: 'pending', // Trạng thái ban đầu luôn là 'pending'
            });

            if (insertError) {
                throw insertError;
            }

            alert(`Đã gửi yêu cầu booking thành công tới ${talentName}!`);
            onClose(); // Đóng modal sau khi gửi thành công
            setNotes(''); // Reset form
            setBookingDate('');
        } catch (err: any) {
            setError('Đã xảy ra lỗi: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null; // Nếu không mở thì không render gì cả

    return (
        // Lớp phủ nền
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Hộp thoại Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Booking: {talentName}</h2>
                <form onSubmit={handleSendBooking}>
                    <div className="mb-4">
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày mong muốn
                        </label>
                        <input
                            id="bookingDate"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú cho Talent (yêu cầu, mô tả công việc...)
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ví dụ: Cần chụp lookbook cho bộ sưu tập hè, thời gian từ 9h-17h..."
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
                            Hủy
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
                            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}