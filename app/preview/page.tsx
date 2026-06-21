// GATED page — middleware blocks unauthenticated access before this renders.
export default function Preview() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontFamily: "var(--display-font)", textTransform: "uppercase" }}>
        You&rsquo;re in.
      </h1>
      <p style={{ color: "var(--ink-soft)" }}>
        This is a placeholder for the real cartercripe.com, still under
        construction. If you can read this, the gate let you through.
      </p>
      <form action="/api/logout" method="post" style={{ marginTop: 24 }}>
        <button className="btn" type="submit" style={{ maxWidth: 200 }}>
          Log out
        </button>
      </form>
    </main>
  );
}
