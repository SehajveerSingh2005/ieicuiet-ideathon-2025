"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/app/components/ui/button";
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Users, LogOut, User, Shield, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useFirebaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@techovation.com' || user?.email === 'admin@example.com' || user?.email?.includes('admin');

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
              <h1 className="text-xl font-bold gradient-text">Cre'oVate 2025</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Igniting Creativity, Driving Innovations</p>
            </div>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="md:hidden p-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

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

          {/* User Actions - Only shown on desktop for logged out users */}
          <div className="hidden md:flex items-center space-x-3">
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
                  <span className="hidden sm:inline">Logout</span>
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
                    <span className="hidden sm:inline">Login</span>
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
                    <span className="hidden sm:inline">Register Team</span>
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
                     <span className="hidden sm:inline">Admin</span>
                   </Button>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              href="/leaderboard" 
              className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Leaderboard
            </Link>
            <Link 
              href="/vote" 
              className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              Vote
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={closeMenu}
              >
                Admin
              </Link>
            )}
            
            {/* Mobile User Actions */}
            {!user && (
              <div className="pt-4 border-t border-muted-foreground/20 space-y-3">
                <Link 
                  href="/login" 
                  className="block w-full"
                  onClick={closeMenu}
                >
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="w-full btn-animate text-muted-foreground hover:text-foreground hover:bg-muted/10 justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                
                <Link 
                  href="/register" 
                  className="block w-full"
                  onClick={closeMenu}
                >
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full btn-animate border-2 border-primary/20 text-primary hover:bg-primary/10 justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Register Team
                  </Button>
                </Link>
                
                <Link 
                  href="/admin/login" 
                  className="block w-full"
                  onClick={closeMenu}
                >
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="w-full btn-animate text-muted-foreground hover:text-foreground hover:bg-muted/10 justify-start"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-4 border-t border-muted-foreground/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">
                      {user.displayName || 'Team'}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    variant="outline"
                    size="sm"
                    className="btn-animate border-2 border-muted-foreground/20 text-foreground hover:bg-muted/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}