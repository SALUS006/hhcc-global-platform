# Agentic Prompt: Generate HHCC Angular 18 Working Application

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously scaffold and generate a complete, build-ready Angular 18+ standalone application for the Helping Hands Care Center (HHCC) Platform inside the `angular-ui/` directory.

---

Generate a fully working Angular 18+ application with standalone components, lazy-loaded routes, and a healthcare-friendly color theme. The app must build successfully with `npx ng build` and work standalone using mock data before the backend is ready.

Please carefully read and cross-reference the following workspace files before generating:

1. **Mandatory Reference Files:**
   - `solution/ui-design-mockups.md` — Wireframes and screen map for all 12 use cases.
   - `solution/architecture_design.md` — Sections 3.1 (Angular layer), 5 (MVP Auth with `X-Mock-User-Id` header), 9 (Directory structure).
   - `solution/swagger-profile.yaml` — `UserProfile` schema and `/profiles` endpoints.
   - `solution/swagger-scheduling.yaml` — `CareFacility`, `CareBooking` schemas and `/facilities`, `/bookings` endpoints.
   - `solution/swagger-payment.yaml` — `PaymentInvoice` schema and `/payments` endpoints.
   - `database/init-scripts/01-schema.sql` — Table structures for model alignment.
   - `database/init-scripts/02-mock-data.sql` — Sample data to populate the mock service.

---

## Part 1: Project Scaffold

Generate the following configuration files inside `angular-ui/`:

- **`package.json`**: Angular 18 dependencies (`@angular/core`, `@angular/router`, `@angular/forms`, `@angular/common`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `@angular/animations`, `@angular/compiler`, `rxjs`, `zone.js`, `tslib`). Dev dependencies: `@angular-devkit/build-angular`, `@angular/cli`, `@angular/compiler-cli`, `typescript ~5.4`. Scripts: `start`, `build`, `test`.
- **`angular.json`**: Valid JSON (no `$schema` key). Project name `hhcc-angular-ui`. Builder `@angular-devkit/build-angular:application`. Browser entry `src/main.ts`. Styles: `src/styles.css`. Assets from `src/assets`. Dev and production configurations.
- **`tsconfig.json`**: Strict mode, ES2022 target/module, bundler moduleResolution, Angular compiler options with strict templates.
- **`tsconfig.app.json`**: Extends `tsconfig.json`, files: `src/main.ts`, includes `src/**/*.d.ts`.
- **`.npmrc`**: Set `registry=https://registry.npmjs.org` to avoid corporate proxy issues.
- **`.gitignore`**: Ignore `node_modules/`, `dist/`, `.angular/`.

---

## Part 2: Color Theme & Global Styles

**IMPORTANT — Healthcare-Friendly Palette (NOT red):**

Create `src/styles.css` with CSS custom properties using this calming healthcare palette:

```
--primary: #1a6b6a          (Teal-green)
--primary-dark: #134e4e     (Dark teal)
--primary-light: #e0f2f1    (Light teal background)
--accent: #7c4dff           (Light purple)
--accent-light: #ede7f6     (Light purple background)
--info: #0288d1             (Blue)
--success: #2e7d32          (Green)
--warning: #f57c00          (Orange)
--danger: #c62828           (Red — errors only)
--bg: #f4f8f8               (Soft greenish-white page background)
--card-bg: #ffffff
--text: #1a2e35             (Dark blue-grey)
--text-light: #607d8b       (Blue-grey secondary text)
--border: #d5e0e0           (Teal-tinted border)
--radius: 8px
```

Include global utility classes: `.container`, `.btn` variants (primary/secondary/success/danger/sm), `.card`, `.form-group`, `.form-control` with teal focus ring (`rgba(26,107,106,0.12)`), `.table`, `.badge` variants (success/warning/danger/info), `.page-header`, `.grid` variants (2/3/4 columns), `.empty-state`, `.toast` with slide-in animation, spacing utilities (mt/mb 1-3), flex utilities.

Use Google Fonts `Inter` (weights 300-700) and Material Icons loaded via `src/index.html`.

---

## Part 3: Entry Point & App Shell

- **`src/index.html`**: Standard HTML5 with `<app-root>`, Google Fonts link, Material Icons link, base href `/`.
- **`src/main.ts`**: Bootstrap `AppComponent` with `appConfig`.
- **`src/app/app.config.ts`**: Provide `provideRouter(routes)`, `provideHttpClient()`, `provideZoneChangeDetection`.
- **`src/app/app.component.ts`**: Standalone component with:
  - Sticky responsive navbar with logo (`🏠 HHCC`), nav links (Home, Profile, Scheduling, Payment, Support, Admin, Register button).
  - Hamburger toggle for mobile (<768px).
  - Nav active state using `var(--primary-light)` background and `var(--primary)` text color.
  - `<router-outlet>` for page content.
  - Footer with copyright, Privacy/Terms/Contact links.

