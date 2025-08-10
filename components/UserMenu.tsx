// /components/UserMenu.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

// Lấy kiểu Profile từ types_db
import { Database } from 'types/types_db';
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserMenuProps {
    user: User;
    profile: Profile | null;
}

export default function UserMenu({ user, profile }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Avatar */}
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500">
                <Image
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt={user.email || 'User Avatar'}
                    width={40}
                    height={40}
                    className="object-cover"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-semibold">Đã đăng nhập với</p>
                        <p className="truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Đăng xuất
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}