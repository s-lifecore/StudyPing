import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="mb-8 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
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
            </div>

            <ThemeToggle />
        </header>
    );
}