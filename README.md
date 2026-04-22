# Fenmo - Personal Expense Tracker

# Database Selection
I went ahead with Postgres because
   - Flexibility it offers such as jsonb supports and customs types. It felt like most encompassing option
   - ACID Compliance
Things i wanted to implemented but couldn't due to time constraints are      
 - Pagination.
 - Monitoring and logging 
 - Rate limiting 

## Tech Stack
### Frontend
- **Next.js 14** 
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### Backend
- **NestJS** 
- **TypeORM** 
- **PostgreSQL** 

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fenmo
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Local Development

1. **Start the database**
   ```bash
   docker-compose up db
   ```

2. **Install dependencies and start backend**
   ```bash
   cd fenmo-be
   npm install
   npm run start:dev
   ```

3. **Install dependencies and start frontend**
   ```bash
   cd fenmo-fe
   npm install
   npm run dev
   ```
## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password
DB_NAME=fenmo_db
```

## Project Structure

```
fenmo/
├── docker-compose.yml
├── README.md
├── fenmo-be/                 # NestJS Backend
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── expense/
│   │   └── utilities/
│   ├── Dockerfile
│   └── package.json
├── fenmo-fe/                 # Next.js Frontend
│   ├── app/
│   ├── hooks/
│   ├── Dockerfile
│   └── package.json
```