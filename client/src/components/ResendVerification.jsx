import { useState } from "react";
import { resendVerificationEmail } from "../services/api";

export default function ResendVerification({ initialEmail = "", initiallyOpen = false }) {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await resendVerificationEmail(email.trim());
      setMessage(result.message || "Verification requested. Check your inbox and spam folder.");
    } catch (error) {
      setMessage(error.message || "Unable to send verification email. Please try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <details open={initiallyOpen || undefined} style={{ marginTop: 20 }}>
      <summary>Didn't receive your verification email?</summary>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <label>
          Account email
          <input type="email" autoComplete="email" autoFocus={initiallyOpen} value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Sending..." : "Resend verification email"}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
    </details>
  );
}
