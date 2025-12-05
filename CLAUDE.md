# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles

- Always verify your work meets all requirements before delivering it to the user
- **Only return to user when:**
  - You've delivered a comprehensive, polished and well-tested solution
  - You've exhausted all possible avenues for independent progress
  - You face a genuine blocker requiring their specific knowledge/access or feedback

## Development Server

- **DO NOT run `npm run dev` or any server commands** - The user manages the development server
- **The server is always available on port 4000** during development
- You can assume the server is running and accessible at `http://localhost:4000`
- Focus on making code changes and testing functionality via the running server

## Requesting Information

- If you need additional information from the user, you can request it in the middle of executing a task
- If you can, test the features yourself before asking the user to test it

## Task Execution

- **After making ANY code changes**, you must call the `code-standards-reviewer` subagent to verify the code follows project coding standards and style guidelines from CLAUDE.md
- **At the end of the task**, you must call the `architect` subagent to review all your code and implementation of the features for completeness, security, and engineering best practices
- Calling code-standards-reviewer immediately after changes and architect only at the end ensures you deliver a polished, standards-compliant output to the user as quickly as possible

## Proactiveness Rules

- If the user asks you how to approach something, you should do your best to answer their question first, and not immediately jump into taking actions
- Do not add additional code explanation summary unless requested by the user. After working on a file, just stop, rather than providing an explanation of what you did.

## Decision Making

- Seek permission before broad refactors or swapping major libraries/APIs

## Testing Rules

See `.claude/skills/typescript-standards.md` for comprehensive testing patterns and standards.

## Memory Policy

### Claude.md and replit.md

- The files `CLAUDE.md` and `replid.md` are markdowns files with project information, structure, and user preferences
- Reset behavior: Message history resets completely between sessions
- Rely entirely on `CLAUDE.md` and `replit.md` and project documentation for long-term information storage / memory. Keep them up to date as you work on the project.

### Documentation Requirements

**User Preferences**

- Document when user expresses preferences (coding style, workflow, tools)
- Update immediately when user asks to remember something
- Track patterns of how they like to work

**Architecture Tracking**

- Document when adding/removing features
- Track project structure changes
- Log new dependencies or tools
- Record architectural decisions with dates

**Required Sections**

- Overview: Purpose, goals, current state
- User Preferences: Coding style, workflow preferences
- Project Architecture: Structure and key decisions

**Update Protocol**

- Immediate: User preferences and critical changes
- During session: Architecture changes and features
- Before session end: Review and ensure all documented

**Documentation Style Guidelines**

When documenting changes to CLAUDE.md:

1. **Architecture Section**: Add architectural info if needed:
   - High-level overview of how it works
   - Integration points with existing systems
   - Critical patterns or constraints
   - Do NOT include: specific function names, test file names, detailed API signatures
   - Keep it brief and focused on concepts

2. **Environment Variables**: Update if new env vars added

3. **Avoid Over-Documentation**:
   - Don't list specific function names (they change frequently)
   - Don't list test files (assumed to exist)
   - Don't duplicate what's obvious from reading the code
   - Focus on WHY and HOW things integrate, not WHAT every function does

### Design System Setup

The frontend must be carefully designed. A file "design_guidelines.md" consists of design guidance you MUST follow whenever building or changing the frontend.

- If you believe the instructions on this file are outdated, update the file to reflect the current design system.

## Project Overview

An Applicant Tracking System (ATS) built with Express, React, PostgreSQL (via Drizzle ORM), and TypeScript. The system features:

- **Multi-tenant isolation** using Row-Level Security (RLS) with organization-based boundaries
- **AI-powered screening interviews** using Eleven Labs conversational AI with multi-dimensional scoring
- **Stage-based application workflows** (application form → screening interview → face-to-face interview)
- **Multi-channel communication** (AI phone calls, SMS, email, WhatsApp)
- **Candidate self-service portal** with OTP authentication via phone number
- **Real-time job queue monitoring** with BullMQ and Bull Board dashboard
- **Hierarchical tenant management** using materialized paths for organizational structure

## Full-Stack JavaScript Development Guidelines

### Architecture

- Follow modern web application patterns and best-practices
- Put as much of the app in the frontend as possible. The backend should only be responsible for data persistence, making API calls and handling agent and business logic.
- Minimize the number of files. Collapse similar components into a single file
- If the request is complex and requires functionality that can't be done in a single request, it is okay to stub out the backend and implement the frontend first

### Types

