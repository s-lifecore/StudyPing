"use client";

import { useEffect, useState } from "react";

import {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "@/lib/appwrite";

import {
  ID,
  Query,
} from "appwrite";

export default function Home() {
  const [name, setName] = useState("");

  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("status", "active"),
        ]
      );

      setSessions(response.documents);
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
          name: name,
          status: "active",
          place: "図書館",
          mode: "なんにんでも",
          startNote: "線形代数",
        }
      );

      await fetchSessions();

      alert("開始した！");
    } catch (error) {
      console.error(error);

      alert("エラー");
    }
  };

  useEffect(() => {
    fetchSessions();

    const savedName =
      localStorage.getItem("studyping-name");

    if (savedName) {
      setName(savedName);
    }
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">
        StudyPing
      </h1>

      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => {
          setName(e.target.value);

          localStorage.setItem(
            "studyping-name",
            e.target.value
          );
        }}
        className="mt-6 w-full rounded border p-2"
      />

      <button
        onClick={handleStart}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        作業開始
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          🟢 作業中
        </h2>

        <div className="mt-4 space-y-4">
          {sessions.length === 0 && (
            <p>
              現在作業中の人はいません。
            </p>
          )}

          {sessions.map((session) => (
            <div
              key={session.$id}
              className="rounded border p-4"
            >
              <p className="text-lg font-bold">
                {session.name}
              </p>

              <p className="mt-1">
                📍 {session.place}
              </p>

              <p className="mt-1">
                👥 {session.mode}
              </p>

              <p className="mt-1">
                💬 {session.startNote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}