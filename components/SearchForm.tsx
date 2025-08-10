// /components/SearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return; // Không tìm kiếm nếu input rỗng

        // Tạo URL và chuyển hướng đến trang tìm kiếm
        const params = new URLSearchParams();
        params.set('q', searchTerm); // 'q' là viết tắt của query
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg p-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm người mẫu, diễn viên, thành phố..."
                    className="w-full bg-transparent px-4 py-2 text-gray-900 focus:outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 transition">
                    Tìm kiếm
                </button>
            </div>
        </form>
    );
}