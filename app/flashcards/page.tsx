import Link from "next/link";
import { getFlashcards } from "@/lib/bank";
import FlashcardDeck from "@/components/FlashcardDeck";

export const metadata = { title: "Flashcards · AI-901 Prep" };

export default function FlashcardsPage() {
  const cards = getFlashcards();
  return (
    <div className="shell">
      <Link
        href="/"
        className="mono-label"
        style={{ display: "inline-block", marginBottom: "var(--space-lg)", textDecoration: "none" }}
      >
        ← Home
      </Link>
      <FlashcardDeck cards={cards} />
    </div>
  );
}
