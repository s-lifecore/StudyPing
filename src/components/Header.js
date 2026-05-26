"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import useUser from "../hooks/useUser";
import toast from "react-hot-toast";

export default function Header() {
    const router = useRouter();
    const { user, logout } = useUser();

    const handleLogout = async () => {
        await logout();
        toast.success("ログアウトしました");
        router.push("/login");
    };

    return (
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            {/* 左側：ナビゲーション */}
            <nav className="flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-base font-bold text-gray-800 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                >
                    🟢 <span>Home</span>
                </Link>

                <Link
                    href="/status"
                    className="flex items-center gap-1.5 text-base font-bold text-gray-800 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                >
                    📊 <span>Stats</span>
                </Link>

                {user && (
                    <Link
                        href="/me"
                        className="flex items-center gap-1.5 text-base font-bold text-gray-800 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                    >
                        👤 <span>マイページ</span>
                    </Link>
                )}
            </nav>

            {/* 右側：ユーザー情報 + テーマ切り替え */}
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <span className="hidden text-sm text-gray-600 dark:text-gray-300 sm:block">
                            {user.name || user.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                        >
                            ログアウト
                        </button>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-lg border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                    >
                        ログイン
                    </Link>
                )}
                <ThemeToggle />
            </div>
        </header>
    );
}