---

## Part 4: Routing (Lazy-Loaded)

Create `src/app/app.routes.ts` with these lazy-loaded routes:

| Route | Component | Location |
|-------|-----------|----------|
| `/` | HomeComponent | `app/home/` |
| `/register` | RegisterComponent | `app/profile/register/` |
| `/profile/family` | FamilyListComponent | `app/profile/family-list/` |
| `/profile/family/add` | FamilyFormComponent | `app/profile/family-form/` |
| `/profile/family/edit/:id` | FamilyFormComponent | `app/profile/family-form/` |
| `/profile/pets` | PetListComponent | `app/profile/pet-list/` |
| `/profile/pets/add` | PetFormComponent | `app/profile/pet-form/` |
| `/profile/pets/edit/:id` | PetFormComponent | `app/profile/pet-form/` |
| `/scheduling` | BookingListComponent | `app/scheduling/booking-list/` |
| `/scheduling/new` | BookingFormComponent | `app/scheduling/booking-form/` |
| `/payment` | PaymentDashboardComponent | `app/payment/payment-dashboard/` |
| `/payment/checkout/:invoiceId` | PaymentCheckoutComponent | `app/payment/payment-checkout/` |
| `/support` | SupportComponent | `app/support/` |
| `/admin` | AdminDashboardComponent | `app/admin/admin-dashboard/` |
| `**` | Redirect to `/` | — |

---

## Part 5: Shared Services & Models

**`src/app/shared/models.ts`** — TypeScript interfaces matching Swagger schemas:
- `UserProfile` (id, fullName, email, role, contactNumber, createdBy, updatedBy)
- `FamilyMember` (id, userId, fullName, relationship, dateOfBirth, careType, specialNotes)
- `Pet` (id, userId, petName, petType, breed, age, weight, photoUrl, specialNotes)
- `CareFacility` (id, facilityName, locationAddress, description, photoUrl, isActive)
- `CareBooking` (id, userId, facilityId, pickupTime, dropoffTime, status, bookingType, memberName, facilityName)
- `PaymentInvoice` (id, bookingId, amount, currency, status, paymentDate, bookingDescription)

**`src/app/shared/api.service.ts`** — Injectable HttpClient service:
- Base URL: `/api/v1`
- All requests include header `X-Mock-User-Id: 1` (per architecture Section 5 MVP auth).
- Methods: `getProfiles()`, `createProfile()`, `getFacilities()`, `getBookings()`, `createBooking()`, `getPaymentByBooking(bookingId)`, `createPayment()`.

**`src/app/shared/mock-data.service.ts`** — Injectable in-memory mock service:
- Pre-populated with data matching `02-mock-data.sql`: 3 users (Admin + 2 Customers), 2 facilities (Downtown Pet Care, Sunset Elderly Care), 2 bookings (1 Confirmed, 1 Pending), 2 invoices (1 Paid $150, 1 Unpaid $500).
- Additional mock data: 3 family members (Sarah/daughter, Tom/son, Mary/mother with elderly care), 2 pets (Buddy/Golden Retriever, Whiskers/Persian Cat).
- Full CRUD methods for family members and pets (get, getById, add, update, delete).
- Booking creation, invoice listing, and pay invoice methods.

---

## Part 6: Page Components (All 12 Use Cases)

Every component must be `standalone: true` and import only what it needs.

**UC1 — HomeComponent** (`app/home/home.component.ts`):
- Hero section with gradient background: `linear-gradient(135deg, #1a3c5e 0%, #1a6b6a 50%, #4db6ac 100%)`.
- "Explore Services" and "Sign Up" CTA buttons.
- 3 service cards (Pet Care 🐾, Elderly Care 👴, Family Care 👨‍👩‍👧) in a grid.
- USP checklist (4 items).
- Facility cards loaded from MockDataService showing name, address, description, star rating.

**UC2 — RegisterComponent** (`app/profile/register/register.component.ts`):
- Form fields: Full Name, Email, Contact Number, Password, Confirm Password, Terms checkbox.
- Validation: required fields, password min 6 chars, password match, terms agreement.
- Success state with link to home. Uses MockDataService.createProfile().

