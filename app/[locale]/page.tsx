"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-blue-600">ModularHouse</span>
            </div>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('welcome')}
          </p>
        </header>

        {/* Success indicator */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full">
            <span className="text-2xl mr-3">✅</span>
            <span className="font-semibold">Système i18n fonctionnel !</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Link 
            href="/fr/products" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-3xl mb-3">🏘️</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('products')}</h3>
            <p className="text-gray-600 text-sm">Nos maisons modulaires</p>
          </Link>

          <Link 
            href="/fr/billing" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('billing')}</h3>
            <p className="text-gray-600 text-sm">Gestion des factures</p>
          </Link>

          <Link 
            href="/fr/admin" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
          >
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('admin')}</h3>
            <p className="text-gray-600 text-sm">Administration</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Langue</h3>
            <p className="text-blue-600 font-medium">Français 🇫🇷</p>
          </div>
        </div>
      </div>
    </div>
  );
}