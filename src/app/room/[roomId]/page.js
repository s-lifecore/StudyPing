"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Header from "../../../components/Header";

import toast from "react-hot-toast";

import {
    databases,
    DATABASE_ID,
    COLLECTION_ID,
} from "../../../lib/appwrite";

import { ID, Query } from "appwrite";

export default function RoomPage() {
    const { roomId } = useParams();

    const [name, setName] = useState("");
    const [place, setPlace] = useState("");
    const [mode, setMode] = useState("なんにんでも");
    const [startNote, setStartNote] = useState("");
    const [endNote, setEndNote] = useState("");

    const [sessions, setSessions] = useState([]);
    const [mySession, setMySession] = useState(null);
    const [now, setNow] = useState(Date.now());

    const fetchSessions = async () => {
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal("status", "active"),
                    Query.equal("roomId", roomId),
                ]
            );

            setSessions(res.documents);

            const mine = res.documents.find(
                (s) => s.name === name
            );

            setMySession(mine || null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleStart = async () => {
        if (!name) return alert("名前を入力してね");

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    name,
                    status: "active",
                    place,
                    mode,
                    startNote,
                    endNote: "",
                    roomId,
                }
            );

            setEndNote("");

            await fetchSessions();

            toast.success(`${name} が開始した！`);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEnd = async () => {
        if (!mySession) return;

        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                mySession.$id,
                {
                    status: "finished",
                    endNote,
                }
            );

            setEndNote("");

            await fetchSessions();

            toast.success(`${name} が終了した！`);
        } catch (e) {
            console.error(e);
        }
    };

    const copyInviteLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("招待リンクをコピーしたよ！");
    };

    const formatTime = (t) =>
        new Date(t).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatDuration = (createdAt) => {
        const diff = now - new Date(createdAt);
        const min = Math.max(0, Math.floor(diff / 60000));
        const h = Math.floor(min / 60);
        const m = min % 60;

        return h > 0 ? `${h}時間${m}分` : `${m}分`;
    };

    useEffect(() => {
        const saved = localStorage.getItem("studyping-name");
        if (saved) setName(saved);
    }, []);

    useEffect(() => {
        if (roomId) fetchSessions();
    }, [roomId, name]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSessions();
        }, 5000);

        return () => clearInterval(interval);
    }, [roomId, name]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen p-8 bg-white text-black dark:bg-black dark:text-white">
            <Header />

            <h1 className="text-3xl font-bold">
                StudyRoom: {roomId}
            </h1>

            {/* 🔗 招待リンク */}
            <button
                onClick={copyInviteLink}
                className="mt-3 px-3 py-1 border rounded"
            >
                🔗 招待リンクをコピー
            </button>

            <input
                className="mt-6 w-full border p-2 rounded"
                placeholder="名前"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    localStorage.setItem("studyping-name", e.target.value);
                }}
            />

            <input
                className="mt-3 w-full border p-2 rounded"
                placeholder="場所"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
            />

            <select
                className="mt-3 w-full border p-2 rounded"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
            >
                <option value="なんにんでも">なんにんでも</option>
                <option value="ひとりで">ひとりで</option>
            </select>

            <textarea
                className="mt-3 w-full border p-2 rounded"
                placeholder="開始コメント"
                value={startNote}
                onChange={(e) => setStartNote(e.target.value)}
            />

            {mySession && (
                <textarea
                    className="mt-3 w-full border p-2 rounded"
                    placeholder="終了コメント"
                    value={endNote}
                    onChange={(e) => setEndNote(e.target.value)}
                />
            )}

            {!mySession ? (
                <button
                    onClick={handleStart}
                    className="mt-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded"
                >
                    作業開始
                </button>
            ) : (
                <button
                    onClick={handleEnd}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    作業終了
                </button>
            )}

            <div className="mt-10">
                <h2 className="text-xl font-bold">🟢 作業中</h2>

                <div className="mt-4 space-y-4">
                    {sessions.length === 0 && (
                        <p>この部屋にはまだ誰もいません</p>
                    )}

                    {sessions.map((s) => (
                        <div key={s.$id} className="border p-4 rounded">
                            <p className="font-bold">{s.name}</p>
                            <p>📍 {s.place}</p>
                            <p>👥 {s.mode}</p>
                            <p>💬 {s.startNote}</p>
                            <p>🕒 {formatDuration(s.$createdAt)}</p>
                            <p>⏰ {formatTime(s.$createdAt)} 開始</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}