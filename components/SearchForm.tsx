// /components/SearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    // Thêm state cho danh mục, mặc định là 'talent'
    const [category, setCategory] = useState('talent');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            // Nếu không có từ khóa, vẫn chuyển hướng đến trang search
            router.push('/search');
            return;
        }

        const params = new URLSearchParams();
        // Thêm cả 2 tham số vào URL
        params.set('category', category);
        params.set('q', searchTerm);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg p-2">
                {/* Ô Select Danh mục */}
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="appearance-none bg-transparent pl-4 pr-8 py-2 text-gray-700 font-semibold focus:outline-none"
                    >
                        <option value="talent">Talent</option>
                        <option value="city">Thành phố</option>
                        {/* Thêm các option khác nếu cần */}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {/* Đường kẻ phân cách */}
                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                {/* Ô Input Từ khóa */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập từ khóa..."
                    className="w-full bg-transparent px-4 py-2 text-gray-900 focus:outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-700 transition flex-shrink-0">
                    Tìm kiếm
                </button>
            </div>
        </form>
    );
}