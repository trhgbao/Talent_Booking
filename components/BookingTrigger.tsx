// components/BookingTrigger.tsx
'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';
import { User } from '@supabase/supabase-js';

// Component này chỉ để quản lý việc mở/đóng modal
export default function BookingTrigger({ talentId, talentName, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700"
      >
        Gửi yêu cầu Booking
      </button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        talentId={talentId}
        talentName={talentName}
        currentUser={currentUser}
      />
    </>
  );
}