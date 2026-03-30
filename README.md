# Helping Hands Care Center (HHCC) - Global Expansion Platform

Welcome to the HHCC Global Platform! This repository contains the structural mono-repo framework designed specifically for our aggressive 1-week MVP delivery sprint. This initiative relies on independent, parallel development heavily leveraging GitHub Copilot across three domains: Customer Identities, Feature Scheduling, and MVP Mocked Payments.

## 📚 Technical Strategy & Solutions
**MANDATORY READING:** Every developer and architect must familiarize themselves with the finalized architecture blueprints and exact Swagger specs located within the [`/solution`](./solution/) directory. These files define the exact DB constraints and JSON formats that you must adhere to.

- **[Architecture & Solution Design](./solution/architecture_design.md)**: Details the exact integration patterns, Nginx proxying, and the exclusive DB architectural design.
- **[Profile API Swagger](./solution/swagger-profile.yaml)**: Strict OpenAPI contract for Tanuj & Sandeep.
- **[Scheduling API Swagger](./solution/swagger-scheduling.yaml)**: Strict OpenAPI contract for Arturo & Naveen.
- **[Payment API Swagger](./solution/swagger-payment.yaml)**: Strict OpenAPI contract for Alpesh & Naga.

## 🚀 Local Workspace & Deployment Strategies

To guarantee everyone builds against the exact same environment without manual installation bottlenecks, the entire backend is fully containerized with Docker. You have two ways to run the workspace depending on what you are working on.

### Strategy 1: Deploy Everything At Once (Recommended for UI & Integrations)
This orchestrator boots the MySQL Database, applies the table schemas and mock data, and compiles and launches **all three Spring Boot microservices** simultaneously.

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
Once the containers are deployed, Docker binds the respective microservices to your localhost automatically. 

Test your deployment natively by visiting these standard Health Check endpoints in your browser or Postman:
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

## ⚖️ Team Governance Policies
As established in Section 8 of the Architecture document, strictly abide by vertical domain mapping. **Sandeep** and **Naveen** are your core DB Architects—no developer outside of them should alter the Database Initialization Scripts. Maintain strict boundaries so we avoid merge conflict bottlenecks!

Get ready. Have fun. Let's build!
