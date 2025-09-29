'use client';

import React, { useState, useEffect } from 'react';
import { BoltIcon, UsersIcon, CreditCardIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { isAdminAuthenticated, logoutAdmin } from '../../lib/adminAuth';
import LoginAdmin from './components/LoginAdmin';
import ClientManager from './components/ClientManager';
import RealTimeUsers from './components/RealTimeUsers';
import RealTimeBillingData from './components/RealTimeBillingData';

type AdminView = 'clients' | 'realtime' | 'billing';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AdminView>('realtime');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <LoginAdmin onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'realtime':
        return <RealTimeUsers />;
      case 'clients':
        return <ClientManager />;
      case 'billing':
        return <RealTimeBillingData />;
      default:
        return <RealTimeUsers />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation responsive */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            {/* Navigation tabs */}
            <nav className="flex overflow-x-auto sm:space-x-4" aria-label="Tabs">
              <button
                onClick={() => setCurrentView('realtime')}
                className={`whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 ${
                  currentView === 'realtime'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <BoltIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Temps Réel</span>
              </button>
              <button
                onClick={() => setCurrentView('clients')}
                className={`whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 ${
                  currentView === 'clients'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Clients</span>
              </button>
              <button
                onClick={() => setCurrentView('billing')}
                className={`whitespace-nowrap py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-2 ${
                  currentView === 'billing'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <CreditCardIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Facturation</span>
              </button>
            </nav>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mt-2 sm:mt-0 px-3 py-2 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 pb-20">
        {renderContent()}
      </div>
    </div>
  );
}