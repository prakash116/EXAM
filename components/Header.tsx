import Link from "next/link";

export default function Header() {
  return (
    <header className="no-print sticky top-0 z-40 bg-charcoal text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Text-based logo placeholder — replace with an <Image> later */}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-lg font-extrabold text-charcoal"
          >
            RA
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-wide text-gold-400 sm:text-lg">
              RestoCare Academy
            </span>
            <span className="block text-xs text-gray-300 sm:text-sm">
              Online Examination System
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
