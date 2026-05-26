"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
    databases,
    DATABASE_ID,
} from "../../../lib/appwrite";

import { ID, Query } from "appwrite";

import useUser from "../../../hooks/useUser";
import Header from "../../../components/Header";

export default function RoomPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const { user } = useUser();

    const [users, setUsers] = useState([]);
    const presenceDocId = useRef(null);

    // 入室
    const joinRoom = async () => {
        if (!user) return;

        try {
            const doc = await databases.createDocument(
                DATABASE_ID,
                "presence",
                ID.unique(),
                {
                    userId: user.id,
                    userName: user.name,
                    roomId,
                    lastSeen: new Date().toISOString(),
                }
            );

            presenceDocId.current = doc.$id;
        } catch (e) {
            console.error("入室エラー:", e);
        }
    };

    // 退出
    const leaveRoom = async () => {
        if (!presenceDocId.current) return;

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                "presence",
                presenceDocId.current
            );
        } catch (e) {
            console.error("退出エラー:", e);
        }
    };

    // heartbeat（生存更新）
    const heartbeat = () => {
        return setInterval(async () => {
            if (!user || !presenceDocId.current) return;

            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    "presence",
                    presenceDocId.current,
                    {
                        lastSeen: new Date().toISOString(),
                    }
                );
            } catch {
                // ドキュメントが消えていた場合は再入室
                await joinRoom();
            }
        }, 10000);
    };

    // 一覧取得
    const fetchPresence = async () => {
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                "presence",
                [
                    Query.equal("roomId", roomId),
                ]
            );

            setUsers(res.documents);
        } catch (e) {
            console.error(e);
        }
    };

    // オンライン判定（20秒以内）
    const isOnline = (lastSeen) => {
        const diff = Date.now() - new Date(lastSeen);
        return diff < 20000;
    };

    useEffect(() => {
        if (!user) return;

        joinRoom();
        fetchPresence();

        const hb = heartbeat();
        const interval = setInterval(fetchPresence, 5000);

        return () => {
            clearInterval(hb);
            clearInterval(interval);
            leaveRoom();
        };
    }, [user, roomId]);

    const onlineUsers = users.filter((u) => isOnline(u.lastSeen));

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
            <div className="mx-auto max-w-2xl">
                <Header />

                {/* ルームタイトル */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            📖 {roomId}
                        </h1>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            作業ルーム
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        ← 退出
                    </button>
                </div>

                {/* オンラインユーザー */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
                        オンライン中
                        <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            {onlineUsers.length}
                        </span>
                    </h2>

                    {onlineUsers.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            現在このルームに誰もいません
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {onlineUsers.map((u) => (
                                <li
                                    key={u.$id}
                                    className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-800"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        {(u.userName || "?")[0].toUpperCase()}
                                    </span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {u.userName || "名無し"}
                                    </span>
                                    {u.userId === user?.id && (
                                        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                                            あなた
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 通知リンク */}
                <div className="mt-4 text-right">
                    <Link
                        href={`/room/${roomId}/notifications`}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        🔔 通知を見る →
                    </Link>
                </div>
            </div>
        </main>
    );
}
