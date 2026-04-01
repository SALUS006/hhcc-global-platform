# Agentic Prompt: Generate Spring Boot Microservices for HHCC Platform MVP - Scheduling Service.

**Instructions for GitHub Copilot / Agent**:
Execute the following prompt to autonomously generate Spring Boot microservices for the HHCC Platform MVP. The microservices should be designed to handle user authentication and use the HHCC Platform's database for any data management. The service should allow to create a spring boot application that exposes REST endpoints. The application should be created inside the directory `spring-microservices/scheduling-service`. This service manages the Care Platform Facility Listings and Booking Services. Handles pick-up and drop-off scheduling for patients, including booking, rescheduling, and cancellation of transportation services. It also manages the availability of care facilities and coordinates with the payment service for billing related to transportation.

---

You are an expert Java developer with extensive experience in building Spring Boot applications. Your task is to create a fully functional Spring Boot application that serves as a microservice for the HHCC Platform MVP. This microservice will handle user authentication and interact with the HHCC Platform's database for data management. Rely on the users' input to create in the necessary folder and implement the REST endpoints. 

You have deep knowledge of the Java language, JVM, build tools (Maven, Gradle), popular frameworks (Spring, Jakarta EE, etc), and best practices for enterprise and cloud-native Java applications. You write clean, maintainable, and efficient Java code, and always consider the implications of changes on performance, security, and maintainability.

You are thoughtful, give nuanced answers, and think through the implications of your code changes. You consider edge cases, potential pitfalls, and always think about how your code fits into the larger context of the codebase and system architecture. You consider dependencies and interactions with other modules, services, and environments.

1. **Mandatory Reference Files:**
   - `solution/ui-design-mockups.md` — Wireframes and screen map for all 12 use cases.
   - `solution/architecture_design.md` — Sections 3.1 (Angular layer), 5 (MVP Auth with `X-Mock-User-Id` header), 9 (Directory structure).
   - `solution/swagger-profile.yaml` — `UserProfile` schema and `/profiles` endpoints.
   - `solution/swagger-scheduling.yaml` — `CareFacility`, `CareBooking` schemas and `/facilities`, `/bookings` endpoints.
   - `solution/swagger-payment.yaml` — `PaymentInvoice` schema and `/payments` endpoints.
   - `database/init-scripts/01-schema-mysql.sql` — Table structures for model alignment.
   - `database/init-scripts/02-mock-data-mysql.sql` — Sample data to populate the mock service.

---

## Existing Scaffold (Already Present)

The following files already exist and should be preserved or extended (not recreated from scratch):

| File | Notes |
|------|-------|
| `pom.xml` | Spring Boot 3.2.4 parent, Java 21, `spring-boot-starter-web`, `spring-boot-starter-jdbc`, `mysql-connector-j`, `lombok` |
| `Dockerfile` | Multi-stage Maven build → `eclipse-temurin:21-jre-alpine` runtime on port 8081 |
| `src/main/resources/application.properties` | Port 8081, MySQL datasource with `${DB_HOST:localhost}` |
| `SchedulingServiceApplication.java` | Standard `@SpringBootApplication` entry point |
| `controller/HealthController.java` | `GET /api/v1/scheduling/health` — DB connectivity check via `JdbcTemplate` |

---

## Required Dependencies (Add to pom.xml)

Add these dependencies that are NOT in the existing scaffold:

```xml
<!-- Null/blank checking utility — use StringUtils.isNotBlank() instead of manual null && isBlank() checks -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
</dependency>
<!-- Version managed by spring-boot-starter-parent BOM — do NOT specify a version -->

<!-- Test support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

Add these build plugins:

```xml
<!-- Code formatter -->
<plugin>
    <groupId>net.revelc.code.formatter</groupId>
    <artifactId>formatter-maven-plugin</artifactId>
    <version>2.24.1</version>
    <configuration>
        <lineEnding>LF</lineEnding>
        <encoding>UTF-8</encoding>
    </configuration>
</plugin>

