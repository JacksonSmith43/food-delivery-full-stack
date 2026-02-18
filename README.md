# Food Delivery Full-Stack Application

A modern, full-stack food delivery platform built with **Spring Boot 4** and **Angular 21**. Browse restaurants, explore menus by category, manage your cart, and place orders through an intuitive Material Design interface.

## Table of Contents

- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Manual Setup](#-manual-setup)
- [Application URLs](#-application-urls)
- [Project Structure](#-project-structure)
- [Development Workflows](#-development-workflows)
- [Troubleshooting](#-troubleshooting)

## Technology Stack

### Frontend
- **Angular 21** - Standalone components architecture.
- **TypeScript 5.7** - Type-safe development.
- **Angular Material** - UI component library.
- **Signals** - Reactive state management.
- **RxJS** - Observables for HTTP requests.
- **Vitest** - Unit testing framework.
- **esbuild** - Fast build tooling.

### Backend
- **Spring Boot 4.0.2** - REST API framework.
- **Spring Security 6.x** - Authentication and authorisation
- **Spring Data JPA** - Database abstraction layer.
- **Hibernate** - ORM for PostgreSQL.
- **Java 25** - Latest LTS Java version.
- **Maven** - Dependency management and build tool.

### Database & DevOps
- **PostgreSQL 15** - Relational database.
- **Docker & Docker Compose** - Database containerisation.
- **pgAdmin 4** - Database administration UI.

## Prerequisites

Before running this application, ensure you have the following installed:

- **Java 25** - [Download JDK](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 20+** - [Download Node.js](https://nodejs.org/)
- **Docker Desktop** - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download Git](https://git-scm.com/)

**Verify installations:**
```powershell
java -version        # Should show Java 25.
node -v              # Should show v20 or higher.
docker --version     # Should show Docker version.
```

## Quick Start

**The fastest way to start the entire application:**

```powershell
# 1. Ensure Docker Desktop is running.

# 2. Run the orchestrated startup script.
.\quick-start.ps1
```

This script automatically:
1. Starts PostgreSQL and pgAdmin containers.
2. Builds and starts the Spring Boot backend.
3. Installs npm dependencies and starts the Angular frontend.
4. Opens the application in your browser at http://localhost:4200

## Manual Setup

If you prefer to start services individually or need to debug:

### Step 1: Start Docker Services (PostgreSQL + pgAdmin)

```powershell
docker-compose up -d
```

**What this does:**
- Starts PostgreSQL on port **5432**
- Starts pgAdmin on port **8081**
- Creates persistent volumes for data storage.

### Step 2: Start the Backend (Spring Boot)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**What this does:**
- Compiles Java application using Maven wrapper.
- Connects to PostgreSQL database.
- Seeds initial data (restaurants, categories, menu items).
- Starts REST API on port **8080**

### Step 3: Start the Frontend (Angular)

```powershell
cd frontend
npm install          # First time only, or after package.json changes.
npm start            # Equivalent to: ng serve
```

**What this does:**
- Installs Angular dependencies
- Compiles TypeScript with esbuild
- Uses proxy to forward `/api` and `/images` requests to backend
- Starts dev server on port **4200**

## Application URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | - |
| **Backend API** | http://localhost:8080/api | - |
| **Static Images** | http://localhost:8080/images | - |
| **pgAdmin** | http://localhost:8081 | Email: `admin@food-delivery.com`<br>Password: `admin123` |
| **PostgreSQL** | localhost:5432 | Database: `food_delivery`<br>User: `postgres`<br>Password: `postgres` |

## Project Structure

```
food-delivery-full-stack/
├── backend/
│   ├── src/main/java/com/fooddelivery/
│   │   ├── config/              # Security, CORS configuration
│   │   ├── controller/          # REST API endpoints
│   │   ├── entity/              # JPA entities (Restaurant, MenuItem, Cart, etc.)
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── service/             # Business logic layer
│   │   └── initialiser/         # Database seeding (@PostConstruct)
│   ├── src/main/resources/
│   │   ├── application.properties  # Spring configuration
│   │   └── static/images/       # Restaurant, category, menu images
│   └── pom.xml                  # Maven dependencies
│
├── frontend/
│   ├── src/app/
│   │   ├── auth/                # Login, Register components
│   │   ├── account/             # Profile management
│   │   ├── restaurants/         # Restaurant listing & details
│   │   ├── cart/                # Shopping cart component
│   │   ├── navbar/              # Navigation bar
│   │   └── shared/
│   │       ├── services/        # HTTP services (cart, restaurants, auth)
│   │       └── model/           # TypeScript interfaces
│   ├── angular.json             # Angular configuration
│   ├── proxy.conf.json          # Development proxy settings
│   └── package.json             # npm dependencies
│
├── docker-compose.yml           # PostgreSQL + pgAdmin setup
├── quick-start.ps1              # Orchestrated startup script
└── README.md                    # This file
```


## Development Workflows

### Running Tests

**Backend (Spring Boot):**
```powershell
cd backend
.\mvnw.cmd test
```

**Frontend (Angular with Vitest):**
```powershell
cd frontend
npm test
```

### Building for Production

**Backend:**
```powershell
cd backend
.\mvnw.cmd clean package
# Output: target/food-delivery-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```powershell
cd frontend
npm run build
# Output: dist/food-delivery-frontend/
```

### Database Management

**Reset Database (WARNING: Deletes all data):**
```powershell
docker-compose down -v  # Removes volumes.
docker-compose up -d    # Recreates with fresh data.
```


## Troubleshooting

### Port Already in Use

**Symptoms:** Application fails to start with "Address already in use" error.

**Solution:**
```powershell
# Check which process is using a port (e.g., 8080).
netstat -ano | findstr :8080

# Kill the process by PID.
taskkill /PID <PID> /F
```

### Docker Not Running

**Symptoms:** `docker-compose up` fails with connection error.

**Solution:**
1. Start Docker Desktop.
2. Wait for Docker engine to fully start (whale icon in system tray).
3. Run `docker ps` to verify Docker is responsive.

### Maven Build Fails

**Symptoms:** `.\mvnw.cmd` shows compilation errors.

**Solution:**
```powershell
# Clean Maven cache and rebuild.
.\mvnw.cmd clean install -U
```

### Angular Compilation Errors

**Symptoms:** Frontend shows TypeScript errors or won't compile.

**Solution:**
```powershell
# Clear node_modules and reinstall.
rm -r node_modules
rm package-lock.json
npm install
```
