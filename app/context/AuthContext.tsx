// app/context/AuthContext.tsx // Corrected comment to .tsx
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import User type
import { auth } from '@firebase/client';

// 1. Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loadingAuth: boolean;
}

// 2. Provide a type argument.
// Using 'undefined' as a default and checking in useAuth is a common pattern.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) { // 3. Typed children prop
  const [user, setUser] = useState<User | null>(null); // 4. Typed user state
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => { // Explicit return type
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error ensures the hook is used within an AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};