<!-- Checkstyle — uses project-level checkstyle.xml, NOT google_checks.xml -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <configLocation>checkstyle.xml</configLocation>
        <consoleOutput>true</consoleOutput>
        <violationSeverity>warning</violationSeverity>
        <failOnViolation>false</failOnViolation>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>com.puppycrawl.tools</groupId>
            <artifactId>checkstyle</artifactId>
            <version>10.14.2</version>
        </dependency>
    </dependencies>
</plugin>
```

---

## Checkstyle Configuration (Create `checkstyle.xml` in project root)

Create a **custom** `checkstyle.xml` in the `scheduling-service/` root directory. Do NOT use `google_checks.xml` directly — it conflicts with the project's 4-space indentation convention.

**Key overrides from Google defaults:**
- **Indentation**: `basicOffset=4` (project uses 4-space, not Google's 2-space)
- **Line length**: `max=120` (Spring Boot convention)
- **Import ordering**: Do NOT include `CustomImportOrder` module — let the formatter handle it
- **AbbreviationAsWordInName**: `allowedAbbreviationLength=3` (allows names like `handleSQLException`)
- **Javadoc**: `JavadocType` at warning level, `JavadocMethod` at info level. Do NOT use the `scope` property — it was removed in Checkstyle 10.x and will cause a configuration error.
- **Lombok suppression**: Suppress `MissingJavadocMethod` on `@Data` annotated classes

---

## Architecture & Code Patterns

### Package Structure
```
com.hhcc.scheduling/
├── controller/
│   ├── HealthController.java        (existing)
│   ├── CareFacilityController.java  (new)
│   └── CareBookingController.java   (new)
├── model/
│   ├── CareFacility.java            (new)
│   └── CareBooking.java             (new)
├── repository/
│   ├── CareFacilityRepository.java  (new)
│   └── CareBookingRepository.java   (new)
├── exception/
│   └── GlobalExceptionHandler.java  (new)
└── SchedulingServiceApplication.java (existing)
```

### Data Access Pattern
- Use **raw JDBC via `JdbcTemplate`** — absolutely NO JPA or Hibernate (per architecture doc).
- Use `RowMapper<T>` lambdas for result set mapping.
- Use `GeneratedKeyHolder` with `PreparedStatementCreator` for INSERT operations to retrieve auto-generated IDs.
- Use `Optional<T>` for single-entity lookups (never return null).
- Use `org.apache.commons.lang3.StringUtils.isNotBlank()` for all null/blank string checks on optional filter parameters.

### Model Classes
- Use Lombok `@Data` annotation for getters/setters/toString/equals/hashCode.
- Field names must be camelCase matching the Swagger schema (e.g., `facilityName`, `pickupTime`, `dependentType`).
- DB column names use snake_case (e.g., `facility_name`, `pickup_time`, `dependent_type`) — the `RowMapper` handles the translation.
- Include audit fields: `createdDt`, `createdBy`, `updatedDt`, `updatedBy` (mapped from `created_dt`, `created_by`, etc.).

### Exception Handling — GlobalExceptionHandler

**CRITICAL**: The `@ControllerAdvice` must handle `ResponseStatusException` BEFORE the generic `Exception` handler. Without this, all `ResponseStatusException` (e.g., 404 NOT_FOUND) thrown by controllers will be caught by the generic handler and returned as HTTP 500 instead of the intended status code.

Handler order (most specific first):
1. `@ExceptionHandler(ResponseStatusException.class)` — preserves the original HTTP status code
2. `@ExceptionHandler(SQLException.class)` — returns HTTP 500 with database error payload
3. `@ExceptionHandler(Exception.class)` — catch-all returning HTTP 500

### Import Rules
- **NEVER use star imports** (e.g., `import org.springframework.web.bind.annotation.*`). Always use explicit imports. Checkstyle enforces `AvoidStarImport`.

---

## REST Endpoints (Matching swagger-scheduling.yaml)

### Care Facilities — `CareFacilityController`
Base path: `/api/v1/scheduling/facilities`

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `GET` | `/api/v1/scheduling/facilities` | List all active facilities | Optional `?careType=` query param. Use MySQL `FIND_IN_SET(?, supported_care_types)` for filtering comma-separated values. |
| `GET` | `/api/v1/scheduling/facilities/{id}` | Get facility by ID | Return 404 via `ResponseStatusException` if not found. |

### Care Bookings — `CareBookingController`
Base path: `/api/v1/scheduling/bookings`

| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| `POST` | `/api/v1/scheduling/bookings` | Create a booking | Set `status=PENDING`, `createdBy`/`updatedBy` from `userId`. Return HTTP 201. |
| `GET` | `/api/v1/scheduling/bookings/{userId}` | List bookings for user | Optional `?status=` query param filter. |
| `GET` | `/api/v1/scheduling/bookings/{userId}/{id}` | Get single booking | Scoped to user ownership. Return 404 if not found. |
| `DELETE` | `/api/v1/scheduling/bookings/{userId}/{id}` | Cancel a booking | Soft-cancel: `UPDATE status='CANCELLED'`. Return 204 on success, 404 if not found. |

---

## Testing Requirements

### Test Framework & Annotations
- Use **JUnit 5** with **Spring Boot Test** (`@WebMvcTest` for controller tests).
- Use `@MockBean` from `org.springframework.boot.test.mock.mockito.MockBean` — this is the correct package for **Spring Boot 3.2.x**. Do NOT use `org.springframework.boot.test.mock.bean.MockBean` (does not exist) or `org.springframework.test.context.bean.override.mockito.MockitoBean` (Spring Boot 3.4+ only).
- Use `MockMvc` for HTTP-level controller testing.
- Use `ObjectMapper` with `JavaTimeModule` registered for serializing `LocalDateTime` fields in POST request bodies.
- Name test files with `*ImplTest.java` suffix.

### Test Coverage Per Class

**CareBookingControllerImplTest** (8 tests):
- `create_returnsCreatedBooking` — POST returns 201 with saved entity
- `getAllByUser_returnsBookings` — GET returns list
- `getAllByUser_withStatusFilter` — GET with `?status=CONFIRMED` passes filter
- `getAllByUser_returnsEmptyList` — GET returns empty array for unknown user
- `getById_returnsBooking` — GET by ID returns entity
- `getById_returns404WhenNotFound` — GET by ID returns 404 (verify `ResponseStatusException` propagates correctly through `GlobalExceptionHandler`)
- `cancel_returns204OnSuccess` — DELETE returns 204
- `cancel_returns404WhenNotFound` — DELETE returns 404

**CareFacilityControllerImplTest** (5 tests):
- `getAll_returnsAllActiveFacilities` — returns list
- `getAll_withCareTypeFilter_passesFilterToRepository` — passes `careType` param
- `getAll_returnsEmptyList` — empty result
- `getById_returnsFoundFacility` — returns entity
- `getById_returns404WhenNotFound` — returns 404

**GlobalExceptionHandlerImplTest** (2 tests):
- `handleSQLException_returns500WithDbError` — direct method invocation test
- `handleGenericException_returns500WithGenericError` — direct method invocation test

### Key Testing Pitfall
The 404 tests (`getById_returns404WhenNotFound`, `cancel_returns404WhenNotFound`) will FAIL with `Status expected:<404> but was:<500>` if the `GlobalExceptionHandler` does not have a dedicated `ResponseStatusException` handler. The generic `Exception` handler catches it first and returns 500. This is the most common failure — ensure the `ResponseStatusException` handler exists.

---

## Javadoc Requirements

Add Javadoc comments to ALL public classes and methods in the `src/main/` source tree:
- **Class-level**: Describe purpose, use cases covered, and `@see` references to related classes.
- **Method-level**: Describe behavior, `@param`, `@return`, and `@throws` tags.
- **Test class-level**: Describe what is being tested and the testing approach (e.g., `@WebMvcTest` with mocked repository).

---

## Code Quality & Formatting

### Execution Order
Run these commands in sequence after all code is generated:

1. `mvn formatter:format` — auto-formats all Java files (4-space indent, LF line endings)
2. `mvn checkstyle:check` — validates against `checkstyle.xml` (must produce 0 violations)
3. `mvn clean test` — all 15 tests must pass

### Style Rules
- 4-space indentation (project convention, matching profile-service)
- 120-character line length maximum
- No star imports — always use explicit imports
- Use `StringUtils.isNotBlank()` from `org.apache.commons.lang3` for null/blank string checks
- Lombok `@Slf4j` for logging, `@Data` for model POJOs

---

## Guidelines for Development:
* Follow the project's custom `checkstyle.xml` style guide (based on Google Java Style with 4-space indentation overrides).
* Use meaningful class, method, and variable names.
* Organize code into packages by layer (controller, model, repository, exception).
* Use access modifiers (private, protected, public) appropriately.
* Prefer immutability and thread safety where possible.
* Document public APIs and complex logic with Javadoc comments.
* Use annotations for dependency injection, configuration, and validation.
* Format code with `mvn formatter:format` and validate with `mvn checkstyle:check`.
* If you add, remove, or update any dependencies, update relevant documentation and version constraints in pom.xml.
* Sensitive values (e.g., secrets, API keys) must be referenced via environment variables or secure configuration, never hardcoded.

## Development Steps:
1. **Project Setup**: Extend the existing scaffold in `spring-microservices/scheduling-service`. Add `commons-lang3`, `spring-boot-starter-test`, `formatter-maven-plugin`, and `maven-checkstyle-plugin` to `pom.xml`. Create `checkstyle.xml` in the project root.
2. **Model Classes**: Create `CareFacility.java` and `CareBooking.java` in the `model/` package with Lombok `@Data` and fields matching the Swagger schemas and DB columns.
3. **Repository Classes**: Create `CareFacilityRepository.java` and `CareBookingRepository.java` using `JdbcTemplate` with `RowMapper` lambdas. Use `StringUtils.isNotBlank()` for optional filter parameters. Use `GeneratedKeyHolder` for inserts.
4. **Exception Handler**: Create `GlobalExceptionHandler.java` with `@ControllerAdvice`. Handle `ResponseStatusException` FIRST, then `SQLException`, then generic `Exception`.
5. **Controller Classes**: Create `CareFacilityController.java` and `CareBookingController.java` matching the Swagger endpoints. Use explicit imports (no star imports). Throw `ResponseStatusException` for 404 cases.
6. **Unit Tests**: Create test classes using `@WebMvcTest` with `@MockBean` (from `org.springframework.boot.test.mock.mockito.MockBean`). Cover happy paths and 404 failure scenarios. Register `JavaTimeModule` on `ObjectMapper` for `LocalDateTime` serialization.
7. **Javadoc**: Add Javadoc to all public classes and methods in `src/main/`.
8. **Formatting & Validation**: Run `mvn formatter:format`, then `mvn checkstyle:check` (0 violations), then `mvn clean test` (15 tests, 0 failures).

### Testing
Use JUnit 5 with Spring Boot Test for unit tests.
Write tests in files with the *ImplTest.java suffix.
Mock dependencies with `@MockBean` from `org.springframework.boot.test.mock.mockito.MockBean`.
Review test changes to ensure both happy path and failure scenarios are covered.
The test coverage minimum is 80%.

### Conventions to Follow:
* Use consistent naming conventions for classes, methods, and variables.
* Follow the project's package structure and organization.
* Ensure that all code is properly documented with Javadoc comments where necessary.
* Adhere to the project's `checkstyle.xml` coding standards.
* Use environment variables for sensitive information and configuration.
* Methods should not return null; use Optional or throw exceptions instead.
* Handle exceptions gracefully and provide meaningful error messages.
* Null/blank string checks must use `StringUtils.isNotBlank()` from `org.apache.commons.lang3`.
* Use logging (`@Slf4j`) to provide insights into the application's behavior. Use appropriate log levels (INFO for request entry, ERROR for failures).
* pom.xml: prefer BOMs defined in `dependencyManagement` over individual dependencies where possible. `commons-lang3` version is managed by the Spring Boot parent BOM — do not specify a version.


### Validation Checklist
- [ ] `mvn formatter:format` — 0 failed files
- [ ] `mvn checkstyle:check` — 0 violations
- [ ] `mvn clean test` — 15 tests, 0 failures
- [ ] No star imports in any file
- [ ] `GlobalExceptionHandler` handles `ResponseStatusException` before generic `Exception`
- [ ] All public classes and methods have Javadoc
- [ ] Use `apache-commons` pacakge for String and Collection null checks.
