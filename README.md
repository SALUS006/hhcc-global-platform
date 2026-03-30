# Helping Hands Care Center (HHCC) - Global Expansion Platform

Welcome to the HHCC Global Platform! This repository contains the structural mono-repo framework designed specifically for our aggressive 1-week MVP delivery sprint. This initiative relies on independent, parallel development heavily leveraging GitHub Copilot across three domains: Customer Identities, Feature Scheduling, and MVP Mocked Payments.

## 📚 Technical Strategy & Solutions
**MANDATORY READING:** Every developer and architect must familiarize themselves with the finalized architecture blueprints and exact Swagger specs located within the [`/solution`](./solution/) directory. These files define the exact DB constraints and JSON formats that you must adhere to.

- **[Architecture & Solution Design](./solution/architecture_design.md)**: Details the exact integration patterns, Nginx proxying, and the exclusive DB architectural design.
- **[Profile API Swagger](./solution/swagger-profile.yaml)**: Strict OpenAPI contract for Tanuj & Sandeep.
- **[Scheduling API Swagger](./solution/swagger-scheduling.yaml)**: Strict OpenAPI contract for Arturo & Naveen.
- **[Payment API Swagger](./solution/swagger-payment.yaml)**: Strict OpenAPI contract for Alpesh & Naga.

## 🚀 Local Initialization (Day 1 Setup)

### 1. Establish the Unified Database
The entire application (Profile, Scheduling, Payment) maps to a single, localized MySQL relational database. To guarantee everyone builds against the exact same data definitions without manual setup, simply boot the database via Docker.

From the root `hhcc-global-platform/` directory, run:
```bash
docker-compose -f docker-compose.mysql.yml up -d
```
*Docker will boot `mysql:8.0` on port 3306 and immediately trigger the `*-mysql.sql` scripts inside `/database/init-scripts`, injecting your initial database tables and mock rows perfectly.*

#### 🔌 Connecting to the Database locally (e.g. via DBeaver)
You can connect to the running Docker database using any SQL client with these credentials:
- **Server Host:** `localhost` (or `127.0.0.1`)
- **Port:** `3306`
- **Database:** `hhcc_db`
- **Username:** `root`
- **Password:** `hhcc_password`

*(Note for DBeaver users: If you get a "Public Key Retrieval is not allowed" error, right-click your connection, select **Edit Connection**, go to **Driver Properties**, and set `allowPublicKeyRetrieval` to `true`)*

### 2. Feature Scaffolding
Following your startup, navigate strictly to your assigned layer to scaffold your frameworks. 

- **Angular Builders (`/angular-ui`)**: Scaffold your modules (Profile, Booking, Payment). Be prepared to implement an Nginx proxy to eliminate CORS.
- **Node.js Builders (`/node-orchestrator`)**: Initialize your API Orchestrator (Express/NestJS). You will pass the mock `X-Mock-User-Id` header downwards to Java.
- **Spring Boot Builders (`/spring-microservices`)**: Generate your Maven packages (Java 25). **Do not use JPA/Hibernate**. Use Native JDBC templates and bind them against the MySQL container you just booted.

### 3. Contract-Driven Acceleration
Load your respective OpenAPI YAML file directly into your IDE and invoke GitHub Copilot to automatically generate your core DTOs and Interfaces. Avoid hand-typing JSON models across the varying layers.

## ⚖️ Team Governance Policies
As established in Section 8 of the Architecture document, strictly abide by vertical domain mapping. **Sandeep** and **Naveen** are your core DB Architects—no developer outside of them should alter the Database Initialization Scripts. Maintain strict boundaries so we avoid merge conflict bottlenecks!

Get ready. Have fun. Let's build!
