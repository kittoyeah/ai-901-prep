import Link from "next/link";
import { getExamPool } from "@/lib/bank";
import ExamRunner from "@/components/ExamRunner";

export const metadata = { title: "Mock exam · AI-901 Prep" };

export default function ExamPage() {
  const pool = getExamPool();
  return (
    <div className="shell">
      <Link
        href="/"
        className="mono-label"
        style={{ display: "inline-block", marginBottom: "var(--space-lg)", textDecoration: "none" }}
      >
        ← Home
      </Link>
      <ExamRunner pool={pool} />
    </div>
  );
}
