// /app/dashboard/profile/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileForm from '@/components/ProfileForm';
import ImageUploader from '@/components/ImageUploader';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Profile, PortfolioItem } from '@/types'; // <-- Bước 3: Import từ file chung


export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null); 
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Hàm để lấy tất cả dữ liệu
    const fetchData = async (currentUser: User) => {
        // Lấy thông tin profile
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
        setProfile(profileData);

        // Lấy danh sách portfolio
        const { data: portfolioData } = await supabase.from('portfolios').select('id, file_url').eq('talent_id', currentUser.id);
        setPortfolioItems(portfolioData || []);
    };

    // Lấy thông tin user khi component được load
    useEffect(() => {
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push('/auth');
                return;
            }
            setUser(currentUser);
            await fetchData(currentUser);
            setLoading(false);
        };
        getUser();
    }, [router]);

    // Hàm xử lý xóa
    const handleDeletePortfolioItem = async (item: PortfolioItem) => {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa mục này?');
        if (!confirmed) return;

        try {
            // Lấy đường dẫn file từ URL
            const filePath = new URL(item.file_url).pathname.split('/portfolios/')[1];

            // 1. Xóa file trên Storage
            const { error: storageError } = await supabase.storage.from('portfolios').remove([filePath]);
            if (storageError) throw storageError;

            // 2. Xóa dòng trong CSDL
            const { error: dbError } = await supabase.from('portfolios').delete().eq('id', item.id);
            if (dbError) throw dbError;

            // 3. Cập nhật lại UI
            setPortfolioItems(currentItems => currentItems.filter(p => p.id !== item.id));
            toast.success('Đã xóa thành công!');

        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    }

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (!user) return null;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột 1: Chỉnh sửa thông tin */}
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                    <ProfileForm user={user} profile={profile} />
                </div>

                {/* Cột 2: Quản lý Portfolio */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Quản lý Portfolio</h2>
                    <div className="mb-8">
                        <ImageUploader userId={user.id} onUploadComplete={() => fetchData(user)} />
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Portfolio hiện tại</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {portfolioItems.map(item => (
                            <div key={item.id} className="relative group">
                                <Image src={item.file_url} alt="Portfolio item" width={200} height={200} className="rounded-md object-cover w-full aspect-square" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                    <button onClick={() => handleDeletePortfolioItem(item)} className="text-white bg-red-600 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}