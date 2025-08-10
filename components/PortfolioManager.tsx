// /components/PortfolioManager.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react'; // Thêm useCallback
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation'; // Thêm import này

interface PortfolioItem {
    id: number;
    file_url: string | null;
}

export default function PortfolioManager({ userId }: { userId: string }) {
    const supabase = createClient();
    const router = useRouter(); // Thêm dòng này
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- LOGIC MỚI: TÁCH HÀM FETCH RA RIÊNG ---
    const fetchPortfolio = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('portfolios')
            .select('id, file_url')
            .eq('talent_id', userId)
            .order('id', { ascending: false });

        if (error) {
            toast.error("Không thể tải portfolio.");
        } else {
            setItems(data || []);
        }
        setLoading(false);
    }, [supabase, userId]); // Thêm dependencies

    // useEffect chỉ gọi hàm fetch
    useEffect(() => {
        if (userId) {
            fetchPortfolio();
        }
    }, [userId, fetchPortfolio]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) return toast.error('Vui lòng chọn file.');
        setUploading(true);
        const toastId = toast.loading(`Đang xử lý ${files.length} file...`);

        try {
            // --- LOGIC MỚI: XỬ LÝ UPLOAD RÕ RÀNG HƠN ---
            const uploadTasks = files.map(async (file) => {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                const compressedFile = await imageCompression(file, options);
                const filePath = `${userId}/${Date.now()}-${compressedFile.name}`;
                const { error } = await supabase.storage.from('portfolios').upload(filePath, compressedFile);
                if (error) throw new Error(`Lỗi upload file ${file.name}: ${error.message}`);
                const { data } = supabase.storage.from('portfolios').getPublicUrl(filePath);
                return { talent_id: userId, file_url: data.publicUrl, type: 'image' };
            });

            const uploadedFilesData = await Promise.all(uploadTasks);

            const { error: dbError } = await supabase.from('portfolios').insert(uploadedFilesData);
            if (dbError) throw dbError;

            // ----- SỬA LỖI QUAN TRỌNG NHẤT Ở ĐÂY -----
            toast.success('Upload thành công!', { id: toastId });
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // Sau khi mọi thứ thành công, gọi lại hàm fetch để lấy danh sách mới nhất
            // Điều này đảm bảo giao diện được cập nhật đúng
            await fetchPortfolio();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { id: toastId });
            }
        } finally {
            // Đảm bảo setUploading(false) luôn được gọi
            setUploading(false);
        }
    };

    // ... (hàm handleDelete và JSX giữ nguyên)
    const handleDelete = async (item: PortfolioItem) => {
        if (!item.file_url) return;
        if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;

        const filePath = item.file_url.split('/portfolios/')[1];
        const { error: storageError } = await supabase.storage.from('portfolios').remove([filePath]);
        if (storageError) return toast.error(storageError.message);

        const { error: dbError } = await supabase.from('portfolios').delete().eq('id', item.id);
        if (dbError) return toast.error(dbError.message);

        setItems(current => current.filter(i => i.id !== item.id));
        toast.success('Đã xóa thành công!');
        router.refresh(); // Refresh sau khi xóa
    };

    return (
        <div>
            {/* Form Upload */}
            <div className="p-6 border-2 border-dashed rounded-lg mb-8">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {files.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {uploading ? 'Đang xử lý...' : `Lưu ${files.length} mục`}
                    </button>
                )}
            </div>

            {/* Hiển thị Portfolio */}
            <h3 className="text-lg font-semibold mb-4">Portfolio hiện tại</h3>
            {loading ? <p>Đang tải portfolio...</p> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map(item => (
                        item.file_url && (
                            <div key={item.id} className="relative group aspect-square">
                                <Image
                                    src={item.file_url}
                                    alt="Portfolio item"
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="text-white bg-red-600 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}