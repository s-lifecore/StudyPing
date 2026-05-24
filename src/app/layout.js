import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "StudyPing",
  description: "みんなの作業状況を共有",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
    >
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}