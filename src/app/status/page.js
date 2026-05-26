"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";

import {
    databases,
    DATABASE_ID,
    COLLECTION_ID,
} from "../../lib/appwrite";

import { Query } from "appwrite";

export default function StatsPage() {
    const [finishedSessions, setFinishedSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFinishedSessions = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal("status", "finished"),
                    Query.orderDesc("$updatedAt"),
                    Query.limit(10),
                ]
            );

            setFinishedSessions(response.documents);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalStudyTime = () => {
        let totalMinutes = 0;

        finishedSessions.forEach((session) => {
            const start = new Date(session.$createdAt);
            const end = new Date(session.$updatedAt);
            totalMinutes += Math.floor((end - start) / 1000 / 60);
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}時間${minutes}分`;
    };

    const formatDuration = (createdAt, updatedAt) => {
        const start = new Date(createdAt);
        const end = new Date(updatedAt);
        const minutes = Math.floor((end - start) / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const remainMinutes = minutes % 60;

        if (hours <= 0) return `${remainMinutes}分`;
        return `${hours}時間${remainMinutes}分`;
    };

    const formatDate = (t) =>
        new Date(t).toLocaleString("ja-JP", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

    useEffect(() => {
        fetchFinishedSessions();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
            <div className="mx-auto max-w-2xl">
                <Header />

                <h1 className="text-3xl font-bold tracking-tight">
                    📊 Stats
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    みんなの学習記録
                </p>

                {/* サマリーカード */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            終了セッション数
                        </p>
                        <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {finishedSessions.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            累計作業時間
                        </p>
                        <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {getTotalStudyTime()}
                        </p>
                    </div>
                </div>

                {/* 最近終了した人 */}
                <h2 className="mb-3 mt-8 text-lg font-bold">
                    ✅ 最近終了した人
                </h2>

                {loading ? (
                    <p className="text-sm text-gray-400">読み込み中...</p>
                ) : finishedSessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                        <p className="text-gray-400 dark:text-gray-500">
                            まだ終了履歴はありません
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {finishedSessions.map((session) => (
                            <div
                                key={session.$id}
                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {session.name || session.userName || "名無し"}
                                    </p>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                        ⏱ {formatDuration(session.$createdAt, session.$updatedAt)}
                                    </span>
                                </div>

                                {session.endNote && (
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        💬 {session.endNote}
                                    </p>
                                )}

                                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                    🏁 {formatDate(session.$updatedAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
