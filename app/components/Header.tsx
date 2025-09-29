"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import CartIcon from "../../components/CartIcon";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Debug logs
  console.log('🎯 Header: user =', user);
  console.log('🎯 Header: user?.isVerified =', user?.isVerified);
  console.log('🎯 Header: Should show authenticated UI?', user && user.isVerified);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">MH</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ModularHouse
                </span>
                <div className="text-xs text-gray-500 -mt-1">Solutions Modulaires</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Produits
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions - Authentification */}
          <div className="hidden lg:flex items-center space-x-3">
            <CartIcon />
            {user && user.isVerified ? (
              <>
                <Link href="/billing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Paiement
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Paramètres
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-700 px-2">
                   {user.name?.split(' ')[0] || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md">
                  Se connecter
                </Link>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Devis Gratuit
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon />
            {user && user.isVerified ? (
              <span className="text-sm text-gray-700">
                {user.name?.split(' ')[0] || user.email}
              </span>
            ) : (
              <Link href="/login" className="text-blue-600 hover:text-blue-800 p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg rounded-b-lg">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                 Accueil
              </Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                 Produits
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                ℹ À propos
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                 Contact
              </Link>
              {user && (
                <>
                  <Link href="/billing" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                    💳 Paiement
                  </Link>
                  <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                    ⚙️ Paramètres
                  </Link>
                </>
              )}
              <div className="px-3 py-3 space-y-2">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    🚪 Déconnexion
                  </button>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      🔑 Se connecter
                    </Link>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                      📋 Devis Gratuit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
