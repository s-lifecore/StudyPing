"use client";

import { useState } from "react";
import { account } from "../../lib/appwrite";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();

    const [mode, setMode] = useState("login"); // "login" | "register"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("メールアドレスとパスワードを入力してください");
            return;
        }
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            toast.success("ログインしました");
            router.push("/");
        } catch (err) {
            const msg = err?.message ?? "";
            if (msg.includes("Invalid credentials")) {
                toast.error("メールアドレスまたはパスワードが正しくありません");
            } else if (msg.includes("user_not_found")) {
                toast.error("アカウントが見つかりません");
            } else {
                toast.error("ログインに失敗しました: " + msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("すべての項目を入力してください");
            return;
        }
        if (password.length < 8) {
            toast.error("パスワードは8文字以上で入力してください");
            return;
        }
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);
            toast.success("アカウントを作成しました");
            router.push("/");
        } catch (err) {
            const msg = err?.message ?? "";
            if (msg.includes("already exists") || msg.includes("user_already_exists")) {
                toast.error("このメールアドレスはすでに登録されています");
            } else if (msg.includes("password")) {
                toast.error("パスワードが要件を満たしていません（8文字以上）");
            } else {
                toast.error("登録に失敗しました: " + msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900 dark:shadow-gray-800">
                {/* ロゴ・タイトル */}
                <div className="mb-8 text-center">
                    <div className="mb-3 text-5xl">🟢</div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        StudyPing
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        学習記録を仲間と共有しよう
                    </p>
                </div>

                {/* タブ切り替え */}
                <div className="mb-6 flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                            mode === "login"
                                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        ログイン
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("register")}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                            mode === "register"
                                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        新規登録
                    </button>
                </div>

                {/* フォーム */}
                <form
                    onSubmit={mode === "login" ? handleLogin : handleRegister}
                    className="space-y-4"
                >
                    {mode === "register" && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                ユーザー名
                            </label>
                            <input
                                type="text"
                                placeholder="例: 田中 太郎"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            パスワード
                        </label>
                        <input
                            type="password"
                            placeholder={mode === "register" ? "8文字以上" : "パスワード"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {loading
                            ? "処理中..."
                            : mode === "login"
                            ? "ログイン"
                            : "アカウントを作成"}
                    </button>
                </form>

                {/* 切り替えリンク */}
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {mode === "login" ? (
                        <>
                            アカウントをお持ちでないですか？{" "}
                            <button
                                type="button"
                                onClick={() => setMode("register")}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                新規登録
                            </button>
                        </>
                    ) : (
                        <>
                            すでにアカウントをお持ちですか？{" "}
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                ログイン
                            </button>
                        </>
                    )}
                </p>
            </div>
        </main>
    );
}
