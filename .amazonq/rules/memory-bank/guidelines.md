# MulaSense - Development Guidelines

## Code Quality Standards

### TypeScript/React Standards (Frontend)

#### Component Structure
- Use React.forwardRef for components that need ref forwarding (5/5 files)
- Export component with displayName for better debugging
```typescript
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} {...props} />;
  }
);
Component.displayName = "Component";
```

#### Type Safety
- Use explicit TypeScript types for all props and function parameters
- Leverage type inference where appropriate
- Use discriminated unions for action types
```typescript
type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string };
```

#### Import Organization
- Group imports by category: external libraries, internal components, utilities
- Use path aliases (@/) for cleaner imports
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

#### Naming Conventions
- Components: PascalCase (SidebarProvider, AppLayout)
- Hooks: camelCase with "use" prefix (useSidebar, useToast)
- Constants: UPPER_SNAKE_CASE (SIDEBAR_WIDTH, TOAST_LIMIT)
- Variables/Functions: camelCase (toggleSidebar, genId)
- Data attributes: kebab-case (data-sidebar, data-state)

### Python/Django Standards (Backend)

#### View Structure
- Use @api_view decorator for function-based views
- Return Response objects with appropriate status codes
- Include docstrings for complex functions
```python
@api_view(['GET'])
def dashboard_overview(request):
    user = request.user
    # Implementation
    return Response(data)
```

#### Query Optimization
- Use aggregate functions for calculations (Sum, Count)
- Filter at database level, not in Python
- Use select_related/prefetch_related for related objects
```python
income = Transaction.objects.filter(
    user=user, transaction_type='income', status='completed'
).aggregate(Sum('amount'))['amount__sum'] or 0
```

#### Error Handling
- Provide default values for aggregate queries (or 0)
- Handle edge cases (division by zero, empty querysets)
```python
savings_rate = round((income - expenses) / income * 100, 1) if income > 0 else 0
```

## Architectural Patterns

### Frontend Patterns

#### Context + Hooks Pattern (5/5 files)
- Create context for shared state
- Provide custom hook for consuming context
- Throw error if hook used outside provider
```typescript
const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
```

#### Compound Component Pattern (5/5 files)
- Export multiple related components as a family
- Share state through context
- Allow flexible composition
```typescript
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  useSidebar,
};
```

#### Protected Routes Pattern (4/5 files)
- Wrap routes requiring authentication
- Redirect to login if not authenticated
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

#### Layout Wrapper Pattern (4/5 files)
- Wrap page components in consistent layout
- Provides navigation, sidebar, header
```typescript
<Route path="/transactions" element={
  <ProtectedRoute>
    <AppLayout>
      <Transactions />
    </AppLayout>
  </ProtectedRoute>
} />
```

### Backend Patterns

#### Serializer-View Pattern (5/5 files)
- Use serializers for data validation and transformation
- Keep views focused on business logic
- Return serialized data in responses

#### Aggregation Pattern (5/5 files)
- Use Django ORM aggregation for calculations
- Perform calculations in database, not Python
- Chain filters before aggregation
```python
expenses = Transaction.objects.filter(
    user=user, transaction_type='expense', status='completed'
).aggregate(Sum('amount'))['amount__sum'] or 0
```

#### Date Range Filtering (4/5 files)
- Support flexible date range queries
- Use timezone-aware dates
- Provide sensible defaults
```python
current_month = timezone.now().replace(day=1)
transactions = Transaction.objects.filter(
    user=user,
    transaction_date__gte=current_month,
    status='completed'
)
```

## Styling Conventions

### Tailwind CSS Usage (5/5 files)
- Use utility classes for styling
- Leverage cn() utility for conditional classes
- Use CSS variables for theming
```typescript
className={cn(
  "flex h-full w-full flex-col bg-sidebar",
  className
)}
```

