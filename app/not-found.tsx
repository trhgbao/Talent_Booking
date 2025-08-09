// /app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold mb-4">Trang không tồn tại</h2>
            <p className="text-gray-600 mb-8">Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                Quay về Trang chủ
            </Link>
        </div>
    )
}