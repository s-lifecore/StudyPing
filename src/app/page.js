"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePushNotification from "@/hooks/usePushNotification";
import Header from "../components/Header";

import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "../lib/appwrite";

import { Query } from "appwrite";

export default function Home() {
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [roomInput, setRoomInput] = useState("");
  const { sendPush } = usePushNotification();

  const fetchRooms = async () => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("status", "active"),
        ]
      );

      const docs = res.documents;

      // roomIdごとに集計
      const map = {};

      docs.forEach((d) => {
        if (!d.roomId) return;

        if (!map[d.roomId]) {
          map[d.roomId] = {
            roomId: d.roomId,
            count: 0,
          };
        }

        map[d.roomId].count += 1;
      });

      setRooms(Object.values(map));
    } catch (e) {
      console.error(e);
    }
  };

  const enterRoom = (id) => {
    router.push(`/room/${id}`);
  };

  const createRoom = () => {
    if (!roomInput) return;

    router.push(`/room/${roomInput}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-white text-black dark:bg-black dark:text-white">
      <Header />

      <h1 className="text-3xl font-bold">
        StudyPing Rooms
      </h1>

      {/* ルーム作成 */}
      <div className="mt-6 flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="新しいルームID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />

        <button
          onClick={createRoom}
          className="bg-black text-white dark:bg-white dark:text-black px-4 rounded"
        >
          作成
        </button>
      </div>

      {/* ルーム一覧 */}
      <div className="mt-10 space-y-4">
        {rooms.length === 0 && (
          <p>まだルームがありません</p>
        )}

        {rooms.map((room) => (
          <div
            key={room.roomId}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {room.roomId}
              </p>

              <p className="text-sm">
                🟢 {room.count} 人作業中
              </p>
            </div>

            <button
              onClick={() => enterRoom(room.roomId)}
              className="px-3 py-1 border rounded"
            >
              入室
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}