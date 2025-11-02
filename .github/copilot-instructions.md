## Repo orientation — quick facts

- Framework: Next.js (app router), Next 16 + React 19 (see `package.json`).
- Styling: Tailwind CSS (v4) + PostCSS. Global styles in `src/globals.css`.
- TypeScript: strict mode enabled; path alias `@/*` -> `src/*` (see `tsconfig.json`).

## Where to start reading

- Root layout: `src/app/(main)/layout.tsx` — shows global providers and the app-level UI composition (Menu, Cart, Search, Footer).  Useful to understand page structure and where providers mount.
- Contexts: `src/context/search-context.tsx` — small provider that exposes search visibility; used by `SearchComponent`.
- Server actions and APIs: `src/app/actions.ts` — contains `login` (`'use server'`) and `getCarrito`. Treat this as the minimal server-side API layer for demos/mocks.
- Mock data: `src/db/*` — in-repo mock stores (`products.ts`, `users.ts`). Prefer editing here when changing demo data.
- Components split: `src/components/client/*` (client-only components with `"use client"`) versus `src/components/*` (shared server/client components). Example client components: `cart-button.tsx`, `cart-component.tsx`, `search-button.tsx`.

## Important conventions (copyable rules)

- Respect the `use client` / `use server` boundary. Components in `src/components/client` are client components and must include the directive if they use hooks or browser APIs.
- Small provider pattern: `SearchProvider` exposes { visible, setVisible } and is mounted at the root layout. Other UI modals follow this visibility pattern.
- Server actions live in `src/app/actions.ts` and are imported by client components when needed (example: `CartComponent` calls `getCarrito` via `import { getCarrito } from "@/app/actions"`).
- Mock DB modules under `src/db` are the canonical demo data source—editing these changes runtime behavior without external services.
- File naming: many components use the `-component` suffix (e.g., `footer-component.tsx`) and menu file has a known typo `menu-omponent.tsx` — be careful when importing.

## Build / dev / run

- Primary commands (from `package.json`):
  - npm run dev — run Next dev server (default port 3000)
  - npm run build — production build
  - npm run start — start built app

- Next configuration: `next.config.ts` enables the React compiler and experimental turbopack caching. Expect modern Next features; local dev uses `next dev`.

## Integrations & runtime notes

- Cookies/headers: `src/app/actions.ts` uses `cookies()` from `next/headers` for simple auth lookup. When modifying auth flows, check server action cookie usage.
- No external backend in-tree: the app uses mocked arrays in `src/db`. For feature work that requires persistent data, replace or adapt these modules.

## Patterns & examples to reference

- Toggle search overlay:

  - Provider: `src/context/search-context.tsx`
  - Consumer: `src/components/search-component.tsx` — uses context and renders an overlay with id="overlay" and a click handler that sets `setVisible(false)`.

- Cart flow (client -> server action):

  - `src/components/client/cart-component.tsx` (client) calls `getCarrito()` imported from `src/app/actions.ts` inside useEffect to populate items.

## Quick debugging tips for contributors

- If a client component fails, check whether it is missing `"use client"` or is importing server-only APIs.
- If server actions return unexpected results, inspect `src/db/*` for mock data and `src/app/actions.ts` for cookie logic.

## Files to read first (summary)

- `src/app/(main)/layout.tsx` — root layout and providers
- `src/context/search-context.tsx` — UI provider pattern
- `src/app/actions.ts` — server actions (login, getCarrito)
- `src/db/users.ts`, `src/db/products.ts` — demo data
- `src/components/*` and `src/components/client/*` — UI building blocks

If anything here is unclear or you want more specific guidance (examples for adding a new server action, wiring a new provider, or converting a component from server to client), tell me which area and I'll expand with concrete code edits and small tests.
