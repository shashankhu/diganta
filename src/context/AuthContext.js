"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null);

  // ─── Initialize from localStorage ───
  useEffect(() => {
    try {
      const stored = localStorage.getItem("diganta_token");
      const storedUser = localStorage.getItem("diganta_user");
      if (stored && storedUser) {
        setToken(stored);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted localStorage — clear it
      localStorage.removeItem("diganta_token");
      localStorage.removeItem("diganta_user");
    }
    setLoading(false);
  }, []);

  // ─── Logout ───
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("diganta_token");
    localStorage.removeItem("diganta_user");
  }, []);

  // Keep a ref to logout so apiFetch always uses the latest version
  logoutRef.current = logout;

  // ─── Login ───
  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem("diganta_token", tokenValue);
    localStorage.setItem("diganta_user", JSON.stringify(userData));
  }, []);

  // ─── Session Validation (periodic) ───
  useEffect(() => {
    if (!token) return;

    // Validate session on mount and every 5 minutes
    const validate = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          logoutRef.current?.();
        } else if (res.ok) {
          const data = await res.json();
          if (data.user) {
            // Sync role changes from server
            setUser((prev) => ({
              ...prev,
              role: data.user.role,
              name: data.user.name,
            }));
            localStorage.setItem(
              "diganta_user",
              JSON.stringify({
                ...JSON.parse(localStorage.getItem("diganta_user") || "{}"),
                role: data.user.role,
                name: data.user.name,
              })
            );
          }
        }
      } catch {
        // Network error — don't logout, just skip validation
      }
    };

    validate(); // Initial validation
    const interval = setInterval(validate, 5 * 60 * 1000); // Every 5 min
    return () => clearInterval(interval);
  }, [token]);

  // ─── Authenticated Fetch Wrapper ───
  const apiFetch = useCallback(
    async (url, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const res = await fetch(url, { ...options, headers });

      // Handle empty responses (204, etc.)
      if (res.status === 204) return null;

      let data;
      try {
        data = await res.json();
      } catch {
        if (!res.ok) throw new Error("Request failed");
        return null;
      }

      if (res.status === 401) {
        logoutRef.current?.();
        throw new Error("Session expired");
      }

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      return data;
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, apiFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