- Always think through and generate the data model first in `shared/schema/` to ensure consistency between frontend and backend. Do this before writing any other code
- Keep the data model as simple as possible (e.g. don't add createdAt and updatedAt fields unless it is strictly necessary)
- For each model, additionally write:
  - The insert schema using `createInsertSchema` from `drizzle-zod`. Use `.omit` to exclude any auto-generated fields
  - **The select schema using `createSelectSchema` from `drizzle-zod` for runtime validation**
  - The insert type using `z.infer<typeof insertSchema>`
  - The select type using `typeof table.$inferSelect`
- Do not use JSONB columns. Use typed columns or arrays, or create a new table for the data.
- **Schema Validation Requirements:**
  - **CRITICAL**: All database models MUST have both insert and select Zod schemas
  - Select schemas are used for runtime response validation on backend and frontend
  - When adding a new table, immediately create both `insertXSchema` and `selectXSchema`
  - Example: `export const selectJobSchema = createSelectSchema(jobs);`
- **Common pitfalls to avoid:**
  - When writing array columns in the Drizzle schema, always call `.array()` as a method on the column type, not as a wrapper function. That is, do `text().array()` instead of `array(text())`

### Storage

- Make sure to update `IStorage` in `server/storage.ts` to accommodate any storage CRUD operations you need in the application
- Ensure that storage interface uses the types from `@shared/schema`

### Backend

- After writing the storage interface, write the API routes in the `server/routes.ts` file
- Always use the storage interface to do any CRUD operations. Keep the routes as thin as possible
- **Request Validation**: Validate the request body using Zod insert schemas from `drizzle-zod` before passing it to the storage interface
- **Response Validation**: **CRITICAL** - ALL API endpoints MUST validate responses before sending to client
  - Import `validateResponse` from `server/utils/validate-response.ts`
  - Use select schemas from `@shared/schema` for validation
  - Wrap all `res.json()` calls with `validateResponse(schema)(data)`
  - Example: `res.json(validateResponse(z.array(selectJobSchema))(jobs))`
  - This catches bugs in storage layer and ensures type safety
  - For complex responses, compose schemas inline or create reusable schemas in `shared/schema/`

### Frontend

**Routing (wouter)**

- Use `wouter` for routing on the frontend
- If you need to add a new page, add them to the `client/src/pages` directory and register them in `client/src/App.tsx`
- If there are multiple pages, use a sidebar for navigation. Use the `Link` component or the `useLocation` hook from `wouter` instead of modifying the window directly

**Forms**

- For forms, always use shadcn's `useForm` hook and `Form` component from `@/components/ui/form` which wraps `react-hook-form`
- When appropriate, use the `zodResolver` from `@hookform/resolvers/zod` to validate the form data using the appropriate insert schema from `@shared/schema`
- Use `.extend` to add validation rules to the insert schema
- Remember that the form component is controlled, ensure you pass default values to the `useForm` hook

**Data Fetching (TanStack Query)**

- Always use `@tanstack/react-query` when fetching data
- **Validated Queries (REQUIRED)**: Use `createValidatedQuery` from `@/lib/api` for ALL data fetching
  - Import select schemas from `@shared/schema` to validate responses
  - NO manual type annotations needed - types auto-infer from schemas
  - Example: `queryFn: () => createValidatedQuery(z.array(selectJobSchema))({ url: '/api/jobs' })`
  - Supports query parameters: `createValidatedQuery(schema)({ url: '/api/jobs', params: { status: 'open' } })`
  - This provides runtime validation AND automatic TypeScript type inference
- **Validated Mutations**: Use `createValidatedMutation` from `@/lib/api` for POST/PATCH/DELETE
  - Example: `mutationFn: createValidatedMutation(selectJobSchema)('POST', '/api/jobs')`
  - For DELETE use `z.void()` schema: `createValidatedMutation(z.void())('DELETE', url)`
- **Cache Management**:
  - Always invalidate the cache by queryKey after mutations. Import `queryClient` from `@lib/queryClient`
  - For hierarchical or variable query keys use an array for cache segments: `queryKey: ['/api/recipes', id]` instead of `queryKey: [`/api/recipes/${id}`]`
- Show a loading or skeleton state while queries (via `.isLoading`) or mutations (via `.isPending`) are being made
- The template uses TanStack Query v5 which only allows the object form for query related functions. e.g. `useQuery({ queryKey: ['key'] })` instead of `useQuery(['key'])`

**Loading States**

- **ALWAYS use skeleton loaders instead of text loading indicators** (e.g., "Loading..." text)
- Skeleton loaders should be colocated with the component they represent (not in separate files)
- Create reusable skeleton components that match the actual content layout structure
- Export skeleton components when they need to be reused across files
- Use minimal placeholders (2-3 skeleton items) to indicate loading
- Create detailed shapes that match actual content (icons, text lines, buttons, etc.)
- Use the existing `<Skeleton>` component from `@/components/ui/skeleton`
- Maintain consistent spacing and layout between skeleton and actual content
- Named constants should be used for repeated counts (e.g., `SKELETON_STEPS = 3`)
- Add appropriate test IDs to skeleton components for testing

Example skeleton structure:

```tsx
// Colocated with the main component
function JobCardSkeleton() {
  return (
    <Card data-testid="skeleton-job-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

// Usage in loading state
{isLoading ? (
  <div className="grid grid-cols-3 gap-6">
    <JobCardSkeleton />
    <JobCardSkeleton />
    <JobCardSkeleton />
  </div>
) : (
  // Actual content...
)}
```

**Common Pitfalls**

- For toast notifications, use `import { toast } from "sonner"` and call methods like `toast.success()`, `toast.error()`, or `toast.info()` directly
- If a form is failing to submit, try logging out `form.formState.errors` to see if there are form validation errors for fields that might not have associated form fields
- DO NOT explicitly import React as the existing Vite setup has a JSX transformer that does it automatically
- Use `import.meta.env.<ENV_VAR>` to access environment variables on the frontend instead of `process.env.<ENV_VAR>`. Note that variables must be prefixed with `VITE_` in order for the env vars to be available on the frontend
- `<SelectItem>` will throw an error if it has no value prop. Provide a value prop like this `<SelectItem value="option1">`

**Testing Attributes**

- Add a `data-testid` attribute to every HTML element that users can interact with (buttons, inputs, links, etc.) and to elements displaying meaningful information (user data, status messages, dynamic content, key values)
- Use unique, descriptive identifiers following this pattern:
  - Interactive elements: `{action}-{target}` (e.g., `button-submit`, `input-email`, `link-profile`)
  - Display elements: `{type}-{content}` (e.g., `text-username`, `img-avatar`, `status-payment`)
- For dynamically generated elements (lists, grids, repeated components), append a unique identifier at the end: `{type}-{description}-{id}`
  - Examples: `card-product-${productId}`, `row-user-${index}`, `text-price-${itemId}`
  - The dynamic identifier can be any unique value (database ID, index, key) as long as it's unique within that group
- Keep test IDs stable and descriptive of the element's purpose rather than its appearance or implementation details

**Typography Components**

- **ALWAYS use typography components** from `@/components/ui/typography` instead of inline Tailwind text classes
- Available components: `TypographyH1`, `TypographyH2`, `TypographyH3`, `TypographyH4`, `TypographyLead`, `TypographyP`, `TypographyLarge`, `TypographySmall`, `TypographyMuted`, `TypographyLabel`, `TypographyInlineCode`, `TypographyBlockquote`
- **When to use each component:**
  - `<TypographyH1>` - Page titles (use once per page)
  - `<TypographyH2>` - Major sections
  - `<TypographyH3>` - Subsections
  - `<TypographyH4>` - Minor headings
  - `<TypographyLabel>` - ALL form labels and section labels (replaces `text-sm font-medium text-muted-foreground`)
  - `<TypographyMuted>` - ALL secondary/contextual information (replaces `text-sm text-muted-foreground`)
  - `<TypographyLead>` - Page introductions or important callouts
  - `<TypographyP>` - Standard body paragraphs
  - `<TypographySmall>` - Fine print, terms, conditions
  - `<TypographyLarge>` - Emphasized content
  - `<TypographyInlineCode>` - Inline code snippets
  - `<TypographyBlockquote>` - Quotes or callouts
- **DO NOT apply custom sizing to typography components:**
  - NEVER use text sizing classes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.) on typography components
  - Each component has a pre-defined size that ensures visual consistency across the application
  - If you need a different size, use the appropriate component instead (e.g., use `<TypographyH3>` instead of `<TypographyH2 className="text-lg">`)
  - Exception: Non-sizing utilities like colors, spacing, weight, or alignment are acceptable via `className` prop
