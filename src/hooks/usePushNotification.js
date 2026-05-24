"use client";

import { useEffect } from "react";

export default function usePushNotification() {
    useEffect(() => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const sendPush = ({ title, body }) => {
        if (Notification.permission !== "granted") return;

        new Notification(title, {
            body,
            icon: "/icon.png",
        });
    };

    return { sendPush };
}