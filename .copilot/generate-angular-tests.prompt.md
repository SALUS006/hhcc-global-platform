# Agentic Prompt: Generate HHCC Angular Unit Tests

**Instructions for GitHub Copilot / Agent**: 
Execute the following prompt to autonomously generate comprehensive unit tests for every component and service in the HHCC Angular application.

---

Write comprehensive unit tests (`.spec.ts` files) for every component and service in the `angular-ui/src/app/` directory using Angular 18 TestBed with Jasmine/Karma.

**Reference files before generating:**
- All `.component.ts` files in `angular-ui/src/app/`
- `angular-ui/src/app/shared/models.ts`
- `angular-ui/src/app/shared/mock-data.service.ts`
- `angular-ui/src/app/shared/api.service.ts`

## Standards to Follow

### 1. File Naming
Each test file must be co-located with its source file as `component-name.component.spec.ts` or `service-name.service.spec.ts`.

### 2. TestBed Setup
- Use `TestBed.configureTestingModule()` with the standalone component under test.
- Import `RouterTestingModule` (or `provideRouter([])`) for components using `routerLink`.
- Import `FormsModule` for components using `ngModel`.
- Use `HttpClientTestingModule` for services using `HttpClient`.

### 3. Mock Dependencies
- Never use real services in component tests.
- Provide `MockDataService` as a spy object using `jasmine.createSpyObj()` with all methods stubbed.
- For `ActivatedRoute`, provide a mock with `snapshot.paramMap.get()` returning test values.

### 4. Test Categories Per Component
Use `describe` blocks for each category:

- **Creation**: `it('should create the component')` — verify component instantiates.
- **Rendering**: Verify key DOM elements exist (headings, buttons, form fields, tables) using `fixture.nativeElement.querySelector()`.
- **Data binding**: Verify mock data appears in the template after `fixture.detectChanges()`.
- **User interactions**: Simulate clicks (`button.click()`), form input (`input.value = 'x'; input.dispatchEvent(new Event('input'))`), and select changes. Verify the component state updates accordingly.
- **Form validation**: For form components, test required field validation — submit with empty fields should not call the service method. Submit with valid data should call the service and navigate.
- **Navigation**: Verify `router.navigate()` is called with correct path after successful form submission. Use `spyOn(router, 'navigate')`.
- **Conditional rendering**: Test `*ngIf` branches — e.g., empty state shows when list is empty, success message shows after action.

### 5. Service Tests — MockDataService (`mock-data.service.spec.ts`)
- Test initial data is populated (getProfiles returns 3 users, getFacilities returns 2, etc.).
- Test CRUD operations: add returns item with generated id, update modifies existing item, delete removes item from list.
- Test edge cases: getFamilyMember with non-existent id returns undefined, deletePet with invalid id doesn't throw.

### 6. Service Tests — ApiService (`api.service.spec.ts`)
- Use `HttpClientTestingModule` and `HttpTestingController`.
- Verify each method sends the correct HTTP method, URL, and `X-Mock-User-Id` header.
- Verify request body for POST methods.
- Flush mock responses and verify the observable returns expected data.

### 7. Code Quality Rules
- No `any` types — use proper interfaces from `shared/models.ts`.
- Each `it()` block tests exactly one behavior.
- Use descriptive test names: `it('should display 3 family members in the table')` not `it('works')`.
- Call `fixture.detectChanges()` after setup and after state changes.
- Clean up subscriptions in `afterEach` if applicable.
- Minimum 80% code coverage target per file.

### 8. Components to Test (13 total)

| Component | Key Test Scenarios |
|-----------|-------------------|
| `app.component` | Navbar renders, menu toggle works, all nav links present |
| `home.component` | Hero section renders, 3 service cards, facilities loaded from mock |
| `register.component` | Form validation (empty fields, short password, mismatch, terms unchecked), successful registration |
| `family-list.component` | Table renders members, delete triggers confirm and removes item, empty state when no members |
| `family-form.component` | Add mode vs edit mode (route param), form submission calls correct service method, navigates back |
| `pet-list.component` | Card grid renders pets with correct icons, delete works, empty state |
| `pet-form.component` | Add/edit modes, form validation, two-column layout for age/weight, submission |
| `booking-list.component` | Bookings render with correct icons, filter by type works, filter by status works |
| `booking-form.component` | Type toggle switches dropdowns, facility preview shows on selection, submission creates booking |
| `payment-dashboard.component` | KPI values computed correctly (totalDue, totalPaid), invoice table renders, Pay Now link for unpaid only |
| `payment-checkout.component` | Loads invoice from route param, calculates tax (8%) and total, payment success state after pay |
| `support.component` | Star rating click updates value, feedback submission shows success, FAQ toggle open/close |
| `admin-dashboard.component` | KPI cards show correct counts from mock data, user table renders with role badges, facility cards render |

## Karma & Test Configuration

Ensure the project has the required test infrastructure:

1. Add test dependencies to `package.json` if missing:
   - `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`
   - `jasmine-core`, `@types/jasmine`

2. Create `karma.conf.js` if it doesn't exist with:
   - Frameworks: `['jasmine', '@angular-devkit/build-angular']`
   - Browsers: `['ChromeHeadless']`
   - Coverage reporter with `text-summary` and `html` outputs
   - Single run mode enabled

3. Create `tsconfig.spec.json` extending `tsconfig.json` with:
   - Types: `['jasmine']`
   - Files: `['src/test.ts']`

4. Add `test` architect target to `angular.json` if missing.

## Validation

After generating all spec files, run:
```bash
npx ng test --no-watch --code-coverage
```
All tests must pass. Fix any failures before completing.
