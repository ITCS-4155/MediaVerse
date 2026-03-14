"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const GalleryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Page() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const [profile, setProfile] = useState({ name: "", location: "", bio: "", avatar: null });
  const [account, setAccount] = useState({ email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notifs, setNotifs] = useState({ emailUpdates: true, pushNotifs: false, weeklyDigest: true });

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleGalleryPick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      alert("Camera access denied or not available.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setProfile((p) => ({ ...p, avatar: canvas.toDataURL("image/jpeg") }));
    stopCamera();
  }, [stopCamera]);

  const handleSave = () => {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    { id: "account", label: "Account", icon: <ShieldIcon /> },
    { id: "notifications", label: "Notifications", icon: <BellIcon /> },
    { id: "privacy", label: "Privacy", icon: <LockIcon /> },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.layout}>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarBrand}>
            <span style={styles.brandDot} />
            <span style={styles.brandName}>mediaverse</span>
          </div>
          <p style={styles.sidebarHeading}>Settings</p>
          <nav style={styles.nav}>
            {tabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                onMouseEnter={() => setHoveredTab(id)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  ...styles.navBtn,
                  ...(activeTab === id ? styles.navBtnActive : {}),
                  ...(hoveredTab === id && activeTab !== id ? styles.navBtnHover : {}),
                }}
              >
                <span style={{ opacity: activeTab === id ? 1 : 0.5 }}>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main style={styles.main}>

          {/* PROFILE */}
          {activeTab === "profile" && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile</h2>
              <p style={styles.sectionSub}>How others see you on Mediaverse.</p>

              <div style={styles.avatarBlock}>
                <div style={styles.avatarRing}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={styles.avatarActions}>
                  <p style={styles.avatarLabel}>Profile photo</p>
                  <div style={styles.avatarBtns}>
                    <button onClick={handleGalleryPick} style={styles.avatarBtn}>
                      <GalleryIcon /> From gallery
                    </button>
                    <button onClick={cameraActive ? stopCamera : startCamera} style={styles.avatarBtn}>
                      <CameraIcon /> {cameraActive ? "Cancel" : "Use camera"}
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                </div>
              </div>

              {cameraActive && (
                <div style={styles.cameraWrap}>
                  <video ref={videoRef} autoPlay playsInline muted style={styles.cameraVideo} />
                  <button onClick={capturePhoto} style={styles.captureBtn}>
                    <span style={styles.captureInner} />
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />

              <div style={styles.fields}>
                <Field label="Display name" id="name" value={profile.name} placeholder="e.g. Alex Rivera"
                  onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                <Field label="Where you're from" id="location" value={profile.location} placeholder="e.g. Atlanta, GA"
                  onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
                <div style={{ ...styles.fieldWrap, position: "relative" }}>
                  <label style={styles.label} htmlFor="bio">Bio</label>
                  <textarea id="bio" rows={4} value={profile.bio} maxLength={200}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell the world a little about yourself…"
                    style={styles.textarea} />
                  <span style={styles.charCount}>{profile.bio.length}/200</span>
                </div>
              </div>
            </section>
          )}

          {/* ACCOUNT */}
          {activeTab === "account" && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Account</h2>
              <p style={styles.sectionSub}>Manage your email and password.</p>
              <div style={styles.fields}>
                <Field label="Email address" id="email" type="email" value={account.email} placeholder="you@example.com"
                  onChange={(v) => setAccount((a) => ({ ...a, email: v }))} />
                <div style={styles.divider}>
                  <span style={styles.dividerLine} />
                  <span style={styles.dividerText}>change password</span>
                  <span style={styles.dividerLine} />
                </div>
                <Field label="Current password" id="currentPassword" type="password" value={account.currentPassword} placeholder="••••••••"
                  onChange={(v) => setAccount((a) => ({ ...a, currentPassword: v }))} />
                <Field label="New password" id="newPassword" type="password" value={account.newPassword} placeholder="••••••••"
                  onChange={(v) => setAccount((a) => ({ ...a, newPassword: v }))} />
                <Field label="Confirm new password" id="confirmPassword" type="password" value={account.confirmPassword} placeholder="••••••••"
                  onChange={(v) => setAccount((a) => ({ ...a, confirmPassword: v }))} />
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Notifications</h2>
              <p style={styles.sectionSub}>Choose what you hear about and when.</p>
              <div style={styles.toggleList}>
                <Toggle label="Email updates" description="Receive product news and feature announcements."
                  checked={notifs.emailUpdates} onChange={(v) => setNotifs((n) => ({ ...n, emailUpdates: v }))} />
                <Toggle label="Push notifications" description="Get notified in-browser about activity on your account."
                  checked={notifs.pushNotifs} onChange={(v) => setNotifs((n) => ({ ...n, pushNotifs: v }))} />
                <Toggle label="Weekly digest" description="A summary of what happened on your feed each week."
                  checked={notifs.weeklyDigest} onChange={(v) => setNotifs((n) => ({ ...n, weeklyDigest: v }))} />
              </div>
            </section>
          )}

          {/* PRIVACY */}
          {activeTab === "privacy" && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Privacy</h2>
              <p style={styles.sectionSub}>Control your data and visibility.</p>
              <div style={styles.dangerZone}>
                <p style={styles.dangerTitle}>Danger zone</p>
                <p style={styles.dangerDesc}>These actions are permanent and cannot be undone.</p>
                <div style={styles.dangerBtns}>
                  <button style={styles.dangerBtnOutline}>Deactivate account</button>
                  <button style={styles.dangerBtnFill}>Delete account</button>
                </div>
              </div>
            </section>
          )}

          {/* Save bar */}
          <div style={styles.saveBar}>
            <button onClick={handleSave} style={styles.saveBtn}>
              {saved ? <><CheckIcon /> Saved</> : "Save changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, id, value, placeholder, type = "text", onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label} htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...styles.input, ...(focused ? styles.inputFocused : {}) }} />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div style={styles.toggleRow}>
      <div>
        <p style={styles.toggleLabel}>{label}</p>
        <p style={styles.toggleDesc}>{description}</p>
      </div>
      <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        style={{ ...styles.toggleTrack, ...(checked ? styles.toggleTrackOn : {}) }}>
        <span style={{ ...styles.toggleThumb, ...(checked ? styles.toggleThumbOn : {}) }} />
      </button>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#0b0f1a", fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 },
  layout: { position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" },
  sidebar: { width: "220px", flexShrink: 0, borderRight: "1px solid #1f2937", padding: "2rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem", backgroundColor: "#0d1117" },
  sidebarBrand: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" },
  brandDot: { display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#6ee7b7" },
  brandName: { fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6ee7b7" },
  sidebarHeading: { fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4b5563", margin: "0 0 0.75rem 0.25rem" },
  nav: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  navBtn: { display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "none", border: "none", color: "#6b7280", fontSize: "0.88rem", fontWeight: "500", cursor: "pointer", textAlign: "left", fontFamily: "'Georgia', serif", transition: "all 0.15s" },
  navBtnActive: { backgroundColor: "#1f2937", color: "#f9fafb" },
  navBtnHover: { backgroundColor: "#161d2a", color: "#d1d5db" },
  main: { flex: 1, padding: "3rem 3.5rem", maxWidth: "640px" },
  section: { marginBottom: "2rem" },
  sectionTitle: { margin: "0 0 0.3rem", fontSize: "1.6rem", fontWeight: "700", color: "#f9fafb", letterSpacing: "-0.02em" },
  sectionSub: { margin: "0 0 2rem", fontSize: "0.88rem", color: "#6b7280" },
  avatarBlock: { display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" },
  avatarRing: { width: "88px", height: "88px", borderRadius: "50%", border: "2px solid #6ee7b7", padding: "3px", flexShrink: 0, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" },
  avatarPlaceholder: { width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarActions: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  avatarLabel: { margin: 0, fontSize: "0.8rem", color: "#9ca3af", letterSpacing: "0.04em" },
  avatarBtns: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  avatarBtn: { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "6px", color: "#d1d5db", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Georgia', serif" },
  cameraWrap: { position: "relative", marginBottom: "1.5rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #1f2937", maxWidth: "360px" },
  cameraVideo: { width: "100%", display: "block", borderRadius: "12px" },
  captureBtn: { position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", border: "3px solid white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" },
  captureInner: { display: "block", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "white" },
  fields: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9ca3af" },
  input: { width: "100%", padding: "0.75rem 1rem", backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#f9fafb", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box", fontFamily: "'Georgia', serif" },
  inputFocused: { borderColor: "#6ee7b7", boxShadow: "0 0 0 3px rgba(110,231,183,0.08)" },
  textarea: { width: "100%", padding: "0.75rem 1rem", backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", color: "#f9fafb", fontSize: "0.95rem", outline: "none", resize: "vertical", fontFamily: "'Georgia', serif", lineHeight: 1.6, boxSizing: "border-box" },
  charCount: { position: "absolute", bottom: "0.6rem", right: "0.75rem", fontSize: "0.72rem", color: "#4b5563" },
  divider: { display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" },
  dividerLine: { flex: 1, height: "1px", backgroundColor: "#1f2937" },
  dividerText: { fontSize: "0.72rem", color: "#4b5563", whiteSpace: "nowrap", letterSpacing: "0.06em", textTransform: "uppercase" },
  toggleList: { display: "flex", flexDirection: "column", gap: 0 },
  toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 0", borderBottom: "1px solid #1f2937", gap: "1.5rem" },
  toggleLabel: { margin: "0 0 0.2rem", fontSize: "0.92rem", color: "#f9fafb", fontWeight: "600" },
  toggleDesc: { margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 },
  toggleTrack: { flexShrink: 0, width: "44px", height: "24px", borderRadius: "99px", backgroundColor: "#1f2937", border: "1px solid #374151", cursor: "pointer", position: "relative", transition: "background-color 0.2s" },
  toggleTrackOn: { backgroundColor: "#6ee7b7", borderColor: "#6ee7b7" },
  toggleThumb: { position: "absolute", top: "2px", left: "2px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#6b7280", transition: "transform 0.2s, background-color 0.2s" },
  toggleThumbOn: { transform: "translateX(20px)", backgroundColor: "#0b0f1a" },
  dangerZone: { border: "1px solid #3f1515", borderRadius: "12px", padding: "1.5rem", backgroundColor: "#1a0f0f" },
  dangerTitle: { margin: "0 0 0.3rem", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", color: "#f87171" },
  dangerDesc: { margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#9ca3af" },
  dangerBtns: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  dangerBtnOutline: { padding: "0.6rem 1.1rem", border: "1px solid #7f1d1d", borderRadius: "7px", background: "none", color: "#f87171", fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Georgia', serif" },
  dangerBtnFill: { padding: "0.6rem 1.1rem", border: "none", borderRadius: "7px", backgroundColor: "#7f1d1d", color: "#fecaca", fontSize: "0.85rem", cursor: "pointer", fontWeight: "700", fontFamily: "'Georgia', serif" },
  saveBar: { paddingTop: "1.5rem", borderTop: "1px solid #1f2937" },
  saveBtn: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 2rem", backgroundColor: "#6ee7b7", color: "#0b0f1a", border: "none", borderRadius: "8px", fontSize: "0.92rem", fontWeight: "700", letterSpacing: "0.02em", cursor: "pointer", fontFamily: "'Georgia', serif" },
};