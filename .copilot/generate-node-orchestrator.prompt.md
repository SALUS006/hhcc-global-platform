# Agentic Prompt: Generate HHCC Node.js Orchestration Layer

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate the complete Node.js REST Orchestration Layer for the Helping Hands Care Center (HHCC) Platform inside the `node-orchestrator/` directory.

---

Generate a production-ready Node.js Express + TypeScript orchestration API that acts as a strict REST proxy between the Angular UI and the three Spring Boot microservices.

**Mandatory Reference Files (read before generating):**
- `solution/architecture_design.md` — Sections 3.2 (Orchestration Layer), 5 (MVP Auth), 6.2 (Docker), 9 (Directory Structure)
- `solution/swagger-profile.yaml` — Profile API contract (`UserProfile` schema, `/profiles` endpoints)
- `solution/swagger-scheduling.yaml` — Scheduling API contract (`CareFacility`, `CareBooking` schemas, `/facilities`, `/bookings` endpoints)
- `solution/swagger-payment.yaml` — Payment API contract (`PaymentInvoice` schema, `/payments` endpoints)

---

## Part 1: Project Scaffold

Create the following files in `node-orchestrator/`:

**`package.json`**:
- Name: `hhcc-node-orchestrator`
- Dependencies: `express`, `axios`, `cors`, `dotenv`
- DevDependencies: `typescript`, `@types/express`, `@types/cors`, `@types/node`, `ts-node`, `nodemon`
- Scripts:
  - `"start": "node dist/index.js"`
  - `"dev": "nodemon --exec ts-node src/index.ts"`
  - `"build": "tsc"`
  - `"lint": "tsc --noEmit"`

**`tsconfig.json`**:
- Target: ES2022, Module: CommonJS, outDir: `./dist`, rootDir: `./src`
- Strict mode enabled, esModuleInterop: true, resolveJsonModule: true

**`.env`** (default environment variables):
```
PORT=3000
PROFILE_SERVICE_URL=http://ms-profile-service:8080/api/v1
SCHEDULING_SERVICE_URL=http://ms-scheduling-service:8081/api/v1
PAYMENT_SERVICE_URL=http://ms-payment-service:8082/api/v1
```

**`.gitignore`**: `node_modules/`, `dist/`, `.env`

**`.npmrc`**: `registry=https://registry.npmjs.org`

---

## Part 2: Entry Point (`src/index.ts`)

- Load environment variables from `.env` using `dotenv`
- Create Express app on port from `PORT` env var (default 3000)
- Middleware: `cors()`, `express.json()`, `express.urlencoded({ extended: true })`
- Mount controllers:
  - `profileController` at `/api/profile`
  - `schedulingController` at `/api/scheduling`
  - `paymentController` at `/api/payment`
- Mount placeholder controllers (in-memory stubs until DB/microservice support exists):
  - Family member routes at `/api/v1` (routes: `/family-members`, `/family-members/:id`)
  - Pet routes at `/api/v1` (routes: `/pets`, `/pets/:id`)
  - Feedback routes at `/api/v1` (routes: `/feedback`)
- Global health endpoint: `GET /api/health` returning `{ "status": "UP", "service": "node-orchestrator" }`
- Global error handler middleware that catches errors and returns `{ error: message, status: code }`
- Log startup message: `HHCC Orchestrator running on port ${PORT}`

---

## Part 3: Shared Utilities

**`src/utils/proxy.ts`** — Reusable Axios proxy helper:
```typescript
// Create a function that:
// 1. Accepts: method (GET/POST/PUT/DELETE), targetUrl, req (Express Request)
// 2. Forwards the request body (for POST/PUT)
// 3. Forwards the `X-Mock-User-Id` header from the incoming request
// 4. Returns the downstream response data and status
// 5. On error, extracts the downstream error response or returns 502 Bad Gateway
```

**`src/utils/config.ts`** — Service URL configuration:
```typescript
// Export the three service base URLs from environment variables:
// PROFILE_SERVICE_URL, SCHEDULING_SERVICE_URL, PAYMENT_SERVICE_URL
```

