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

        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return { user, loading };
}