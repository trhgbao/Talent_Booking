// /app/dashboard/bookings/page.tsx
'use client' // Chuyển thành client component để có thể dùng hook

import { createClient } from '@/lib/supabase/client'; // Dùng client helper
import { redirect } from 'next/navigation';
import BookingList from '@/components/BookingList';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

// Định nghĩa lại kiểu dữ liệu cho rõ ràng
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

export default function BookingsDashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        redirect('/auth');
        return;
      }
      setUser(currentUser);

      // Câu query đã được sửa lại cho đúng
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, created_at, start_date, notes, status,
          client:client_id (full_name, avatar_url)
        `)
        .eq('talent_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Lỗi lấy danh sách booking:", error);
      } else {
        setBookings(data as any); // Dùng `as any` ở đây để đơn giản hóa, vì BookingList đã có type guard
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Đang tải danh sách booking...</div>;
  }

  return (
      <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Quản lý Booking</h1>
          <BookingList initialBookings={bookings} />
      </div>
  );
}