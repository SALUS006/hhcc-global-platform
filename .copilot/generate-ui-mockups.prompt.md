# Agentic Prompt: Generate HHCC UI Design Mockups

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate comprehensive UI design wireframe mockups for the Helping Hands Care Center (HHCC) Platform, mapped to all 12 business use cases.

---

Generate a detailed, professional UI design mockups document for the Helping Hands Care Center (HHCC) Angular web application. The output must be saved to `solution/ui-design-mockups.md`.

Please carefully read and cross-reference the following workspace files before generating:

1. **Architecture & API Contracts (Mandatory References):**
   - `solution/architecture_design.md` — Sections 3.1 (Presentation Layer), 5 (Security/MVP Auth), 7 (Database Schema), 9 (Directory Structure).
   - `solution/swagger-profile.yaml` — Profile API endpoints and `UserProfile` schema.
   - `solution/swagger-scheduling.yaml` — Facility & Booking API endpoints, `CareFacility` and `CareBooking` schemas.
   - `solution/swagger-payment.yaml` — Payment API endpoints and `PaymentInvoice` schema.
   - `database/init-scripts/01-schema.sql` — Table structures and relationships.
   - `database/init-scripts/02-mock-data.sql` — Sample data for realistic mockup content.

2. **Business Use Cases to Cover (All 12):**
   - **UC1 - Home Screen**: Landing page for unregistered/logged-out users. Hero banner, services overview (Pet Care, Elderly Care, Family Care), unique selling points, care center facility cards with photos/ratings.
   - **UC2 - User Registration**: Registration form with Full Name, Email, Contact Number, Password, Confirm Password, Terms checkbox. Validation messages.
   - **UC3 - Add Family Member**: Form with Full Name, Relationship dropdown (Child/Parent/Spouse/Other), Date of Birth, Care Type (Child Care/Elderly Care), Special Notes textarea.
   - **UC4 - Manage Family Members**: Table/list view showing all family members with Name, Relationship, Care Type, DOB columns. Edit and Delete action buttons. Empty state when no members exist.
   - **UC5 - Add Pet**: Form with Pet Name, Pet Type dropdown (Dog/Cat/Bird/Other), Breed, Age, Weight, Photo Upload area, Special Notes.
   - **UC6 - Manage Pets**: Card grid layout showing pet photo/icon, name, breed, age, weight. Edit and Delete buttons per card.
   - **UC7 - Schedule Pick-Up/Drop-Off (Family)**: Booking form with Family Member dropdown, Care Facility dropdown with preview card, Pick-Up and Drop-Off datetime pickers, Special Instructions.
   - **UC8 - Schedule Pick-Up/Drop-Off (Pets)**: Same booking form but with Pet dropdown, service type checkboxes (Daycare/Boarding/Grooming).
   - **UC9 - Make Payment**: Payment dashboard with summary KPI cards (Total Due, Total Paid, Invoice Count), invoice history table with status badges, checkout form with card details, and payment success confirmation screen.
   - **UC10 - Email Notification**: Server-side only (no UI screen). Include email template mockups for Registration Confirmation and Booking Confirmation.
   - **UC11 - Feedback & Support**: Star rating widget, feedback textarea, three contact channel cards (Live Chat, Email, Phone), FAQ accordion.
   - **UC12 - Admin Dashboard**: KPI cards (Users, Bookings, Revenue, Facilities), recent activity feed, user management table with role badges, facility management cards with active status.

3. **Document Structure Requirements:**
   - **Screen Map Table**: Map each use case to its Angular route path and component folder location under `angular-ui/src/app/`.
   - **ASCII Wireframe Mockups**: For every screen listed above, produce a detailed box-drawing wireframe showing layout, form fields, buttons, tables, cards, and navigation elements.
   - **Shared Components Section**: Include wireframes for:
     - Navigation bar variants (Logged Out, Customer, Admin).
     - User profile dropdown menu.
     - Toast notification styles (Success, Warning, Error).
     - Confirmation dialog (for delete actions).
     - Loading spinner.
     - Empty state placeholder.
   - **Responsive Breakpoints Table**: Define Mobile (<768px), Tablet (768-1024px), Desktop (>1024px) with layout descriptions. Include a mobile hamburger navigation wireframe.
   - **Angular Component → API Mapping Table**: Map each UI component to its HTTP method, API endpoint path, and backend service name.

4. **Data & Content Constraints:**
   - Use realistic sample data from `02-mock-data.sql` (e.g., "John Doe", "Downtown Pet Care", "$150.00").
   - Form placeholders must match the Swagger schema field names (e.g., `fullName`, `contactNumber`, `pickupTime`).
   - Status badges must reflect the database enum values: Booking status (`Pending`, `Confirmed`, `Completed`), Payment status (`Unpaid`, `Paid`, `Refunded`).
   - The scheduling screens must include a Booking Type toggle between "Family Member" and "Pet" as defined in UC7 and UC8.

Format the entire output as a single Markdown document with clear section headers, ASCII wireframes inside fenced code blocks, and properly formatted tables.
