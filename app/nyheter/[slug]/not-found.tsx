import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-6">
      <div className="min-h-12"></div>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-light">Artikeln hittades inte</h1>
        <Link
          href="/nyheter"
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          ← Tillbaka till nyheter
        </Link>
      </div>
    </section>
  );
}
