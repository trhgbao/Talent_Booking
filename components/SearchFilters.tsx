// /components/SearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Hook để đọc URL params

    // State cho từng ô input, khởi tạo giá trị từ URL
    const [fullName, setFullName] = useState(searchParams.get('full_name') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [minHeight, setMinHeight] = useState(searchParams.get('min_height') || '');

    // Hàm để xây dựng URL và chuyển hướng
    const handleFilterChange = () => {
        const params = new URLSearchParams();

        // Chỉ thêm vào URL nếu người dùng có nhập giá trị
        if (fullName) params.set('full_name', fullName);
        if (city) params.set('city', city);
        if (minHeight) params.set('min_height', minHeight);

        // Dùng router.push để chuyển hướng đến URL mới
        router.push(`/search?${params.toString()}`);
    };

    // Sử dụng useEffect để tự động tìm kiếm sau khi người dùng ngừng gõ
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleFilterChange();
        }, 500); // Đợi 500ms sau khi ngừng gõ mới tìm kiếm

        return () => clearTimeout(delayDebounceFn);
    }, [fullName, city, minHeight]); // Chạy lại mỗi khi một giá trị thay đổi

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ô lọc theo Tên */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Tên Talent</label>
                    <input
                        type="text"
                        id="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="VD: An Nguyen"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                {/* Ô lọc theo Thành phố */}
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Thành phố</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="VD: Ho Chi Minh City"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                {/* Ô lọc theo Chiều cao tối thiểu */}
                <div>
                    <label htmlFor="min_height" className="block text-sm font-medium text-gray-700">Chiều cao tối thiểu (cm)</label>
                    <input
                        type="number"
                        id="min_height"
                        value={minHeight}
                        onChange={(e) => setMinHeight(e.target.value)}
                        placeholder="VD: 170"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}