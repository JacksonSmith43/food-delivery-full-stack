# Food Delivery Full-Stack - AI Agent Instructions

## Architecture Overview

This is a **Spring Boot 4 + Angular 21** full-stack application with a **PostgreSQL** database. The architecture follows a clean separation:

- **Backend**: Spring Boot REST API (port 8080) with JPA/Hibernate ORM
- **Frontend**: Angular standalone components (port 4200) with Angular Material
- **Database**: PostgreSQL 15 in Docker (port 5432)
- **State Management**: Backend uses HTTP sessions for cart persistence; frontend uses Angular signals

## Critical Developer Workflows

### Starting the Application
**ALWAYS use `.\quick-start.ps1`** - this is the project's orchestrated startup script that:
1. Starts Docker (PostgreSQL + pgAdmin)
2. Builds and runs Spring Boot backend (via Maven wrapper)
3. Installs npm dependencies and starts Angular frontend

Never start services individually unless debugging a specific component.

### Development URLs
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- pgAdmin: http://localhost:8081 (admin@food-delivery.com / admin123)
- Static images: http://localhost:8080/images

### Backend Build & Run
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Maven wrapper (`mvnw.cmd` on Windows) is the preferred build tool - do not use global Maven.

### Frontend Build & Run
```powershell
cd frontend
npm start  # Uses proxy.conf.json to forward /api and /images to backend
```

## Project-Specific Conventions

### Backend (Spring Boot)

**Package Structure**: `com.fooddelivery.*`
- `config/` - Spring Security and CORS configuration
- `controller/` - REST endpoints prefixed with `/api`
- `entity/` - JPA entities with Hibernate mappings
- `repository/` - Spring Data JPA repositories (extends `JpaRepository`)
- `service/` - Business logic layer
- `initialiser/` - Data seeding via `@PostConstruct` with `@DependsOn` ordering

**Key Patterns**:
- All controllers use `@CrossOrigin(origins = "http://localhost:4200")`
- REST APIs return `ResponseEntity<T>` with explicit HTTP status codes
- Cart operations are session-based using `HttpSession` - no authentication required
- JPA relationships use `@JsonManagedReference`/`@JsonBackReference` to prevent circular serialization
- Database initialization happens via `@Component` classes with `@PostConstruct` (see [RestaurantInitialiser.java](backend/src/main/java/com/fooddelivery/initialiser/RestaurantInitialiser.java))

**Security Configuration**: CSRF is disabled for API endpoints. All `/api/**` and `/images/**` routes permit anonymous access ([SecurityConfig.java](backend/src/main/java/com/fooddelivery/config/SecurityConfig.java)).

### Frontend (Angular)

**Architecture**: Angular 21 with standalone components (no NgModules).

**Key Patterns**:
- All components are standalone with `providedIn: 'root'` services
- State management uses Angular signals: `signal<T>()`, `.set()`, `.update()`
- HTTP services inject `HttpClient` via `inject()` function (not constructor)
- API calls return `Observable<T>` and components subscribe with `.subscribe({ next, error })`
- Cart state is centrally managed in [cart.service.ts](frontend/src/app/shared/services/cart.service.ts)

**Proxy Configuration**: [proxy.conf.json](frontend/proxy.conf.json) forwards `/api` and `/images` to `http://localhost:8080` during `ng serve`.

**Prettier Configuration**: Project uses Prettier with 100-char line width and single quotes. HTML uses Angular parser (`package.json` prettier config).

## Data Flow & Integration

### Restaurant & Menu Flow
1. Backend initializers (`@PostConstruct`) seed database on startup
2. Frontend calls `GET /api/restaurants/` → returns `Restaurants[]` with nested `categories` and `menuItems`
3. [restaurants.service.ts](frontend/src/app/shared/services/restaurants.service.ts) deduplicates categories using `Map<string, CategoryType>`

### Cart Flow (Session-Based)
1. Backend uses `HttpSession.getId()` as cart identifier
2. Cart is persisted in PostgreSQL with `@OneToMany` relationship to `CartItem`
3. Frontend cart service maintains signals: `cart` and `cartSummary`
4. API endpoints:
   - `GET /api/cart` - retrieve session cart
   - `POST /api/cart/add` - body: `{ menuItemId, quantity }`
   - `POST /api/cart/remove` - body: `{ menuItemId, quantity }`
   - `GET /api/cart/summary` - returns `{ totalQuantity, totalCost, itemCount }`

## Technology Stack Specifics

- **Java Version**: 25 (configured in [pom.xml](backend/pom.xml))
- **Spring Boot**: 4.0.2 with Spring Security 6.x (lambda DSL for security config)
- **Angular**: 21.0.0 with Vitest for testing (not Jasmine/Karma)
- **Database**: PostgreSQL 15 with Hibernate DDL auto-update (`spring.jpa.hibernate.ddl-auto=update`)
- **Frontend Build**: Uses `@angular/build` (esbuild-based), not Webpack

## Static Resources

Images are served from `backend/src/main/resources/static/images/` with subdirectories:
- `restaurants/` - restaurant banner images
- `categories/` - category icons
- `menus/` - menu item photos

Access via: `http://localhost:8080/images/{subdirectory}/{filename}`

## Common Gotchas

1. **Port Conflicts**: If startup fails, check if ports 4200, 8080, or 5432 are already in use
2. **Docker Dependency**: Backend will not start without PostgreSQL running
3. **Session Cookies**: Cart functionality requires browser cookies enabled for session management
4. **Maven Wrapper**: Always use `.\mvnw.cmd` (Windows) or `./mvnw` (Unix) - not `mvn`
5. **Angular Errors**: Check `angular.log` if frontend compilation fails - TypeScript errors will block startup
6. **Database Schema**: Schema auto-updates on backend restart - be cautious with entity changes in production

## Debugging & Logs

- **Backend logs**: Console output from Spring Boot application
- **Frontend logs**: `angular.log` file created by quick-start script
- **Database queries**: Enable with `spring.jpa.show-sql=true` in [application.properties](backend/src/main/resources/application.properties)
