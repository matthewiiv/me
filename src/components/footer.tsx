import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { EMAIL } from "@/constants";

const socialLinks = [
  {
    href: "https://github.com/matthewiiv",
    label: "GitHub",
    icon: Github
  },
  {
    href: "https://www.linkedin.com/in/matthewiiv/",
    label: "LinkedIn",
    icon: Linkedin
  },
  {
    href: "https://x.com/matthewsharp3",
    label: "Twitter",
    icon: Twitter
  },
  {
    href: `mailto:${EMAIL}`,
    label: "Email",
    icon: Mail
  }
];

/**
 * Footer with social links
 */
export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4">
        <div className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={link.label}
            >
              <link.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
