import Link from "next/link";

export default function Header() {
    return (
        <header className="mb-8 flex items-center gap-4 border-b pb-4">
            <Link
                href="/"
                className="text-lg font-bold"
            >
                🟢 Home
            </Link>

            <Link
                href="/status"
                className="text-lg font-bold"
            >
                📊 Status
            </Link>
        </header>
    );
}