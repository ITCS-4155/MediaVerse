"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "../../lib/actions.js";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const response = await loginAction(formData);

      if (response?.error) {
          alert(response.error);
      }
  };

  const handleSocialLogin = (provider) => {
    // TODO: wire up to NextAuth or your OAuth provider
    // e.g. signIn("google") / signIn("github") / signIn("apple")
    console.log(`Sign in with ${provider}`);
  };

  const socialProviders = [
    { id: "google", label: "Google", icon: <GoogleIcon /> },
    { id: "github", label: "GitHub", icon: <GitHubIcon /> },
    { id: "apple",  label: "Apple",  icon: <AppleIcon /> },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandName}>mediaverse</span>
        </div>

        <h1 style={styles.heading}>Sign in</h1>
        <p style={styles.sub}>Welcome back. Enter your credentials to continue.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldWrap}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="you@example.com"
              style={{ ...styles.input, ...(focused === "email" ? styles.inputFocused : {}) }}
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.passwordWrap}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: "3rem", ...(focused === "password" ? styles.inputFocused : {}) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={styles.forgotRow}>
            <a href="#" style={styles.forgotLink}>Forgot password?</a>
          </div>

          <button type="submit" style={styles.submitBtn}>Sign in →</button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Social buttons */}
        <div style={styles.socialGrid}>
          {socialProviders.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSocialLogin(id)}
              onMouseEnter={() => setHoveredSocial(id)}
              onMouseLeave={() => setHoveredSocial(null)}
              style={{
                ...styles.socialBtn,
                ...(hoveredSocial === id ? styles.socialBtnHover : {}),
              }}
              aria-label={`Sign in with ${label}`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        <p style={styles.signupRow}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.signupLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0f1a",
    fontFamily: "'Georgia', serif",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "2rem",
  },
  brandDot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#6ee7b7",
  },
  brandName: {
    fontSize: "0.85rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#6ee7b7",
  },
  heading: {
    margin: "0 0 0.4rem",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#f9fafb",
    letterSpacing: "-0.02em",
  },
  sub: {
    margin: "0 0 1.5rem",
    fontSize: "0.9rem",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    padding: "0.65rem 0.5rem",
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#d1d5db",
    fontSize: "0.82rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "'Georgia', serif",
  },
  socialBtnHover: {
    backgroundColor: "#374151",
    borderColor: "#4b5563",
    color: "#f9fafb",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#1f2937",
  },
  dividerText: {
    fontSize: "0.75rem",
    color: "#4b5563",
    whiteSpace: "nowrap",
    letterSpacing: "0.03em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#f9fafb",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: "#6ee7b7",
    boxShadow: "0 0 0 3px rgba(110,231,183,0.1)",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    lineHeight: 1,
    padding: 0,
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-0.5rem",
  },
  forgotLink: {
    fontSize: "0.8rem",
    color: "#6b7280",
    textDecoration: "none",
  },
  submitBtn: {
    marginTop: "0.5rem",
    padding: "0.85rem",
    backgroundColor: "#6ee7b7",
    color: "#0b0f1a",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.03em",
    cursor: "pointer",
  },
  signupRow: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  signupLink: {
    color: "#6ee7b7",
    textDecoration: "none",
    fontWeight: "600",
  },
};