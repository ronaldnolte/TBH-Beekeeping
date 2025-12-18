export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#FFF8E7]">
            <h2 className="mb-4 text-2xl font-bold text-[#4A3C28]">Page Not Found</h2>
            <p className="mb-6 text-[#8B4513]">Could not find requested resource</p>
            <a
                href="/"
                className="rounded-lg bg-[#E67E22] px-6 py-3 text-white font-bold hover:bg-[#D35400] transition-colors shadow-md"
            >
                Return Home
            </a>
        </div>
    );
}