---

## Part 4: Profile Controller (`src/controllers/profile.controller.ts`)

**Downstream target**: `PROFILE_SERVICE_URL` (default: `http://ms-profile-service:8080/api/v1`)

Map these routes (matching `swagger-profile.yaml`):

| Orchestrator Route | Method | Downstream URL | Description |
|---|---|---|---|
| `/profiles` | GET | `{PROFILE_URL}/profiles` | List all profiles |
| `/profiles` | POST | `{PROFILE_URL}/profiles` | Create new profile |
| `/profiles/:id` | GET | `{PROFILE_URL}/profiles/:id` | Get profile by ID |
| `/profiles/:id` | PUT | `{PROFILE_URL}/profiles/:id` | Update profile |
| `/profiles/:id` | DELETE | `{PROFILE_URL}/profiles/:id` | Delete profile |
| `/profiles/health` | GET | `{PROFILE_URL}/profiles/health` | Health check passthrough |

### 4a: Family Member Placeholder Routes (No DB table yet — stub only)

These routes support UC3/UC4 (Add/Manage Family Members) from the Angular UI. They currently have **no backing microservice or DB table**. Implement them as in-memory stub endpoints that return mock data regardless of `STUB_MODE`. Mark each handler with a `// TODO: Proxy to Profile microservice once family_member table and API exist` comment.

| Orchestrator Route | Method | Stub Behavior |
|---|---|---|
| `/family-members` | GET | Return mock array: `[{id:1, userId:2, fullName:"Sarah Doe", relationship:"Daughter", dateOfBirth:"2018-03-15", careType:"Child Care", specialNotes:"Allergic to peanuts"}, {id:2, userId:2, fullName:"Tom Doe", relationship:"Son", dateOfBirth:"2014-07-22", careType:"Child Care"}, {id:3, userId:2, fullName:"Mary Doe", relationship:"Mother", dateOfBirth:"1954-01-10", careType:"Elderly Care", specialNotes:"Requires wheelchair assistance"}]` |
| `/family-members` | POST | Return `req.body` with generated `id`, status `201` |
| `/family-members/:id` | GET | Find by id from in-memory array, return `404` if not found |
| `/family-members/:id` | PUT | Update in-memory, return updated object |
| `/family-members/:id` | DELETE | Remove from in-memory, return `204` |

### 4b: Pet Placeholder Routes (No DB table yet — stub only)

These routes support UC5/UC6 (Add/Manage Pets) from the Angular UI. Same approach — in-memory stubs with `// TODO` comments.

| Orchestrator Route | Method | Stub Behavior |
|---|---|---|
| `/pets` | GET | Return mock array: `[{id:1, userId:2, petName:"Buddy", petType:"Dog", breed:"Golden Retriever", age:3, weight:65, specialNotes:"Friendly, loves fetch"}, {id:2, userId:2, petName:"Whiskers", petType:"Cat", breed:"Persian", age:2, weight:10}]` |
| `/pets` | POST | Return `req.body` with generated `id`, status `201` |
| `/pets/:id` | GET | Find by id, return `404` if not found |
| `/pets/:id` | PUT | Update in-memory, return updated object |
| `/pets/:id` | DELETE | Remove from in-memory, return `204` |

### 4c: Feedback Placeholder Route (No DB table yet — stub only)

Supports UC11 (Feedback & Support) from the Angular UI.

| Orchestrator Route | Method | Stub Behavior |
|---|---|---|
| `/feedback` | POST | Accept `{userId, rating, comment}`, return `{id: generated, ...req.body, createdAt: new Date()}` with status `201` |
| `/feedback` | GET | Return in-memory array of submitted feedback |

---

## Part 5: Scheduling Controller (`src/controllers/scheduling.controller.ts`)

**Downstream target**: `SCHEDULING_SERVICE_URL` (default: `http://ms-scheduling-service:8081/api/v1`)

Map these routes (matching `swagger-scheduling.yaml`):

