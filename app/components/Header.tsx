"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/app/components/ui/button";
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Users, LogOut, User, Shield } from 'lucide-react';

export default function Header() {
  const { user, logout } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@techovation.com' || user?.email === 'admin@example.com' || user?.email?.includes('admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-foreground shadow-lg">
              <Image src="/image.png" alt="Club Logo" width={48} height={48} className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Cre&apos;oVate 2025</h1>
              <p className="text-xs text-muted-foreground">Igniting Creativity, Driving Innovations</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/vote" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Vote
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Team Info */}
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">
                    {user.displayName || 'Team'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="btn-animate text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                
                {/* Register Button */}
                <Link href="/register">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Register Team
                  </Button>
                </Link>
                 {/* Admin Login Button */}
                 <Link href="/admin/login">
                   <Button 
                     variant="ghost"
                     size="sm"
                     className="btn-animate text-muted-foreground hover:text-foreground hover:bg-muted/10"
                   >
                     <Shield className="w-4 h-4 mr-2" />
                     Admin
                   </Button>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}