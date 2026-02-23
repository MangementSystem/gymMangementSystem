# 🏋️ Gym Management System - Backend API

A comprehensive NestJS-based backend API for gym management with authentication, authorization, and complete member management features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run start:dev

# API will be available at http://localhost:3001/api
```

## 📋 Features

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Refresh token support
- Password hashing with bcrypt
- Public/Protected routes

### ✅ User Management
- User registration and login
- Profile management
- Role assignment (Super Admin, Admin, Trainer, Member)
- Status tracking (Active, Inactive, Suspended)

### ✅ Gym Management
- Organization management
- Member management
- Membership plans
- Transaction tracking
- Attendance logging
- Progress tracking

### ✅ Workout Management
- Exercise library
- Workout programs
- Workout logging
- AI-powered exercise analysis
- AI insights and recommendations

## 🏗️ Architecture

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   ├── core/                    # Core utilities & constants
│   ├── organizations/           # Organization management
│   ├── members/                 # Member management
│   ├── plans/                   # Membership plans
│   ├── memberships/             # Active memberships
│   ├── transactions/            # Payment transactions
│   ├── attendance-devices/      # Attendance hardware
│   ├── attendance-logs/         # Attendance records
│   ├── progress/                # Member progress tracking
│   ├── exercises/               # Exercise library
│   ├── workout-programs/        # Workout programs
│   ├── workout-logs/            # Workout session logs
│   ├── ai-exercise-analysis/    # AI exercise analysis
│   └── ai-insights/             # AI-powered insights
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json                 # Dependencies
```

## 🔐 Authentication

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "member"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | System administrator | Full system access |
| **Admin** | Gym administrator | Manage organization, members, trainers |
| **Trainer** | Fitness trainer | Manage assigned members, create programs |
| **Member** | Gym member | View profile, track progress |

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh access token

### Organizations
- `GET /api/organizations` - List all organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Members
- `GET /api/members` - List all members
- `POST /api/members` - Create member
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Plans
- `GET /api/plans` - List all plans
- `POST /api/plans` - Create plan
- `GET /api/plans/:id` - Get plan details
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Memberships
- `GET /api/memberships` - List all memberships
- `POST /api/memberships` - Create membership
- `GET /api/memberships/:id` - Get membership details
- `PUT /api/memberships/:id` - Update membership
- `DELETE /api/memberships/:id` - Delete membership

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction details

### Attendance
- `GET /api/attendance-logs` - List attendance logs
- `POST /api/attendance-logs` - Log attendance
- `GET /api/attendance-devices` - List devices

### Workouts
- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create exercise
- `GET /api/workout-programs` - List programs
- `POST /api/workout-programs` - Create program
- `GET /api/workout-logs` - List workout logs
- `POST /api/workout-logs` - Log workout

### AI Features
- `POST /api/ai-exercise-analysis` - Analyze exercise
- `GET /api/ai-insights` - Get AI insights

## 🔧 Environment Variables

```env
# Application
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📦 Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugging

# Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run e2e tests

# Code Quality
npm run lint               # Run linter
npm run format             # Format code with Prettier

# Database
npm run seed               # Seed database
```

## 🗄️ Database

### PostgreSQL Setup

```bash
# Create database
createdb gym_management

# Or using psql
psql -U postgres
CREATE DATABASE gym_management;
```

### TypeORM Configuration

The application uses TypeORM with automatic entity loading and synchronization in development mode.

**⚠️ Production:** Set `synchronize: false` and use migrations.

## 🔒 Security

### Best Practices Implemented

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Role-based authorization
✅ Input validation with class-validator
✅ CORS protection
✅ SQL injection prevention (TypeORM)
✅ XSS protection
✅ Rate limiting ready

### Production Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure specific CORS origins
- [ ] Enable HTTPS
- [ ] Set synchronize: false in TypeORM
- [ ] Use database migrations
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Use helmet for security headers

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Manual Testing

Use Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:3001/api

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

## 📚 Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL
- **ORM:** TypeORM 0.3
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator
- **Documentation:** (Swagger - to be added)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ using NestJS**
