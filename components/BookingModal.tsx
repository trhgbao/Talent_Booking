// /components/BookingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast'; // Dùng toast thay cho alert

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    talentId: string;
    talentName: string;
    currentUser: User; // currentUser không nên là null ở đây
}

export default function BookingModal({ isOpen, onClose, talentId, talentName, currentUser }: BookingModalProps) {
    const supabase = createClient();
    const [notes, setNotes] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);

    // useEffect để xác định component đang chạy ở phía client
    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleSendBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingDate) {
            return toast.error('Vui lòng chọn ngày booking.');
        }

        setIsLoading(true);
        const toastId = toast.loading('Đang gửi yêu cầu...');

        try {
            const { error: insertError } = await supabase.from('bookings').insert({
                talent_id: talentId,
                client_id: currentUser.id,
                start_date: bookingDate,
                notes: notes,
                status: 'pending',
            });

            if (insertError) {
                throw insertError;
            }

            toast.success(`Đã gửi yêu cầu booking thành công tới ${talentName}!`, { id: toastId });
            onClose();
            setNotes('');
            setBookingDate('');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Đã xảy ra lỗi: ${err.message}`, { id: toastId });
            } else {
                toast.error('Đã xảy ra một lỗi không xác định.', { id: toastId });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Tạo nội dung của modal
    const modalContent = isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-4">Booking: {talentName}</h2>
                <form onSubmit={handleSendBooking}>
                    <div className="mb-4">
                        <label htmlFor="bookingDate" className="block text-sm font-medium mb-1">
                            Ngày mong muốn
                        </label>
                        <input
                            id="bookingDate"
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium mb-1">
                            Ghi chú cho Talent
                        </label>
                        <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="Mô tả công việc, thời gian, địa điểm..."
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Hủy
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 hover:bg-blue-700">
                            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;

    // Sử dụng Portal để render modal
    if (isBrowser) {
        return createPortal(
            modalContent,
            document.body
        );
    } else {
        return null;
    }
}