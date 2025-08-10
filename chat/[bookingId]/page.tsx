// /app/chat/[bookingId]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu
interface Message {
    id: number;
    created_at: string;
    content: string;
    sender_id: string;
    profiles: { // Lấy thông tin người gửi
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export default function ChatPage({ params }: { params: { bookingId: string } }) {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const bookingId = params.bookingId;

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch dữ liệu ban đầu và lắng nghe Realtime
    useEffect(() => {
        const setupChat = async () => {
            // 1. Lấy thông tin user
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push('/auth');
                return;
            }
            setUser(currentUser);

            // 2. Fetch tin nhắn cũ
            const { data: initialMessages, error } = await supabase
                .from('messages')
                .select(`*, profiles (full_name, avatar_url)`)
                .eq('booking_id', bookingId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Lỗi fetch tin nhắn:", error);
            } else {
                setMessages(initialMessages || []);
            }
            setLoading(false);

            // 3. Lắng nghe tin nhắn mới
            const channel = supabase.channel(`chat:${bookingId}`)
                .on<Message>(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
                    async (payload) => {
                        // Khi có tin nhắn mới, fetch thêm thông tin profile của người gửi
                        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', payload.new.sender_id).single();
                        const messageWithProfile = { ...payload.new, profiles: profile } as Message;
                        setMessages(currentMessages => [...currentMessages, messageWithProfile]);
                    }
                )
                .subscribe();

            // Cleanup function: Hủy đăng ký khi component unmount
            return () => {
                supabase.removeChannel(channel);
            };
        };
        setupChat();
    }, [bookingId, router]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const content = newMessage.trim();
        setNewMessage('');

        const { error } = await supabase.from('messages').insert({
            booking_id: bookingId,
            sender_id: user.id,
            content: content,
        });

        if (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        }
    };

    if (loading) return <div className="p-8">Đang tải cuộc trò chuyện...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] container mx-auto">
            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender_id !== user?.id && (
                            <Image src={msg.profiles?.avatar_url || '/default-avatar.png'} alt="avatar" width={32} height={32} className="rounded-full" />
                        )}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Khu vực nhập tin nhắn */}
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 p-2 border rounded-md"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Gửi</button>
                </form>
            </div>
        </div>
    );
}