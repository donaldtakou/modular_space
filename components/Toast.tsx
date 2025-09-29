'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'cart';
  isVisible: boolean;
  onClose: () => void;
  productName?: string;
  productImage?: string;
}

export default function Toast({ message, type, isVisible, onClose, productName, productImage }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Délai pour l'animation de sortie
      }, 4000); // Affichage plus long pour les toasts avec produit

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500',
      text: 'text-green-800',
      icon: 'text-green-500'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500',
      text: 'text-red-800',
      icon: 'text-red-500'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500',
      text: 'text-blue-800',
      icon: 'text-blue-500'
    },
    cart: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-emerald-500',
      text: 'text-emerald-800',
      icon: 'text-emerald-500'
    }
  }[type];

  const icon = {
    success: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    cart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
      </svg>
    )
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
    }`}>
      <div className={`${styles.bg} shadow-xl rounded-lg max-w-sm overflow-hidden`}>
        {type === 'cart' && productName ? (
          // Toast spécial pour l'ajout au panier avec image produit
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${styles.icon}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${styles.text}`}>
                      Produit ajouté au panier !
                    </p>
                    <p className={`text-xs ${styles.text} opacity-80 mt-1`}>
                      {productName}
                    </p>
                  </div>
                  {productImage && (
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 ml-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onClose();
                      // Ouvrir le panier (on peut ajouter cette fonctionnalité plus tard)
                    }}
                    className={`text-xs ${styles.text} hover:underline font-medium`}
                  >
                    Voir le panier →
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`ml-2 ${styles.text} opacity-60 hover:opacity-100 transition-opacity`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Toast standard
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 ${styles.icon}`}>
                {icon}
              </div>
              <span className={`text-sm font-medium ${styles.text} flex-1`}>{message}</span>
              <button
                onClick={onClose}
                className={`ml-2 ${styles.text} opacity-60 hover:opacity-100 transition-opacity`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}