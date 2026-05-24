"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            await account.createEmailPasswordSession(email, password);
            router.push("/");
        } catch (e) {
            alert("ログイン失敗");
        }
    };

    const register = async () => {
        try {
            await account.create(
                "unique()",
                email,
                password,
                "user"
            );

            await login();
        } catch (e) {
            alert("登録失敗");
        }
    };

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">Login</h1>

            <input
                className="border p-2 mt-4 w-full"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 mt-2 w-full"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login} className="mt-4 border px-4 py-2">
                ログイン
            </button>

            <button onClick={register} className="mt-2 border px-4 py-2">
                新規登録
            </button>
        </main>
    );
}