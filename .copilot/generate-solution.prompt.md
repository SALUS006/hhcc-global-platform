# Agentic Prompt: Map HHCC Architecture Design 

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate the identical architectural blueprint and structural framework for the Helping Hands Care Center (HHCC) Platform MVP.

---

Generate a highly professional, "production-ready" architecture design and solution document for the Helping Hands Care Center (HHCC) digital application. Our objective is to support global expansion into pet and elderly care by aggressively building an MVP within a 1-week Copilot-assisted sprint using independent, parallel development. 

Please strictly adhere to the following explicit constraints and formatting:

1. **Technology Stack Specifications:**
   - **Frontend UI Layer:** Angular 18+
   - **Orchestration Layer:** Node.js (Express/NestJS) implementing a Modular BFF pattern with vertically sliced routes (Profile, Scheduling, Payment).
   - **Business Logic Layer:** 3 distinct Spring Boot 3+ microservices built explicitly on **Java 25** using **Maven (`pom.xml`)**. Mandate the use of `@ControllerAdvice` for global Java exception handling to protect the Node layer.
   
2. **Database & Persistence Constraints:**
   - Enforce a Single Relational Database Schema (PostgreSQL 16+ or MySQL 8+).
   - Data access must explicitly utilize native **JDBC**. Absolutely no JPA or Hibernate is permitted.
   - Primary Keys (`id`) must translate to `long` (BIGINT in SQL).
   - Every single schema table MUST include mandatory audit fields: `created_dt`, `updated_dt`, `created_by` (mapping to user ID), and `updated_by`.

3. **Development Strategy & MVP Scoping:**
   - Teams must adhere to an API-First design, finalizing Swagger OpenAPI contracts by Noon on Day 1.
   - **MVP Constraints**: Payment Process integrations (like Stripe/PayPal) are strictly mocked. Security is simplified via a hardcoded `X-Mock-User-Id` HTTP header. Full JWT crypto-validation and live payments are deferred as post-MVP enhancements.
   - Fix cross-origin constraints by injecting an Nginx reverse proxy within the Angular deployment to dynamically route `/api` traffic internally to the Node.js container.

4. **Integration & Containerization:**
   - Containerize the entire mono-repo stack using Docker. 
   - Architect a root `docker-compose.yml` deployment strategy to boot the UI, Node API, all 3 Java Services, and the unified PostgreSQL shared instance locally.
   - Utilize lightweight Alpine layers (e.g., `temurin:25-jre-alpine` for the Spring Boot `.jar` files).

5. **Team Task Allocation Governance:**
   - Structure a 7-person team based on Vertical Feature Ownership.
   - **Full-Stack UI/Node Owners**: Tanuj (owns Profile), Arturo (owns Scheduling), Alpesh (owns Payment).
   - **Java Backend Owners**: Sandeep, Naveen, Naga.
   - **Exclusive Database Authority**: Sandeep and Naveen explicitly own ALL database conceptual design, relationship modeling, and SQL table generation on Day 1. Naga and the Full-Stack teams strictly inherit and consume these precise pre-generated tables.
   - **QA/Integration Owner**: Akhil is OOO for Days 1-4; configure his capacity to execute solely upon his return on Day 5 to review Copilot Unit Tests and squash deployment bugs.

Format the output artifact as an immaculate Markdown document. Include detailed Mermaid.js diagrams mapping the Component Interaction Architecture and the Database Entity-Relationship (ER) model. Finally, append a mono-repo Directory Structure tree outlining precisely where each of the 7 developers will store their partitioned code.
