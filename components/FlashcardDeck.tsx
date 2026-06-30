"use client";

import Link from "next/link";
import { useState } from "react";
import type { Flashcard } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

export default function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[idx];
  const total = deck.length;

  function go(delta: number) {
    setFlipped(false);
    setIdx((i) => (i + delta + total) % total);
  }

  function reshuffle() {
    setDeck(shuffle(cards));
    setIdx(0);
    setFlipped(false);
  }

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
        <span className="mono-label">Flashcards · {idx + 1}/{total}</span>
        <button type="button" className="btn btn--ghost" onClick={reshuffle}>Shuffle</button>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show term" : "Show definition"}
      >
        <span className="flashcard__inner">
          <span className="flashcard__face flashcard__front">
            <span className="mono-label">term</span>
            <span className="flashcard__term">{card.term}</span>
            <span className="mono-label" style={{ opacity: 0.7 }}>tap to flip</span>
          </span>
          <span className="flashcard__face flashcard__back">
            <span className="mono-label">definition</span>
            <span className="flashcard__def">{card.definition}</span>
          </span>
        </span>
      </button>

      <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-lg)", justifyContent: "space-between" }}>
        <button type="button" className="btn btn--ghost" onClick={() => go(-1)}>Previous</button>
        <Link href="/" className="btn btn--ghost">Home</Link>
        <button type="button" className="btn btn--primary" onClick={() => go(1)}>Next</button>
      </div>
    </section>
  );
}
