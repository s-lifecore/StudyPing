"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    client,
    databases,
    DATABASE_ID,
} from "@/lib/appwrite";

export default function RoomNotifications() {
    const { roomId } = useParams();

    const [list, setList] = useState([]);

    const fetchInitial = async () => {
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                "notifications"
            );

            const filtered = res.documents.filter(
                (n) => n.roomId === roomId
            );

            setList(filtered);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchInitial();

        // 🔥 Realtime購読
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.notifications.documents`,
            (response) => {
                const payload = response.payload;

                if (!payload) return;

                // roomフィルタ
                if (payload.roomId === roomId) {
                    setList((prev) => [
                        payload,
                        ...prev,
                    ]);
                }
            }
        );

        return () => unsubscribe();
    }, [roomId]);

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">
                🔔 Room Notifications (Realtime): {roomId}
            </h1>

            <div className="mt-4 space-y-3">
                {list.length === 0 && (
                    <p>まだ通知はありません</p>
                )}

                {list.map((n) => (
                    <div
                        key={n.$id}
                        className="border p-3 rounded"
                    >
                        <p>{n.message}</p>

                        <p className="text-sm text-gray-500">
                            {new Date(n.$createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}