# Agentic Prompt: Full-Stack Integration (UI → Orchestrator → Microservices)

**Instructions for GitHub Copilot / Agent**:
Execute this prompt to wire an Angular UI through a Node.js orchestration layer to Spring Boot microservices with zero integration errors. This prompt encodes lessons learned from real deployment failures.

---

## Phase 1: Scan All Layers (DO THIS FIRST)

Before writing any code, scan all three layers to build a complete contract map.

### 1a. Scan Java Controllers

For every `@RestController` in `spring-microservices/`:
- Record the exact `@RequestMapping` base path
- Record every `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` with full path
- Record whether endpoints require path variables like `{userId}` or `{id}`
- Record the request body class (`@RequestBody`) and its fields
- Record the response DTO class and its fields

**Output a table like this:**

```
| Service | Controller | Method | Full URL | Path Vars | Request Body Fields | Response Fields |
```

### 1b. Scan Database Schema

Read the MySQL schema file (`database/init-scripts/01-schema-mysql.sql`):
- Record every table name and its columns
- Record foreign key relationships
- Compare column names against Java RowMapper/entity field mappings
- Flag any column the Java code reads that doesn't exist in the schema

### 1c. Scan Node Orchestrator Routes

For every route in `node-orchestrator/src/controllers/`:
- Record the Express route path
- Record the downstream proxy URL it calls
- Compare against the Java controller URLs from step 1a
- Flag any URL mismatch

### 1d. Scan Angular API Service

Read `angular-ui/src/app/shared/api.service.ts`:
- Record every HTTP method call with its URL
- Compare against Node orchestrator routes from step 1c
- Flag any missing routes

### 1e. Scan Angular Components

For every component in `angular-ui/src/app/`:
- Record which service it injects (ApiService vs MockDataService)
- Record which methods it calls
- Record the payload shape it sends for POST/PUT calls
- Compare POST payloads against Java `@RequestBody` class fields from step 1a
- Flag any field name mismatches

---

## Phase 2: Fix URL Chain Mismatches

The URL chain is: Angular → nginx → Node → Java

### Common Pitfalls (from real failures):

1. **Java uses nested paths, Node doesn't**
   - Java: `GET /api/v1/profiles/{userId}/family-members`
   - Node must inject `userId` from `X-Mock-User-Id` header
   - Angular calls flat: `GET /api/v1/family-members`
   - Node rewrites: `GET /api/v1/family-members` → `GET {PROFILE_URL}/profiles/${userId}/family-members`

2. **Java uses singular, Angular uses plural (or vice versa)**
   - Java: `/api/v1/payment/invoices`
   - Angular: `/api/v1/payments`
   - Node must map: `/payments` → `${PAYMENT_URL}/payment/invoices`

3. **Java scopes by userId in path, Angular doesn't**
   - Java: `GET /bookings/{userId}` (list by user)
   - Angular: `GET /bookings` (list all)
   - Node must inject: `GET /bookings` → `GET ${URL}/bookings/${userId}`

4. **Java has no "list all" endpoint**
   - If Java only has `GET /{userId}` but no `GET /`, you must either:
     - Add the endpoint to Java, OR
     - Have Node inject the userId from the header

### Fix Pattern:

For each Node proxy route, verify the FULL downstream URL resolves to an actual Java endpoint:

```typescript
// WRONG — Java has no GET /scheduling/bookings (without userId)
await proxyRequest('GET', `${URL}/scheduling/bookings`, req, res);

// RIGHT — inject userId from header
const userId = (req.headers['x-mock-user-id'] as string) || '1';
await proxyRequest('GET', `${URL}/scheduling/bookings/${userId}`, req, res);
```

---

## Phase 3: Fix Payload Mismatches

### Common Pitfalls:

1. **Angular sends UI-friendly fields, Java expects DB-aligned fields**
   - Angular sends: `{ bookingType: 'Pet', memberName: 'Buddy' }`
   - Java expects: `{ careType: 'PET', dependentType: 'PET', dependentId: 1 }`
   - Fix: Update Angular form to collect and send the Java-required fields

2. **Angular uses camelCase, Java RowMapper uses snake_case**
   - Java Jackson auto-converts if `@JsonProperty` is set
   - Verify the Java entity/DTO field names match what Angular sends

