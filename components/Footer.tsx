export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-8 text-sm text-center text-neutral-600 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Kontrast · All rights reserved
      </div>
    </footer>
  );
}
