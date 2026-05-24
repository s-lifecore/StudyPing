"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "../hooks/useUser";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user, loading } = useUser();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading) return <p>Loading...</p>;

    return children;
}