import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="nav">
      <div className="shell shell--wide nav__inner">
        <Link href="/" className="nav__brand">
          AI<span className="tick">-901</span> Prep
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
