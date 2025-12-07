# MulaSense - Project Structure

## Architecture Overview
MulaSense follows a monorepo structure with a Django REST Framework backend and a React/TypeScript mobile application. The architecture is modular, with clear separation between backend services and frontend presentation.

## Directory Structure

```
MulaSense/
├── accounting/              # Accounting module
├── ai/                      # AI integration module
├── budget/                  # Budget management module
├── reports/                 # Reporting module
├── users/                   # User management module
├── MulaSense/               # Django project configuration
├── Mobile app/              # React Native mobile application
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
└── db.sqlite3              # SQLite database
```

## Backend Structure (Django)

### Core Django Modules

#### users/ - User Management & Authentication
- **Purpose**: Handles user registration, authentication, and profile management
- **Key Components**:
  - Custom user model with phone number authentication
  - User profile with business information
  - Role-based permissions system
  - Token authentication
- **Files**:
  - `models.py`: User and UserProfile models
  - `serializers.py`: User data serialization
  - `views.py`: Authentication endpoints (register, login, profile)
  - `permissions.py`: Custom permission classes
  - `validators.py`: Phone number and data validation

#### budget/ - Budget Management
- **Purpose**: Budget creation, tracking, and analysis
- **Key Components**:
  - Budget models with categories
  - Budget vs. actual tracking
  - Period-based budgeting
  - Budget permissions
- **Files**:
  - `models.py`: Budget, BudgetCategory models
  - `serializers.py`: Budget data serialization
  - `views.py`: Budget CRUD operations
  - `permissions.py`: Budget access control

#### accounting/ - Transaction Management
- **Purpose**: Financial transaction tracking and account management
- **Key Components**:
  - Transaction recording (income/expense)
  - Account management
  - Transaction categorization
  - Management commands for data setup
- **Files**:
  - `models.py`: Transaction, Account models
  - `serializers.py`: Transaction data serialization
  - `views.py`: Transaction CRUD operations
  - `management/commands/`: Setup scripts

#### ai/ - AI Integration
- **Purpose**: Google Generative AI integration for financial insights
- **Key Components**:
  - Financial analysis using Gemini AI
  - Spending pattern recognition
  - Budget recommendations
  - Predictive analytics
- **Files**:
  - `models.py`: AI interaction history
  - `serializers.py`: AI request/response serialization
  - `views.py`: AI insight endpoints

#### reports/ - Report Generation
- **Purpose**: Financial report generation in multiple formats
- **Key Components**:
  - PDF report generation (ReportLab)
  - Excel export (OpenPyXL)
  - Custom date range reports
  - Visual charts and graphs
- **Files**:
  - `models.py`: Report configuration models
  - `serializers.py`: Report data serialization
  - `views.py`: Report generation endpoints

#### MulaSense/ - Project Configuration
- **Purpose**: Django project settings and configuration
- **Files**:
  - `settings.py`: Django configuration, CORS, database, installed apps
  - `urls.py`: Root URL configuration
  - `wsgi.py`: WSGI application entry point
  - `asgi.py`: ASGI application entry point

## Frontend Structure (Mobile App)

### Mobile app/ - React TypeScript Application

#### src/components/ - UI Components
- **ui/**: Shadcn UI components (buttons, cards, dialogs, forms, etc.)
- **layout/**: Layout components (sidebar, header, navigation)
- **features/**: Feature-specific components (dashboard widgets, transaction forms)

#### src/pages/ - Application Pages
- **Dashboard**: Financial overview with metrics and charts
- **Transactions**: Transaction list and management
- **Budget**: Budget planning and tracking
- **Goals**: Financial goal management
- **Reports**: Report generation and viewing
- **Profile**: User profile and settings
- **Auth**: Login and registration pages

#### src/services/ - API Integration
- **api.ts**: Axios configuration and API client
- **auth.service.ts**: Authentication API calls
- **budget.service.ts**: Budget API calls
- **transaction.service.ts**: Transaction API calls
- **ai.service.ts**: AI insights API calls

#### src/contexts/ - React Context
- **AuthContext**: User authentication state
- **ThemeContext**: Theme management (dark/light mode)

#### src/hooks/ - Custom React Hooks
- **use-toast.ts**: Toast notification hook
- **use-mobile.ts**: Mobile detection hook
- **use-auth.ts**: Authentication hook

#### src/types/ - TypeScript Definitions
- Type definitions for API responses
- Component prop types
- Domain models (User, Transaction, Budget, etc.)

#### src/lib/ - Utility Functions
- **utils.ts**: Helper functions (cn, formatters)
- **constants.ts**: Application constants

#### src/data/ - Mock Data
- Mock data for development and testing
- Fallback data when API is unavailable

#### Configuration Files
- **capacitor.config.ts**: Capacitor mobile configuration
- **vite.config.ts**: Vite build configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

## Architectural Patterns

### Backend Patterns

#### Django REST Framework Architecture
- **Model-Serializer-View Pattern**: Each module follows Django's MVT pattern with DRF serializers
- **ViewSets**: Use DRF ViewSets for CRUD operations
- **Token Authentication**: Token-based authentication for API security
- **Permission Classes**: Custom permission classes for access control

#### Module Organization
- Each Django app is self-contained with models, views, serializers, and URLs
- Migrations stored per app
- Management commands for data setup and maintenance

### Frontend Patterns

#### Component Architecture
- **Atomic Design**: Components organized from atoms (buttons) to organisms (forms)
- **Shadcn UI**: Reusable, accessible UI components
- **Composition Pattern**: Components composed from smaller components

#### State Management
- **React Context**: Global state (auth, theme)
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management

#### Routing
- **React Router**: Client-side routing with protected routes
- **Lazy Loading**: Code splitting for performance

#### API Integration
- **Axios**: HTTP client with interceptors
- **Service Layer**: Abstracted API calls in service files
- **Error Handling**: Centralized error handling with toast notifications

## Data Flow

### Authentication Flow
1. User submits credentials via mobile app
2. Frontend sends POST to `/api/users/login/`
3. Backend validates and returns auth token
4. Token stored in localStorage/Context
5. Token included in subsequent API requests

### Transaction Flow
1. User creates transaction in mobile app
2. Frontend sends POST to `/api/accounting/transactions/`
3. Backend validates and saves to database
4. Response returned to frontend
5. UI updates with new transaction

### AI Insights Flow
1. User requests insights in mobile app
2. Frontend sends POST to `/api/ai/insights/`
3. Backend fetches user financial data
4. Backend calls Google Generative AI API
5. AI response processed and returned
6. Frontend displays insights

## Database Schema

### Core Models
- **User**: Custom user model with phone authentication
- **UserProfile**: Extended user information
- **Budget**: Budget definitions with periods
- **BudgetCategory**: Budget categories and limits
- **Transaction**: Financial transactions (income/expense)
- **Account**: Financial accounts (bank, cash, credit)
- **Goal**: Financial goals and targets
- **Report**: Report configurations

### Relationships
- User → UserProfile (One-to-One)
- User → Budget (One-to-Many)
- Budget → BudgetCategory (One-to-Many)
- User → Transaction (One-to-Many)
- User → Account (One-to-Many)
- User → Goal (One-to-Many)

## Build and Deployment

### Backend
- **Development**: `python manage.py runserver`
- **Database**: SQLite (development), PostgreSQL (production recommended)
- **Static Files**: Django static file handling

### Frontend
- **Development**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (Production build)
- **Android**: `npm run android` (Build and sync to Android)
- **iOS**: `npm run ios` (Build and sync to iOS)
- **Preview**: `npm run preview` (Preview production build)
