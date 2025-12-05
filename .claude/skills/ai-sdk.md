---
name: AI SDK v5 Development
description: Reference guide for building with Vercel AI SDK v5. Always consult official documentation at ai-sdk.dev before implementing AI features.
---

# AI SDK v5 Development Reference

**CRITICAL**: Never assume you know how the AI SDK works. Always consult the official documentation at https://ai-sdk.dev/docs/ before implementing any AI features.

## Official Documentation Links

Always reference these docs before implementing:

- **Main Documentation**: https://ai-sdk.dev/docs/
- **AI SDK Core** (Backend): https://ai-sdk.dev/docs/ai-sdk-core
- **AI SDK UI** (React/Frontend): https://ai-sdk.dev/docs/ai-sdk-ui
- **Getting Started**: https://ai-sdk.dev/docs/getting-started
- **API Reference**: https://ai-sdk.dev/docs/reference
- **Examples**: https://ai-sdk.dev/examples

## Package Structure

The AI SDK v5 is split into focused packages:

```typescript
// Core AI functionality (backend)
import { streamText, generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

// React hooks (frontend)
import { useChat, useCompletion } from "@ai-sdk/react";

// Types
import type { Message, ToolInvocation } from "ai";
```

**Always check package.json to verify which AI SDK packages are installed before importing.**

## Common Pitfalls

### v4 to v5 Migration

**CRITICAL**: AI SDK v5 has breaking changes from v4. Do NOT use v4 patterns.

```typescript
// ❌ BAD: v4 pattern (deprecated)
import { OpenAI } from "ai";
const openai = new OpenAI({ apiKey: "..." });

// ✅ GOOD: v5 pattern
import { openai } from "@ai-sdk/openai";
// API key from environment: OPENAI_API_KEY

// ❌ BAD: v4 useChat pattern
const { messages, append, input, handleInputChange } = useChat();

// ✅ GOOD: v5 pattern
const { messages, sendMessage } = useChat();
```

### Environment Variables

```typescript
// ✅ GOOD: Provider packages read from standard env vars
// OpenAI: OPENAI_API_KEY
// Anthropic: ANTHROPIC_API_KEY

import { openai } from "@ai-sdk/openai";
const model = openai("gpt-4o"); // Reads OPENAI_API_KEY automatically

// ❌ BAD: Hardcoding API keys
const model = openai("gpt-4o", { apiKey: "sk-..." }); // Never do this!
```

### Message Conversion

```typescript
import { convertToModelMessages } from "ai";

// ✅ GOOD: Convert UI messages to model format
const result = streamText({
  model: openai("gpt-4o"),
  messages: convertToModelMessages(uiMessages)
});

// ❌ BAD: Passing UI messages directly
const result = streamText({
  model: openai("gpt-4o"),
  messages: uiMessages // May not work correctly!
});
```

### Custom Transports

```typescript
import { DefaultChatTransport } from "ai";

// ✅ GOOD: Using custom transport for authentication
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: "/api/chat",
    headers: authHeaders
  })
});

// ❌ BAD: Using deprecated 'api' + 'headers' directly (v4 pattern)
const { messages } = useChat({
  api: "/api/chat",
  headers: authHeaders // This may not work as expected in v5
});
```

## AI Simulator Wrapper

**CRITICAL**: Always import `generateObject` and `generateText` from the wrapper instead of `ai` directly:

```typescript
// ✅ GOOD: Use the wrapper for all LLM calls
import { generateObject, generateText } from "../utils/ai";

// Requires simulatedResponse parameter that matches the schema type
const { object } = await generateObject({
  model: openai(OPENAI_MODEL),
  schema: mySchema,
  prompt: "...",
  simulatedResponse: {
    /* default response matching schema */
  }
});

// ❌ BAD: Don't import directly from ai
import { generateObject } from "ai";
```

**Why use the wrapper:**

- Enables AI simulation in development to avoid real LLM calls during testing
- `simulatedResponse` is returned when `AI_SIMULATOR_ENABLED=true`
- Defaults to enabled in development, disabled in production

**Activation:** `AI_SIMULATOR_ENABLED=true` (defaults to enabled in development)

## Before You Implement

Always consult the official documentation:

1. **Check the main docs**: https://ai-sdk.dev/docs/
2. **Review examples**: https://ai-sdk.dev/examples
3. **Read API reference**: https://ai-sdk.dev/docs/reference
4. **Check migration guide** (if migrating from v4): https://ai-sdk.dev/docs/migration

**Remember**: The AI SDK is actively developed. Always refer to the latest documentation rather than assuming patterns from memory or older examples.
