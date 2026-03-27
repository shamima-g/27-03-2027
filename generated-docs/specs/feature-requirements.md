# Feature: Contact Form & Admin Submissions Panel

## Problem Statement

Website visitors have no structured way to reach site administrators, and administrators have no central place to review incoming messages. This feature provides a simple public-facing contact form for anonymous visitors to submit inquiries, and a protected admin panel where the single administrator can view all received submissions.

## User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| Anonymous Visitor | Any unauthenticated website visitor | Submit the contact form; view success/error feedback; no access to any admin area |
| Admin | Single administrator account (seeded in config) | Log in via credentials; view the submissions list; click into a submission for full detail; log out; no delete, no status changes |

## Functional Requirements

### Contact Form

- **R1:** The contact form displays four fields in order: Name (text input), Email (email input), Subject (select/dropdown), and Message (textarea). All four fields are required.
- **R2:** The Subject dropdown presents the following options: "General Inquiry", "Feedback", "Support", "Other".
- **R3:** A live character counter is displayed below the Message textarea showing the format "X / 1000", where X is the current character count. The counter updates as the user types.
- **R4:** When a visitor submits the form with all fields valid, the system saves the submission and replaces the form with a success state on the same page without navigating away. The success state displays: a green circular checkmark icon, a bold "Message Sent!" heading, the subtitle "Thanks for reaching out. I'll get back to you soon.", and a "Send another message" button in outlined/ghost style. Clicking "Send another message" resets the form and returns to the blank form state.
- **R5:** When a visitor submits the form and the API call fails, the system displays a red error banner at the top of the form — above all fields — with the text "Something went wrong. Please try again or contact us directly." The form fields remain populated with the visitor's entered data so they can retry without re-entering information.
- **R6:** The form does not include CAPTCHA or any spam/rate-limiting mechanism.

### Admin Authentication

- **R7:** The admin login page presents a username and password form. On successful authentication, the admin is redirected to the submissions list page.
- **R8:** A logout control is available to the authenticated admin on all admin pages. Clicking it ends the session and redirects the admin to the login page.
- **R9:** Any unauthenticated request to an admin-only page redirects the user to the login page.
- **R10:** When an authenticated admin session expires, the next admin page interaction redirects the admin to the login page.

### Admin Submissions Panel

- **R11:** The submissions list page displays the page title "Inbox" and the current year. All contact form submissions are shown as individual cards, each displaying the following fields: Name (prominent), Email, Subject, Message Preview (truncated), and Date/time (e.g., "March 4 at 7:02 AM").
- **R12:** The admin can click on any submission card to navigate to a submission detail page that shows the full Name, Email, Subject, Date Received, and complete Message text.
- **R13:** The submissions list does not include search, filter, or sort controls.
- **R14:** The submissions list does not include a CSV export function.

### Privacy Policy

- **R15:** A placeholder privacy policy page is accessible to all visitors (unauthenticated). It is linked from the contact form page.

## Business Rules

- **BR1:** The Email field must contain a valid email address format (matching the pattern `user@domain.tld`). Submissions with an invalid email address must not be accepted; the user sees an inline validation error: "Please enter a valid email address."
- **BR2:** The Name field is required. Submissions with a blank Name must not be accepted; the user sees an inline validation error: "Name is required."
- **BR3:** The Subject field is required. Submissions without a selected Subject must not be accepted; the user sees an inline validation error: "Subject is required."
- **BR4:** The Message field is required and has a maximum length of 1,000 characters. Submissions exceeding 1,000 characters must not be accepted; the user sees an inline validation error: "Message must be 1,000 characters or fewer."
- **BR5:** The Message field is required. Submissions with a blank Message must not be accepted; the user sees an inline validation error: "Message is required."
- **BR6:** Only the single seeded admin account can access the admin panel. There is no admin self-registration path.
- **BR7:** Admin permissions are read-only: the admin can view submissions but cannot delete, edit, or change the status of any submission.
- **BR8:** Contact form submissions are retained for 12 months from the date of submission. No automatic deletion mechanism is implemented in this version; the 12-month retention period is a policy commitment, not an enforced automated process.

## Data Model

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| ContactSubmission | id, name (string), email (string), subject (string — one of: "General Inquiry", "Feedback", "Support", "Other"), message (string, max 1000 chars), submitted_at (timestamp) | Standalone — no relationships |
| AdminUser | id, username (string), password_hash (string) | Standalone — seeded at setup, no user management UI |

Notes:
- IP address is NOT stored.
- Read/unread status is NOT stored.
- No soft-delete flag — submissions are not deleteable through the UI.

## Key Workflows

### Workflow 1: Visitor Submits Contact Form (Happy Path)