| Orchestrator Route | Method | Downstream URL | Description |
|---|---|---|---|
| `/facilities` | GET | `{SCHEDULING_URL}/facilities` | List all facilities |
| `/facilities/:id` | GET | `{SCHEDULING_URL}/facilities/:id` | Get facility by ID |
| `/bookings` | GET | `{SCHEDULING_URL}/bookings` | List all bookings |
| `/bookings` | POST | `{SCHEDULING_URL}/bookings` | Create booking |
| `/bookings/:id` | GET | `{SCHEDULING_URL}/bookings/:id` | Get booking by ID |
| `/bookings/:id` | PUT | `{SCHEDULING_URL}/bookings/:id` | Update booking |
| `/bookings/:id` | DELETE | `{SCHEDULING_URL}/bookings/:id` | Delete booking |
| `/scheduling/health` | GET | `{SCHEDULING_URL}/scheduling/health` | Health check passthrough |

---

## Part 6: Payment Controller (`src/controllers/payment.controller.ts`)

**Downstream target**: `PAYMENT_SERVICE_URL` (default: `http://ms-payment-service:8082/api/v1`)

Map these routes (matching `swagger-payment.yaml`):

| Orchestrator Route | Method | Downstream URL | Description |
|---|---|---|---|
| `/payments` | GET | `{PAYMENT_URL}/payments` | List all invoices |
| `/payments` | POST | `{PAYMENT_URL}/payments` | Create/process payment |
| `/payments/:id` | GET | `{PAYMENT_URL}/payments/:id` | Get invoice by ID |
| `/payments/booking/:bookingId` | GET | `{PAYMENT_URL}/payments/booking/:bookingId` | Get invoice by booking ID |
| `/payments/:id/pay` | PUT | `{PAYMENT_URL}/payments/:id/pay` | Mark invoice as Paid |
| `/payment/health` | GET | `{PAYMENT_URL}/payment/health` | Health check passthrough |

---

## Part 7: Header Forwarding Rules

**CRITICAL — MVP Authentication (from Architecture Section 5):**

Every proxy call to the downstream microservices MUST forward these headers from the incoming Angular request:
- `X-Mock-User-Id` — The hardcoded mock user ID from the Angular UI (e.g., `1`)
- `Content-Type` — Forward as-is (typically `application/json`)

The proxy utility should extract these from `req.headers` and include them in the Axios request to the downstream service.

---

## Part 8: Stub Mode (Fallback when microservices are down)

Add an environment variable `STUB_MODE=true` that, when enabled, returns hardcoded mock responses instead of proxying to downstream services. This allows the Angular UI to develop independently.

**Stub responses** (matching `database/init-scripts/02-mock-data.sql`):

- `GET /api/profile/profiles` → Return 3 mock users (Admin, John Doe, Jane Smith)
- `GET /api/scheduling/facilities` → Return 2 mock facilities (Downtown Pet Care, Sunset Elderly Care)
- `GET /api/scheduling/bookings` → Return 2 mock bookings (1 Confirmed, 1 Pending)
- `GET /api/payment/payments` → Return 2 mock invoices (1 Paid $150, 1 Unpaid $500)
- `POST` endpoints in stub mode → Return the request body with a generated `id` and `201` status

**Placeholder endpoints (always stub, no microservice backend yet):**
- `GET/POST/PUT/DELETE /api/v1/family-members` → In-memory CRUD (see Part 4a)
- `GET/POST/PUT/DELETE /api/v1/pets` → In-memory CRUD (see Part 4b)
- `GET/POST /api/v1/feedback` → In-memory store (see Part 4c)

When `STUB_MODE` is not set or `false`, all requests proxy to the real microservices.

---

## Part 9: Docker

**`Dockerfile`** — Multi-stage build:
```dockerfile
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Part 10: Docker Compose Integration

After generating all files, add the `node-orchestrator` service to `docker-compose.full.yml`:

```yaml
  node-orchestrator:
    build:
      context: ./node-orchestrator
      dockerfile: Dockerfile
    container_name: hhcc-node-orchestrator
    environment:
      - PROFILE_SERVICE_URL=http://ms-profile-service:8080/api/v1
      - SCHEDULING_SERVICE_URL=http://ms-scheduling-service:8081/api/v1
      - PAYMENT_SERVICE_URL=http://ms-payment-service:8082/api/v1
    ports:
      - "3000:3000"
    depends_on:
      - ms-profile-service
      - ms-scheduling-service
      - ms-payment-service
    networks:
      - hhcc-network
