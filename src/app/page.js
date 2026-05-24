"use client";

import {
  useEffect,
  useState,
} from "react";

import Header from "../components/Header";

import toast from "react-hot-toast";

import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "../lib/appwrite";

import {
  ID,
  Query,
} from "appwrite";

export default function Home() {
  const [name, setName] =
    useState("");

  const [place, setPlace] =
    useState("");

  const [mode, setMode] =
    useState("なんにんでも");

  const [startNote, setStartNote] =
    useState("");

  const [endNote, setEndNote] =
    useState("");

  const [sessions, setSessions] =
    useState([]);

  const [mySession, setMySession] =
    useState(null);

  const [now, setNow] =
    useState(Date.now());

  const fetchSessions = async () => {
    try {
      const response =
        await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            Query.equal(
              "status",
              "active"
            ),
          ]
        );

      setSessions(response.documents);

      const mine =
        response.documents.find(
          (session) =>
            session.name === name
        );

      setMySession(mine || null);

    } catch (error) {
      console.error(error);
    }
  };

  const handleStart = async () => {
    if (!name) {
      alert("名前を入力してください");
      return;
    }

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
        }
      );

      setEndNote("");

      await fetchSessions();

      toast.success(`${name} が開始した！`);

    } catch (error) {
      console.error(error);
      alert("エラー");
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

    } catch (error) {
      console.error(error);
      alert("エラー");
    }
  };

  const formatDuration = (createdAt) => {
    const start = new Date(createdAt);

    const diff = now - start;

    const minutes = Math.max(
      0,
      Math.floor(diff / 1000 / 60)
    );

    const hours = Math.floor(minutes / 60);
    const remainMinutes = minutes % 60;

    if (hours <= 0) return `${remainMinutes}分`;

    return `${hours}時間${remainMinutes}分`;
  };

  const formatStartTime = (createdAt) => {
    return new Date(createdAt).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const saved =
      localStorage.getItem("studyping-name");
    if (saved) setName(saved);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [name]);

  // 🔥 subscribe削除 → 安定ポーリング方式
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, [name]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white p-8 text-black dark:bg-black dark:text-white">
      <Header />

      <h1 className="text-4xl font-bold">
        StudyPing
      </h1>

      <input
        className="mt-6 w-full rounded border p-2"
        placeholder="名前"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          localStorage.setItem("studyping-name", e.target.value);
        }}
      />

      <input
        className="mt-4 w-full rounded border p-2"
        placeholder="場所"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />

      <select
        className="mt-4 w-full rounded border p-2"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="なんにんでも">なんにんでも</option>
        <option value="ひとりで">ひとりで</option>
      </select>

      <textarea
        className="mt-4 w-full rounded border p-2"
        placeholder="開始コメント"
        value={startNote}
        onChange={(e) => setStartNote(e.target.value)}
      />

      {mySession && (
        <textarea
          className="mt-4 w-full rounded border p-2"
          placeholder="終了コメント"
          value={endNote}
          onChange={(e) => setEndNote(e.target.value)}
        />
      )}

      {mySession ? (
        <button
          onClick={handleEnd}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white dark:bg-red-600"
        >
          作業終了
        </button>
      ) : (
        <button
          onClick={handleStart}
          className="mt-4 rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          作業開始
        </button>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          🟢 作業中
        </h2>

        <div className="mt-4 space-y-4">
          {sessions.length === 0 && (
            <p>現在作業中の人はいません。</p>
          )}

          {sessions.map((session) => (
            <div key={session.$id} className="rounded border p-4">
              <p className="text-lg font-bold">{session.name}</p>

              <p className="mt-1">📍 {session.place}</p>

              <p className="mt-1">👥 {session.mode}</p>

              <p className="mt-1">💬 {session.startNote}</p>

              <p className="mt-1">
                🕒 {formatDuration(session.$createdAt)}
              </p>

              <p className="mt-1">
                🟢 {formatStartTime(session.$createdAt)} 開始
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}