'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart, useFormatPrice } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemsCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useFormatPrice();
  const { user, loading } = useAuth();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Vérifier si l'utilisateur est connecté
    if (!loading && !user) {
      // Sauvegarder l'intention de checkout
      localStorage.setItem('pendingCheckout', 'true');
      localStorage.setItem('selectedProducts', JSON.stringify(items));
      // Rediriger vers la page de connexion
      window.location.href = '/login?redirect=billing&from=cart';
      return;
    }
    
    // Utilisateur connecté, procéder au paiement
    localStorage.setItem('selectedProducts', JSON.stringify(items));
    window.location.href = '/billing?from=cart';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Panier ({itemsCount})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-96 text-gray-500 px-6 py-12">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Votre panier est vide</h3>
                <p className="text-sm text-center text-gray-500">
                  Ajoutez des produits pour commencer votre commande
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4 bg-white">
                {items.map((item) => (
                  <div key={item.product.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 bg-white"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/80x80/f0f0f0/666666?text=Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {item.product.description.length > 80 
                            ? item.product.description.substring(0, 80) + '...' 
                            : item.product.description
                          }
                        </p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.product.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                          {item.product.features.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{item.product.features.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-blue-600">
                            {formatPrice(item.product.price)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center text-sm font-semibold"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center bg-white px-2 py-1 rounded border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center text-sm font-semibold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Subtotal for this item */}
                        <div className="mt-2 text-right">
                          <span className="text-xs text-gray-500">Sous-total: </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(parseFloat(item.product.price.replace(/[^0-9.]/g, '')) * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Supprimer du panier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : (!user ? 'Se connecter pour payer' : 'Procéder au paiement')}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}