# MulaSense Mobile App

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Django backend running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL:
Edit `.env` file and set your backend URL:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

### Backend Connection

The app will automatically:
- Try to connect to the backend API
- Fall back to mock data if backend is unavailable
- Show loading states while fetching data

### Running with Backend

1. Start Django backend:
```bash
cd ..
python manage.py runserver
```

2. Start frontend (in another terminal):
```bash
npm run dev
```

### Running with Mock Data Only

If you want to test without the backend:
- The app will automatically use mock data when API calls fail
- All pages will work with sample data

### Features

- **Dashboard**: Financial overview with metrics
- **Transactions**: Income/expense tracking
- **Budget**: Budget planning and monitoring
- **Goals**: Financial goal tracking
- **Reports**: Financial analytics and reports
- **Profile**: User profile management
- **Settings**: App preferences

### Authentication

Default test credentials (if backend is running):
- Phone: +263 77 123 4567
- Password: test123

Or create a new account via the Register page.

### Troubleshooting

**Blank pages:**
- Check browser console for errors
- Ensure backend is running on correct port
- Check `.env` file has correct API URL
- Clear browser cache and localStorage

**API errors:**
- Verify Django backend is running
- Check CORS settings in Django
- Ensure token authentication is configured

**Mock data not showing:**
- Check browser console for JavaScript errors
- Verify all dependencies are installed
- Try clearing node_modules and reinstalling
