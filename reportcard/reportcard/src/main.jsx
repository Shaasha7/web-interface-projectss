/* ==========================================================================
   main.jsx — Application entry point
   ========================================================================== */

// Global styles must load first (tokens, fonts, reset), then components.
import "./index.css";

import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

/* --------------------------------------------------------------------------
   Theme: honour a saved choice ("light" | "dark"); otherwise follow the OS.
   Set it anywhere with: localStorage.setItem("reportcard.theme", "dark")
   -------------------------------------------------------------------------- */
const THEME_KEY = "reportcard.theme";

try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }
} catch {
  /* storage unavailable — fall back to OS preference */
}

/* --------------------------------------------------------------------------
   Error boundary — shows a branded recovery screen instead of a blank page
   -------------------------------------------------------------------------- */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook your monitoring service (Sentry, LogRocket, etc.) in here.
    console.error("[ReportCard] Unhandled error:", error, info?.componentStack);
  }

  handleReload = () => window.location.reload();

  handleReset = () => {
    try {
      localStorage.removeItem("reportcard.students.v1");
    } catch {
      /* ignore */
    }
    window.location.assign(import.meta.env.BASE_URL || "/");
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main>
        <div className="page">
          <div className="empty-state" role="alert">
            <div className="empty-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3>Something went wrong</h3>
            <p>
              An unexpected error occurred. Reloading usually fixes it. If it keeps
              happening, reset the saved data.
            </p>
            <div className="header-actions" style={{ justifyContent: "center" }}>
              <button className="btn outline" onClick={this.handleReset}>
                Reset data
              </button>
              <button className="btn" onClick={this.handleReload}>
                Reload page
              </button>
            </div>
            {import.meta.env.DEV && (
              <pre
                style={{
                  marginTop: 24,
                  padding: 16,
                  textAlign: "left",
                  overflowX: "auto",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--red)",
                  fontSize: "0.8rem",
                }}
              >
                {String(this.state.error?.stack || this.state.error)}
              </pre>
            )}
          </div>
        </div>
      </main>
    );
  }
}

/* --------------------------------------------------------------------------
   Mount
   -------------------------------------------------------------------------- */
const container = document.getElementById("root");

if (!container) {
  throw new Error('Root element "#root" not found. Check index.html.');
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
