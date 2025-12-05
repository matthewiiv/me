---
name: TypeScript Coding Standards
description: Comprehensive TypeScript, React, and backend coding standards for this project
---

# TypeScript Coding Standards

This skills file contains comprehensive TypeScript, React, and backend coding standards for this project.

## Comments Rule

**IMPORTANT: DO NOT ADD INLINE COMMENTS unless asked.**

Never add inline code comments unless the user explicitly requests them. This keeps code clean and reduces noise.

**EXCEPTION: Always add JSDocs to functions.**

All functions (both named functions and arrow functions assigned to constants) must have JSDoc comments that describe:

- What the function does
- Parameters (using @param)
- Return value (using @returns)
- Any thrown errors (using @throws)

```typescript
// GOOD: JSDoc for function
/**
 * Calculates the total price for an order
 * @param price - The unit price
 * @param quantity - The quantity ordered
 * @returns The total price
 */
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// GOOD: JSDoc for arrow function
/**
 * Retrieves a user by their ID
 * @param id - The user ID
 * @returns The user object or null if not found
 */
const getUserById = async (id: string): Promise<User | null> => {
  return await storage.getUser(id);
};

// GOOD: JSDoc with @throws
/**
 * Validates and processes user input
 * @param data - The user input data
 * @returns Validation result with errors if any
 * @throws {ValidationError} When data format is invalid
 */
function validateUserInput(data: UserInput): ValidationResult {
  if (!isValidFormat(data)) {
    throw new ValidationError("Invalid format");
  }
  return { isValid: true, errors: [] };
}

// BAD: No JSDoc
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// BAD: Inline comments instead of JSDoc
function calculateTotal(price: number, quantity: number): number {
  // Calculate the total
  return price * quantity;
}
```

## Code Style

### Type Annotations

**Rule: Prefer explicit types for function parameters and return values**

```typescript
// GOOD: Explicit types
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// BAD: Implicit any
function calculateTotal(price, quantity) {
  return price * quantity;
}

// GOOD: Explicit return type
const getUserById = async (id: string): Promise<User | null> => {
  return await storage.getUser(id);
};

// ACCEPTABLE: Type inference for simple variables
const count = 5; // TypeScript infers number
const items = ["a", "b", "c"]; // TypeScript infers string[]
```

### Import Statements

**Rule: NO inline imports - ALL imports must be at the top of the file**

Never use dynamic imports (`await import()`) or require statements inside functions or class bodies. All imports must be at the top level of the file.

```typescript
// GOOD: Top-level imports
import express from "express";
import { eq } from "drizzle-orm";
import { getUnsafeAdminDb } from "../db";
import { DatabaseStorage } from "../storage/index";
import { screeningCalls, smsMessages } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.post("/api/webhooks/example", async (req, res) => {
    const adminDb = getUnsafeAdminDb();
    const storage = new DatabaseStorage();

    const [record] = await adminDb
      .select()
      .from(screeningCalls)
      .where(eq(screeningCalls.id, id))
      .limit(1);

    res.json(record);
  });
}

// BAD: Inline imports
export function registerRoutes(app: Express) {
  app.post("/api/webhooks/example", async (req, res) => {
    const { DatabaseStorage } = await import("../storage/index"); // NEVER!
    const { screeningCalls } = await import("@shared/schema"); // NEVER!
    const { eq } = await import("drizzle-orm"); // NEVER!

    const adminDb = getUnsafeAdminDb();
    const storage = new DatabaseStorage();

    const [record] = await adminDb
      .select()
      .from(screeningCalls)
      .where(eq(screeningCalls.id, id))
      .limit(1);

    res.json(record);
  });
}
```

**Why this rule exists:**

- **Performance**: Inline imports add overhead to every function call
- **Type safety**: TypeScript can't analyze dynamic imports as well
- **Code clarity**: Top-level imports show all dependencies at a glance
- **Tree shaking**: Bundlers can better optimize top-level imports
- **Consistency**: Matches industry standards and ESLint recommendations

**Exception: Code splitting**

The ONLY valid use of dynamic imports is for intentional code splitting in frontend applications:

```typescript
// ACCEPTABLE: Lazy loading a large component
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### Avoid `any` and Type Assertions

**Rule: Never use `any` unless absolutely necessary**

**Rule: Never use type assertions (casting) - use type guards instead**

Type assertions (`as` keyword or `<Type>` syntax) bypass TypeScript's type checking and can hide bugs. This rule is enforced by ESLint.

```typescript
// BAD: Using any
function processData(data: any) {
  return data.value;
}

