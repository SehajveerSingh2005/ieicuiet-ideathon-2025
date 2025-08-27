"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  adminUser: { email: string; name: string } | null;
  adminLoading: boolean;
  adminSignIn: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const ADMIN_NAME = 'Event Admin';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [adminLoading, setAdminLoading] = useState(true); // Start as loading

  // Load admin session from localStorage on mount
  useEffect(() => {
    const savedAdminSession = localStorage.getItem('adminSession');
    if (savedAdminSession) {
      try {
        const adminData = JSON.parse(savedAdminSession);
        setAdminUser(adminData);
      } catch (error) {
        console.error('Error loading admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }
    setAdminLoading(false);
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    setAdminLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check credentials against environment variables
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminData = { email: ADMIN_EMAIL, name: ADMIN_NAME };
      setAdminUser(adminData);
      
      // Save to localStorage for persistence
      localStorage.setItem('adminSession', JSON.stringify(adminData));
    } else {
      throw new Error('Invalid admin credentials');
    }
    
    setAdminLoading(false);
  };

  const adminLogout = async () => {
    setAdminUser(null);
    localStorage.removeItem('adminSession');
  };

  const isAdmin = !!adminUser;

  const value = {
    adminUser,
    adminLoading,
    adminSignIn,
    adminLogout,
    isAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
