import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper with navigation and footer
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
