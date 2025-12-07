import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserType } from '@/types';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(() => {
    const stored = localStorage.getItem('accountType');
    console.log('UserContext init: accountType =', stored);
    return (stored as UserType) || 'individual';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    console.log('UserContext init: token =', token ? 'exists' : 'missing');
    return !!token;
  });

  console.log('UserProvider rendering:', { userType, isAuthenticated });

  useEffect(() => {
    localStorage.setItem('accountType', userType);
  }, [userType]);

  return (
    <UserContext.Provider value={{ userType, setUserType, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