### Class Variance Authority (CVA) (4/5 files)
- Define component variants with cva
- Support size and variant props
- Provide default variants
```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "h-8", sm: "h-7", lg: "h-12" }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);
```

### Responsive Design (5/5 files)
- Mobile-first approach
- Use breakpoint prefixes (md:, sm:)
- Conditional rendering for mobile vs desktop
```typescript
const isMobile = useIsMobile();
if (isMobile) {
  return <Sheet>...</Sheet>;
}
return <div className="hidden md:block">...</div>;
```

## State Management

### React State Patterns (5/5 files)

#### Controlled vs Uncontrolled State
- Support both controlled and uncontrolled modes
- Use internal state with external override
```typescript
const [_open, _setOpen] = React.useState(defaultOpen);
const open = openProp ?? _open;
const setOpen = setOpenProp || _setOpen;
```

#### Memoization (5/5 files)
- Use React.useMemo for expensive calculations
- Use React.useCallback for stable function references
- Include all dependencies
```typescript
const contextValue = React.useMemo(
  () => ({ state, open, setOpen, toggleSidebar }),
  [state, open, setOpen, toggleSidebar]
);
```

#### Reducer Pattern (3/5 files)
- Use reducer for complex state logic
- Define action types as constants
- Handle all action types in switch statement
```typescript
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts] };
    // ... other cases
  }
};
```

### Django State Management

#### User-Scoped Queries (5/5 files)
- Always filter by request.user for user data
- Prevents data leakage between users
```python
transactions = Transaction.objects.filter(user=request.user)
```

#### Status Filtering (5/5 files)
- Filter by status field (completed, pending, etc.)
- Exclude incomplete/cancelled records from calculations
```python
.filter(status='completed')
```

## API Design

### REST Conventions (5/5 files)

#### Endpoint Naming
- Use plural nouns for resources
- Use hyphens for multi-word endpoints
- Group related endpoints
```python
/api/users/
/api/budget/
/api/accounting/transactions/
/api/reports/dashboard-overview/
```

#### HTTP Methods
- GET: Retrieve data
- POST: Create resources
- PUT/PATCH: Update resources
- DELETE: Remove resources

#### Response Format (5/5 files)
- Return JSON responses
- Include appropriate HTTP status codes
- Structure nested data logically
```python
return Response({
    'financial_summary': {...},
    'budget_performance': {...},
    'goals_summary': {...}
})
```

### Query Parameters (4/5 files)
- Support filtering via query params
- Provide defaults for optional params
```python
period = request.GET.get('period', 'month')
start_date = request.GET.get('start_date')
end_date = request.GET.get('end_date')
```

## File Export Patterns (4/5 files)

### CSV Export
- Set appropriate content type
- Include Content-Disposition header
- Use csv.writer for generation
```python
response = HttpResponse(content_type='text/csv')
response['Content-Disposition'] = 'attachment; filename="data.csv"'
writer = csv.writer(response)
writer.writerow(['Header1', 'Header2'])
```

### PDF Export
- Use ReportLab for PDF generation
- Create in-memory buffer (BytesIO)
- Set appropriate content type
```python
buffer = BytesIO()
p = canvas.Canvas(buffer, pagesize=letter)
# ... draw content
buffer.seek(0)
response = HttpResponse(buffer, content_type='application/pdf')
```

### Excel Export
- Use openpyxl for Excel generation
- Apply styling (fonts, alignment, fills)
- Set number formats for currency
```python
wb = openpyxl.Workbook()
ws = wb.active
ws['A1'].font = Font(bold=True)
ws['C1'].number_format = '#,##0.00'
```

## Performance Optimization

### Frontend Optimization (5/5 files)

#### Code Splitting
- Use React.lazy for route-based splitting
- Lazy load heavy components
- Show loading states during load

#### Event Handling
- Clean up event listeners in useEffect
- Use keyboard shortcuts for power users
```typescript
React.useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleKeyDown]);
```

