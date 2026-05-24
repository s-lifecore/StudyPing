"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  client,
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "@/lib/appwrite";

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
      alert(
        "名前を入力してください"
      );

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
          place: place,
          mode: mode,
          startNote: startNote,
        }
      );

      await fetchSessions();

      alert("開始した！");

    } catch (error) {
      console.error(error);

      alert("エラー");
    }
  };

  const handleEnd = async () => {
    if (!mySession) {
      return;
    }

    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        mySession.$id,
        {
          status: "finished",
        }
      );

      await fetchSessions();

      alert("終了した！");

    } catch (error) {
      console.error(error);

      alert("エラー");
    }
  };

  const formatDuration = (
    createdAt
  ) => {
    const start =
      new Date(createdAt);

    const diff =
      now - start;

    const minutes = Math.max(
      0,
      Math.floor(
        diff / 1000 / 60
      )
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
    const savedName =
      localStorage.getItem(
        "studyping-name"
      );

    if (savedName) {
      setName(savedName);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [name]);

  useEffect(() => {
    const unsubscribe =
      client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
        () => {
          fetchSessions();
        }
      );

    return () => {
      unsubscribe();
    };
  }, [name]);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setNow(Date.now());
      }, 60000);

    return () => {
      clearInterval(interval);
    };
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
          setName(
            e.target.value
          );

          localStorage.setItem(
            "studyping-name",
            e.target.value
          );
        }}
        className="mt-6 w-full rounded border p-2"
      />

      <input
        type="text"
        placeholder="場所"
        value={place}
        onChange={(e) =>
          setPlace(
            e.target.value
          )
        }
        className="mt-4 w-full rounded border p-2"
      />

      <select
        value={mode}
        onChange={(e) =>
          setMode(
            e.target.value
          )
        }
        className="mt-4 w-full rounded border p-2"
      >
        <option value="なんにんでも">
          なんにんでも
        </option>

        <option value="ひとりで">
          ひとりで
        </option>
      </select>

      <textarea
        placeholder="コメント"
        value={startNote}
        onChange={(e) =>
          setStartNote(
            e.target.value
          )
        }
        className="mt-4 w-full rounded border p-2"
      />

      {mySession ? (
        <button
          onClick={handleEnd}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
        >
          作業終了
        </button>
      ) : (
        <button
          onClick={handleStart}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          作業開始
        </button>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          🟢 作業中
        </h2>

        <div className="mt-4 space-y-4">
          {sessions.length ===
            0 && (
            <p>
              現在作業中の人は
              いません。
            </p>
          )}

          {sessions.map(
            (session) => (
              <div
                key={
                  session.$id
                }
                className="rounded border p-4"
              >
                <p className="text-lg font-bold">
                  {
                    session.name
                  }
                </p>

                <p className="mt-1">
                  📍{" "}
                  {
                    session.place
                  }
                </p>

                <p className="mt-1">
                  👥{" "}
                  {
                    session.mode
                  }
                </p>

                <p className="mt-1">
                  💬{" "}
                  {
                    session.startNote
                  }
                </p>

                <p className="mt-1">
                  🕒{" "}
                  {formatDuration(
                    session.$createdAt
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