3. **Angular sends string IDs, Java expects Long**
   - Angular: `{ facilityId: "1" }` (from select value)
   - Java: expects `Long facilityId`
   - Fix: Use `[ngValue]` instead of `[value]` in Angular selects to preserve number type

### Verification:

For every POST/PUT endpoint, create a comparison table:

```
| Field | Angular Sends | Java Expects | Match? |
```

---

## Phase 4: Wire Angular Components to ApiService

For each component currently using `MockDataService`:

1. Replace import: `MockDataService` → `ApiService`
2. Replace constructor injection
3. Convert sync calls to Observable subscriptions:

```typescript
// BEFORE (sync mock)
this.facilities = this.mock.getFacilities();

// AFTER (async API)
this.api.getFacilities().subscribe(data => this.facilities = data);
```

4. For forms that navigate after submit:
```typescript
this.api.createBooking(booking).subscribe(() => {
  this.router.navigate(['/scheduling']);
});
```

5. For components calling multiple APIs (like admin dashboard), use `forkJoin`:
```typescript
forkJoin({
  users: this.api.getProfiles(),
  bookings: this.api.getBookings(),
  invoices: this.api.getInvoices(),
  facilities: this.api.getFacilities()
}).subscribe(({ users, bookings, invoices, facilities }) => {
  // process all data
});
```

---

## Phase 5: Docker Compose Verification

### Pre-deployment Checklist:

1. Verify `docker-compose.full.yml` has correct service URLs in environment:
   - `PROFILE_SERVICE_URL=http://ms-profile-service:8080/api/v1`
   - `SCHEDULING_SERVICE_URL=http://ms-scheduling-service:8081/api/v1`
   - `PAYMENT_SERVICE_URL=http://ms-payment-service:8082/api/v1`

2. Verify nginx.conf proxies `/api/` to `http://node-orchestrator:3000/api/`

3. Verify dependency chain: `angular-ui` → `node-orchestrator` → `ms-*-service` → `hhcc-mysql`

4. **CRITICAL**: If DB schema changed, volumes must be reset:
   ```bash
   docker compose -f docker-compose.full.yml down -v
   docker compose -f docker-compose.full.yml up --build
   ```

### Post-deployment Smoke Test:

After containers are up, verify each endpoint returns 200:

```bash
# Health checks
curl http://localhost:3000/api/health
curl http://localhost:8080/api/v1/profiles/health
curl http://localhost:8081/api/v1/scheduling/health
curl http://localhost:8082/api/v1/payment/health

# Data endpoints (through nginx → node → java)
curl http://localhost/api/v1/facilities
curl http://localhost/api/v1/profiles
curl http://localhost/api/v1/family-members
curl http://localhost/api/v1/pets
curl http://localhost/api/v1/bookings
curl http://localhost/api/v1/payments
```

If any return 500, check the Java service logs:
```bash
docker compose -f docker-compose.full.yml logs ms-scheduling-service --tail=30
```

---

## Integration Error Taxonomy

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| 404 from Java | Node proxy URL doesn't match Java `@RequestMapping` | Fix proxy URL path |
| 500 from Java "table doesn't exist" | Stale MySQL volume with old schema | `docker compose down -v` and rebuild |
| 500 from Java "column not found" | Java RowMapper reads column not in DB schema | Align schema or RowMapper |
| 500 from Java "null pointer on field" | Angular payload missing required Java field | Add field to Angular model and form |
| 499 from nginx | Client cancelled (forkJoin cascade from one failed request) | Fix the one failing endpoint first |
| 502 from Node | Java service not reachable (wrong hostname or port) | Check docker-compose service names and ports |
| CORS error in browser | nginx not proxying `/api/` correctly | Check nginx.conf proxy_pass |

---

## Output Artifacts

After completing integration, produce:
1. Updated `api.service.ts` with all methods matching Node routes
2. Updated Node controllers with correct proxy URLs
3. Updated Angular components using ApiService
4. Updated `models.ts` with fields matching Java DTOs
5. Verified `docker-compose.full.yml` with correct env vars
6. All endpoints returning 200 in smoke test
