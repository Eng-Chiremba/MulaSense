# MulaSense - Technology Stack

## Programming Languages

### Backend
- **Python 3.x**: Primary backend language
- **SQL**: Database queries (SQLite dialect)

### Frontend
- **TypeScript 5.8.3**: Primary frontend language with strict type checking
- **JavaScript (ES6+)**: Build scripts and configuration
- **CSS3**: Styling with Tailwind CSS
- **HTML5**: Markup

## Backend Technologies

### Core Framework
- **Django 5.2.8**: High-level Python web framework
- **Django REST Framework 3.15.2**: Toolkit for building Web APIs

### Database
- **SQLite**: Development database (included with Django)
- **Django ORM**: Object-relational mapping

### Authentication & Security
- **Django Token Authentication**: Token-based API authentication
- **Django CORS Headers 4.6.0**: Cross-Origin Resource Sharing support
- **Custom Permission Classes**: Role-based access control

### AI Integration
- **Google Generative AI 0.3.2**: Gemini AI integration for financial insights
- **Python Dotenv 1.0.0**: Environment variable management

### Report Generation
- **ReportLab 4.0.7**: PDF generation library
- **OpenPyXL 3.1.2**: Excel file generation and manipulation

### Python Dependencies
```
Django==5.2.8
djangorestframework==3.15.2
django-cors-headers==4.6.0
google-generativeai==0.3.2
python-dotenv==1.0.0
reportlab==4.0.7
openpyxl==3.1.2
```

## Frontend Technologies

### Core Framework
- **React 18.3.1**: UI library for building user interfaces
- **React DOM 18.3.1**: React rendering for web
- **TypeScript 5.8.3**: Static type checking

### Build Tools
- **Vite 7.2.6**: Fast build tool and dev server
- **@vitejs/plugin-react-swc 3.11.0**: React plugin with SWC compiler
- **ESLint 9.32.0**: Code linting
- **PostCSS 8.5.6**: CSS processing
- **Autoprefixer 10.4.21**: CSS vendor prefixing

### Mobile Framework
- **Capacitor 6.0.0**: Native mobile runtime
- **@capacitor/android 6.0.0**: Android platform support
- **@capacitor/ios 6.0.0**: iOS platform support
- **@capacitor/splash-screen 6.0.0**: Splash screen plugin
- **@capacitor/status-bar 6.0.0**: Status bar plugin

### UI Framework & Components
- **Shadcn UI**: Component library built on Radix UI
- **Radix UI**: Unstyled, accessible component primitives
  - Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Progress, Radio Group, Select, Slider
  - Switch, Tabs, Toast, Tooltip, and more
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **tailwindcss-animate 1.0.7**: Animation utilities
- **Lucide React 0.462.0**: Icon library
- **next-themes 0.3.0**: Theme management (dark/light mode)

### State Management
- **TanStack Query 5.83.0**: Server state management and caching
- **React Context API**: Global state management

### Form Management
- **React Hook Form 7.61.1**: Form state management and validation
- **@hookform/resolvers 3.10.0**: Validation schema resolvers
- **Zod 3.25.76**: TypeScript-first schema validation

### Routing
- **React Router DOM 6.30.1**: Client-side routing

### Data Visualization
- **Recharts 2.15.4**: Composable charting library

### HTTP Client
- **Axios 1.6.0**: Promise-based HTTP client

### Utility Libraries
- **class-variance-authority 0.7.1**: CSS class variance management
- **clsx 2.1.1**: Conditional className utility
- **tailwind-merge 2.6.0**: Tailwind class merging
- **date-fns 3.6.0**: Date utility library
- **cmdk 1.1.1**: Command menu component
- **sonner 1.7.4**: Toast notifications
- **vaul 0.9.9**: Drawer component
- **input-otp 1.4.2**: OTP input component
- **embla-carousel-react 8.6.0**: Carousel component

### Development Dependencies
```json
{
  "@types/node": "^22.16.5",
  "@types/react": "^18.3.23",
  "@types/react-dom": "^18.3.7",
  "@tailwindcss/typography": "^0.5.16",
  "typescript-eslint": "^8.38.0",
  "globals": "^15.15.0",
  "lovable-tagger": "^1.1.11"
}
```

## Development Tools

### Backend Development
- **Python Virtual Environment**: Isolated Python environment
- **Django Management Commands**: Custom management commands for setup
- **Django Admin**: Built-in admin interface
- **Django Debug Toolbar**: Development debugging (optional)

### Frontend Development
- **Vite Dev Server**: Hot module replacement (HMR)
- **TypeScript Compiler**: Type checking
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting (configured via ESLint)

### Version Control
- **Git**: Source control
- **.gitignore**: Configured for Python and Node.js projects

## API & Integration

### REST API
- **Django REST Framework**: RESTful API endpoints
- **Token Authentication**: Bearer token in headers
- **CORS**: Configured for cross-origin requests

### AI Services
- **Google Gemini API**: Natural language processing for financial insights
- **API Key Management**: Environment variable configuration

## Configuration Files

### Backend Configuration
- **settings.py**: Django project settings
- **urls.py**: URL routing configuration
- **.env**: Environment variables (API keys, secrets)
- **requirements.txt**: Python dependencies

### Frontend Configuration
- **vite.config.ts**: Vite build configuration
- **tsconfig.json**: TypeScript compiler options
- **tsconfig.app.json**: App-specific TypeScript config
- **tsconfig.node.json**: Node-specific TypeScript config
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration
- **eslint.config.js**: ESLint rules
- **capacitor.config.ts**: Capacitor mobile configuration
- **components.json**: Shadcn UI configuration
- **package.json**: Node dependencies and scripts

## Development Commands

### Backend Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Run tests
python manage.py test
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint

# Build and run Android
npm run android

# Build and run iOS
npm run ios
```

## Environment Variables

### Backend (.env)
```
GOOGLE_API_KEY=<your-gemini-api-key>
SECRET_KEY=<django-secret-key>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Browser & Platform Support

### Web Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

### Mobile Platforms
- Android 7.0+ (API level 24+)
- iOS 13.0+

## Performance Optimizations

### Backend
- Django ORM query optimization
- Database indexing
- Token-based authentication (stateless)

### Frontend
- Code splitting with React.lazy
- Tree shaking with Vite
- Asset optimization
- Lazy loading of routes
- TanStack Query caching
- Memoization with React.memo

## Security Features

### Backend
- CSRF protection
- SQL injection prevention (Django ORM)
- XSS protection
- Token authentication
- Permission-based access control
- Environment variable secrets

### Frontend
- Input sanitization
- Secure token storage
- HTTPS enforcement (production)
- Content Security Policy headers
