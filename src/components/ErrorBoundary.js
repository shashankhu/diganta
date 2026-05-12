"use client";

import { Component } from "react";

/**
 * Global Error Boundary — catches React rendering errors
 * and prevents white-screen crashes in production.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "var(--space-8)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-lg)",
              background: "var(--accent-danger-bg, #fef2f2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "var(--space-4)",
              fontSize: "28px",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: "var(--text-xl, 20px)",
              fontWeight: 600,
              color: "var(--text-primary, #1e293b)",
              marginBottom: "var(--space-2, 8px)",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "var(--text-muted, #64748b)",
              fontSize: "var(--text-sm, 14px)",
              marginBottom: "var(--space-6, 24px)",
              maxWidth: 400,
            }}
          >
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "var(--space-3, 12px) var(--space-6, 24px)",
              background: "var(--accent-primary, #6366f1)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md, 8px)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "var(--text-sm, 14px)",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