// BAD: Using type assertion (casting)
function processData(data: unknown) {
  return (data as DataStructure).value; // ESLint will error!
}

// GOOD: Use type guards
function isDataStructure(data: unknown): data is DataStructure {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data
  );
}

function processData(data: unknown) {
  if (!isDataStructure(data)) {
    throw new Error('Invalid data structure');
  }
  return data.value; // TypeScript knows data is DataStructure
}

// BETTER: Use proper types from the start
interface DataStructure {
  value: string;
}

function processData(data: DataStructure) {
  return data.value;
}

// BAD: Casting in React props
<SidebarProvider style={sidebarStyle as React.CSSProperties}> // ESLint error!

// GOOD: Proper typing
const sidebarStyle: React.CSSProperties = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
} as const;

<SidebarProvider style={sidebarStyle}> // No casting needed
```

### Type vs Interface

**Rule: Use `interface` for object shapes, `type` for unions/intersections**

```typescript
// GOOD: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// GOOD: Type for unions
type Status = "pending" | "active" | "closed";

// GOOD: Type for complex types
type Result<T> = { success: true; data: T } | { success: false; error: string };

// GOOD: Extending interfaces
interface Employee extends User {
  department: string;
  role: string;
}
```

### Nullability

**Rule: Always handle null/undefined explicitly**

```typescript
// BAD: Assuming value exists
function getUserName(user: User) {
  return user.name.toUpperCase(); // Crashes if name is null
}

// GOOD: Optional chaining and nullish coalescing
function getUserName(user: User) {
  return user.name?.toUpperCase() ?? "Unknown";
}

// GOOD: Type guards
function getUserName(user: User | null): string {
  if (!user) return "Unknown";
  return user.name;
}
```

### Enums vs Union Types

**Rule: Prefer union types over enums**

```typescript
// BAD: Enum (adds runtime code)
enum Status {
  Pending = "pending",
  Active = "active",
  Closed = "closed"
}

// GOOD: Union type (no runtime overhead)
type Status = "pending" | "active" | "closed";

// GOOD: With const object for iteration if needed
const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  CLOSED: "closed"
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

### Function Length

**Rule: Keep functions small and focused**

```typescript
// GOOD: Single responsibility
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

// ACCEPTABLE: Multiple related checks
function validateUserInput(data: UserInput): ValidationResult {
  const errors: string[] = [];

  if (!validateEmail(data.email)) {
    errors.push("Invalid email");
  }

  if (!validatePassword(data.password)) {
    errors.push("Password too short");
  }

  return { isValid: errors.length === 0, errors };
}
```

### Formatting

- Controlled by ESLint and Prettier. Run `npm run lint` and `npm run format` to fix issues.

### No Magic Numbers

```typescript
// BAD
if (items.length > 10) {
}
setTimeout(callback, 3000);

// GOOD
const MAX_ITEMS = 10;
const TIMEOUT_MS = 3000;

if (items.length > MAX_ITEMS) {
}
setTimeout(callback, TIMEOUT_MS);
```

## Environment Variables

**Rule: NEVER access process.env or import.meta.env directly**

**Rule: ALWAYS import environment variables from centralized config files**

All environment variables must be accessed through centralized configuration files that provide validation, type safety, and fail-fast behavior at startup.

### Backend Environment Variables

```typescript
// GOOD: Import from centralized config
import { config } from "./config";

// Use typed, validated config
const db = postgres(config.database.url);
const port = config.server.port;
const apiKey = config.openai.apiKey;

// BAD: Direct process.env access
const db = postgres(process.env.DATABASE_URL!); // No validation!
const port = process.env.PORT || 4000; // No type safety!
const apiKey = process.env.OPENAI_API_KEY; // May be undefined!
```

### Frontend Environment Variables

```typescript
// GOOD: Import from centralized config
import { config } from "@/config";

// Use typed, validated config
const supabaseClient = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

const { isLoaded } = useLoadScript({
  googleMapsApiKey: config.googleMaps.apiKey || "",
  libraries
});

// BAD: Direct import.meta.env access
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!, // No validation!
  import.meta.env.VITE_SUPABASE_ANON_KEY! // May be undefined!
);

const { isLoaded } = useLoadScript({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  libraries
});
```

### Configuration File Structure

**Backend (server/config.ts):**

