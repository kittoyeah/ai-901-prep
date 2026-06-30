"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Askable, ExamPool, Option } from "@/lib/types";

const EXAM_SIZE = 40;
const CONCEPT_COUNT = 17; // ~42% — within the 40-45% blueprint band
const PASS = 700;

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function buildExam(pool: ExamPool): Askable[] {
  const concepts = sample(pool.concepts, CONCEPT_COUNT);
  const foundry = sample(pool.foundry, EXAM_SIZE - concepts.length);
  return sample([...concepts, ...foundry], EXAM_SIZE);
}

function mmss(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ExamRunner({ pool }: { pool: ExamPool }) {
  const [exam, setExam] = useState<Askable[]>(() => buildExam(pool));
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const total = exam.length;
  const q = exam[idx];
  const current = answers[q.uid] ?? [];
  const answeredCount = exam.filter((a) => (answers[a.uid] ?? []).length > 0).length;

  const score = useMemo(() => {
    const correct = exam.filter((a) => sameSet(answers[a.uid] ?? [], a.correct)).length;
    return { correct, scaled: Math.round((correct / total) * 1000) };
  }, [exam, answers, total]);

  function choose(key: string) {
    setAnswers((prev) => {
      const cur = prev[q.uid] ?? [];
      if (q.type === "single") return { ...prev, [q.uid]: [key] };
      const nextSel = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      return { ...prev, [q.uid]: nextSel };
    });
  }

  function restart() {
    setExam(buildExam(pool));
    setAnswers({});
    setIdx(0);
    setElapsed(0);
    setFinished(false);
  }

  if (finished) {
    const pass = score.scaled >= PASS;
    return (
      <section>
        <div className="result" aria-live="polite">
          <p className="mono-label">Mock exam · {mmss(elapsed)} · {total} questions</p>
          <p className="result__score">
            {score.scaled}
            <span style={{ color: "var(--color-ink-3)" }}>/1000</span>
          </p>
          <p
            className="explain__verdict"
            style={{ color: pass ? "var(--color-correct)" : "var(--color-wrong)", fontSize: "1rem" }}
          >
            {pass ? "Pass" : "Below pass"} · {score.correct}/{total} correct · pass mark {PASS}
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" className="btn btn--primary" onClick={restart}>
              New mock exam
            </button>
            <Link href="/" className="btn btn--ghost">Home</Link>
          </div>
        </div>

        <h2 style={{ margin: "var(--space-2xl) 0 var(--space-md)" }}>Review</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          {exam.map((a, i) => {
            const picked = answers[a.uid] ?? [];
            const ok = sameSet(picked, a.correct);
            return (
              <div key={a.uid}>
                <p className="mono-label" style={{ marginBottom: "var(--space-2xs)" }}>
                  Q{i + 1} · <span style={{ color: ok ? "var(--color-correct)" : "var(--color-wrong)" }}>{ok ? "correct" : "missed"}</span>
                </p>
                {a.caseStem && <p className="scenario" style={{ marginBottom: "var(--space-xs)" }}>{a.caseStem}</p>}
                <p style={{ color: "var(--color-ink)", fontWeight: 500, marginBottom: "var(--space-xs)" }}>{a.stem}</p>
                <ReviewExplain askable={a} picked={picked} />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function optionState(o: Option): string | undefined {
    return current.includes(o.key) ? "selected" : undefined;
  }

  return (
    <section>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-lg)" }}>
        <div className="progress" aria-hidden="true">
          <div className="progress__bar" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="mono-label">Mock exam · {idx + 1}/{total}</span>
          <span className="mono-label">{mmss(elapsed)} · {answeredCount} answered</span>
        </div>
      </div>

      {q.caseStem && <p className="scenario" style={{ marginBottom: "var(--space-md)" }}>{q.caseStem}</p>}
      <h2 className="stem" style={{ marginBottom: "var(--space-md)" }}>{q.stem}</h2>
      {q.type === "multi" && (
        <p className="mono-label" style={{ marginBottom: "var(--space-sm)" }}>Select all that apply</p>
      )}

      <div className="options" role="group" aria-label="Answer options">
        {q.options.map((o) => (
          <button
            key={o.key}
            type="button"
            className="option"
            data-state={optionState(o)}
            aria-pressed={current.includes(o.key)}
            onClick={() => choose(o.key)}
          >
            <span className="option__key" aria-hidden="true">{o.key}</span>
            <span className="option__text">{o.text}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-lg)", flexWrap: "wrap" }}>
        <button type="button" className="btn btn--ghost" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
          Previous
        </button>
        {idx + 1 < total ? (
          <button type="button" className="btn btn--primary" onClick={() => setIdx((i) => i + 1)}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => setFinished(true)}>
            Finish exam
          </button>
        )}
      </div>
    </section>
  );
}

function ReviewExplain({ askable, picked }: { askable: Askable; picked: string[] }) {
  const { options, correct, explanation } = askable;
  function state(o: Option): string {
    if (correct.includes(o.key)) return "correct";
    if (picked.includes(o.key)) return "wrong";
    return "muted";
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
      <div className="options">
        {options.map((o) => (
          <div key={o.key} className="option" data-state={state(o)} aria-disabled>
            <span className="option__key" aria-hidden="true">{o.key}</span>
            <span className="option__text">{o.text}</span>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--color-ink-2)", fontSize: "0.9rem" }}>{explanation.correct}</p>
    </div>
  );
}