- **Benefits:**
  - Consistency: All labels look identical, all muted text uses same color
  - Maintainability: Change typography system-wide by editing one component
  - Developer experience: Autocomplete and semantic naming
  - Type safety: TypeScript ensures proper usage
- See `design_guidelines.md` for complete typography system documentation

## UI/Design Guidelines

**For comprehensive design system guidelines, see `design_guidelines.md`**

This section covers critical project-specific UI patterns and overrides:

### Color System (CSS Variables)

**IMPORTANT**: When modifying color variables in `index.css`:

- Use H S% L% format (space-separated with percentages after Saturation and Lightness)
- DO NOT wrap in `hsl()`
- Reference in Tailwind config like: `foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"`

### Critical Rules

**Never use emojis** - Use Lucide icons from the icon library instead (can be styled with foreground colors)

**Elevation Utilities** - Custom Tailwind classes in `index.css`:

- `hover-elevate` - Subtle background elevation on hover
- `active-elevate-2` - More dramatic elevation on press-down
- `<Button>` and `<Badge>` already have these built-in - DO NOT add manual hover/active states
- NEVER use with `overflow-hidden` or `overflow-scroll`
- Compatible with any background color

**Component Heights** - Interactable controls on the same line must have matching heights:

- `<Button>` heights: default (min-h-9), sm (min-h-8), lg (min-h-10), icon (h-9)
- Never manually set heights on `<Button>` - use size variants

**Layout Stability** - NO layout shifts on hover:

- Use `visibility: hidden` not `display: none` for showing/hiding on hover
- Elements should never change size on hover

**Flex Layout** - Always pair justify-between/justify-around/justify-evenly with `gap` or `space-x-*`

```tsx
// BAD: No gap with justify-between
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

// GOOD: Gap added
<CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
```

### Component Requirements

**ALWAYS use existing Shadcn components:**

- Use `<Card>`, `<Button>`, `<Badge>` from `@/components/ui/`
- For sidebars, MUST use `@/components/ui/sidebar` primitives (not custom implementations)
- Never nest Cards inside Cards

**Icon Buttons:**

- ALWAYS use `<Button size="icon">` for icon-only buttons
- NEVER add height/width classes to `size="icon"` buttons

```tsx
// GOOD
<Button size="icon" variant="ghost">
  <MyLucideIcon />
</Button>

// BAD - Don't create custom icon buttons
<Button size="sm" className="w-8 h-8">
  <MyLucideIcon />
</Button>
```

**Page Headers:**

- ALWAYS use `<PageHeader>` component from `@/components/page-header` for page headers
- NEVER create custom headers with manual `<header>` elements
- PageHeader provides consistent styling and navigation across all pages

```tsx
// GOOD
<PageHeader
  title="Organization Settings"
  showBack={true}
  onBack={() => setLocation("/admin")}
/>

// BAD - Don't create custom headers
<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
  <Settings className="w-5 h-5" />
  <TypographyH4>Organization Settings</TypographyH4>
</header>
```

**PageHeader Props:**

- `title` (required): The page title text
- `showBack`: Show back button (defaults to false)
- `onBack`: Callback when back button is clicked
- `badge`: Optional badge to display next to title
- `metadata`: Array of metadata strings to display below title
- `summary`: Optional ReactNode for additional summary content
- `actions`: Optional ReactNode for action buttons (e.g., "Create New")

## File Operations

### File Naming Conventions

All files in the codebase follow **kebab-case** naming convention:

**Frontend Files:**

- **Pages**: `login.tsx`, `signup.tsx`, `job-edit.tsx`
- **Components**: `app-sidebar.tsx`, `job-form-view.tsx`, `form-question-card.tsx`
- **Hooks**: `use-copy-to-clipboard.ts`, `use-typewriter.ts`, `use-status-typewriter.ts`
- **Contexts**: `auth-context.tsx`
- **Library/Utils**: `api.ts`, `query-client.ts`, `supabase.ts`
- **Root App**: `app.tsx`, `main.tsx`

**Backend Files:**

- **All backend files use kebab-case**: `db-connection.ts`, `rls-context.ts`, `error-handler.ts`

**Shared Files:**

- **Lowercase**: `schema.ts`, `types.ts`

**Test Files:**