```typescript
import { z } from "zod";

// Define schemas with validation messages
const databaseConfigSchema = z.object({
  url: z.string().min(1, "DATABASE_URL must be set"),
  adminUrl: z.string().min(1, "DATABASE_ADMIN_URL must be set")
});

const serverConfigSchema = z.object({
  port: z.coerce.number().default(4000),
  nodeEnv: z.enum(["development", "production", "test"]).default("development")
});

// Compose into complete config schema
const envConfigSchema = z.object({
  database: databaseConfigSchema,
  server: serverConfigSchema
  // ... other config sections
});

// Validate at module load time (fail-fast)
function validateEnv() {
  const rawConfig = {
    database: {
      url: process.env.DATABASE_URL,
      adminUrl: process.env.DATABASE_ADMIN_URL
    },
    server: {
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV
    }
  };

  try {
    return envConfigSchema.parse(rawConfig);
  } catch (error) {
    // Log errors and exit immediately
    console.error("Environment variable validation failed");
    throw error;
  }
}

// Export validated, typed config
export const config = validateEnv();
export type Config = z.infer<typeof envConfigSchema>;
```

**Frontend (client/src/config.ts):**

```typescript
import { z } from "zod";

// Validate VITE_* prefixed variables
const supabaseConfigSchema = z.object({
  url: z.string().min(1, "VITE_SUPABASE_URL must be set"),
  anonKey: z.string().min(1, "VITE_SUPABASE_ANON_KEY must be set")
});

const googleMapsConfigSchema = z.object({
  apiKey: z.string().optional() // Optional integrations
});

const envConfigSchema = z.object({
  supabase: supabaseConfigSchema,
  googleMaps: googleMapsConfigSchema
});

function validateEnv() {
  const rawConfig = {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    googleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }
  };

  return envConfigSchema.parse(rawConfig);
}

export const config = validateEnv();
```

### Benefits of Centralized Configuration

**Type Safety:**

- TypeScript knows exact shape of config object
- Autocomplete for all configuration properties
- Compile-time errors for typos or missing properties

**Validation:**

- Zod validates all variables at startup
- Application fails fast if required variables are missing
- Clear error messages show exactly what's wrong

**Maintainability:**

- Single source of truth for all environment variables
- Easy to see all configuration at a glance
- Simple to add new variables (update schema, update validation)

**Security:**

- No accidental undefined values
- Required variables can't be missing in production
- Optional variables have proper fallback handling

**Developer Experience:**

- No need to remember variable names
- IDE autocomplete for all config properties
- Documentation through Zod schemas and error messages

### Common Patterns

**Optional API Keys:**

```typescript
// Backend
const elevenlabsConfigSchema = z.object({
  apiKey: z.string().optional(),
  agentId: z.string().optional()
});

// Usage
if (config.elevenlabs.apiKey) {
  // Feature is available
  await callElevenLabsAPI(config.elevenlabs.apiKey);
} else {
  // Gracefully degrade or show error
  console.warn("ElevenLabs API key not configured");
}
```

**Environment-Specific Defaults:**

```typescript
const redisConfigSchema = z.object({
  url: z
    .string()
    .optional()
    .transform((val) => val || "redis://localhost:6379")
});

// Defaults to localhost in development, required in production
```

**Port Configuration:**

```typescript
const serverConfigSchema = z.object({
  port: z.coerce.number().default(4000) // Coerce string to number
});
```

### Migration Guide

When adding environment variables to the centralized config:

1. **Add to schema** in `server/config.ts` or `client/src/config.ts`
2. **Update validation** in the appropriate schema object
3. **Update `.env.example`** with the new variable
4. **Remove direct access** from all files using the variable
5. **Import config** and use `config.category.property` instead

```typescript
// Before migration
const apiKey = process.env.OPENAI_API_KEY;

// After migration
import { config } from "./config";
const apiKey = config.openai.apiKey;
```

### References

See `CLAUDE.md` for complete list of environment variables and configuration structure.

## File Organization

### Project Structure

```
project/
├── client/              # Frontend code
│   └── src/
│       ├── components/  # Reusable UI components
│       │   └── ui/     # shadcn/ui components
│       ├── pages/      # Page components (routes)
│       ├── lib/        # Utilities and helpers
│       └── hooks/      # Custom React hooks
├── server/             # Backend code
│   ├── routes.ts      # API route handlers
│   ├── storage.ts     # Data storage layer
│   └── ai.ts          # AI/external service integrations
└── shared/            # Code shared between client/server
    └── schema.ts      # Database schema and types
```

### File Naming

```typescript
// Component files: PascalCase
Button.tsx;
UserProfile.tsx;
JobCard.tsx;

// Utility files: camelCase
queryClient.ts;
formatDate.ts;
validation.ts;

// Page files: kebab-case or PascalCase
Dashboard.tsx;
Jobs.tsx;
not - found.tsx;

// Type/interface files: camelCase
types.ts;
schema.ts;
```

## Naming Conventions

### Variables

