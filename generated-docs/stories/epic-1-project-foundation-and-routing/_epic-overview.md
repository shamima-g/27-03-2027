# Epic 1: Project Foundation & Routing

## Description

Establishes the dark-theme layout, global styles, authentication infrastructure, and route protection that all subsequent epics depend on. This epic delivers the complete skeleton of the application: a dark root layout, a reconfigured NextAuth credentials provider with a single seeded admin account (username-based, not email), a login page at `/admin/login`, and a persistent admin layout with logout. No epic can be started until this one is complete.

## Stories

1. **Dark Theme & Global Layout** - Update `globals.css` with dark-theme design tokens and configure the root layout to apply a dark background and foreground to all pages. | File: `story-1-dark-theme-and-global-layout.md` | Status: Pending
2. **Authentication Configuration & Admin Login Page** - Reconfigure NextAuth for a single seeded admin account with username-based credentials, simplify `UserRole` to `ADMIN` only, create the sign-in page at `/admin/login`, and redirect unauthenticated `/admin/*` access to `/admin/login`. | File: `story-2-auth-config-and-admin-login-page.md` | Status: Pending
3. **Admin Layout with Logout** - Create the admin layout wrapping all `/admin/*` pages (excluding login) with a persistent header/nav and a logout control that ends the session and redirects to `/admin/login`. | File: `story-3-admin-layout-with-logout.md` | Status: Pending
