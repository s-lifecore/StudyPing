"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUser from "../hooks/useUser";

const PUBLIC_PATHS = ["/login"];

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useUser();

    const isPublic = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        if (!loading && !user && !isPublic) {
            router.push("/login");
        }
    }, [user, loading, isPublic]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
                <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>
            </div>
        );
    }

    if (!user && !isPublic) return null;

    return children;
}