```typescript
// camelCase for variables and functions
const userName = "John";
const totalCount = 42;

function calculateTotal() {}
```

### Constants

```typescript
// SCREAMING_SNAKE_CASE for true constants
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com";

// camelCase for objects that won't change reference (but properties might)
const config = {
  apiKey: process.env.API_KEY,
  timeout: 4000
};
```

### Functions

```typescript
// Verbs for functions
function fetchUser() {}
function createJob() {}
function validateInput() {}

// Boolean functions: is/has/can prefix
function isValid() {}
function hasPermission() {}
function canEdit() {}

// Event handlers: handle/on prefix
function handleClick() {}
function onSubmit() {}
```

### React Components

```typescript
// PascalCase for components
function UserCard() {}
function JobListItem() {}

// Props interfaces: ComponentNameProps
interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
}
```

### Type Names

```typescript
// PascalCase for types and interfaces
interface User {}
type Status = "active" | "inactive";

// Suffix for specific type categories
type UserInput = {
  /* ... */
}; // Input types
type UserSelect = {
  /* ... */
}; // Database select types
type UserInsert = {
  /* ... */
}; // Database insert types
```

## Validation

### Schema Requirements

**Rule: All database models MUST have both insert and select Zod schemas**

**Rule: Select schemas MUST coerce date/timestamp fields using z.coerce.date()**

```typescript
// In shared/schema/ (e.g., jobs.ts)
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Define table
export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
  // ...
});

// CRITICAL: Create both insert and select schemas
export const insertJobSchema = createInsertSchema(jobs, {
  // Coerce dates in insert schema
  applicationDeadline: z.coerce.date()
}).omit({
  id: true, // Auto-generated
  createdAt: true,
  updatedAt: true
});

// CRITICAL: Coerce ALL date/timestamp fields in select schemas
export const selectJobSchema = createSelectSchema(jobs, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  applicationDeadline: z.coerce.date()
});

// Derive types
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
```

**Why date coercion is required:**

- Database returns timestamps as strings
- Frontend needs Date objects for manipulation
- Without coercion, validation fails when API returns data
- `z.coerce.date()` converts strings to Date objects automatically

**Common mistake:**

```typescript
// BAD: No date coercion - validation will fail!
export const selectJobStageSchema = createSelectSchema(jobStages);
// createdAt comes back as string, schema expects Date, validation fails

// GOOD: Coerce all date/timestamp fields
export const selectJobStageSchema = createSelectSchema(jobStages, {
  createdAt: z.coerce.date()
});
```

### Zod Validation

**Rule: Validate all external input with Zod**

```typescript
// Backend - Request validation
app.post("/api/jobs", async (req, res) => {
  // Validate request body
  const result = insertJobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.errors
    });
  }

  const job = await storage.createJob(result.data);
  res.json(job);
});

// Frontend form validation
const form = useForm<InsertJob>({
  resolver: zodResolver(
    insertJobSchema.extend({
      // Add frontend-specific validation
      title: z.string().min(5, "Title must be at least 5 characters")
    })
  ),
  defaultValues: {
    title: "",
    department: "",
    location: "",
    status: "draft",
    positions: 1
  }
});
```

### Backend Response Validation

**Rule: ALL backend responses MUST be validated before sending to client**

This catches bugs in the storage layer and ensures type safety throughout the stack.

```typescript
import { validateResponse } from "../utils/validate-response.js";

// GOOD: Validate single object response
app.get("/api/jobs/:id", async (req, res) => {
  const job = await storage.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(validateResponse(selectJobSchema)(job));
});

// GOOD: Validate array response
app.get("/api/jobs", async (req, res) => {
  const jobs = await storage.listJobs();
  res.json(validateResponse(z.array(selectJobSchema))(jobs));
});

// GOOD: Validate complex response with inline schema composition
app.get("/api/jobs/:id", async (req, res) => {
  const job = await storage.getJob(req.params.id);
  const stages = await storage.getJobStages(req.params.id);

  const jobWithStages = { ...job, stages };
  res.json(
    validateResponse(
      selectJobSchema.extend({
        stages: z.array(selectJobStageSchema)
      })
    )(jobWithStages)
  );
});

// BAD: No response validation
app.get("/api/jobs/:id", async (req, res) => {
  const job = await storage.getJob(req.params.id);
  res.json(job); // Missing validation!
});
```

### Frontend Query Validation

**Rule: ALL frontend queries MUST use createValidatedQuery for runtime validation and automatic type inference**

