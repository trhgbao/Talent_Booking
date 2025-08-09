// /types/index.ts

import { User } from '@supabase/supabase-js';

// Định nghĩa kiểu cho một hồ sơ cá nhân
export type Profile = {
    id: string;
    full_name: string | null;
    height: number | null;
    weight: number | null;
    city: string | null;
    bio: string | null;
    avatar_url: string | null;
    // Thêm bất kỳ trường nào khác bạn có trong bảng 'profiles'
};

// Định nghĩa kiểu cho một mục trong portfolio
export type PortfolioItem = {
    id: number;
    file_url: string;
    title?: string | null; // Có thể có hoặc không
};