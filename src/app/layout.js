import "./globals.css";
import ProtectedRoute from "../components/ProtectedRoute";

export const metadata = {
  title: "StudyPing",
  description: "Study & Work Activity Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {/* 🔐 全ページログイン必須 */}
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </body>
    </html>
  );
}