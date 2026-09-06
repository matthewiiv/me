import { NAME } from "@/constants";

/**
 * Footer: name line above the closing hazard-stripe band
 */
export function Footer() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] sm:px-10">
        <span data-testid="text-footer-name">{NAME}</span>
        <span data-testid="text-footer-year">© {new Date().getFullYear()}</span>
      </div>
      <div className="stripes h-5 sm:h-7" aria-hidden="true" />
    </footer>
  );
}
