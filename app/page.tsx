import Link from "next/link";
import { getFlashcards, getSummaries } from "@/lib/bank";

export default function Home() {
  const summaries = getSummaries();
  const totalQ = summaries.reduce((n, s) => n + s.total, 0);
  const cardCount = getFlashcards().length;

  return (
    <div className="shell shell--wide">
      <header style={{ marginBottom: "var(--space-xl)", maxWidth: "46rem" }}>
        <p className="mono-label" style={{ marginBottom: "var(--space-sm)" }}>
          Microsoft Azure AI Fundamentals
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.2rem)", marginBottom: "var(--space-md)" }}>
          Practise for the AI-901 exam
        </h1>
        <p style={{ color: "var(--color-ink-2)", fontSize: "1.05rem" }}>
          AI-901 replaced AI-900 in 2026. It tests whether you can describe AI
          concepts and build basic AI solutions with Microsoft Foundry. {totalQ}{" "}
          practice questions here across {summaries.length} sections, with the full
          reason every option is right or wrong.
        </p>

        {/* Exam facts (from the official skills-measured guide) */}
        <div className="facts">
          <div className="fact">
            <span className="fact__n">700<span className="unit"> /1000</span></span>
            <span className="mono-label">pass mark</span>
          </div>
          <div className="fact">
            <span className="fact__n">~40-60</span>
            <span className="mono-label">questions</span>
          </div>
          <div className="fact">
            <span className="fact__n">MCQ</span>
            <span className="mono-label">+ multi · case</span>
          </div>
          <div className="fact">
            <span className="fact__n">English</span>
            <span className="mono-label">no time-extension</span>
          </div>
        </div>

        {/* Domain weighting */}
        <div className="weight">
          <div className="weight__bar" aria-hidden="true">
            <div className="weight__seg weight__seg--a" style={{ width: "43%" }} />
            <div className="weight__seg weight__seg--b" style={{ width: "57%" }} />
          </div>
          <div className="weight__legend">
            <span className="chip">
              <span className="dot" style={{ background: "var(--color-accent-soft)" }} />
              Identify AI concepts · 40-45%
            </span>
            <span className="chip">
              <span className="dot dot--medium" />
              Implement with Foundry · 55-60%
            </span>
          </div>
        </div>

        {/* What to focus on */}
        <p className="scenario focus">
          <strong style={{ color: "var(--color-ink)" }}>Focus to pass:</strong> over
          half the exam is hands-on Microsoft Foundry, so the two Foundry sections
          carry the most weight, prioritise them. Lock in the six Responsible AI
          principles for near-guaranteed marks, and be able to match each scenario to
          the right workload and service.
        </p>
      </header>

      <div className="mode-row">
        <Link href="/exam" className="mode-card">
          <span className="mono-label">timed · scored /1000</span>
          <h3>Mock exam</h3>
          <p>40 questions drawn at exam weighting from the full pool. Scored against the 700 pass mark, with a full review at the end. Every attempt is a fresh draw.</p>
        </Link>
        <Link href="/flashcards" className="mode-card">
          <span className="mono-label">{cardCount} cards</span>
          <h3>Flashcards</h3>
          <p>Rapid terminology drill. Tap to flip term to definition, shuffle the deck, and rattle through the jargon between practice sessions.</p>
        </Link>
      </div>

      <h2 style={{ fontSize: "1.3rem", marginBottom: "var(--space-md)" }}>Practise by topic</h2>
      <div className="card-grid">
        {summaries.map((s) => (
          <Link key={s.slug} href={`/practice/${s.slug}`} className="section-card">
            <p className="mono-label">
              {s.blueprintRef.split(">").pop()?.trim() ?? "Section"}
            </p>
            <h2 className="section-card__title">{s.title}</h2>
            <p>
              <span className="count count--accent">{s.total}</span>{" "}
              <span style={{ color: "var(--color-ink-3)" }}>questions</span>
            </p>
            <div className="section-card__meta">
              <span className="chip"><span className="dot dot--easy" />{s.mix.easy} easy</span>
              <span className="chip"><span className="dot dot--medium" />{s.mix.medium} med</span>
              <span className="chip"><span className="dot dot--hard" />{s.mix.hard} hard</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