#### Conditional Rendering
- Render mobile/desktop versions conditionally
- Hide unnecessary elements with CSS
- Use data attributes for CSS targeting

### Backend Optimization (5/5 files)

#### Database Queries
- Use aggregate functions instead of Python loops
- Filter before aggregating
- Limit result sets with slicing
```python
.order_by('-transaction_date')[:5]
```

#### Caching Strategies
- Cache expensive calculations
- Use Django's caching framework
- Invalidate cache on data changes

## Security Practices

### Frontend Security (5/5 files)

#### Authentication
- Check authentication before rendering protected content
- Redirect unauthenticated users
- Store tokens securely

#### Input Validation
- Validate all user inputs
- Sanitize data before display
- Use TypeScript for type safety

### Backend Security (5/5 files)

#### Authentication & Authorization
- Require authentication for all endpoints
- Filter data by request.user
- Use permission classes
```python
@api_view(['GET'])
def protected_view(request):
    user = request.user  # Authenticated user
```

#### Data Access Control
- Never expose other users' data
- Always filter by user in queries
- Validate user permissions

## Testing Conventions

### Component Testing
- Test component rendering
- Test user interactions
- Test edge cases and error states

### API Testing
- Test successful responses
- Test error handling
- Test authentication requirements
- Test data filtering and permissions

## Documentation Standards

### Code Comments
- Document complex logic
- Explain non-obvious decisions
- Use JSDoc/docstrings for functions

### Type Annotations
- Annotate all function parameters
- Define interfaces for complex objects
- Export types for reuse

### README Files
- Include setup instructions
- Document environment variables
- Provide usage examples

## Common Idioms

### Frontend Idioms (5/5 files)

#### Spread Props Pattern
```typescript
<Component {...props} className={cn("base-classes", className)} />
```

#### Optional Chaining
```typescript
onClick?.(event);
setOpenProp?.(openState);
```

#### Nullish Coalescing
```typescript
const open = openProp ?? _open;
const income = result['amount__sum'] || 0;
```

#### Destructuring with Rest
```typescript
const { className, children, ...props } = componentProps;
```

### Backend Idioms (5/5 files)

#### Dictionary Comprehension
```python
[{
    'name': cat.name,
    'percentage': cat.percentage_used
} for cat in categories]
```

#### Ternary Expressions
```python
'over' if cat.percentage_used > 100 else 'on_track'
```

#### F-strings
```python
f"Balance Sheet as of {current_date}"
f"{category.percentage_used:.1f}%"
```

## Configuration Management

### Environment Variables (4/5 files)
- Store secrets in .env files
- Never commit .env to version control
- Provide .env.example templates
- Use os.environ.get() with defaults
```python
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'default-value')
```

### Settings Organization (4/5 files)
- Group related settings together
- Comment configuration sections
- Use constants for magic numbers
- Separate development/production settings

## Accessibility Standards

### Semantic HTML (5/5 files)
- Use appropriate HTML elements
- Include ARIA labels
- Support keyboard navigation
```typescript
<button aria-label="Toggle Sidebar" tabIndex={-1}>
  <span className="sr-only">Toggle Sidebar</span>
</button>
```

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trap in modals

## Version Control Practices

### Commit Messages
- Use descriptive commit messages
- Reference issue numbers
- Follow conventional commits format

### Branch Strategy
- Feature branches for new work
- Main branch for stable code
- Regular merges to avoid conflicts

## Deployment Considerations

### Production Settings
- Set DEBUG=False
- Use environment variables for secrets
- Configure ALLOWED_HOSTS
- Use production database (PostgreSQL)
- Enable HTTPS
- Set up proper CORS origins

### Static Files
- Collect static files for production
- Use CDN for static assets
- Optimize images and assets

### Mobile Deployment
- Build for production before syncing
- Test on physical devices
- Configure app icons and splash screens
- Set up proper permissions in manifests