```

Also update the `angular-ui` service to depend on `node-orchestrator` instead of the three microservices directly.

---

## API Contract Alignment Checklist

Before completing, verify these contracts match exactly between Angular `api.service.ts` and the orchestrator:

### Profile Domain
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `getProfiles()` | GET | `/api/v1/profiles` | Part 4 → proxy |
| `createProfile()` | POST | `/api/v1/profiles` | Part 4 → proxy |

### Family Members (Placeholder — Part 4a)
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `getFamilyMembers()` | GET | `/api/v1/family-members` | Part 4a → stub |
| `getFamilyMember(id)` | GET | `/api/v1/family-members/:id` | Part 4a → stub |
| `createFamilyMember()` | POST | `/api/v1/family-members` | Part 4a → stub |
| `updateFamilyMember(id)` | PUT | `/api/v1/family-members/:id` | Part 4a → stub |
| `deleteFamilyMember(id)` | DELETE | `/api/v1/family-members/:id` | Part 4a → stub |

### Pets (Placeholder — Part 4b)
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `getPets()` | GET | `/api/v1/pets` | Part 4b → stub |
| `getPet(id)` | GET | `/api/v1/pets/:id` | Part 4b → stub |
| `createPet()` | POST | `/api/v1/pets` | Part 4b → stub |
| `updatePet(id)` | PUT | `/api/v1/pets/:id` | Part 4b → stub |
| `deletePet(id)` | DELETE | `/api/v1/pets/:id` | Part 4b → stub |

### Scheduling Domain
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `getFacilities()` | GET | `/api/v1/facilities` | Part 5 → proxy |
| `getBookings()` | GET | `/api/v1/bookings` | Part 5 → proxy |
| `createBooking()` | POST | `/api/v1/bookings` | Part 5 → proxy |

### Payment Domain
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `getInvoices()` | GET | `/api/v1/payments` | Part 6 → proxy |
| `getInvoice(id)` | GET | `/api/v1/payments/:id` | Part 6 → proxy |
| `getPaymentByBooking(bookingId)` | GET | `/api/v1/payments/booking/:bookingId` | Part 6 → proxy |
| `createPayment()` | POST | `/api/v1/payments` | Part 6 → proxy |
| `payInvoice(id)` | PUT | `/api/v1/payments/:id/pay` | Part 6 → proxy |

### Feedback (Placeholder — Part 4c)
| Angular Method | HTTP | URL | Orchestrator |
|---|---|---|---|
| `submitFeedback()` | POST | `/api/v1/feedback` | Part 4c → stub |
| `getFeedback()` | GET | `/api/v1/feedback` | Part 4c → stub |

### URL Routing Path
Angular → nginx (`/api/*`) → node-orchestrator:3000 (`/api/v1/*`) → microservice:808x (`/api/v1/*`)

**Recommended: Option B** — Mount all orchestrator routes at `/api/v1` to match Angular's existing URL pattern. No Angular changes needed.

---

## Validation

After generating all files:
1. Run `npm install` in `node-orchestrator/`
2. Run `npm run build` to verify TypeScript compiles with zero errors
3. Verify the directory structure matches:
```
node-orchestrator/
├── src/
│   ├── index.ts
│   ├── controllers/
│   │   ├── profile.controller.ts
│   │   ├── scheduling.controller.ts
│   │   ├── payment.controller.ts
│   │   └── placeholder.controller.ts    # Family members, Pets, Feedback (in-memory stubs)
│   └── utils/
│       ├── proxy.ts
│       └── config.ts
├── .env
├── .gitignore
├── .npmrc
├── Dockerfile
├── package.json
└── tsconfig.json
```
