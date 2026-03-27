# Story: Dark Theme & Global Layout

**Epic:** Project Foundation & Routing | **Story:** 1 of 3 | **Wireframe:** N/A

## Story Metadata
| Field | Value |
|-------|-------|
| **Route** | N/A (layout only) |
| **Target File** | `app/layout.tsx`, `app/globals.css` |
| **Page Action** | `modify_existing` |

## User Story
**As a** visitor or admin **I want** the application to display with a consistent dark theme **So that** every page looks polished and cohesive without any bright white flash or unstyled content.

## Acceptance Criteria

### Dark Background and Text

- [ ] AC-1: Given I open any page in the app, when the page loads, then the background is dark (not white or light grey).
- [ ] AC-2: Given I open any page in the app, when the page loads, then the text is light-coloured and readable against the dark background.
- [ ] AC-3: Given I open any page in the app, when the page loads, then there is no white flash before the dark background appears.

### Design Tokens in globals.css

- [ ] AC-4: Given the app is running, when I inspect the page styles, then CSS custom properties for the dark theme (background, foreground, card, border, and muted colours) are defined on the `:root` element from the design tokens in `generated-docs/specs/design-tokens.json`.
- [ ] AC-5: Given the design tokens are applied, when I view any page, then the colour palette matches the dark-theme values specified in the design tokens file.

### Root Layout Structure

- [ ] AC-6: Given I visit any route, when the page renders, then the `<html>` element has the `dark` class applied so Tailwind dark-mode utilities work correctly.
- [ ] AC-7: Given I visit any route, when the page renders, then the `<body>` element uses the dark background and foreground colours defined in the tokens.
- [ ] AC-8: Given I visit any route, when the page renders, then child page content is displayed inside the root layout without any layout shift or unstyled content.

## API Endpoints (from OpenAPI spec)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| — | — | No API calls in this story |

## Implementation Notes
- Source design tokens from `generated-docs/specs/design-tokens.json`. Map token values to CSS custom properties in `globals.css` using the existing Tailwind CSS 4 / Shadcn convention (`--background`, `--foreground`, `--card`, `--border`, `--muted`, etc.).
- The template's `globals.css` already has a structure; update it rather than replacing the whole file — preserve any reset rules and only update the colour variables.
- Add `class="dark"` to the `<html>` tag in `app/layout.tsx`. Tailwind CSS 4 with Shadcn uses `dark` class strategy by default.
- This story enables manual verification that the dark theme is in place before any feature pages are built. Subsequent stories (2 and 3) inherit this layout automatically.
- No new components are needed — this is purely a token/CSS/layout-root change.
