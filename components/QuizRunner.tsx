"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Askable, Option } from "@/lib/types";

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

export default function QuizRunner({
  askables,
  sectionTitle,
}: {
  askables: Askable[];
  sectionTitle: string;
}) {
  const total = askables.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = askables[idx];
  const isCorrect = useMemo(
    () => (submitted ? sameSet(selected, q.correct) : false),
    [submitted, selected, q]
  );

  function choose(key: string) {
    if (submitted) return;
    if (q.type === "single") {
      setSelected([key]);
    } else {
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  }

  function submit() {
    if (selected.length === 0 || submitted) return;
    const ok = sameSet(selected, q.correct);
    if (ok) setCorrectCount((c) => c + 1);
    setSubmitted(true);
  }

  function next() {
    if (idx + 1 >= total) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected([]);
    setSubmitted(false);
  }

  function restart() {
    setIdx(0);
    setSelected([]);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <section className="result" aria-live="polite">
        <p className="mono-label">{sectionTitle} · complete</p>
        <p className="result__score">
          {correctCount}
          <span style={{ color: "var(--color-ink-3)" }}>/{total}</span>
        </p>
        <p style={{ color: "var(--color-ink-2)" }}>
          {pct}% correct this run.
        </p>
        <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" className="btn btn--primary" onClick={restart}>
            Practise again
          </button>
          <Link href="/" className="btn btn--ghost">
            All sections
          </Link>
        </div>
      </section>
    );
  }

  function optionState(o: Option): string | undefined {
    if (!submitted) return selected.includes(o.key) ? "selected" : undefined;
    if (q.correct.includes(o.key)) return "correct";
    if (selected.includes(o.key)) return "wrong";
    return "muted";
  }

  return (
    <section>
      {/* progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-lg)" }}>
        <div className="progress" aria-hidden="true">
          <div className="progress__bar" style={{ width: `${((idx + (submitted ? 1 : 0)) / total) * 100}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="mono-label">
            {sectionTitle} · {idx + 1}/{total}
          </span>
          <span className="mono-label">{correctCount} correct</span>
        </div>
      </div>

      {/* scenario (case questions) */}
      {q.caseStem && (
        <p className="scenario" style={{ marginBottom: "var(--space-md)" }}>
          {q.caseStem}
        </p>
      )}

      {/* stem */}
      <h2 className="stem" style={{ marginBottom: "var(--space-md)" }}>
        {q.stem}
      </h2>

      {q.type === "multi" && !submitted && (
        <p className="mono-label" style={{ marginBottom: "var(--space-sm)" }}>
          Select all that apply
        </p>
      )}

      {/* options */}
      <div className="options" role="group" aria-label="Answer options">
        {q.options.map((o) => (
          <button
            key={o.key}
            type="button"
            className="option"
            data-state={optionState(o)}
            disabled={submitted}
            aria-pressed={selected.includes(o.key)}
            onClick={() => choose(o.key)}
          >
            <span className="option__key" aria-hidden="true">
              {o.key}
            </span>
            <span className="option__text">{o.text}</span>
          </button>
        ))}
      </div>

      {/* actions / explanation */}
      <div style={{ marginTop: "var(--space-lg)" }}>
        {!submitted ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={submit}
            disabled={selected.length === 0}
            aria-disabled={selected.length === 0}
          >
            Check answer
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Explanation askable={q} isCorrect={isCorrect} />
            <button type="button" className="btn btn--primary" onClick={next} autoFocus>
              {idx + 1 >= total ? "See results" : "Next question"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Explanation({ askable, isCorrect }: { askable: Askable; isCorrect: boolean }) {
  const { explanation, options, correct } = askable;
  const keyText = (k: string) => options.find((o) => o.key === k)?.text ?? "";
  const correctLabel = correct.join(", ");
  return (
    <div className="explain" aria-live="polite">
      <span
        className={`explain__verdict ${isCorrect ? "explain__verdict--correct" : "explain__verdict--wrong"}`}
      >
        {isCorrect ? "Correct" : "Not quite"} · answer: {correctLabel}
      </span>
      <p className="explain__why">{explanation.correct}</p>
      {Object.keys(explanation.distractors).length > 0 && (
        <ul className="explain__list">
          {Object.entries(explanation.distractors).map(([k, why]) => (
            <li key={k}>
              <b>{k}</b>
              <span>{why || keyText(k)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
