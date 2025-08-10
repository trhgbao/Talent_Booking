// /app/test/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
    console.log("--- BẮT ĐẦU TRANG TEST (KHÔNG LỌC) ---");
    const supabase = createClient();

    // Lấy TẤT CẢ các dòng và TẤT CẢ các cột để kiểm tra
    const { data, error } = await supabase
        .from('profiles')
        .select('*'); // Lấy tất cả các cột

    console.log("KẾT QUẢ TỪ SUPABASE (KHÔNG LỌC):");
    console.log("DATA:", data);
    console.log("ERROR:", error);
    console.log("--- KẾT THÚC TRANG TEST (KHÔNG LỌC) ---");

    // ... (Phần JSX còn lại giữ nguyên)
    if (error) {
        return (
            <div>
                <h1>Có lỗi xảy ra khi truy vấn!</h1>
                <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>
            </div>
        );
    }
    return (
        <div>
            <h1>Trang Test Supabase (Không Lọc)</h1>
            <h2>Dữ liệu trả về:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}