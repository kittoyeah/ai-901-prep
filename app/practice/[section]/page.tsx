import Link from "next/link";
import { notFound } from "next/navigation";
import { expandSection, getSection, getSlugs } from "@/lib/bank";
import QuizRunner from "@/components/QuizRunner";

export function generateStaticParams() {
  return getSlugs().map((section) => ({ section }));
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const askables = expandSection(section);

  return (
    <div className="shell">
      <Link
        href="/"
        className="mono-label"
        style={{ display: "inline-block", marginBottom: "var(--space-lg)", textDecoration: "none" }}
      >
        ← All sections
      </Link>
      <QuizRunner askables={askables} sectionTitle={section.title} />
    </div>
  );
}
