"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePushNotification from "../hooks/usePushNotification";
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
  const [fetchLoading, setFetchLoading] = useState(true);
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
    } finally {
      setFetchLoading(false);
    }
  };

  const enterRoom = (id) => {
    router.push(`/room/${id}`);
  };

  const createRoom = () => {
    if (!roomInput.trim()) return;
    router.push(`/room/${roomInput.trim()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createRoom();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-2xl">
        <Header />

        <h1 className="text-3xl font-bold tracking-tight">
          📚 学習ルーム一覧
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ルームに入室して、仲間と一緒に学習しよう
        </p>

        {/* ルーム作成 */}
        <div className="mt-6 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            placeholder="新しいルーム名を入力..."
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={createRoom}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            作成 / 入室
          </button>
        </div>

        {/* ルーム一覧 */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            アクティブなルーム
          </h2>

          {fetchLoading ? (
            <p className="text-sm text-gray-400">読み込み中...</p>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500">
                まだ誰も作業していません
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
                上のフォームからルームを作成してみましょう
              </p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.roomId}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {room.roomId}
                  </p>
                  <p className="mt-0.5 text-sm text-emerald-600 dark:text-emerald-400">
                    🟢 {room.count} 人作業中
                  </p>
                </div>

                <button
                  onClick={() => enterRoom(room.roomId)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                >
                  入室
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
