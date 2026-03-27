# Story: Admin Layout with Logout

**Epic:** Project Foundation & Routing | **Story:** 3 of 3 | **Wireframe:** N/A

## Story Metadata
| Field | Value |
|-------|-------|
| **Route** | `/admin/*` (layout, not a page) |
| **Target File** | `app/admin/layout.tsx` |
| **Page Action** | `create_new` |

## User Story
**As the** administrator **I want** a consistent header/navigation bar on every admin page with a logout button **So that** I can sign out at any time and be sure my session is fully ended, and so every Epic 3 feature page has a ready-made shell to build inside.

## Acceptance Criteria

### Admin Layout Shell

- [ ] AC-1: Given I am logged in and visit any `/admin/*` page (other than `/admin/login`), when the page loads, then I see a persistent header or navigation bar at the top of the screen.
- [ ] AC-2: Given I am logged in and visit any `/admin/*` page, when the page loads, then the page content (provided by the child page) is rendered below the header inside the layout.
- [ ] AC-3: Given I am on any admin page, when I look at the header, then the dark theme from Story 1 is applied — there is no light-coloured header on a dark page.

### Logout Control

- [ ] AC-4: Given I am logged in and on any admin page, when I look at the header, then I can see a logout button (or link).
- [ ] AC-5: Given I am logged in, when I click the logout button, then my session ends and I am redirected to `/admin/login`.
- [ ] AC-6: Given I have logged out, when I try to visit any `/admin/*` page, then I am redirected to `/admin/login` (my session is fully gone, not just the UI).

### Login Page Exclusion

- [ ] AC-7: Given I visit `/admin/login`, when the page loads, then the admin header/nav with the logout button is NOT shown — the login page has its own standalone layout.

### Route Protection Integration

- [ ] AC-8: Given I am not logged in, when I try to visit `/admin` or any `/admin/*` page (excluding `/admin/login`), then I am redirected to `/admin/login`.

## API Endpoints (from OpenAPI spec)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| — | — | No external API calls — logout uses NextAuth `signOut()` |

## Implementation Notes
- Create `app/admin/layout.tsx` as a server component (or async server component) that wraps all admin pages. The login page at `app/admin/login/page.tsx` should live outside this layout's scope — either by placing it at `app/admin/login/page.tsx` with its own standalone layout, or by using a route group such as `app/admin/(auth)/login/page.tsx` to exclude it from the admin layout. Choose the approach that makes the file structure clearest.
- **Route protection:** This layout (or `middleware.ts`) must redirect unauthenticated users to `/admin/login`. Check the session server-side at the top of the layout. This is the authoritative location for auth-gating all admin pages — co-ordinate with Story 2's implementation notes.
- **Logout:** The logout button must be a client component (use `"use client"`) because it calls NextAuth's `signOut({ callbackUrl: '/admin/login' })`. Extract it as a small `<LogoutButton />` or `<AdminHeader />` client component and import it into the server layout.
- Use Shadcn components for the header: `<Button variant="ghost" />` or `<Button variant="outline" />` for the logout control.
- This layout is the shell that Epic 3 (Admin Submissions Panel) builds inside. Keep it minimal — just the persistent header with logout. No sidebar, no secondary navigation, no breadcrumbs beyond what is needed for Epic 1.
- **Manual verification note:** This story enables manual verification of AC-10 through AC-12 from Story 2 (route protection), since the admin layout now provides the authenticated shell. The QA phase for this story should cover those Story 2 criteria as well.
