# Story: Authentication Configuration & Admin Login Page

**Epic:** Project Foundation & Routing | **Story:** 2 of 3 | **Wireframe:** N/A

## Story Metadata
| Field | Value |
|-------|-------|
| **Route** | `/admin/login` |
| **Target File** | `app/admin/login/page.tsx`, `lib/auth/auth.config.ts`, `types/roles.ts` |
| **Page Action** | `create_new` (login page) / `modify_existing` (auth config, roles) |

## User Story
**As the** administrator **I want** a login page at `/admin/login` where I can enter my username and password **So that** I can securely access the admin submissions panel, and unauthenticated visitors who try to reach any `/admin/*` page are automatically sent to the login page.

## Acceptance Criteria

### Login Page UI

- [ ] AC-1: Given I visit `/admin/login`, when the page loads, then I see a username field and a password field.
- [ ] AC-2: Given I visit `/admin/login`, when the page loads, then I see a "Sign in" (or equivalent) submit button.
- [ ] AC-3: Given I visit `/admin/login`, when the page loads, then the page uses the dark theme established in Story 1.
- [ ] AC-4: Given I visit `/admin/login`, when the page loads, then there is no visible reference to email — the label for the first field says "Username" (or equivalent), not "Email".

### Successful Login

- [ ] AC-5: Given I am on `/admin/login`, when I enter the correct admin username and password and click submit, then I am redirected to `/admin` (the admin panel home).
- [ ] AC-6: Given I have successfully logged in, when I am redirected to `/admin`, then I do not see the login page again if I navigate back to `/admin`.

### Failed Login

- [ ] AC-7: Given I am on `/admin/login`, when I enter an incorrect username or password and click submit, then I stay on the login page and see an error message telling me my credentials are invalid.
- [ ] AC-8: Given I am on `/admin/login`, when I submit with the username field left blank, then I see a validation message and the form is not submitted.
- [ ] AC-9: Given I am on `/admin/login`, when I submit with the password field left blank, then I see a validation message and the form is not submitted.

### Route Protection

- [ ] AC-10: Given I am not logged in, when I try to visit `/admin` directly, then I am redirected to `/admin/login`.
- [ ] AC-11: Given I am not logged in, when I try to visit any `/admin/*` page directly, then I am redirected to `/admin/login`.
- [ ] AC-12: Given I am logged in as admin, when I visit `/admin/login` directly, then I am redirected away from the login page to `/admin`.

### Role Simplification

- [ ] AC-13: Given the auth system is configured, when I inspect the `UserRole` type, then the only role that exists is `ADMIN` — the template's `POWER_USER`, `STANDARD_USER`, and `READ_ONLY` roles are removed.

## API Endpoints (from OpenAPI spec)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| — | — | No external API calls — auth is handled by NextAuth credentials provider |

## Implementation Notes
- **Replace, don't extend the template auth config.** The template uses email-based credentials and 4 roles. This story replaces both:
  - `types/roles.ts`: Simplify `UserRole` to a single `ADMIN = 'admin'` value. Remove `POWER_USER`, `STANDARD_USER`, `READ_ONLY`, `ROLE_HIERARCHY`, and `DEFAULT_ROLE`. Update all exports accordingly.
  - `lib/auth/auth.config.ts`: Change the credentials provider's field from `email` to `username`. Replace the 4 demo users with a single seeded admin: `{ id: '1', username: 'admin', password: <bcrypt hash of 'Admin123!'>, role: UserRole.ADMIN }`. Update `pages.signIn` to `/admin/login`.
- **Route protection via middleware or admin layout:** The existing `(protected)` layout group redirects to `/auth/signin`. For this project, unauthenticated `/admin/*` access must redirect to `/admin/login`. Implement this either in `middleware.ts` (if it exists) or in `app/admin/layout.tsx` (Story 3 will use the admin layout — co-ordinate so the redirect is in one authoritative place). The login page itself (`/admin/login`) must be publicly accessible.
- **Login page:** Create `app/admin/login/page.tsx` as a client component. Use Shadcn `<Input />`, `<Button />`, `<Label />`, and `<Card />` components. Call NextAuth's `signIn('credentials', { username, password, callbackUrl: '/admin' })` on submit. Display the NextAuth error (from `?error=CredentialsSignin` search param or equivalent) as a visible error message.
- **Redirect logged-in users away from login page:** If a user is already authenticated and visits `/admin/login`, redirect them to `/admin`. Handle this with a server-side session check at the top of the login page component, or via middleware.
- **No email field anywhere on this page.** The FRS specifies username-based auth; the template's email field must not appear.
- This story enables manual verification of AC-10 through AC-12 once Story 3 (admin layout) is in place.