```typescript
import { z } from "zod";
import { selectJobSchema } from "@shared/schema";
import { createValidatedQuery, createValidatedMutation } from "@/lib/api";

// GOOD: Validated query with automatic type inference
const { data: jobs, isLoading } = useQuery({
  queryKey: ["/api/jobs"],
  queryFn: () => createValidatedQuery(z.array(selectJobSchema))("/api/jobs")
  // data is automatically typed as Job[] - no manual type annotation needed!
});

// GOOD: Validated query with query parameters
const { data: job } = useQuery({
  queryKey: ["/api/jobs", jobId],
  queryFn: () =>
    createValidatedQuery(selectJobSchema)("/api/jobs", { id: jobId })
});

// GOOD: Validated mutation
const createJob = useMutation({
  mutationFn: createValidatedMutation(selectJobSchema)("POST", "/api/jobs"),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
  }
});

// GOOD: DELETE mutation with void schema
const deleteJob = useMutation({
  mutationFn: createValidatedMutation(z.void())("DELETE", `/api/jobs/${id}`)
});

// BAD: Manual type annotation instead of validated query
const { data: jobs, isLoading } = useQuery<Job[]>({
  queryKey: ["/api/jobs"]
  // No runtime validation! Type annotation doesn't validate data!
});

// BAD: No validation at all
const { data: jobs } = useQuery({
  queryKey: ["/api/jobs"]
  // No type safety! No runtime validation!
});
```

### Type Guards

**Rule: Use type guards for runtime type checking**

```typescript
// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value
  );
}

// Usage
function processUser(data: unknown) {
  if (!isUser(data)) {
    throw new Error("Invalid user data");
  }
  // TypeScript now knows data is User
  console.log(data.name);
}
```

## React & Frontend Standards

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { User } from '@shared/schema';

// 2. Types/Interfaces
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

// 3. Component
export function UserCard({ user, onEdit }: UserCardProps) {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // 6. Render
  return (
    <div>
      <h3>{user.name}</h3>
      <Button onClick={handleClick} data-testid="button-expand">
        {isExpanded ? 'Collapse' : 'Expand'}
      </Button>
    </div>
  );
}
```

### Hooks Rules

```typescript
// GOOD: Hooks at top level
function Component() {
  const [count, setCount] = useState(0);
  const { data } = useQuery({ queryKey: ['/api/users'] });

  return <div>{count}</div>;
}

// BAD: Conditional hooks
function Component({ shouldFetch }) {
  if (shouldFetch) {
    const { data } = useQuery({ queryKey: ['/api/users'] }); // ERROR!
  }
}

// GOOD: Conditional logic inside hook
function Component({ shouldFetch }) {
  const { data } = useQuery({
    queryKey: ['/api/users'],
    enabled: shouldFetch
  });
}
```

### Data Fetching with TanStack Query

**Rule: Always use createValidatedQuery and createValidatedMutation for type-safe, validated queries**

```typescript
import { z } from "zod";
import { selectJobSchema } from "@shared/schema";
import { createValidatedQuery, createValidatedMutation } from "@/lib/api";

// GOOD: Validated query with automatic type inference
const { data, isLoading, error } = useQuery({
  queryKey: ["/api/jobs"],
  queryFn: () => createValidatedQuery(z.array(selectJobSchema))("/api/jobs")
  // data is automatically typed as Job[] - no manual annotation needed!
});

// GOOD: Hierarchical keys for cache invalidation
const { data } = useQuery({
  queryKey: ["/api/jobs", jobId],
  queryFn: () => createValidatedQuery(selectJobSchema)(`/api/jobs/${jobId}`)
});

// BAD: String interpolation in keys (use separate array elements)
const { data } = useQuery({
  queryKey: [`/api/jobs/${jobId}`] // Harder to invalidate
});

// BAD: Manual type annotation without validation
const { data } = useQuery<Job[]>({
  queryKey: ["/api/jobs"]
  // No runtime validation - type annotation doesn't protect against bad data!
});

// GOOD: Mutation with validation and cache invalidation
const createJob = useMutation({
  mutationFn: createValidatedMutation(selectJobSchema)("POST", "/api/jobs"),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
  }
});

// GOOD: DELETE mutation with void schema
const deleteJob = useMutation({
  mutationFn: createValidatedMutation(z.void())("DELETE", `/api/jobs/${id}`)
});
```

### Loading States & Skeletons

**Rule: ALWAYS use skeleton loaders instead of text loading indicators**

Skeleton loaders provide better UX by showing content layout structure while loading, reducing perceived wait time.

**Pattern: Colocate skeleton components with the components they represent**

```typescript
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const SKELETON_ITEMS = 3;

