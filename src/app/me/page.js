"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import useUser from "@/hooks/useUser";

import {
    databases,
    DATABASE_ID,
    COLLECTION_ID,
} from "@/lib/appwrite";

import { Query } from "appwrite";

export default function MyPage() {
    const { user } = useUser();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMySessions = async () => {
        if (!user) return;

        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal("userId", user.id),
                ]
            );

            setSessions(res.documents);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySessions();
    }, [user]);

    const formatTime = (t) =>
        new Date(t).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

    const totalTime = () => {
        let total = 0;

        sessions.forEach((s) => {
            if (!s.$createdAt || !s.$updatedAt) return;

            const start = new Date(s.$createdAt);
            const end =
                s.status === "finished"
                    ? new Date(s.$updatedAt)
                    : new Date();

            total += end - start;
        });

        const min = Math.floor(total / 60000);
        const h = Math.floor(min / 60);
        const m = min % 60;

        return `${h}時間${m}分`;
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
            <div className="mx-auto max-w-2xl">
                <Header />

                {/* プロフィール */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {user ? (user.name || user.email || "?")[0].toUpperCase() : "?"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user?.name || "マイページ"}
                        </h1>
                        {user?.email && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* 合計作業時間 */}
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        合計作業時間
                    </p>
                    <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ⏱ {totalTime()}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        {sessions.length} セッション
                    </p>
                </div>

                {/* 作業履歴 */}
                <h2 className="mb-3 text-lg font-bold">📜 作業履歴</h2>

                {loading ? (
                    <p className="text-sm text-gray-400">読み込み中...</p>
                ) : sessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                        <p className="text-gray-400 dark:text-gray-500">
                            まだ履歴がありません
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sessions.map((s) => (
                            <div
                                key={s.$id}
                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div className="flex items-start justify-between">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        📖 {s.roomId}
                                    </p>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            s.status === "finished"
                                                ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                        }`}
                                    >
                                        {s.status === "finished" ? "終了" : "作業中"}
                                    </span>
                                </div>

                                {s.place && (
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        📍 {s.place}
                                    </p>
                                )}

                                {s.startNote && (
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        💬 {s.startNote}
                                    </p>
                                )}

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
                                    <span>🕒 開始: {formatTime(s.$createdAt)}</span>
                                    {s.status === "finished" && (
                                        <span>🏁 終了: {formatTime(s.$updatedAt)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
