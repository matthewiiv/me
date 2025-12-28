import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMAIL } from "@/constants";

const experience = [
  {
    title: "Founding Engineer",
    company: "Team Lily",
    period: "Sep 2025 - Present",
    description: "Building AI hiring tools."
  },
  {
    title: "Tech Lead / Interim VP Engineering",
    company: "Let's Do This",
    period: "Sep 2022 - Sep 2025",
    description:
      "Led engineering teams building a marketplace for sporting and mass participation events."
  },
  {
    title: "Senior Full Stack Engineer",
    company: "Dishpatch",
    period: "Jun 2021 - Sep 2022",
    description:
      "Built infrastructure for nationwide delivery of restaurantmeal kits. Later sold to Waitrose"
  },
  {
    title: "Co-Founder / CTO",
    company: "Watch With",
    period: "Nov 2020 - Jun 2021",
    description:
      "Co-founded a costreaming platform for streamers to watch content with their viewers. 30k users in the first week"
  }
];

interface Project {
  title: string;
  description: string;
  tech: string[];
  url?: string;
  note?: string;
}

const projects: Project[] = [
  {
    title: "Transcribe My Notes",
    description:
      "Thousands of voice notes transcribed across 56 languages. Forward WhatsApp messages, get text back in seconds.",
    tech: ["Whisper", "WhatsApp"],
    url: "https://transcribemynotes.com"
  },
  {
    title: "Morpheu5",
    description:
      "Sold out four generative art collections (1,000 pieces) for £300k. Raised £30k for the war in Ukraine.",
    tech: ["Generative Art"],
    url: "https://www.morpheu5.com/"
  },
  {
    title: "Super Magic Link",
    description:
      "Costreaming platform used by ~2,000 streamers to create ~9,000 hours of content watched millions of times.",
    tech: ["Twitch", "Video Sync"],
    note: "Shut down"
  }
];

/**
 * Home page with portfolio sections
 */
export function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-4 py-8">
        <img
          src="/me.png"
          alt="Matthew Sharp"
          className="h-24 w-24 rounded-full"
        />
        <p className="max-w-2xl text-lg text-foreground">
          Software engineer building AI products. Father. Occasional founder. I
          like skiing, motorsport, running, cooking, especially when fire or
          baking is involved.
        </p>
        <div className="pt-4">
          <Button variant="outline" asChild>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </Button>
        </div>
      </section>

      {/* Projects Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium group-hover:text-primary">
                    {project.title}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.note && (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {project.note}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
        <div className="space-y-8">
          {experience.map((job, index) => (
            <div
              key={index}
              className="relative border-l-2 border-border pl-6 pb-2"
            >
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
              <div className="space-y-1">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-primary">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.period}</p>
                <p className="pt-2 text-muted-foreground">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