// Colocated skeleton component
function JobCardSkeleton() {
  return (
    <Card data-testid="skeleton-job-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-md flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
          <Skeleton className="w-9 h-9 rounded-md flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="pt-2 border-t">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// GOOD: Use skeleton in loading state
function JobsList() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: () => createValidatedQuery(z.array(selectJobSchema))("/api/jobs")
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs?.map((job) => <JobCard key={job.id} job={job} />)}
    </div>
  );
}

// BAD: Text loading indicator
function JobsList() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: () => createValidatedQuery(z.array(selectJobSchema))("/api/jobs")
  });

  if (isLoading) {
    return <div>Loading jobs...</div>; // Don't do this!
  }

  return <div>{/* ... */}</div>;
}
```

**Skeleton Guidelines:**

- **Colocation**: Keep skeleton components in the same file as the component they represent
- **Export when reused**: Export skeleton components if they need to be used in multiple files
- **Minimal placeholders**: Show 2-3 skeleton items to indicate loading
- **Detailed shapes**: Match actual content layout (icons, text lines, buttons, etc.)
- **Use base component**: Always use the existing `<Skeleton>` component from `@/components/ui/skeleton`
- **Consistent spacing**: Maintain same gaps and padding as actual content
- **Named constants**: Use constants for repeated counts (avoid magic numbers)
- **Test IDs**: Add `data-testid` attributes to skeleton components

**Example with exported skeleton:**

```typescript
// components/job-form-view.tsx
const SKELETON_STEPS = 3;
const SKELETON_FIELDS = 5;

