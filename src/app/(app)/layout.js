"use client";

import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">{children}</main>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}