- **Always colocated** with source files (not in separate test directories)
- **Use `.test.ts` suffix**: `rbac.test.ts`, `paths.test.ts`, `validate-response.test.ts`
- **Never use `.spec.ts`**

**Exceptions:**

- **UI library components** (shadcn/ui): Already use kebab-case (`button.tsx`, `card.tsx`, etc.)
- **Configuration files**: Follow standard conventions (`package.json`, `tsconfig.json`, `tailwind.config.ts`)

### Code Conventions

- When making changes to files, first understand the file's code conventions. Mimic code style, use existing libraries and utilities, and follow existing patterns
- NEVER assume that a given library is available, even if it is well known. Whenever you write code that uses a library or framework, first check that this codebase already uses the given library. For example, you might look at neighboring files, or check the package.json (or cargo.toml, and so on depending on the language)
- When you create a new component, first look at existing components to see how they're written; then consider framework choice, naming conventions, typing, and other conventions
- When you edit a piece of code, first look at the code's surrounding context (especially its imports) to understand the code's choice of frameworks and libraries. Then consider how to make the given change in a way that is most idiomatic
- Always follow security best practices. Never introduce code that exposes or logs secrets and keys. Never commit secrets or keys to the repository
  - Integrations can help you to manage API keys and secrets, so you should always try to use them as much as possible

### Codebase Research

- Explore before editing: Start by exploring the codebase structure using `ls` to understand the file organization and identify relevant files. Then use `read` to examine files thoroughly before making any modifications
- Read comprehensively: When reading files, use large chunks of 500+ lines at a time. This provides better context and is more efficient than multiple small reads
- Trace dependencies: Follow the import chain by reading relevant files, imported modules, and dependent components to fully understand how your changes will impact the system

### Editing Rules

- When editing text using the `edit` tool, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string
- The edit will FAIL if `old_string` is not unique in the file. Provide a larger string with more surrounding context to make it unique
- When editing a file, remember that other related files may also require updates. Aim for a comprehensive set of changes

## TypeScript Coding Standards

**For comprehensive TypeScript, React, and backend coding standards, see the skills file:**

📚 **[TypeScript Coding Standards](.claude/skills/typescript-standards.md)**

This file contains detailed guidance on:

- Type annotations, type guards, and validation
- Code style and formatting rules
- JSDoc requirements (all functions must have JSDocs)
- React component structure and hooks
- Frontend data fetching with TanStack Query
- Backend route structure and storage patterns
- Error handling (frontend and backend)
- Security standards (input validation, XSS prevention, SQL injection prevention)
- Testing patterns

## AI SDK Development

**For AI SDK v5 development standards and patterns, see the skills file:**

📚 **[AI SDK v5 Development](.claude/skills/ai-sdk.md)**

**CRITICAL**: Never assume you know how the AI SDK works. Always consult the official documentation at https://ai-sdk.dev/docs/ before implementing any AI features.

Key documentation links:

- **Main Docs**: https://ai-sdk.dev/docs/
- **AI SDK Core** (Backend): https://ai-sdk.dev/docs/ai-sdk-core
- **AI SDK UI** (React): https://ai-sdk.dev/docs/ai-sdk-ui

This file contains guidance on:

- Package structure and imports
- Common v4 to v5 migration pitfalls
- Environment variable configuration
- Message conversion patterns
- Documentation references

**AI Simulator Wrapper:**

- All LLM calls must import `generateObject`/`generateText` from `server/utils/ai.ts` (not `ai` directly)
- The wrapper requires a `simulatedResponse` parameter and returns it when `AI_SIMULATOR_ENABLED=true`
- Defaults to enabled in development, disabled in production

## Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (tsx + vite)
npm run build           # Build both client and server for production
npm start               # Run production build
npm run check           # Type-check without emitting files

# Code Quality
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes

# Database
npm run db:generate     # Generate SQL migration files from schema changes
npm run db:migrate      # Run migrations, RLS policies, and permissions
npm run seed            # Seed database with test data
# Note: Migrations run via pre-deploy command in production (npm run db:migrate)
# Note: RLS and permissions setup via SQL scripts (see DEPLOYMENT.md)

# Supabase (Local Development)
npm run supabase:start    # Start local Supabase instance
npm run supabase:stop     # Stop local Supabase
npm run supabase:status   # Check Supabase status
npm run supabase:reset    # Reset database to clean state

# Testing - Unit/Integration (Vitest)
npm test                # Run tests in watch mode
npm run test:ui         # Open Vitest UI
npm run test:coverage   # Generate coverage report

# Testing - E2E (Playwright)
# Prerequisites: Supabase and dev server must be running
npm run test:e2e        # Run end-to-end tests
npm run test:e2e:ui     # Open Playwright UI
npm run test:e2e:debug  # Run tests with headed browser
npm run test:e2e:report # View test report

# Email Templates (React Email)
npm run email:dev       # Preview email templates at localhost:4001
npm run email:build     # Build email templates to dist/emails/
```

### Running Single Tests

```bash
# Vitest (unit/integration)
vitest path/to/test-file.test.ts           # Run specific test file
vitest path/to/test-file.test.ts -t "test name"  # Run specific test

