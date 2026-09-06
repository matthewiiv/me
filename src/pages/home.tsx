import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMAIL, NAME } from "@/constants";

interface YearMonth {
  year: number;
  month: number;
}

interface Role {
  title: string;
  shortTitle: string;
  company: string;
  start: YearMonth;
  /** Undefined means the role is current. */
  end?: YearMonth;
  description: string;
}

interface Project {
  title: string;
  description: string;
  badge: string;
  url?: string;
  tone: "hi" | "paper" | "retired";
}

const FIRST_YEAR = 2020;
const MONTHS_PER_YEAR = 12;
/** Bars narrower than this (percent of the chart) get their label beside them. */
const MIN_LABELLED_BAR_PERCENT = 12;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const stickers = [
  { label: "Software engineer", highlight: false },
  { label: "AI products", highlight: true },
  { label: "Father", highlight: false },
  { label: "Occasional founder", highlight: false }
];

const projects: Project[] = [
  {
    title: "Cardsetting",
    description:
      "Describe your business card in a sentence, get print-ready files back. Five automated print checks before you see a design.",
    badge: "New",
    url: "https://cardsetting.com",
    tone: "hi"
  },
  {
    title: "Transcribe My Notes",
    description:
      "Thousands of voice notes transcribed across 56 languages. Forward WhatsApp messages, get text back in seconds.",
    badge: "56 langs",
    url: "https://transcribemynotes.com",
    tone: "paper"
  },
  {
    title: "Morpheu5",
    description:
      "Sold out four generative art collections (1,000 pieces) for £300k. Raised £30k for the war in Ukraine.",
    badge: "Sold out",
    url: "https://www.morpheu5.com/",
    tone: "paper"
  },
  {
    title: "Super Magic Link",
    description:
      "Costreaming platform used by ~2,000 streamers to create ~9,000 hours of content watched millions of times.",
    badge: "Retired",
    tone: "retired"
  }
];

const roles: Role[] = [
  {
    title: "Founding Engineer",
    shortTitle: "Founding Engineer",
    company: "Team Lily",
    start: { year: 2025, month: 9 },
    description: "Building AI hiring tools."
  },
  {
    title: "Tech Lead / Interim VP Engineering",
    shortTitle: "Tech Lead / Interim VP Eng",
    company: "Let's Do This",
    start: { year: 2022, month: 9 },
    end: { year: 2025, month: 9 },
    description:
      "Led engineering teams building a marketplace for sporting and mass participation events."
  },
  {
    title: "Senior Full Stack Engineer",
    shortTitle: "Senior Full Stack",
    company: "Dishpatch",
    start: { year: 2021, month: 6 },
    end: { year: 2022, month: 9 },
    description:
      "Built infrastructure for nationwide delivery of restaurant meal kits. Later sold to Waitrose."
  },
  {
    title: "Co-Founder / CTO",
    shortTitle: "Co-Founder / CTO",
    company: "Watch With",
    start: { year: 2020, month: 11 },
    end: { year: 2021, month: 6 },
    description:
      "Co-founded a costreaming platform for streamers to watch content with their viewers. 30k users in the first week."
  }
];

/**
 * Number of months from the start of the chart to the given year and month
 */
function monthsFromChartStart({ year, month }: YearMonth): number {
  return (year - FIRST_YEAR) * MONTHS_PER_YEAR + (month - 1);
}

/**
 * Human-readable label for a year and month, e.g. "Sep 2025"
 */
function formatYearMonth({ year, month }: YearMonth): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/**
 * Formats a role's tenure as "Sep 2022 → Sep 2025" or "Sep 2025 → now"
 */
function formatPeriod(role: Role): string {
  const end = role.end ? formatYearMonth(role.end) : "now";
  return `${formatYearMonth(role.start)} → ${end}`;
}

const projectToneClasses: Record<Project["tone"], string> = {
  hi: "bg-hi text-on-hi",
  paper: "bg-paper text-ink",
  retired: "bg-paper-muted text-ink-muted"
};

const projectBadgeToneClasses: Record<Project["tone"], string> = {
  hi: "border-on-hi",
  paper: "border-ink",
  retired: "border-ink-muted"
};

/**
 * Project tile; renders as a link when the project has a URL
 */
