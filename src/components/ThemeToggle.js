"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("studyping-theme");

        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setDark(false);
        }

        setMounted(true);
    }, []);

    const toggleTheme = () => {
        if (dark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("studyping-theme", "light");
            setDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("studyping-theme", "dark");
            setDark(true);
        }
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="rounded border px-3 py-1"
        >
            {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}