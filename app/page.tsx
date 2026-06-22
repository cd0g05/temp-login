import LoginForm from "./login-form";

export default function Home() {
  return (
    <>
      {/* HAZARD TAPE BANNER */}
      <div className="hazard-tape">
        <p>
          <span className="warn">&#9888;</span>&nbsp; This website is currently
          under development and not accessible to the public &nbsp;
          <span className="warn">&#9888;</span>
        </p>
      </div>

      <main className="wrap">
        {/* HERO — the crane lifts the real "P" out of CARTER CRI_E */}
        <section className="hero">
          <p className="eyebrow">Hi, my name is</p>
          <h1 className="hero-name">
            Carter Cri
            <span className="lift-slot">
              <svg
                className="crane"
                viewBox="0 0 220 250"
                fill="none"
                stroke="#16181d"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* jib (horizontal arm) */}
                <line x1="18" y1="42" x2="204" y2="42" />
                <line x1="40" y1="58" x2="190" y2="58" />
                {/* jib web (truss diagonals) */}
                <line x1="40" y1="58" x2="58" y2="42" />
                <line x1="78" y1="58" x2="96" y2="42" />
                <line x1="116" y1="58" x2="134" y2="42" />
                <line x1="154" y1="58" x2="172" y2="42" />
                {/* counter-jib + counterweight */}
                <rect x="14" y="40" width="22" height="20" rx="2" fill="#16181d" />
                {/* mast (tower) to the side, floating/cropped above the name */}
                <line x1="150" y1="58" x2="150" y2="150" />
                <line x1="166" y1="58" x2="166" y2="150" />
                <line x1="150" y1="78" x2="166" y2="98" />
                <line x1="166" y1="78" x2="150" y2="98" />
                <line x1="150" y1="110" x2="166" y2="130" />
                <line x1="166" y1="110" x2="150" y2="130" />
                {/* operator cab */}
                <rect x="150" y="22" width="20" height="20" rx="3" />
                {/* trolley + cable straight down to the hook over the P */}
                <rect x="103" y="50" width="14" height="9" rx="2" fill="#16181d" />
                <line x1="110" y1="59" x2="110" y2="232" strokeWidth="3" />
                {/* hook */}
                <rect
                  x="100"
                  y="232"
                  width="20"
                  height="12"
                  rx="2"
                  fill="#f5c518"
                  strokeWidth="4"
                />
              </svg>
              <span className="lifted-p">P</span>
            </span>
            e
          </h1>
          <p className="lead">
            Welcome to the construction site. The real cartercripe.com is still
            being built, so pardon the dust!
          </p>
        </section>

        {/* LOGIN (centered focal point) */}
        <section className="login-zone">
          <LoginForm />
        </section>

        {/* AUDIENCE COPY (to the sides / below the login) */}
        <section className="audience">
          <p>
            If you are a <strong>potential employer</strong>, please avail
            yourself to <a href="/resume.pdf">my resume</a>.
          </p>
          <p>
            If you are a <strong>friend / teammate / colleague</strong>, please
            feel free to{" "}
            <a href="mailto:carter.cripe@gmail.com">contact me</a>.
          </p>
          <p >
            If you are here on behalf of Hogwarts School of Witchcraft and
            Wizardry, I humbly accept your admissions offer.
          </p>
        </section>
      </main>

      <footer>
        &#169; 2026 Carter Cripe
      </footer>
    </>
  );
}
