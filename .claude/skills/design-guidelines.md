# Design Guidelines: Lily

## Design Approach

**Selected Approach:** Design System (Developer-Focused)

- **Primary Inspiration:** Vercel, Railway, Linear - modern developer tools aesthetic
- **Design System:** Custom minimal system with Tailwind utility-first approach
- **Principles:** Clean, professional, dev-friendly with subtle sophistication

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**

- Background Base: 222 24% 8%
- Surface: 222 20% 12%
- Border: 222 20% 20%
- Text Primary: 222 10% 95%
- Text Secondary: 222 10% 65%
- Accent Primary: 347 81% 62% (pink/red)
- Accent Secondary: 217 91% 60% (tech blue)
- Success: 142 71% 45%
- Error: 0 72% 51%

**Light Mode:**

- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 13% 91%
- Text Primary: 222 24% 8%
- Text Secondary: 222 14% 45%
- Accent Primary: 347 81% 58%
- Accent Secondary: 217 91% 50%

### B. Typography System

**Font Families:**

- **UI Font:** `font-family: ui-sans-serif, system-ui, sans-serif` (Tailwind system fonts)
- **Code Font:** `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` (Tailwind system fonts)

**Typography Components:**

Use the typography components from `@/components/ui/typography` for consistent text styling across the application.

#### Heading Hierarchy

- **TypographyH1** - Page titles (text-4xl font-extrabold tracking-tight)
  - Use once per page for the main page title
  - Example: `<TypographyH1>Dashboard</TypographyH1>`
- **TypographyH2** - Major sections (text-3xl font-semibold tracking-tight with border-b)
  - Use for major content sections
  - Example: `<TypographyH2>Applications</TypographyH2>`
- **TypographyH3** - Subsections (text-2xl font-semibold tracking-tight)
  - Use for subsections within major sections
  - Example: `<TypographyH3>Contact Information</TypographyH3>`
- **TypographyH4** - Minor headings (text-xl font-semibold tracking-tight)
  - Use for smaller section headings
  - Example: `<TypographyH4>Details</TypographyH4>`

#### Text Variants

- **TypographyLead** - Intro/important text (text-xl text-muted-foreground)
  - Use for page introductions or important callouts
  - Example: `<TypographyLead>Welcome to the application portal</TypographyLead>`
- **TypographyP** - Body text (leading-7 with auto-spacing)
  - Use for standard body content
  - Example: `<TypographyP>This is a paragraph of text.</TypographyP>`
- **TypographyLarge** - Emphasized content (text-lg font-semibold)
  - Use for emphasized content that needs attention
  - Example: `<TypographyLarge>Important notice</TypographyLarge>`
- **TypographySmall** - Fine print (text-sm font-medium)
  - Use for terms, conditions, or supplementary information
  - Example: `<TypographySmall>Terms and conditions apply</TypographySmall>`
- **TypographyMuted** - Secondary info (text-sm text-muted-foreground)
  - Use for all secondary/contextual information
  - Example: `<TypographyMuted>Last updated 2 hours ago</TypographyMuted>`
- **TypographyLabel** - Form labels and section labels (text-sm font-medium text-muted-foreground)
  - Use for all form labels and section labels
  - Example: `<TypographyLabel>Username</TypographyLabel>`

#### Specialized Components

- **TypographyInlineCode** - Inline code snippets (bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm)
  - Use for inline code or technical terms
  - Example: `<TypographyInlineCode>npm install</TypographyInlineCode>`
- **TypographyBlockquote** - Quoted text (border-l-2 pl-6 italic mt-6)
  - Use for quotes or callouts
  - Example: `<TypographyBlockquote>This is a quote</TypographyBlockquote>`

#### Usage Guidelines

1. **Heading Hierarchy:** Never skip heading levels (e.g., don't go from TypographyH1 to TypographyH3)
2. **One H1 per page:** Each page should have exactly one TypographyH1 for the main title
3. **Consistent Labels:** Use `<TypographyLabel>` for all form labels and section labels
4. **Secondary Text:** Use `<TypographyMuted>` for all secondary/contextual information
5. **Spacing:**
   - Headings: Use mb-4 for sections, mb-2 for subsections
   - Paragraphs: Auto-spacing via `[&:not(:first-child)]:mt-6`
   - Labels: Use mb-2 before input/content

#### Component Defaults

- **CardTitle:** Default is text-lg (can be overridden with className if needed)
- All typography components support className merging for custom styling when needed

### C. Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16, 24

- Container: max-w-6xl mx-auto px-6
- Section Padding: py-16 md:py-24
- Card Padding: p-6 md:p-8
- Grid Gaps: gap-6 md:gap-8

### D. Component Library

**Welcome Hero Section:**

- Full viewport height (min-h-screen) with centered content
- Gradient background: subtle radial gradient from accent to background
- Large logo/icon (w-20 h-20) with subtle glow effect
- Heading + subheading + status indicator (backend connection)
- Dual CTA buttons: "View Docs" (primary) + "Explore API" (outline)
- Animated status pulse dot showing live connection

**Status Card Component:**

- Glass-morphism effect: backdrop-blur-lg bg-surface/50 border
- Displays: Frontend status, Backend status, Connection latency
- Icon + Label + Value layout in grid
- Subtle hover lift effect (transform translate-y)

**Navigation Header:**

- Sticky top position with blur backdrop
- Logo left, nav links center, theme toggle + GitHub link right
- Minimal height (h-16), clean separator line

**Code Block Component:**

- Dark background with syntax highlighting colors
- Copy button top-right with success feedback
- Rounded corners (rounded-lg)
- Font: JetBrains Mono

**Footer:**

- Simple centered layout
- Tech stack badges (React + Express icons)
- Links: Documentation, GitHub, License
- Built with love message

### E. Animations

**Minimal & Purposeful:**

- Page load: Fade in (opacity 0 to 1, 300ms)
- Status pulse: Smooth ping animation on connection dot
- Button hover: Subtle scale (1.02) with 200ms transition
- Card hover: Translate-y(-4px) with shadow increase
- Theme toggle: Smooth color transitions (300ms)

## Images

**Hero Background:**

- **Type:** Subtle geometric pattern overlay or gradient mesh
- **Placement:** Full viewport behind hero content
- **Style:** Abstract tech-inspired, low opacity (10-15%), doesn't compete with content
- **Alternative:** Consider no image for ultra-clean minimal look, just gradient

**No large hero image** - This is a developer tool, keep it clean and functional.

## Key Features

**Welcome Page Layout:**

1. **Hero Section** - Centered content with status, CTAs, animated background
2. **Quick Start Section** - 3-column grid: Frontend Setup, Backend Setup, Deploy
3. **Tech Stack Section** - Badge grid showing React, Express, Tailwind, etc.
4. **Next Steps Section** - Card layout with actionable developer tasks

**Visual Hierarchy:**

- Primary focus: Connection status and CTAs
- Secondary: Quick start instructions
- Tertiary: Tech stack and resources

**Responsive Behavior:**

- Mobile: Stack everything, reduce padding, single column grids
- Tablet: 2-column grids, moderate spacing
- Desktop: Full multi-column layouts, generous whitespace

**Developer Experience:**

- Clear visual feedback for all states (loading, success, error)
- Monospace fonts for all code/technical content
- High contrast for readability in both themes
- Smooth theme transitions without flash