export function JobFormSkeleton() {
  return (
    <ScrollArea className="h-full" data-testid="scroll-area-skeleton-job-form">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          {Array.from({ length: SKELETON_STEPS }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-9 h-9 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 space-y-6">
            {Array.from({ length: SKELETON_FIELDS }).map((_, field) => (
              <div key={field} className="space-y-2">
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default function JobFormView({ job }: JobFormViewProps) {
  // Component implementation
}

// pages/job-edit.tsx
import JobFormView, { JobFormSkeleton } from "@/components/job-form-view";

function JobEdit() {
  const { data: job, isLoading } = useQuery({
    queryKey: ["/api/jobs", jobId],
    queryFn: () => createValidatedQuery(selectJobSchema)(`/api/jobs/${jobId}`)
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>Edit Job</header>
        <div className="flex-1 overflow-hidden">
          <JobFormSkeleton />
        </div>
      </div>
    );
  }

  return <JobFormView job={job} />;
}
```

### Form Handling

```typescript
// GOOD: React Hook Form with Zod validation
const form = useForm<InsertJob>({
  resolver: zodResolver(insertJobSchema),
  defaultValues: {
    title: "",
    department: "",
    status: "draft"
  }
});

// Handle submission
const onSubmit = async (data: InsertJob) => {
  try {
    await createJobMutation.mutateAsync(data);
    toast({ title: "Job created successfully" });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create job",
      variant: "destructive"
    });
  }
};
```

### Typography Components

**Rule: ALWAYS use typography components from @/components/ui/typography instead of inline Tailwind text classes**

**Rule: NEVER apply custom sizing classes to typography components**

Typography components provide semantic, consistent text styling across the application. Each component has a pre-defined size that ensures visual consistency.

```typescript
import { TypographyH1, TypographyH2, TypographyH3, TypographyLabel, TypographyMuted, TypographyP } from "@/components/ui/typography";

// GOOD: Using typography components
function JobHeader({ job }: { job: Job }) {
  return (
    <div>
      <TypographyH1>{job.title}</TypographyH1>
      <TypographyMuted>{job.department}</TypographyMuted>
      <TypographyP>{job.description}</TypographyP>
    </div>
  );
}

// GOOD: Using TypographyLabel for form labels
function JobForm() {
  return (
    <div className="space-y-2">
      <TypographyLabel>Job Title</TypographyLabel>
      <Input {...field} />
    </div>
  );
}

// BAD: Using inline Tailwind text classes instead of components
function JobHeader({ job }: { job: Job }) {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
      <p className="text-sm text-muted-foreground">{job.department}</p>
      <p className="leading-7">{job.description}</p>
    </div>
  );
}

// BAD: Applying custom sizing to typography components
function JobHeader({ job }: { job: Job }) {
  return (
    <div>
      <TypographyH2 className="text-xl">{job.title}</TypographyH2> {/* NEVER! */}
      <TypographyMuted className="text-xs">{job.department}</TypographyMuted> {/* NEVER! */}
    </div>
  );
}

// GOOD: Use the appropriate component instead of sizing
function JobHeader({ job }: { job: Job }) {
  return (
    <div>
      <TypographyH3>{job.title}</TypographyH3> {/* Use TypographyH3 if you need smaller heading */}
      <TypographySmall>{job.department}</TypographySmall> {/* Use TypographySmall for smaller text */}
    </div>
  );
}

// ACCEPTABLE: Non-sizing utilities via className
function JobHeader({ job }: { job: Job }) {
  return (
    <div>
      <TypographyH1 className="text-center mb-4">{job.title}</TypographyH1> {/* Alignment and spacing OK */}
      <TypographyMuted className="font-semibold">{job.department}</TypographyMuted> {/* Weight OK */}
    </div>
  );
}
```

**Available Typography Components:**

- `<TypographyH1>` - Page titles (use once per page)
- `<TypographyH2>` - Major sections
- `<TypographyH3>` - Subsections
- `<TypographyH4>` - Minor headings
- `<TypographyLead>` - Page introductions or important callouts
- `<TypographyP>` - Standard body paragraphs
- `<TypographyLarge>` - Emphasized content
- `<TypographySmall>` - Fine print, terms, conditions
- `<TypographyMuted>` - ALL secondary/contextual information (replaces `text-sm text-muted-foreground`)
- `<TypographyLabel>` - ALL form labels and section labels (replaces `text-sm font-medium text-muted-foreground`)
- `<TypographyInlineCode>` - Inline code snippets
- `<TypographyBlockquote>` - Quotes or callouts

**Prohibited Sizing Classes:**

Never use these classes on typography components:

- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, etc.

**Why this rule exists:**

- **Consistency**: All labels look identical, all muted text uses same color
- **Maintainability**: Change typography system-wide by editing one component
- **Semantic HTML**: Components map to proper HTML elements with appropriate sizes
- **Type safety**: TypeScript ensures proper usage
- **Design system integrity**: Prevents deviation from established typography scale

### Phone Input Handling

**Rule: ALWAYS use the PhoneInput component for phone number fields**

**Rule: ALWAYS validate phone numbers with isValidPhoneNumber from react-phone-number-input**

```typescript
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

// GOOD: Phone validation with isValidPhoneNumber
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => isValidPhoneNumber(value),
      "Invalid phone number format"
    )
});

// GOOD: Using PhoneInput in a form
<FormField
  control={form.control}
  name="phoneNumber"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Phone Number</FormLabel>
      <FormControl>
        <PhoneInput
          defaultCountry="GB"
          placeholder="Enter phone number"
          data-testid="input-phone"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// BAD: Using regular Input for phone numbers
<Input
  type="tel"
  placeholder="+44 7700 900000"
  {...field}
/>

// BAD: Using regex for phone validation instead of isValidPhoneNumber
phoneNumber: z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
```

**Why this rule exists:**

- **Better UX**: PhoneInput provides country selection, flag icons, and automatic formatting
- **Validation**: `isValidPhoneNumber` handles all international formats correctly
- **E.164 format**: Ensures phone numbers are stored in standard international format
- **Type safety**: Component is fully typed with TypeScript
- **Accessibility**: Built with Radix UI primitives for keyboard navigation and screen readers

**Configuration:**

- Use `defaultCountry="GB"` for UK-based applications (or appropriate country code)
- The component automatically formats numbers as E.164 (e.g., +447700900000)
- Phone numbers are stored as strings in the database

### Event Handlers

```typescript
// GOOD: Typed event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // ...
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// GOOD: Custom event handlers with specific types
const handleSelectUser = (user: User) => {
  setSelectedUser(user);
};
```

### Conditional Rendering

```typescript
// GOOD: Loading states with skeletons (see "Loading States & Skeletons" section)
{isLoading && <JobCardSkeleton />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// GOOD: Ternary for binary conditions
{isExpanded ? <FullView /> : <CompactView />}

// GOOD: Logical AND for single condition
{hasPermission && <AdminPanel />}

// BAD: Rendering false/null in JSX
{count && <div>{count} items</div>} // Shows "0" if count is 0

// GOOD: Explicit comparison
{count > 0 && <div>{count} items</div>}
```

### Props Destructuring

```typescript
// GOOD: Destructure in parameter
function Button({ variant, children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ACCEPTABLE: Destructure in body for complex logic
function ComplexComponent(props: ComplexProps) {
  const { config, data } = props;
  const processed = processData(data, config);

  return <div>{processed}</div>;
}
```

## Backend Standards

### Route Structure

```typescript
import { validateResponse } from "../utils/validate-response.js";

// Keep routes THIN - delegate to storage layer
app.post("/api/jobs", async (req, res) => {
  // 1. Validate input
  const result = insertJobSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Validation failed" });
  }

  try {
    // 2. Delegate to storage
    const job = await storage.createJob(result.data);

    // 3. Validate and return result
    res.status(201).json(validateResponse(selectJobSchema)(job));
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CRITICAL: ALL res.json() calls MUST be wrapped with validateResponse()
app.get("/api/jobs", async (req, res) => {
  const jobs = await storage.listJobs();
  res.json(validateResponse(z.array(selectJobSchema))(jobs));
});

app.get("/api/jobs/:id", async (req, res) => {
  const job = await storage.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(validateResponse(selectJobSchema)(job));
});
```

### Storage Interface Pattern

```typescript
// Define interface for storage operations
export interface IStorage {
  // Jobs
  createJob(data: InsertJob): Promise<Job>;
  getJob(id: string): Promise<Job | null>;
  updateJob(id: string, data: Partial<Job>): Promise<Job>;
  deleteJob(id: string): Promise<void>;
  listJobs(): Promise<Job[]>;

  // Candidates
  createCandidate(data: InsertCandidate): Promise<Candidate>;
  // ...
}

// Implement for in-memory storage
export class MemStorage implements IStorage {
  private jobs = new Map<string, Job>();

  async createJob(data: InsertJob): Promise<Job> {
    const id = crypto.randomUUID();
    const job: Job = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.jobs.set(id, job);
    return job;
  }

  // ... other methods
}

// Easy to swap for database implementation
export class DbStorage implements IStorage {
  async createJob(data: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(data).returning();
    return job;
  }
}
```

### PATCH Route Security

```typescript
// BAD: Accepts any fields
app.patch("/api/jobs/:id", async (req, res) => {
  const job = await storage.updateJob(req.params.id, req.body);
  res.json(job);
});

// GOOD: Whitelist allowed fields with partial schema
const updateJobSchema = insertJobSchema.partial().pick({
  title: true,
  department: true,
  location: true,
  status: true,
  positions: true
});

app.patch("/api/jobs/:id", async (req, res) => {
  const result = updateJobSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Validation failed" });
  }

  const job = await storage.updateJob(req.params.id, result.data);
  res.json(job);
});
```

### Async/Await

```typescript
// GOOD: Use async/await consistently
async function fetchUserData(userId: string): Promise<User> {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// GOOD: Error handling with try/catch
async function processRequest() {
  try {
    const data = await fetchData();
    return processData(data);
  } catch (error) {
    console.error("Processing failed:", error);
    throw new Error("Processing failed");
  }
}

// BAD: Mixing promises and async/await
async function mixedApproach() {
  return fetchData().then((data) => {
    return processData(data);
  });
}
```

## Error Handling

### Frontend Error Handling

```typescript
// GOOD: Try/catch in mutations
const mutation = useMutation({
  mutationFn: async (data: InsertJob) => {
    const response = await apiRequest('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create job');
    }

    return response.json();
  },
  onError: (error) => {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive'
    });
  }
});

// GOOD: Error boundaries for component errors
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Backend Error Handling

```typescript
// GOOD: Consistent error responses
app.post("/api/jobs", async (req, res) => {
  try {
    const result = insertJobSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors
      });
    }

    const job = await storage.createJob(result.data);
    res.json(job);
  } catch (error) {
    console.error("Error creating job:", error);

    // Don't leak internal errors to client
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

// GOOD: Custom error classes
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public details: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: error.message,
      details: error.details
    });
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});
```

## Security Standards

### Input Validation

```typescript
// ALWAYS validate on backend
app.post("/api/users", async (req, res) => {
  const result = insertUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // result.data is now type-safe and validated
});
```

### SQL Injection Prevention

```typescript
// GOOD: Using ORM with parameterized queries
const user = await db.select().from(users).where(eq(users.email, email));

// BAD: String concatenation (if using raw SQL)
const query = `SELECT * FROM users WHERE email = '${email}'`; // NEVER
```

### XSS Prevention

```typescript
// GOOD: React automatically escapes
<div>{userInput}</div>

// DANGEROUS: dangerouslySetInnerHTML (only use if necessary)
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// If you must use it, sanitize first
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
```

## Testing Standards

### Unit Testing Patterns

```typescript
// Test file naming: ComponentName.test.tsx
// UserCard.test.tsx

describe('UserCard', () => {
  it('displays user name', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const handleEdit = vi.fn();
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };

    render(<UserCard user={user} onEdit={handleEdit} />);
    fireEvent.click(screen.getByTestId('button-edit'));

    expect(handleEdit).toHaveBeenCalledWith(user);
  });
});
```
