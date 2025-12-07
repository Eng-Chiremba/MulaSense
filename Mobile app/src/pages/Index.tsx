import Dashboard from './Dashboard';
import BusinessDashboard from './business/BusinessDashboard';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { userType } = useUser();

  return userType === 'individual' ? <Dashboard /> : <BusinessDashboard />;
};

export default Index;