1. Visitor navigates to the contact form page.
2. Visitor enters Name, Email, selects a Subject, and enters a Message.
3. Visitor submits the form.
4. System validates all fields client-side (required, email format, subject selected, message length ≤ 1,000 characters).
5. System sends the submission to the API.
6. API responds with success.
7. System replaces the form with the success state: green circular checkmark icon, bold "Message Sent!" heading, subtitle "Thanks for reaching out. I'll get back to you soon.", and a "Send another message" button.
8. Visitor may click "Send another message" to reset and display the blank form.

### Workflow 2: Visitor Submits Contact Form (Validation Failure)

1. Visitor submits the form with one or more invalid fields (empty required field, invalid email, no subject selected, message over 1,000 characters).
2. System displays inline validation errors next to the offending fields.
3. Visitor corrects the errors and resubmits.

### Workflow 3: Visitor Submits Contact Form (API Failure)

1. Visitor submits a valid form.
2. The API call fails (network error, server error, etc.).
3. System displays a red error banner at the top of the form: "Something went wrong. Please try again or contact us directly." The form fields remain populated.
4. Visitor retries submission.

### Workflow 4: Admin Login

1. Admin navigates to the admin login page.
2. Admin enters username and password.
3. System authenticates credentials via NextAuth credentials provider.
4. On success: admin is redirected to the submissions list page.
5. On failure: system displays an authentication error message; admin remains on login page.

### Workflow 5: Admin Views Submissions

1. Authenticated admin navigates to the submissions list page.
2. System displays the "Inbox" heading with the current year, and all submissions as cards each showing: Name, Email, Subject, Message Preview (truncated), Date/time.
3. Admin clicks a submission card.
4. System navigates to the submission detail page showing full Name, Email, Subject, Date Received, and full Message.
5. Admin can navigate back to the submissions list.

### Workflow 6: Admin Logout

1. Authenticated admin clicks the logout control.
2. System ends the session.
3. Admin is redirected to the login page.

### Workflow 7: Unauthenticated Access to Admin Area

1. Unauthenticated user navigates to any admin-only URL (e.g., `/admin`).
2. System detects no valid session.
3. System redirects the user to the admin login page.

## Compliance & Regulatory Requirements

The contact form collects personal information (name, email address, message). Users may be located in the EU/UK (GDPR), South Africa (POPIA), and California/other US jurisdictions (CCPA). The following requirements reflect those obligations. Note: several standard data-subject rights cannot be fully fulfilled in this version due to the admin-is-read-only constraint — these are flagged as known limitations.

- **CR1:** The contact form page MUST link to the privacy policy page. The link must be visible before the visitor submits the form, so visitors can review how their data will be used prior to submission. (GDPR Art. 13 / POPIA § 18 / CCPA — notice at collection)
- **CR2:** The privacy policy page MUST exist and be publicly accessible (no login required). In this version it is a placeholder; it MUST be updated with substantive content before the application is used in production. The placeholder MUST state that it is not yet complete. (GDPR / POPIA / CCPA)
- **CR3:** The privacy policy MUST state (once complete) the lawful basis for processing personal data, the categories of data collected (name, email, subject, message), the retention period (12 months), and contact details for data subject requests. (GDPR Art. 13 / POPIA § 18)
- **CR4:** Session cookies used for admin authentication MUST NOT be used for tracking, analytics, or advertising purposes. No third-party tracking cookies are set anywhere in the application. Because no non-essential cookies are used, a cookie consent banner is NOT required. (GDPR / ePrivacy / POPIA)
- **CR5:** Contact form submissions MUST be retained for no longer than 12 months from the date of submission. This is a policy commitment; enforcement is manual in this version. (GDPR Art. 5(1)(e) — storage limitation / POPIA § 14)
- **CR6 (Known Limitation):** Data subjects have the right to request deletion of their personal data (GDPR Art. 17 — right to erasure / POPIA § 24 / CCPA right to delete). In this version, no in-app deletion mechanism exists. This is a known limitation. The privacy policy MUST acknowledge this limitation and provide a contact method (e.g., an email address) for submitting deletion requests, which must be handled manually by the administrator.
- **CR7 (Known Limitation):** Data subjects have the right to access their personal data (GDPR Art. 15 / POPIA § 23 / CCPA right to know). In this version, no in-app data export or access mechanism exists. The privacy policy MUST provide a contact method for submitting access requests, which must be handled manually by the administrator.

## Non-Functional Requirements

- **NFR1:** The application MUST be fully responsive and usable on mobile, tablet, and desktop screen sizes.
- **NFR2:** The application MUST meet WCAG 2.1 Level AA accessibility standards. This includes but is not limited to: keyboard navigability, sufficient colour contrast, meaningful ARIA labels on interactive elements, and visible focus indicators.
- **NFR3:** There is no specific performance SLA defined. The application should perform adequately for the expected low-traffic volume of a contact form.
- **NFR4:** Authentication is implemented using NextAuth.js with the credentials provider. The single admin account credentials are seeded in server-side configuration and are not stored or managed through the UI.
- **NFR5:** The application uses a dark theme throughout — both the public-facing contact form and the admin inbox use a dark background. All UI components must be designed and implemented against the dark theme as the default and only theme.