**UC3/4 — FamilyListComponent** (`app/profile/family-list/family-list.component.ts`):
- Page header with breadcrumb and "Add Family Member" button.
- Table with columns: Name, Relationship, Care Type (badge), DOB, Actions (Edit link, Delete button with confirm).
- Empty state when no members.
- Link to Pet list view.

**UC3/4 — FamilyFormComponent** (`app/profile/family-form/family-form.component.ts`):
- Reused for add and edit (detect via route param `:id`).
- Fields: Full Name, Relationship dropdown, Date of Birth (date input), Care Type dropdown, Special Notes textarea.
- Cancel navigates back, Save calls mock service and navigates to list.

**UC5/6 — PetListComponent** (`app/profile/pet-list/pet-list.component.ts`):
- Card grid layout with pet type emoji icon, name, breed, age, weight, special notes.
- Edit link and Delete button per card.
- Empty state. Link back to family list.

**UC5/6 — PetFormComponent** (`app/profile/pet-form/pet-form.component.ts`):
- Reused for add/edit. Fields: Pet Name, Pet Type dropdown, Breed, Age (number), Weight (number), Special Notes.
- Two-column layout for Age/Weight row.

**UC7/8 — BookingListComponent** (`app/scheduling/booking-list/booking-list.component.ts`):
- Page header with "New Booking" button.
- Filter bar with Type dropdown (All/Pet/Family) and Status dropdown (All/Confirmed/Pending/Completed).
- Booking cards showing: type emoji, member/pet name → facility name, pickup/dropoff times formatted, status badge.

**UC7/8 — BookingFormComponent** (`app/scheduling/booking-form/booking-form.component.ts`):
- Booking Type toggle buttons (Family Member / Pet) with active state using `var(--primary-light)`.
- Conditional dropdown: Family members when Family selected, Pets when Pet selected.
- Facility dropdown with preview card showing facility details when selected.
- Pick-Up and Drop-Off datetime-local inputs in two-column row.
- Special Instructions textarea. Success message with link to bookings list.

**UC9 — PaymentDashboardComponent** (`app/payment/payment-dashboard/payment-dashboard.component.ts`):
- 3 summary KPI cards: Total Due (danger color), Total Paid (success color), Invoice Count.
- Invoice history table: Invoice# (formatted INV-001), Booking description, Amount, Status badge, Action (Pay Now link for Unpaid, View text for Paid).

**UC9 — PaymentCheckoutComponent** (`app/payment/payment-checkout/payment-checkout.component.ts`):
- Load invoice by route param `:invoiceId`. Calculate tax (8%) and total.
- Order summary card with booking details, subtotal, tax, total.
- Payment method radio buttons (Credit Card / PayPal).
- Card form: Card Number, Expiry, CVV, Cardholder Name. SSL security note.
- Success state: checkmark icon, invoice number, amount, email confirmation message, View Receipt and Back to Home buttons.

**UC10 — Email Notifications**: No UI component needed (server-side). Already covered in mockups doc.

**UC11 — SupportComponent** (`app/support/support.component.ts`):
- Star rating (1-5 clickable stars with active/inactive opacity).
- Feedback textarea with Submit button and success message.
- 3 contact channel cards (Live Chat 💬 24/7, Email 📧 24h response, Phone 📞 Mon-Fri).
- FAQ accordion (5 items) with click-to-toggle open/close.

**UC12 — AdminDashboardComponent** (`app/admin/admin-dashboard/admin-dashboard.component.ts`):
- 4 KPI cards: Users 👥, Bookings 📅, Revenue 💰, Facilities 🏢 — values computed from mock data.
- Two-column grid: Recent Activity feed (5 hardcoded entries with timestamps), User Management table (ID, Name, Role badge).
- Facility Management section with facility cards showing name, address, description, active status badge.

---

## Part 7: Docker & Deployment

**`angular-ui/Dockerfile`** — Multi-stage build:
- Stage 1: `node:22-alpine`, `npm ci --registry https://registry.npmjs.org`, `npx ng build --configuration production`.
- Stage 2: `nginx:alpine`, copy build output from `/app/dist/hhcc-angular-ui/browser` to nginx html root, copy `nginx.conf`.

**`angular-ui/nginx.conf`**:
- Listen port 80. Serve SPA with `try_files $uri $uri/ /index.html`.
- Proxy `/api/` to `http://node-orchestrator:3000/api/` with forwarded headers.

---

## Validation Criteria

After generating all files, run `npx ng build --configuration development` from the `angular-ui/` directory. The build must complete with **zero errors**. All components must appear as lazy-loaded chunks in the build output. Fix any TypeScript strict mode issues (e.g., optional chaining on nullable `.toString()` calls).
