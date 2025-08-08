// /components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-4 py-8 text-center">
                <p>&copy; {new Date().getFullYear()} TalentBook. All rights reserved.</p>
                <p>Một sản phẩm được tạo ra bằng Next.js và Supabase.</p>
            </div>
        </footer>
    );
}