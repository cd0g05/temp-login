"use client";

import { useEffect, useState, type FormEvent } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirectNote, setRedirectNote] = useState(false);

  // Show a soft note when the visitor was bounced here from a gated page.
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    setRedirectNote(Boolean(from));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const remember = (form.elements.namedItem("remember") as HTMLInputElement)
      .checked;
    const from =
      new URLSearchParams(window.location.search).get("from") || "/preview";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, remember, from }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          redirect?: string;
        };
        window.location.assign(data.redirect || "/preview");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "That password didn't work. Try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="hat" aria-hidden="true">
        &#9981;
      </div>
      <h2>Site Access</h2>
      <p className="sub">Got the password? Step past the tape.</p>
      {redirectNote && !error && (
        <p className="sub" role="status">
          Please log in to view that page.
        </p>
      )}
      {error && (
        <p className="err" role="alert">
          {error}
        </p>
      )}
      <label className="field">
        <span className="sr-only">Access password</span>
        <input
          type="password"
          name="password"
          placeholder="Enter access password"
          autoComplete="current-password"
          aria-label="Access password"
          required
        />
      </label>
      <label className="remember">
        <input type="checkbox" name="remember" defaultChecked /> Keep me logged in
      </label>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Checking…" : "Enter the site"}
      </button>
    </form>
  );
}
