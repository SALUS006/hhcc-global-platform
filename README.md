# Helping Hands Care Center (HHCC) - Global Expansion Platform

Welcome to the HHCC Global Platform! This repository contains the structural mono-repo framework designed specifically for our aggressive 1-week MVP delivery sprint. This initiative relies on independent, parallel development heavily leveraging GitHub Copilot across four domains: **Customer Identities** (including Family Member & Pet Management), **Facility Scheduling**, **MVP Mocked Payments**, and **Feedback & Notifications**.

## 📚 Technical Strategy & Solutions
**MANDATORY READING:** Every developer and architect must familiarize themselves with the finalized architecture blueprints and exact Swagger specs located within the [`/solution`](./solution/) directory. These files define the exact DB constraints and JSON formats that you must adhere to.

- **[Architecture & Solution Design](./solution/architecture_design.md)**: Details the exact integration patterns, Nginx proxying, and the exclusive DB architectural design.
- **[Profile API Swagger](./solution/swagger-profile.yaml)**: Strict OpenAPI contract for Tanuj & Sandeep. *(Contract defined — implementation complete ✅)*
- **[Scheduling API Swagger](./solution/swagger-scheduling.yaml)**: Strict OpenAPI contract for Arturo & Naveen. *(Contract defined — implementation in progress 🔧)*
- **[Payment API Swagger](./solution/swagger-payment.yaml)**: Strict OpenAPI contract for Alpesh & Naga. *(Contract defined — implementation in progress 🔧)*

## 🚀 Local Workspace & Deployment Strategies

To guarantee everyone builds against the exact same environment without manual installation bottlenecks, the entire backend is fully containerized with Docker. You have two ways to run the workspace depending on what you are working on.

### Strategy 1: Deploy Everything At Once (Recommended for UI & Integrations)
This orchestrator boots the MySQL Database, applies the table schemas and mock data, and compiles and launches **the Angular UI, Node.js Orchestrator placeholder, and all three Spring Boot microservices** simultaneously.

From the root `hhcc-global-platform/` directory, run:
```bash
docker-compose -f docker-compose.full.yml up --build -d
```

### Strategy 2: Deploy Database Only (For Local Java Debugging)
If you prefer to run your specific microservice directly via your IDE (IntelliJ/Eclipse) to step continuously through debug code, you only need the isolated Database container running.

```bash
docker-compose -f docker-compose.mysql.yml up -d
```
*You can connect your IDE or DB client (e.g. DBeaver) to the DB using `localhost:3306`, Database: `hhcc_db`, User: `root`, Pass: `hhcc_password`.*
*(DBeaver Note: Ensure `allowPublicKeyRetrieval=true` in your Driver Properties).*

### ✅ Validating Your Deployment
Once the containers are deployed, Docker binds the web interface and microservices to your localhost automatically. 

