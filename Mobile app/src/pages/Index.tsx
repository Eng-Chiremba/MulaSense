import Dashboard from './Dashboard';
import BusinessDashboard from './business/BusinessDashboard';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  console.log('Index component rendering');
  const { userType } = useUser();
  console.log('User type:', userType);

  if (userType === 'individual') {
    console.log('Rendering Dashboard');
    return <Dashboard />;
  } else {
    console.log('Rendering BusinessDashboard');
    return <BusinessDashboard />;
  }
};

export default Index;
