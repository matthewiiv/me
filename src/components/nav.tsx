import { ThemeToggle } from "@/components/theme-toggle";
import { EMAIL, NAME, SOCIAL_LINKS } from "@/constants";
import { slugify } from "@/lib/utils";

/**
 * Site header: name, social links, theme toggle, and the hazard-stripe band
 */
export function Nav() {
  return (
    <header className="border-b-2 border-ink">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] sm:px-10 sm:text-sm sm:tracking-[0.06em]"
        aria-label="Primary"
      >
        <a href="/" className="whitespace-nowrap" data-testid="link-home">
          {NAME}
        </a>
        <div className="flex items-center gap-4 sm:gap-7">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:decoration-hi hover:decoration-[3px] hover:underline-offset-4"
              data-testid={`link-${slugify(link.label)}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${EMAIL}`}
            className="hidden hover:underline hover:decoration-hi hover:decoration-[3px] hover:underline-offset-4 sm:inline"
            data-testid="link-email"
          >
            Email
          </a>
          <ThemeToggle />
        </div>
      </nav>
      <div className="stripes h-2 border-t-2 border-ink" aria-hidden="true" />
    </header>
  );
}
