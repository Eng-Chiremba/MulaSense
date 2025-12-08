import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import AddGoal from "./pages/AddGoal";
import EditGoal from "./pages/EditGoal";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessReports from "./pages/business/BusinessReports";
import ProfitLoss from "./pages/business/ProfitLoss";
import TaxCalculator from "./pages/business/TaxCalculator";
import CreditLine from "./pages/business/CreditLine";
import AIInsights from "./pages/AIInsights";
import AIAdvisor from "./pages/AIAdvisor";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import AddBudget from "./pages/AddBudget";
import BudgetDetail from "./pages/BudgetDetail";
import Kashagi from "./pages/Kashagi";
import IncomeExpenseReport from "./pages/IncomeExpenseReport";
import CategoryBreakdown from "./pages/CategoryBreakdown";
import ProfitLossReport from "./pages/ProfitLossReport";
import CashFlowReport from "./pages/CashFlowReport";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useUser();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions" element={
        <ProtectedRoute>
          <AppLayout>
            <Transactions />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions/add" element={
        <ProtectedRoute>
          <AppLayout>
            <AddTransaction />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions/edit/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <EditTransaction />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transactions/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <TransactionDetail />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/budget" element={
        <ProtectedRoute>
          <AppLayout>
            <Budget />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/budget/add" element={
        <ProtectedRoute>
          <AddBudget />
        </ProtectedRoute>
      } />
      
      <Route path="/budget/:id" element={
        <ProtectedRoute>
          <AppLayout>
            <BudgetDetail />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/budget/kashagi" element={
        <ProtectedRoute>
          <AppLayout>
            <Kashagi />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/goals" element={
        <ProtectedRoute>
          <AppLayout>
            <Goals />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/goals/add" element={
        <ProtectedRoute>
          <AddGoal />
        </ProtectedRoute>
      } />
      
      <Route path="/goals/edit/:id" element={
        <ProtectedRoute>
          <EditGoal />
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports/income-expense" element={
        <ProtectedRoute>
          <AppLayout>
            <IncomeExpenseReport />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports/category-breakdown" element={
        <ProtectedRoute>
          <AppLayout>
            <CategoryBreakdown />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports/profit-loss" element={
        <ProtectedRoute>
          <AppLayout>
            <ProfitLossReport />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports/cashflow" element={
        <ProtectedRoute>
          <AppLayout>
            <CashFlowReport />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/ai-insights" element={
        <ProtectedRoute>
          <AppLayout>
            <AIInsights />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/ai-advisor" element={
        <ProtectedRoute>
          <AppLayout>
            <AIAdvisor />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/business" element={
        <ProtectedRoute>
          <AppLayout>
            <BusinessDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/business/reports" element={
        <ProtectedRoute>
          <AppLayout>
            <BusinessReports />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/business/reports/profit-loss" element={
        <ProtectedRoute>
          <AppLayout>
            <ProfitLoss />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/business/tax" element={
        <ProtectedRoute>
          <AppLayout>
            <TaxCalculator />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/business/credit" element={
        <ProtectedRoute>
          <AppLayout>
            <CreditLine />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <ProtectedRoute>
          <AppLayout>
            <NotFound />
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
