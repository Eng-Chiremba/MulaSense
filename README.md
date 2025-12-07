# MulaSense

A comprehensive financial management system with AI-powered insights, built with Django REST Framework and React Native.

## Overview

MulaSense is a full-stack financial management application that provides budgeting, accounting, reporting, and AI-driven financial analysis capabilities. The system features a Django backend API and a cross-platform mobile application built with React, TypeScript, and Capacitor.

## Features

- User authentication and authorization with role-based permissions
- Budget planning and tracking
- Accounting and transaction management
- **🤖 AI-powered financial advisor with real-time chat**
- **💡 Automated financial insights and personalized recommendations**
- Comprehensive reporting with PDF and Excel export
- Cross-platform mobile application (Android/iOS)
- RESTful API with token authentication

## Technology Stack

### Backend
- Django 5.2.8
- Django REST Framework 3.15.2
- SQLite database
- Google Generative AI integration
- ReportLab for PDF generation
- OpenPyXL for Excel reports

### Frontend/Mobile
- React 18.3.1
- TypeScript
- Vite
- Capacitor 6.0
- Shadcn UI components
- TanStack Query
- React Router
- Recharts for data visualization
- Tailwind CSS

## Project Structure

```
MulaSense/
├── accounting/          # Accounting module
├── ai/                  # AI integration module
├── budget/              # Budget management module
├── reports/             # Reporting module
├── users/               # User management and authentication
├── MulaSense/           # Django project settings
├──
├── manage.py            # Django management script
└── requirements.txt     # Python dependencies
```

## Installation

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd MulaSense
```

2. Create and activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run migrations
```bash
python manage.py migrate
```

5. Create superuser
```bash
python manage.py createsuperuser
```

6. Start development server
```bash
python manage.py runserver
```

### Mobile App Setup

1. Navigate to mobile app directory
```bash
cd "Mobile app"
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Build for mobile platforms
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## API Documentation

The API is accessible at `http://localhost:8000/api/` and includes the following endpoints:

- `/api/users/` - User management
- `/api/budget/` - Budget operations
- `/api/accounting/` - Accounting transactions
- `/api/ai/` - AI-powered insights and chat
  - `POST /api/ai/chat/` - Interactive AI chat
  - `GET /api/ai/insights/` - Financial insights
  - `GET /api/ai/recommendations/` - Personalized recommendations
  - `GET /api/ai/conversations/` - Chat history
  - `POST /api/ai/business-advisor/` - Business advice
- `/api/reports/` - Report generation

## AI Financial Advisor Setup

1. Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/keys)
2. Edit `.env` file and add your key: `OPENROUTER_API_KEY=your-key-here`
3. Install dependencies: `pip install -r requirements.txt`
4. Start backend: `python manage.py runserver`
5. Start frontend: `cd "Mobile app" && npm run dev`

## Configuration

### Backend Configuration
- Configure database settings in `MulaSense/settings.py`
- Set up CORS origins for frontend communication
- Configure AI API keys in environment variables (see AI setup above)

### Mobile App Configuration
- Update API endpoints in the mobile app configuration
- Configure Capacitor for platform-specific settings

## Team

### University of Zimbabwe

**Team Leader:**
- Chessmore Chiremba

**Team Members:**
- Tinashe Chikoko
- Anesu Manderbvu

## License

This project is developed as part of academic work at the University of Zimbabwe.

## Contributing

This is an academic project. For contributions or inquiries, please contact the team leader.

## Support

For issues or questions, please contact the development team through the University of Zimbabwe.
