"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    databases,
    DATABASE_ID,
} from "@/lib/appwrite";

import { ID, Query } from "appwrite";

import useUser from "@/hooks/useUser";

export default function RoomPage() {
    const { roomId } = useParams();
    const { user } = useUser();

    const [users, setUsers] = useState([]);

    let presenceDocId = null;

    // 入室
    const joinRoom = async () => {
        if (!user) return;

        const doc = await databases.createDocument(
            DATABASE_ID,
            "presence",
            ID.unique(),
            {
                userId: user.id,
                userName: user.name,
                roomId,
                lastSeen: new Date(),
            }
        );

        presenceDocId = doc.$id;
    };

    // 退出（重要）
    const leaveRoom = async () => {
        if (!presenceDocId) return;

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                "presence",
                presenceDocId
            );
        } catch (e) {
            console.error(e);
        }
    };

    // heartbeat（生存更新）
    const heartbeat = () => {
        return setInterval(async () => {
            if (!user) return;

            const res = await databases.listDocuments(
                DATABASE_ID,
                "presence",
                [
                    Query.equal("userId", user.id),
                    Query.equal("roomId", roomId),
                ]
            );

            const doc = res.documents[0];
            if (!doc) return;

            await databases.updateDocument(
                DATABASE_ID,
                "presence",
                doc.$id,
                {
                    lastSeen: new Date(),
                }
            );
        }, 10000);
    };

    // 一覧取得
    const fetchPresence = async () => {
        const res = await databases.listDocuments(
            DATABASE_ID,
            "presence",
            [
                Query.equal("roomId", roomId),
            ]
        );

        setUsers(res.documents);
    };

    // オンライン判定
    const isOnline = (lastSeen) => {
        const diff = Date.now() - new Date(lastSeen);
        return diff < 20000; // 20秒以内
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
            leaveRoom(); // 👈 ここが退出検知
        };
    }, [user, roomId]);

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">
                Room: {roomId}
            </h1>

            {/* 👥 オンライン一覧 */}
            <div className="mt-6 border p-4 rounded">
                <h2 className="font-bold">
                    🟢 オンラインユーザー
                </h2>

                {users.filter(u => isOnline(u.lastSeen)).length === 0 && (
                    <p className="text-gray-500 mt-2">
                        誰もいません
                    </p>
                )}

                {users
                    .filter((u) => isOnline(u.lastSeen))
                    .map((u) => (
                        <p key={u.$id}>
                            🟢 {u.userName}
                        </p>
                    ))}
            </div>
        </main>
    );
}