## Out of Scope

- Email notifications to the admin when a new submission is received
- Admin self-registration (the admin account is a single seeded account; no registration flow exists)
- Visitor ability to view, track, or check the status of their own submission
- Analytics or reporting dashboards (submission counts, trends, etc.)
- Submission deletion by the admin
- Marking submissions as read, unread, or resolved
- Search, filter, or sort on the submissions list
- CSV or other data export
- CAPTCHA or spam protection
- Rate limiting on form submission
- Automated enforcement of the 12-month data retention policy (manual process only in this version)
- In-app mechanisms for data subject rights fulfillment (deletion, access requests are handled manually)
- Multiple admin accounts
- Light/system theme variants — dark theme only

## Source Traceability

| ID | Source | Reference |
|----|--------|-----------|
| R1 | User input + screenshot revision | Clarifying question: "What fields does the contact form have?" — updated to add Subject field |
| R2 | User input (screenshot revision) | UI screenshot showing Subject dropdown with options: General Inquiry, Feedback, Support, Other |
| R3 | User input (screenshot revision) | UI screenshot showing live character counter "23 / 1000" below Message textarea |
| R4 | User input + screenshot revision | Clarifying question: "What happens after successful submission?" — updated with full success state UI from screenshot |
| R5 | User input (screenshot revision) | UI screenshot showing red error banner above form fields on submission failure |
| R6 | User input | Clarifying question: "Is CAPTCHA or rate limiting needed?" |
| R7 | intake-manifest.json | context.authMethod = "frontend-only", context.customAuthNotes (NextAuth credentials provider) |
| R8 | User input | Clarifying question: "Is a logout button available?" |
| R9 | User input | Clarifying question: "What happens when unauthenticated user accesses admin area?" |
| R10 | User input | Clarifying question: "What happens on session expiry?" |
| R11 | User input + screenshot revision | UI screenshot showing card-based inbox layout: each card displays Name (prominent), Email, Subject, truncated message preview, and "March 4 at 7:02 AM" style timestamp; page heading "Inbox" with year subtitle |
| R12 | User input (screenshot revision) | UI screenshot showing Subject field on admin submission cards — clicking a card navigates to full detail |
| R13 | User input | Clarifying question: "Is search/filter needed?" |
| R14 | User input | Clarifying question: "Is CSV export needed?" |
| R15 | User input | Clarifying question: "Is a privacy policy page required?" (compliance gap) |
| BR1 | User input | Clarifying question: "What validation is required on the email field?" |
| BR2 | User input | Clarifying question: "Which fields are required?" |
| BR3 | User input (screenshot revision) | Subject dropdown visible in screenshot; confirmed required field |
| BR4 | User input (screenshot revision) | UI screenshot showing "23 / 1000" character counter — message limit updated from 2,000 to 1,000 characters |
| BR5 | User input | Clarifying question: "Which fields are required?" |
| BR6 | User input | Clarifying question: "Is there admin self-registration?" |
| BR7 | User input | Clarifying question: "Can admins delete or update submission status?" |
| BR8 | User input | Clarifying question: "What is the data retention policy?" |
| CR1 | User input + intake-manifest.json | complianceDomains: ["gdpr","popia","ccpa"]; clarifying question: "Is there a privacy policy link on the form?" |
| CR2 | User input | Clarifying question: "Is a privacy policy page to be included?" |
| CR3 | intake-manifest.json | context.complianceNotes (GDPR Art. 13 / POPIA § 18 / CCPA notice at collection) — updated to include "subject" in collected data categories |
| CR4 | User input | Clarifying question: "Are tracking cookies used? Is a consent banner needed?" |
| CR5 | User input | Clarifying question: "What is the data retention period?" |
| CR6 | User input | Clarifying question: "Can admins delete submissions? How are deletion requests handled?" — known limitation |
| CR7 | intake-manifest.json | context.complianceNotes (GDPR Art. 15 / POPIA § 23 / CCPA right to know) — known limitation |
| NFR1 | User input | Clarifying question: "What responsive breakpoints are required?" |
| NFR2 | User input | Clarifying question: "What accessibility standard is required?" |
| NFR3 | User input | Clarifying question: "Are there performance SLAs?" |
| NFR4 | intake-manifest.json | context.authMethod = "frontend-only", context.customAuthNotes |
| NFR5 | User input (screenshot revision) | UI screenshots showing dark background on both contact form and admin inbox views |
