// /components/ImageUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
    userId: string;
    onUploadComplete: () => void; // Callback để báo cho trang cha biết upload đã xong
}

export default function ImageUploader({ userId, onUploadComplete }: ImageUploaderProps) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Vui lòng chọn ít nhất một file để upload.');
            return;
        }

        setUploading(true);
        const toastId = toast.loading(`Đang upload ${files.length} file...`);

        // Sử dụng Promise.all để upload đồng thời nhiều file
        const uploadPromises = files.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolios')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Lấy URL công khai của file vừa upload
            const { data: { publicUrl } } = supabase.storage
                .from('portfolios')
                .getPublicUrl(filePath);

            return {
                talent_id: userId,
                file_url: publicUrl,
                type: file.type.startsWith('image') ? 'image' : 'video',
            };
        });

        try {
            // Chờ tất cả các file upload xong
            const uploadedFilesData = await Promise.all(uploadPromises);

            // Lưu thông tin vào CSDL
            const { error: dbError } = await supabase
                .from('portfolios')
                .insert(uploadedFilesData);

            if (dbError) throw dbError;

            toast.success('Upload thành công!', { id: toastId });
            setFiles([]); // Xóa các file đã chọn
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
            onUploadComplete(); // Báo cho trang cha tải lại danh sách
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Đã xảy ra lỗi: ${error.message}`, { id: toastId });
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 border-2 border-dashed rounded-lg">
            <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {files.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold">Các file đã chọn:</p>
                    <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {uploading ? 'Đang xử lý...' : `Lưu ${files.length} mục vào Portfolio`}
                    </button>
                </div>
            )}
        </div>
    );
}