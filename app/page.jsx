export default function Holding() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.25rem',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .cursor { display: inline-block; width: 0.6em; height: 1.1em;
          background: #9ef0a8; vertical-align: text-bottom;
          animation: blink 1.1s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .cursor { animation: none; }
        }
        a.dsnack { color: #ffd23f; text-decoration: none;
          border-bottom: 1px dashed #ffd23f55; }
        a.dsnack:hover { border-bottom-style: solid; }
        .dim { color: #4f7a55; }
        .warm { color: #ffd23f; }
      `}</style>

      <div style={{ maxWidth: '34rem', width: '100%' }}>
        <p className="dim" style={{ letterSpacing: '0.35em', fontSize: '0.7rem', margin: 0 }}>
          DATAVISM
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 6vw, 2.6rem)',
            margin: '0.4rem 0 2.2rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#d9ffe0',
          }}
        >
          DATA UNDERGROUND
        </h1>

        <p className="dim" style={{ margin: '0 0 1rem' }}>ghost@datavism:~$ status</p>

        <div style={{ lineHeight: 1.85, fontSize: '0.95rem' }}>
          <p style={{ margin: 0 }}>&gt; the basement is being rebuilt.</p>
          <p style={{ margin: 0 }}>&gt; the school of the data underground opens soon.</p>
          <p style={{ margin: '1.1rem 0 0' }}>&gt; you won&rsquo;t learn to code here.</p>
          <p style={{ margin: 0 }}>
            &gt; you&rsquo;ll learn to command &mdash; AI, data, and the right questions.
          </p>
          <p style={{ margin: '1.1rem 0 0', color: '#d9ffe0' }}>
            &gt; the revolution will be computed.<span className="cursor" />
          </p>
        </div>

        <p style={{ marginTop: '2.4rem', fontSize: '0.9rem' }}>
          <span className="dim">meanwhile, upstairs:</span>{' '}
          <a className="dsnack" href="https://data-snack.com">
            data-snack.com
          </a>
        </p>

        <p className="dim" style={{ marginTop: '3rem', fontSize: '0.7rem', lineHeight: 1.8 }}>
          datavism.org &middot; a non-profit digital art project
          <br />
          no tracking on this page. not even ironically.
        </p>
      </div>
    </main>
  )
}