# Playwright (E2E)
npx playwright test path/to/test.spec.ts   # Run specific E2E test
npx playwright test --headed               # Run with visible browser
```

## Architecture

### Monorepo Structure

- **`client/`** - React SPA (Vite + TailwindCSS 4)
  - Uses Wouter for routing (lightweight alternative to React Router)
  - Radix UI + shadcn/ui component library
  - TanStack Query for server state management
  - Path alias: `@/*` → `./client/src/*`

- **`server/`** - Express API server
  - `index.ts` - Main entry point, server setup
  - `routes.ts` - Main route registration
  - `routes/` - Modularized route handlers (webhooks, candidates, etc.)
  - `storage/` - Database access layer (implements `IStorage` interface)
  - `middleware/` - Request processing pipeline:
    - `db-connection.ts` - **CRITICAL**: Must run before RLS middleware
    - `rls-context.ts` - Sets PostgreSQL session variables for multi-tenancy
    - `rbac-context.ts` - Role-based access control context
    - `supabase-auth.ts` - Authentication middleware
    - `error-handler.ts` - Global error handling
  - `services/` - External integrations (LaunchDarkly, AI, email, SMS, etc.)
  - `prompts/` - Centralized AI prompts (TypeScript files for easy PM editing)
  - `queues/` - BullMQ background job definitions
  - `utils/` - Shared utilities and helpers
  - `scripts/` - Database and utility scripts
  - `bull-board.ts` - Job queue monitoring dashboard
  - `vite.ts` - Vite dev server integration

- **`shared/`** - Shared TypeScript types and database schema
  - `schema/` - Drizzle ORM schema split by domain (organizations, users, jobs, applications, stages, etc.)
  - `schema/index.ts` - Barrel export for all schema files (import via `@shared/schema`)
  - `types.ts` - Shared TypeScript types
  - Used by both client and server via path alias: `@shared/*`

- **`scripts/`** - Utility scripts (seed data, docs generation, etc.)

### Database Architecture

**Database Rules (CRITICAL):**

- **NO JSONB ALLOWED** - Use typed columns or arrays instead (e.g., `text[]` for string arrays)
- **Hierarchical tenants use pure materialized paths:**
  - Single source of truth: `path` column only (no `parent_tenant_id` column)
  - No Drizzle relations block for tenants (query using path patterns)
  - Path utilities in `server/utils/paths.ts` for hierarchy operations
- **Universal PostgreSQL support** - Compatible with Neon, Supabase, AWS RDS, etc.

**Multi-Tenant Isolation via RLS (Organization-Based Read-Only + Candidate Access):**

- **READ ISOLATION ONLY**: RLS enforces organization boundaries for SELECT queries only (37 policies)
- **WRITE AUTHORIZATION**: Handled by application-layer RBAC (not database RLS)
- Each request uses a **dedicated database connection** (not pooled) to preserve PostgreSQL session variables
- Session variables: `app.user_id` and `app.user_organization_id` (single organization ID, not array)
- **Two RLS helper functions**:
  - `user_has_org_access(org_id)` - Organization users can access data within their organization
  - `user_is_candidate(candidate_user_id)` - Candidates can access their own claimed applications
- **Dual-Policy Pattern**: Applications table uses both organization AND candidate policies (OR logic)
  - Organization users see all applications in their organization
  - Candidates see only applications where `candidate_user_id` matches their user ID
- Organizations are the security boundary; tenants are for internal hierarchy only
- Middleware order is **critical**: `dbConnectionMiddleware` → `setRLSContext` → `setRBACContext` → routes
- **Authentication is REQUIRED**: All requests must have valid Supabase authentication token
- Note: Database owner role bypasses RLS (standard PostgreSQL behavior)

**Application-Layer RBAC:**

- **Role Scopes**: `org` (organization-wide) and `tenant` (tenant-specific)
- **Standard Roles**: Owner (org scope), Admin (tenant scope), Manager (tenant scope), Support (tenant scope)
- **Tenant Path Assignment**: ALL roles (including org-scoped) have a `tenantPath` in `user_roles`
  - Org-scoped roles are assigned to the root tenant path (e.g., `/${rootTenantId}/`)
  - This grants access to all descendant tenants via materialized path prefix matching
- **Permission Checking**: Uses `isPathAccessible(roleTenantPath, targetPath)` for both scope types
- **RBAC v2 API** (`server/services/rbac-v2/`):
  - `user(auth).can(action, resource).for(paths)` - Check if user can perform action on specific paths
  - `user(auth).has(action, resource)` - Get all paths user has permission for

**Key Database Patterns:**

- Tenant hierarchy uses materialized paths with tenant IDs (`/${rootTenantId}/` or `/${rootTenantId}/${childTenantId}/`)
- Multi-dimensional scoring for screening calls (scoring criteria → dimensions → questions)
- Type-safe question/answer system using discriminated unions (boolean, multichoice, slider, single_choice, file, commute)
- Stage-based application workflow tracking current stage and history
- **Screening Interview System**:
  - `screening_interview_stages` - Configuration for AI agent automation thresholds
  - `screening_interview_stage_questions` - Text prompts the AI agent asks
  - `screening_interview_question_criteria` - Multi-dimensional scoring rubrics (e.g., "Relevance", "Depth", "Self-awareness")
  - `screening_calls` - Call records with transcript, audio URL, and webhook data
  - `screening_call_question_answers` - Snapshotted Q&A with candidate responses
  - `screening_call_criterion_scores` - AI-evaluated scores (0-10) with reasoning for each dimension
- **Form Stage System**:
  - `form_stages` - Form-based application stages
  - `form_stage_questions` - Configurable questions with auto-reject criteria support
  - `form_stage_answers` - Snapshotted answers preserving question state at submission time
  - Supports critical questions that auto-reject applications (e.g., commute time limits, required qualifications)
- **Multi-channel Communication Tracking**:
  - Agent calls (Eleven Labs + Twilio) with transcript storage and cost tracking
  - SMS messages (Twilio) with delivery status and error tracking via `sms_messages` table
  - All messaging linked to application stages

**Critical Functions:**

- **`getDb()`**: Returns request-scoped database instance from AsyncLocalStorage. Throws error if no connection available (must be called within request context)
- **`getUnsafeAdminDb()`**: Returns admin database connection that **BYPASSES ALL RLS POLICIES**. Only use for system operations, middleware setup, or explicit admin tasks. **SECURITY RISK**: Bypasses tenant isolation!
- User pool (default): Max 10 connections, respects RLS policies
- Admin pool: Max 5 connections, bypasses all RLS policies (requires `DATABASE_ADMIN_URL`)

### Build System

**Development:**

- Client: Vite dev server with HMR
- Server: tsx with Node.js for hot reload
- Both run concurrently via `npm run dev`

**Production:**

- Client: Vite builds to `dist/public/`
- Server: esbuild bundles to `dist/index.js`
- Single Express server serves both API and static client files on port 4000 (firewalled, cannot use other ports)

### Environment Configuration

**CRITICAL: All environment variable access MUST use centralized configuration files.**

The project uses type-safe, validated environment configuration to ensure the application fails fast at startup if required variables are missing.

**Configuration Files:**

- **`server/config.ts`** - Backend environment variables
  - Validates all environment variables at module load time using Zod
  - Exports typed `config` object with categorized variables
  - Fails immediately with helpful error messages if required variables are missing

- **`client/src/config.ts`** - Frontend environment variables
  - Validates frontend-only variables (VITE\_\* prefixed)
  - Exports typed `config` object
  - Fails immediately if required Supabase credentials are missing

**Configuration Structure (Backend):**

```typescript
import { config } from "./config";

// Access configuration values
config.database.url; // DATABASE_URL
config.database.adminUrl; // DATABASE_ADMIN_URL
config.database.appUserPassword; // APP_USER_PASSWORD
config.database.appReadonlyPassword; // APP_READONLY_PASSWORD
config.server.port; // PORT (defaults to 4000)
config.server.nodeEnv; // NODE_ENV (defaults to "development")
config.redis.url; // REDIS_URL (defaults to localhost in dev)
config.supabase.url; // SUPABASE_URL (optional)
config.supabase.anonKey; // SUPABASE_ANON_KEY (optional)
config.openai.apiKey; // OPENAI_API_KEY (optional)
config.elevenlabs.apiKey; // ELEVENLABS_API_KEY (optional)
config.elevenlabs.agentId; // ELEVENLABS_AGENT_ID (optional)
config.elevenlabs.agentPhoneNumberId; // ELEVENLABS_AGENT_PHONE_NUMBER_ID (optional)
config.googleMaps.apiKey; // GOOGLE_MAPS_API_KEY (optional)
config.twilio.accountSid; // TWILIO_ACCOUNT_SID (optional)
config.twilio.authToken; // TWILIO_AUTH_TOKEN (optional)
// Note: SMS is sent from alphanumeric sender ID "TeamLily"
config.launchdarkly.sdkKey; // LAUNCHDARKLY_SDK_KEY (optional)
config.cloudflare.tunnelToken; // TUNNEL_TOKEN (optional)
config.logging.maxLogLength; // LOG_MAX_LENGTH (optional)
```

**Configuration Structure (Frontend):**

```typescript
import { config } from "@/config";

// Access configuration values
config.supabase.url; // VITE_SUPABASE_URL (required)
config.supabase.anonKey; // VITE_SUPABASE_ANON_KEY (required)
config.googleMaps.apiKey; // VITE_GOOGLE_MAPS_API_KEY (optional)
config.launchdarkly.clientSideId; // VITE_LAUNCHDARKLY_CLIENT_SIDE_ID (optional)
```

**Rules:**

1. **NEVER access `process.env` or `import.meta.env` directly** - Always import from config files
2. **Backend**: Import from `server/config.ts`
3. **Frontend**: Import from `client/src/config.ts` (note the `@/config` alias)
4. **Validation happens at startup** - App won't run with missing required variables
5. **Type safety** - TypeScript knows exact types of all config values

**Benefits:**

- ✅ **Early validation**: App fails fast at startup instead of at runtime
- ✅ **Type safety**: Autocomplete and type checking for all config values
- ✅ **Single source of truth**: One place to see all environment requirements
- ✅ **Better error messages**: Clear indication of which variables are missing
- ✅ **Easier testing**: Can mock entire config object
- ✅ **Documentation**: Config files serve as living documentation

See `.claude/skills/typescript-standards.md` for detailed coding standards about environment variable usage.

### Testing

- **Vitest** for unit and integration tests
  - Test environment: `happy-dom` (lightweight DOM implementation)
  - Setup file: `test/setup.ts` (loaded before all tests)
  - Testing libraries: `@testing-library/react` + `@testing-library/jest-dom`
  - Coverage provider: v8
  - Test files: Colocated with source using `.test.ts` suffix
- **Playwright** for end-to-end tests
  - Test directory: `e2e/`
  - Runs on port 4000 (same as dev server)
  - Chromium browser only in CI
  - **Prerequisites**: Requires infrastructure to be running before tests:
    - Local Supabase: `npm run supabase:start`
    - Redis: `docker-compose up -d redis`
    - Dev server: `npm run dev`
  - **Test Isolation via RLS**: Each test worker creates isolated organizations, users, and test data
  - **Phone Number Allocation**: Test phone numbers from `scripts/seed/test-phone-numbers.ts`
    - 100 test phone numbers configured in Supabase to bypass OTP verification (code: "123456")
    - E2E tests allocate 2 phone numbers per worker from this pool
    - Supports up to 50 parallel test workers
  - Tests generate random user data per run (names, emails) with deterministic phone number allocation
  - Tests automatically clean up their data after completion

### Background Jobs (BullMQ + Redis)

- **Queue System**: BullMQ for background job processing
- **Redis**: Required in production, defaults to localhost:6379 in development
- **Queue Monitoring**: Bull Board dashboard at `/admin/queues` (requires authentication)
- **Job Definitions**: Located in `server/queues/`
- **Configuration**: Set `REDIS_URL` environment variable for production

**Common Use Cases:**

- Sending screening call invitations
- Processing application submissions
- Email/SMS notifications
- Data exports and reports

**Development:**

```bash
docker-compose up -d redis  # Start Redis via Docker Compose
# Access dashboard at http://localhost:4000/admin/queues
docker-compose down  # Stop Redis when done
```

### Email Development (Mailpit)

- **Local email capture**: Mailpit captures all outbound emails during development
- **Web UI**: View captured emails at `http://localhost:54324`
- **SMTP Port**: 54325 (used by Nodemailer in development mode)
- **API Port**: 54324 (used by E2E tests to verify emails)

**Email Worker:**

- Uses Nodemailer + Mailpit SMTP in development (`NODE_ENV=development`)
- Uses Postmark API in production
- Queue name: `email-messages`
- Supports retry with exponential backoff

**E2E Testing:**

- Use `waitForEmail(recipientEmail, { subjectContains: "..." })` from `e2e/test-utils.ts`
- Fetches emails from Mailpit API (`/api/v1/search?query=to:email`)

## UI/Design Preferences

- **Default theme**: Light mode
- **Primary accent**: Pink/Red (#EB3D63)
- **Font stack**: Inter for UI, JetBrains Mono for code
- Fully responsive design with Radix UI + shadcn/ui components
- Dynamic dark/light mode with smooth transitions

## Common Development Workflows

### Adding a New Database Table

1. **Define schema** in the appropriate file under `shared/schema/`:
   - Create table with `pgTable()` in the relevant domain file (e.g., `jobs.ts`, `users.ts`)
   - Define relations in `relations.ts` if needed
   - Create insert schema with `createInsertSchema().omit({ id: true, createdAt: true })`
   - Create select schema with `createSelectSchema()` - **CRITICAL**: Coerce all date/timestamp fields with `z.coerce.date()`
   - Export insert and select types
   - Re-export from `shared/schema/index.ts` if adding a new domain file

2. **Generate migration files**:
   - Run `npm run db:generate` to create SQL migration files
   - Review generated SQL in `migrations/` folder
   - Commit migration files to git
   - Migrations will automatically run on next app startup

3. **Update storage interface** in `server/storage/index.ts`:
   - Add CRUD methods to `IStorage` interface
   - Implement methods in `DatabaseStorage` class using `getDb()`

4. **Create API routes** in `server/routes/` or `server/routes.ts`:
   - Validate requests with insert schemas
   - Delegate to storage layer
   - Validate responses with `validateResponse()` helper

5. **Frontend integration**:
   - Use `createValidatedQuery()` for GET requests
   - Use `createValidatedMutation()` for POST/PATCH/DELETE
   - Add skeleton loading states

### Working with Screening Interviews

**Backend setup** for AI agent screening:

- Configure stage in `screening_interview_stages` with auto-advance/reject thresholds
- Add questions to `screening_interview_stage_questions` (text prompts for AI)
- Generate scoring criteria via `question-criteria-generator.ts` service (creates multi-dimensional rubrics)
- Queue calls via `call-queue.ts` using BullMQ
- Process webhook callbacks from Eleven Labs to store transcripts
- Background job scores transcripts using `transcript-scorer.ts` service

**Frontend components**:

- `screening-call-booking.tsx` - Schedule/initiate calls
- `screening-stage-config.tsx` - Configure automation and questions
- Display scores on application detail page

### Implementing Form Stages with Critical Questions

**Critical questions** auto-reject applications that don't meet criteria:

- Boolean: Must be true/false
- Slider: Must be within min/max range
- Multichoice: Must select specific options
- Single choice: Must select specific option
- Commute: Max travel time or distance (can be bypassed with "willing to relocate")

**Example flow**:

1. Create form stage in `form_stages`
2. Add questions to `form_stage_questions` with `isCritical: true`
3. Set critical criteria (e.g., `criticalCommuteMaxCarMin: 30` for 30-minute max drive)
4. Frontend uses `form-question-card.tsx` to render questions
5. On submission, backend validates answers against criteria in storage layer
6. Failed applications set `status: 'failed'`, progressed ones set `status: 'progressed'`

### Building Email Templates with React Email

**Email templates are built using React Email** - write emails as React components with full type safety and live preview.

**Directory Structure**:

- `server/emails/` - Email template components (e.g., `password-reset.tsx`)
- `scripts/build-emails.ts` - Build script that compiles React to HTML
- `supabase/templates/` - Compiled HTML templates (used by local dev and copied to dist/ during build)

**Development Workflow**:

1. **Create a new email template** in `server/emails/`:

   ```tsx
   // server/emails/welcome.tsx
   import * as React from "react";
   import {
     Html,
     Head,
     Body,
     Container,
     Heading,
     Text,
     Button
   } from "@react-email/components";

   export default function WelcomeEmail() {
     return (
       <Html>
         <Head />
         <Body style={main}>
           <Container>
             <Heading>Welcome!</Heading>
             <Text>Thanks for joining us.</Text>
             <Button href="{{ .ConfirmationURL }}">Get Started</Button>
           </Container>
         </Body>
       </Html>
     );
   }
   ```

2. **Preview during development**:

   ```bash
   npm run email:dev
   # Opens preview at http://localhost:4001
   # Live reload as you edit templates
   ```

3. **Build templates**:

   ```bash
   npm run email:build
   # Compiles React components to supabase/templates/*.html
   # Rebuild dev container to reload templates in local Supabase
   ```

4. **Deploy**:
   - **Local development**: Templates automatically loaded from `supabase/templates/` via `config.toml` (rebuild dev container to reload)
   - **Production**: `npm run build` copies templates to `dist/templates/` for deployment
   - **Supabase Cloud dashboard**: Copy template HTML from `supabase/templates/` and paste into Dashboard → Authentication → Email Templates
   - Supabase variables like `{{ .ConfirmationURL }}` are preserved in the output

**Template Guidelines**:

- Use Supabase template variables: `{{ .ConfirmationURL }}`, `{{ .Token }}`, etc.
- Match app design: pink accent (#EB3D63), Inter font, clean layout
- Mobile-responsive by default (React Email handles email client compatibility)
- All templates must import `* as React` at the top
- Use inline styles via style objects (React Email converts to email-safe HTML)

**Build Script and Config**:

- Update `scripts/build-emails.ts` when adding new templates (import and render each)
- Password reset template configured in `supabase/config.toml` as `[auth.email.template.recovery]`
- Other email templates (invite, confirmation, etc.) can be added to `config.toml` as needed

## Key Conventions

1. **Database queries must use `getDb()`** - Never import `db` directly; respect request-scoped connections for RLS
2. **NO JSONB columns** - Use typed columns or PostgreSQL arrays (e.g., `text[]`)
3. **Tenant hierarchy**: Use materialized path queries (`server/utils/paths.ts`), not Drizzle relations
4. **Validation**:
   - Backend: ALL endpoints validate requests (Zod insert schemas) and responses (`validateResponse` helper)
   - Frontend: ALL queries use `createValidatedQuery` and `createValidatedMutation` from `@/lib/api`
5. **Path aliases**: Use `@/*` (client), `@shared/*` (both) instead of relative imports
6. **Answer snapshots**: When storing answers (screening calls or forms), snapshot the question text and configuration to preserve historical context even if questions are later modified or deleted

## Deployment

**Production Stack:**

- **Application**: Render Web Service (fully managed Node.js hosting)
- **Database**: Supabase Cloud (PostgreSQL + Auth)
- **Redis**: Render Managed Redis (BullMQ job queues)
- **CI/CD**: Auto-deploy from GitHub main branch

**Deployment Files:**

- `render.yaml` - Infrastructure-as-code blueprint defining web service and Redis
- `.env.production.example` - Template for all required environment variables
- `DEPLOYMENT.md` - Complete step-by-step deployment guide

**Key Requirements:**

- Supabase project with database connection strings (direct connection on port 5432)
- All API keys configured as environment variables in Render dashboard
- Generate migrations locally (`npm run db:generate`), commit to git, and deploy
- Migrations run via Render pre-deploy command (`scripts/run-migrations.ts`)

**Auto-Deployment:**

- Push to `main` branch triggers automatic rebuild and deployment
- Zero-downtime deployments with health checks
- Render monitors `/api/health` endpoint

**Monitoring:**

- Application logs and metrics in Render dashboard
- Bull Board job queue dashboard at `/admin/queues`
- Supabase database metrics and backups

See `DEPLOYMENT.md` for complete deployment instructions and troubleshooting guide.

## Environment Variables

Required:

- `DATABASE_URL` - PostgreSQL connection string using `app_user` role (respects RLS policies). Format: `postgresql://app_user:PASSWORD@host:5432/database`
- `DATABASE_ADMIN_URL` - PostgreSQL connection string using `postgres` superuser role (bypasses RLS). Format: `postgresql://postgres:PASSWORD@host:5432/database`
- `APP_USER_PASSWORD` - Password for the `app_user` database role. Used by `grant-permissions.sql` script to create/update the role. Must match password in `DATABASE_URL`
- `APP_READONLY_PASSWORD` - Password for the `app_readonly` database role. Read-only access for analytics/reporting. Must match password used in any read-only connection strings
- `DATABASE_READONLY_URL` - PostgreSQL connection string using `app_readonly` role (SELECT-only, for Lily chat database queries). Format: `postgresql://app_readonly:PASSWORD@host:5432/database`
- `PORT` - Server port (defaults to 4000)

Optional:

- `NODE_ENV` - Set to "development" or "production"
- `REDIS_URL` - Redis connection string for BullMQ job queues (required in production, defaults to localhost in development)
- Supabase configuration (if using Supabase auth):
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_ANON_KEY` - Supabase anonymous/public key
  - `VITE_SUPABASE_URL` - (Frontend) Same as SUPABASE_URL
  - `VITE_SUPABASE_ANON_KEY` - (Frontend) Same as SUPABASE_ANON_KEY
- OpenAI configuration:
  - `OPENAI_API_KEY` - API key for OpenAI services
- ElevenLabs configuration (for outbound calling via Twilio):
  - `ELEVENLABS_API_KEY` - ElevenLabs API authentication key
  - `ELEVENLABS_AGENT_ID` - Agent ID for conversational AI
  - `ELEVENLABS_AGENT_PHONE_NUMBER_ID` - Phone number resource ID for the agent
- Google Maps configuration (for commute time calculations):
  - `GOOGLE_MAPS_API_KEY` - Google Maps Distance Matrix API key (required for commute questions feature)
  - `VITE_GOOGLE_MAPS_API_KEY` - (Frontend) Same as GOOGLE_MAPS_API_KEY
- Twilio configuration (for SMS notifications):
  - `TWILIO_ACCOUNT_SID` - Twilio account identifier
  - `TWILIO_AUTH_TOKEN` - Twilio authentication token
  - Note: SMS is sent from alphanumeric sender ID "TeamLily" (not available in US/Canada)
- Application Base URL configuration:
  - `APP_BASE_URL` - Base URL for short application links in SMS and emails (defaults to `http://localhost:4000` in development, required in production)
- LaunchDarkly configuration (for feature flags):
  - `LAUNCHDARKLY_SDK_KEY` - Server-side SDK key for LaunchDarkly
  - `VITE_LAUNCHDARKLY_CLIENT_SIDE_ID` - (Frontend) Client-side ID for LaunchDarkly React SDK
- Sentry configuration (for error tracking):
  - `SENTRY_DSN` - Backend Sentry DSN
  - `VITE_SENTRY_DSN` - Frontend Sentry DSN
- Cloudflare Tunnel configuration (for local webhook testing):
  - `TUNNEL_TOKEN` - Tunnel authentication token (per developer, see `.cloudflared/README.md`)
