"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    databases,
    DATABASE_ID,
    COLLECTION_ID,
} from "@/lib/appwrite";

import { Query } from "appwrite";

export default function StatsPage() {
    const [
        finishedSessions,
        setFinishedSessions,
    ] = useState([]);

    const fetchFinishedSessions =
        async () => {
            try {
                const response =
                    await databases.listDocuments(
                        DATABASE_ID,
                        COLLECTION_ID,
                        [
                            Query.equal(
                                "status",
                                "finished"
                            ),
                            Query.orderDesc(
                                "$updatedAt"
                            ),
                            Query.limit(10),
                        ]
                    );

                setFinishedSessions(
                    response.documents
                );

            } catch (error) {
                console.error(error);
            }
        };

    const getTotalStudyTime =
        () => {
            let totalMinutes = 0;

            finishedSessions.forEach(
                (session) => {
                    const start =
                        new Date(
                            session.$createdAt
                        );

                    const end =
                        new Date(
                            session.$updatedAt
                        );

                    const diff =
                        end - start;

                    totalMinutes +=
                        Math.floor(
                            diff /
                            1000 /
                            60
                        );
                }
            );

            const hours =
                Math.floor(
                    totalMinutes / 60
                );

            const minutes =
                totalMinutes % 60;

            return `${hours}時間${minutes}分`;
        };

    const formatDuration = (
        createdAt,
        updatedAt
    ) => {
        const start =
            new Date(createdAt);

        const end =
            new Date(updatedAt);

        const diff =
            end - start;

        const minutes =
            Math.floor(
                diff / 1000 / 60
            );

        const hours =
            Math.floor(
                minutes / 60
            );

        const remainMinutes =
            minutes % 60;

        if (hours <= 0) {
            return `${remainMinutes}分`;
        }

        return `${hours}時間${remainMinutes}分`;
    };

    useEffect(() => {
        fetchFinishedSessions();
    }, []);

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-4xl font-bold">
                📊 StudyPing Stats
            </h1>

            <div className="mt-10 rounded border p-4">
                <h2 className="text-2xl font-bold">
                    今日の統計
                </h2>

                <div className="mt-4 space-y-2">
                    <p>
                        ✅ 終了人数:
                        {" "}
                        {
                            finishedSessions.length
                        }
                        人
                    </p>

                    <p>
                        🕒 累計作業時間:
                        {" "}
                        {getTotalStudyTime()}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold">
                    ✅ 最近終了した人
                </h2>

                <div className="mt-4 space-y-4">
                    {finishedSessions.length ===
                        0 && (
                            <p>
                                まだ終了履歴は
                                ありません。
                            </p>
                        )}

                    {finishedSessions.map(
                        (session) => (
                            <div
                                key={session.$id}
                                className="rounded border p-4"
                            >
                                <p className="text-lg font-bold">
                                    {session.name}
                                </p>

                                <p className="mt-1">
                                    💬{" "}
                                    {
                                        session.endNote
                                    }
                                </p>

                                <p className="mt-1">
                                    🕒{" "}
                                    {formatDuration(
                                        session.$createdAt,
                                        session.$updatedAt
                                    )}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}