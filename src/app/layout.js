import "./globals.css";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "../components/ProtectedRoute";

export const metadata = {
  title: "StudyPing",
  description: "Study & Work Activity Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
