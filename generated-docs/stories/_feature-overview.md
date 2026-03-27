# Feature: Contact Form & Admin Submissions Panel

## Summary

A public-facing contact form that lets anonymous visitors submit inquiries, paired with a protected admin panel where a single administrator can view all received submissions.

## Epics

1. **Epic 1: Project Foundation & Routing** - Dark-theme layout, global styles, all app routes, route protection middleware (unauthenticated `/admin/*` → redirect to `/admin/login`), NextAuth credentials provider with seeded admin account, and logout control on all admin pages. | Status: Pending | Dir: `epic-1-project-foundation-and-routing/`
2. **Epic 2: Contact Form (Public)** - Public contact form at `/` with Name, Email, Subject (dropdown), and Message textarea; live character counter; client-side validation with inline errors; form submission via API with success state; error banner on API failure with fields preserved; privacy policy link visible before submit. | Status: Pending | Dir: `epic-2-contact-form-public/`
3. **Epic 3: Admin Submissions Panel** - Authenticated submissions list page with "Inbox" heading and current year; submission cards showing Name, Email, Subject, truncated message preview, and formatted date; card click navigates to detail page with full submission; no search/filter/sort/export. | Status: Pending | Dir: `epic-3-admin-submissions-panel/`
4. **Epic 4: Privacy Policy Page** - Static page at `/privacy-policy` accessible to all visitors, with placeholder content noting the policy is incomplete, and acknowledgment of the manual deletion/access request process. | Status: Pending | Dir: `epic-4-privacy-policy-page/`

## Epic Dependencies

- **Epic 1: Project Foundation & Routing** — no dependencies — must be first. Establishes routing, auth infrastructure, and layout that all other epics depend on.
- **Epic 2: Contact Form (Public)** — depends on Epic 1 (requires routing and layout). Independent of Epics 3 and 4 once Epic 1 is done.
- **Epic 3: Admin Submissions Panel** — depends on Epic 1 (requires auth, route protection, and admin layout). Independent of Epics 2 and 4 once Epic 1 is done.
- **Epic 4: Privacy Policy Page** — depends on Epic 1 (requires routing and layout). Independent of Epics 2 and 3 once Epic 1 is done. Can parallel with Epics 2 and 3.

**Parallelization note:** Epics 2, 3, and 4 are all independent of each other and can be worked on in any order after Epic 1 completes. Recommended sequence: Epic 1 → Epic 2 → Epic 3 → Epic 4.
