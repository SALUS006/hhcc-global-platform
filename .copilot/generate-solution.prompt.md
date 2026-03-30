# Agentic Prompt: Map HHCC Architecture Design 

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate the identical architectural blueprint and structural framework for the Helping Hands Care Center (HHCC) Platform MVP.

---

Generate a highly professional, "production-ready" architecture design and solution document for the Helping Hands Care Center (HHCC) digital application. Our objective is to support global expansion into pet and elderly care by aggressively building an MVP within a 1-week Copilot-assisted sprint using independent, parallel development. 

Please strictly adhere to the following explicit constraints and formatting:

1. **Technology Stack Specifications:**
   - **Frontend UI Layer:** Angular 18+
   - **Orchestration Layer:** Node.js (NestJS preferred for its modular controller pattern) implementing a Modular BFF pattern with vertically sliced routes (Profile, Scheduling, Payment, Feedback).
   - **Business Logic Layer:** 3 distinct Spring Boot 3+ microservices built explicitly on **Java 21 (LTS)** using **Maven (`pom.xml`)**. Mandate the use of `@ControllerAdvice` for global Java exception handling to protect the Node layer.
   
2. **Database & Persistence Constraints:**
   - Enforce a Single Relational Database Schema using **MySQL 8+** exclusively.
   - Data access must explicitly utilize native **JDBC**. Absolutely no JPA or Hibernate is permitted.
   - Primary Keys (`id`) must translate to `long` (BIGINT in SQL).
   - Every single schema table MUST include mandatory audit fields: `created_dt`, `updated_dt`, `created_by` (mapping to user ID), and `updated_by`. Exception: `service_notification` requires only `created_dt`.

3. **Full Database Schema — 8 Required Tables:**
   - **`user_profile`** (MS1): Core identity, role (ADMIN/CUSTOMER/STAFF), password_hash.
   - **`family_member`** (MS1): Dependent linked to user_profile — supports CHILDCARE and ELDERLY care_type values.
   - **`pet_profile`** (MS1): Pet linked to user_profile — species, breed, medical_notes.
   - **`care_facility`** (MS2): Care center catalog with `supported_care_types` (CHILDCARE, PET, ELDERLY).
   - **`care_booking`** (MS2): Unified booking table. Must include `care_type` (CHILDCARE/PET/ELDERLY), `dependent_type` (FAMILY_MEMBER/PET), and `dependent_id` (polymorphic FK to family_member.id or pet_profile.id).
   - **`payment_invoice`** (MS3): Invoice per booking with `payment_method` (MOCK/CREDIT_CARD/PAYPAL).
   - **`user_feedback`** (MS1): User ratings and support requests — `user_id` is NULLABLE to support guest/unregistered feedback.
   - **`service_notification`** (MS1): Email/SMS audit log. MVP implementation via Spring Mail (SMTP).

4. **Development Strategy & MVP Scoping:**
   - Teams must adhere to an API-First design, finalizing Swagger OpenAPI contracts by Noon on Day 1.
   - **MVP Constraints**: Payment integrations (Stripe/PayPal) are strictly mocked. Security is simplified via a hardcoded `X-Mock-User-Id` HTTP header. Full JWT crypto-validation and live payments are deferred as post-MVP enhancements.
   - Fix cross-origin constraints by injecting an Nginx reverse proxy within the Angular deployment to dynamically route `/api` traffic internally to the Node.js container.
   - Email notifications (UC#10) are implemented via **Spring Mail (SMTP)** within MS1, triggered on: REGISTRATION, BOOKING_CONFIRMED, BOOKING_CANCELLED, and PAYMENT_RECEIVED events.

5. **Integration & Containerization:**
   - Containerize the entire mono-repo stack using Docker. 
   - Architect a root `docker-compose.yml` deployment strategy to boot the UI, Node API, all 3 Java Services, and the unified MySQL shared instance locally.
   - Utilize lightweight Alpine layers (e.g., `eclipse-temurin:21-jre-alpine` for the Spring Boot `.jar` files).

6. **Team Task Allocation Governance:**
   - Structure a 7-person team based on Vertical Feature Ownership.
   - **Full-Stack UI/Node Owners**: Tanuj (owns Profile — including family_member & pet_profile UI + `/api/profile` routes), Arturo (owns Scheduling — `/api/scheduling` routes), Alpesh (owns Payment & Feedback — `/api/payment` and `/api/feedback` routes).
   - **Java Backend Owners**: Sandeep (Profile MS1 — owns user_profile, family_member, pet_profile, user_feedback, service_notification JDBC), Naveen (Scheduling MS2 — owns care_facility, care_booking JDBC + docker-compose), Naga (Payment MS3 — owns payment_invoice JDBC).
   - **Exclusive Database Authority**: Sandeep and Naveen explicitly own ALL database conceptual design, relationship modeling, and SQL DDL generation on Day 1. Naga and the Full-Stack teams strictly inherit and consume these precise pre-generated tables.
   - **QA/Integration Owner**: Akhil is OOO for Days 1-4; configure his capacity to execute solely upon his return on Day 5 to review Copilot Unit Tests and squash deployment bugs.

Format the output artifact as an immaculate Markdown document. Include detailed Mermaid.js diagrams mapping the Component Interaction Architecture and the Database Entity-Relationship (ER) model with all 8 tables and their relationships. Finally, append a mono-repo Directory Structure tree outlining precisely where each of the 7 developers will store their partitioned code.
