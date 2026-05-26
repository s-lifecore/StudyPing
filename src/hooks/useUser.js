"use client";

import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";

export default function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const res = await account.get();

            setUser({
                id: res.$id,
                name: res.name,
                email: res.email,
            });
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession("current");
        } catch {
            // セッションが既に無効でも問題なし
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return { user, loading, logout };
}