function ProjectTile({ project }: { project: Project }) {
  const className = cn(
    "flex min-h-[200px] flex-col justify-between gap-8 border-2 border-ink p-5 sm:min-h-[260px] sm:p-7",
    projectToneClasses[project.tone],
    project.url &&
      "transition-transform duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)] focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:shadow-[8px_8px_0_var(--ink)] focus-visible:outline-none"
  );
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] lg:text-[44px]"
          data-testid={`text-project-title-${project.title}`}
        >
          {project.title}
        </span>
        <span
          className={cn(
            "shrink-0 border-2 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.06em] sm:text-[13px]",
            projectBadgeToneClasses[project.tone]
          )}
          data-testid={`text-project-badge-${project.title}`}
        >
          {project.badge}
        </span>
      </div>
      <p
        className="text-[15px] leading-snug sm:text-[17px]"
        data-testid={`text-project-description-${project.title}`}
      >
        {project.description}
      </p>
    </>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={`link-project-${project.title}`}
      >
        {content}
      </a>
    );
  }
  return (
    <div className={className} data-testid={`card-project-${project.title}`}>
      {content}
    </div>
  );
}

/**
 * Experience as a lap chart: one bar per role, positioned by real tenure
 */
function LapChart() {
  const now = new Date();
  const current: YearMonth = {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
  const lastYear = Math.max(current.year, FIRST_YEAR);
  const years = Array.from(
    { length: lastYear - FIRST_YEAR + 1 },
    (_, index) => FIRST_YEAR + index
  );
  const totalMonths = years.length * MONTHS_PER_YEAR;

  const bars = roles.map((role) => {
    const startMonth = monthsFromChartStart(role.start);
    const endMonth = monthsFromChartStart(role.end ?? current) + 1;
    const width = ((endMonth - startMonth) / totalMonths) * 100;
    return {
      role,
      left: (startMonth / totalMonths) * 100,
      width,
      isCurrent: !role.end,
      labelOutside: width < MIN_LABELLED_BAR_PERCENT
    };
  });

  return (
    <div
      className="border-2 border-ink bg-paper"
      role="img"
      aria-label={`Career timeline from ${FIRST_YEAR} to ${lastYear}`}
      data-testid="chart-experience"
    >
      <div
        className="grid border-b-2 border-ink text-[9px] font-bold tracking-[0.02em] sm:text-xs sm:uppercase sm:tracking-[0.08em]"
        style={{
          gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`
        }}
      >
        {years.map((year, index) => (
          <span
            key={year}
            className={cn("px-1 py-1.5 sm:px-3 sm:py-2", index > 0 && "yr")}
          >
            <span className="sm:hidden">'{String(year).slice(-2)}</span>
            <span className="hidden sm:inline">{year}</span>
          </span>
        ))}
      </div>
      <div className="relative flex flex-col gap-2 py-3 sm:gap-3.5 sm:py-5">
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`
          }}
          aria-hidden="true"
        >
          {years.map((year, index) => (
            <span key={year} className={cn(index > 0 && "yr")} />
          ))}
        </div>
        {bars.map(({ role, left, width, isCurrent, labelOutside }) => (
          <div
            key={role.company}
            className="relative h-7 sm:h-[60px]"
            data-testid={`bar-role-${role.company}`}
          >
            <div
              className={cn(
                "absolute top-0 h-full",
                isCurrent
                  ? "border-2 border-ink bg-hi text-on-hi"
                  : "bg-ink text-paper"
              )}
              style={{ left: `${left}%`, width: `${width}%` }}
              aria-hidden="true"
            />
            <div
              className={cn(
                "pointer-events-none absolute top-0 hidden h-full flex-col justify-center whitespace-nowrap px-3 md:flex",
                labelOutside
                  ? "text-ink"
                  : isCurrent
                    ? "text-on-hi"
                    : "text-paper"
              )}
              style={
                labelOutside
                  ? { left: `${left + width}%` }
                  : { left: `${left}%`, width: `${width}%`, overflow: "hidden" }
              }
            >
              <span className="font-display text-base font-extrabold leading-tight tracking-[-0.01em]">
                {role.company}
              </span>
              <span
                className={cn(
                  "hidden text-[11px] font-bold uppercase tracking-[0.06em] lg:block",
                  labelOutside ? "text-ink-muted" : "opacity-80"
                )}
              >
                {role.shortTitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Home page: hero, bio, projects, and experience
 */
export function HomePage() {
  return (
    <div className="flex flex-col">
      <section
        className="flex flex-col gap-6 border-b-2 border-ink px-5 pb-8 pt-9 sm:gap-8 sm:px-10 sm:pb-12 sm:pt-14"
        aria-labelledby="hero-name"
      >
        <h1
          id="hero-name"
          className="font-display text-[72px] font-extrabold uppercase leading-[0.86] tracking-[-0.03em] sm:text-[104px] lg:text-[128px]"
          data-testid="text-name"
        >
          Matthew
          <br />
          Sharp
        </h1>
        <ul className="flex flex-wrap gap-2 sm:gap-3">
          {stickers.map((sticker) => (
            <li
              key={sticker.label}
              className={cn(
                "inline-flex h-9 items-center rounded-full border-[3px] border-ink px-3.5 text-[13px] font-bold uppercase tracking-[0.04em] sm:h-10 sm:px-4 sm:text-[15px]",
                sticker.highlight ? "bg-hi text-on-hi" : "bg-paper text-ink"
              )}
              data-testid={`text-sticker-${sticker.label}`}
            >
              {sticker.label}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="grid border-b-2 border-ink md:grid-cols-12"
        aria-label="About"
      >
        <div className="border-b-2 border-ink md:col-span-4 md:border-b-0 md:border-r-2">
          <img
            src="/me.png"
            alt={NAME}
            width={512}
            height={512}
            className="aspect-[4/3] h-full w-full object-cover object-[center_20%] grayscale md:aspect-auto md:min-h-[320px]"
            data-testid="img-portrait"
          />
        </div>
        <div className="flex flex-col justify-between gap-6 px-5 py-6 md:col-span-8 md:gap-8 md:p-10">
          <p
            className="max-w-3xl font-display text-[26px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-[40px] sm:leading-none"
            data-testid="text-bio"
          >
            I like skiing, motorsport, running, cooking, especially when fire or
            baking is involved.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex h-14 items-center justify-between gap-3 bg-ink px-5 font-display text-base font-extrabold uppercase text-hi transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-hi sm:h-[60px] sm:self-start sm:px-7 sm:text-[22px]"
            data-testid="link-email-cta"
          >
            <span>{EMAIL}</span>
            <ArrowRight className="size-5 sm:size-6" strokeWidth={3} />
          </a>
        </div>
      </section>

      <section
        className="flex flex-col gap-4 border-b-2 border-ink px-5 py-8 sm:gap-6 sm:px-10 sm:py-12"
        aria-labelledby="projects-heading"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="projects-heading"
            className="font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.03em] sm:text-[56px]"
          >
            Projects
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] sm:text-sm sm:tracking-[0.06em]">
            <span className="sm:hidden">Side quests</span>
            <span className="hidden sm:inline">Side quests, 2020 → now</span>
          </span>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-6">
          {projects.map((project) => (
            <ProjectTile key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section
        className="flex flex-col gap-4 px-5 py-8 sm:gap-6 sm:px-10 sm:py-12"
        aria-labelledby="experience-heading"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="experience-heading"
            className="font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.03em] sm:text-[56px]"
          >
            Experience
          </h2>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] sm:text-sm sm:tracking-[0.06em]">
            Lap chart
          </span>
        </div>
        <LapChart />
        <ul className="grid gap-4 border-t-2 border-ink pt-4 sm:gap-5 sm:pt-5 md:grid-cols-2 md:gap-x-10">
          {roles.map((role) => (
            <li
              key={role.company}
              className="flex flex-col gap-1 text-[15px] leading-snug md:grid md:grid-cols-[150px_1fr] md:gap-3"
              data-testid={`row-role-${role.company}`}
            >
              <span
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.06em] md:pt-0.5 md:text-xs",
                  !role.end && "text-hi brightness-75 dark:brightness-100"
                )}
                data-testid={`text-role-period-${role.company}`}
              >
                {formatPeriod(role)}
              </span>
              <span>
                <strong data-testid={`text-role-title-${role.company}`}>
                  {role.title}, {role.company}.
                </strong>{" "}
                <span data-testid={`text-role-description-${role.company}`}>
                  {role.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
