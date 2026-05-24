"use client";

import {
    useEffect,
    useState,
} from "react";

export default function ThemeToggle() {
    const [dark, setDark] =
        useState(false);

    useEffect(() => {
        const saved =
            localStorage.getItem(
                "studyping-theme"
            );

        if (saved === "dark") {
            document.documentElement.classList.add(
                "dark"
            );

            setDark(true);
        }
    }, []);

    const toggleTheme =
        () => {
            if (dark) {
                document.documentElement.classList.remove(
                    "dark"
                );

                localStorage.setItem(
                    "studyping-theme",
                    "light"
                );

            } else {
                document.documentElement.classList.add(
                    "dark"
                );

                localStorage.setItem(
                    "studyping-theme",
                    "dark"
                );
            }

            setDark(!dark);
        };

    return (
        <button
            onClick={toggleTheme}
            className="rounded border px-3 py-1"
        >
            {dark
                ? "☀️ Light"
                : "🌙 Dark"}
        </button>
    );
}