**1. Access the Frontend UI:**
Open your browser and navigate to the root domain representing the Nginx web server:
- **Angular App**: [http://localhost](http://localhost)

**2. Access the Backend APIs:**
Test your Java deployments directly by visiting these standard Health Check endpoints in your browser or Postman:
- **Profile Service**: [http://localhost:8080/api/v1/profiles/health](http://localhost:8080/api/v1/profiles/health)
- **Scheduling Service**: [http://localhost:8081/api/v1/scheduling/health](http://localhost:8081/api/v1/scheduling/health)
- **Payment Service**: [http://localhost:8082/api/v1/payment/health](http://localhost:8082/api/v1/payment/health)

A successful end-to-end deployment will return an HTTP 200 OK containing:
```json
{
  "service": "UP",
  "database": "CONNECTED"
}
```

**3. Confirm all containers are running:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected running containers after `docker-compose.full.yml`:

| Container | Expected Status | Port |
|-----------|----------------|------|
| `hhcc-mysql` | `Up (healthy)` | `3306` |
| `ms-profile-service` | `Up` | `8080` |
| `ms-scheduling-service` | `Up` | `8081` |
| `ms-payment-service` | `Up` | `8082` |
| `hhcc-angular-ui` | `Up` | `80` |
| `node-orchestrator` | `Up` | *(internal only)* |

## 📡 API Endpoints Reference

All endpoints are exposed through the respective Spring Boot service. The Node.js Orchestrator proxies these via the `/api/*` routes to the Angular UI.

### Profile Service — `http://localhost:8080`

#### User Profiles
| Method | Endpoint | Description | UC | Status |
|--------|----------|-------------|----|---------|
| `GET` | `/api/v1/profiles/health` | Health check | — | ✅ Live |
| `GET` | `/api/v1/profiles` | List all user profiles | — | ✅ Live |
| `POST` | `/api/v1/profiles` | Register a new user | UC#2 | ✅ Live |

#### Family Members
| Method | Endpoint | Description | UC | Status |
|--------|----------|-------------|----|---------|
| `GET` | `/api/v1/profiles/{userId}/family-members` | List all family members for a user | UC#4 | ✅ Live |
| `GET` | `/api/v1/profiles/{userId}/family-members/{id}` | Get a single family member | UC#4 | ✅ Live |
| `POST` | `/api/v1/profiles/{userId}/family-members` | Add a family member | UC#3 | ✅ Live |
| `PUT` | `/api/v1/profiles/{userId}/family-members/{id}` | Update a family member | UC#4 | ✅ Live |
| `DELETE` | `/api/v1/profiles/{userId}/family-members/{id}` | Remove a family member | UC#4 | ✅ Live |

#### Pets
| Method | Endpoint | Description | UC | Status |
|--------|----------|-------------|----|---------|
| `GET` | `/api/v1/profiles/{userId}/pets` | List all pets for a user | UC#6 | ✅ Live |
| `GET` | `/api/v1/profiles/{userId}/pets/{id}` | Get a single pet | UC#6 | ✅ Live |
| `POST` | `/api/v1/profiles/{userId}/pets` | Add a pet | UC#5 | ✅ Live |
| `PUT` | `/api/v1/profiles/{userId}/pets/{id}` | Update a pet | UC#6 | ✅ Live |
| `DELETE` | `/api/v1/profiles/{userId}/pets/{id}` | Remove a pet | UC#6 | ✅ Live |

> **Note:** The Profile Service (MS1) is fully deployed with all 5 live routes per domain above. The `X-Mock-User-Id` header is used by the Node.js Orchestrator to populate `userId` — pass it manually in Postman during direct testing.

### Scheduling Service — `http://localhost:8081`

> 🔧 **Sprint Status**: Only the `/health` endpoint is live. The `/facilities` and `/bookings` routes are **planned** and being implemented by Arturo (Node.js) & Naveen (Spring Boot) during Days 2–3.

| Method | Endpoint | Description | UC | Status |
|--------|----------|-------------|----|---------|
| `GET` | `/api/v1/scheduling/health` | Health check | — | ✅ Live |
| `GET` | `/api/v1/scheduling/facilities` | List care facilities | UC#1 | 🔧 Planned |
| `GET` | `/api/v1/scheduling/bookings/{userId}` | List bookings for a user | UC#7, UC#8 | 🔧 Planned |
| `POST` | `/api/v1/scheduling/bookings` | Create a booking | UC#7, UC#8 | 🔧 Planned |

### Payment Service — `http://localhost:8082`

> 🔧 **Sprint Status**: Only the `/health` endpoint is live. The `/invoices` routes are **planned** and being implemented by Alpesh (Node.js) & Naga (Spring Boot) during Days 2–3.

| Method | Endpoint | Description | UC | Status |
|--------|----------|-------------|----|---------|
| `GET` | `/api/v1/payment/health` | Health check | — | ✅ Live |
| `GET` | `/api/v1/payment/invoices/{bookingId}` | Get invoice for a booking | UC#9 | 🔧 Planned |
| `POST` | `/api/v1/payment/invoices` | Submit a payment (mock) | UC#9 | 🔧 Planned |

## ⚖️ Team Governance Policies
As established in Section 8 of the Architecture document, strictly abide by vertical domain mapping. **Sandeep** and **Naveen** are your core DB Architects—no developer outside of them should alter the Database Initialization Scripts. Maintain strict boundaries so we avoid merge conflict bottlenecks!

Get ready. Have fun. Let's build!
