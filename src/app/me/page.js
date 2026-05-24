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
        <main className="min-h-screen p-8 bg-white text-black dark:bg-black dark:text-white">
            <Header />

            <h1 className="text-3xl font-bold">
                マイページ
            </h1>

            {user && (
                <p className="mt-2 text-gray-500">
                    {user.name} ({user.email})
                </p>
            )}

            <div className="mt-6">
                <p className="font-bold">
                    ⏱ 合計作業時間
                </p>
                <p className="text-xl">{totalTime()}</p>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold">
                    📜 作業履歴
                </h2>

                {loading ? (
                    <p>読み込み中...</p>
                ) : sessions.length === 0 ? (
                    <p>まだ履歴がありません</p>
                ) : (
                    <div className="mt-4 space-y-4">
                        {sessions.map((s) => (
                            <div
                                key={s.$id}
                                className="border p-4 rounded"
                            >
                                <p className="font-bold">
                                    {s.roomId}
                                </p>

                                <p>📍 {s.place}</p>

                                <p>💬 {s.startNote}</p>

                                <p>🕒 開始: {formatTime(s.$createdAt)}</p>

                                {s.status === "finished" && (
                                    <p>
                                        🏁 終了: {formatTime(s.$updatedAt)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}