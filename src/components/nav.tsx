import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Main navigation header
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <span className="text-lg font-semibold">Matthew Sharp</span>
        <ThemeToggle />
      </nav>
    </header>
  );
}
