'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import CartDrawer from './CartDrawer';

export default function CartIcon() {
  const { itemsCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Ouvrir le panier"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 002-2 2 2 0 00-2 2zm-8 0a2 2 0 002-2 2 2 0 00-2 2z" 
          />
        </svg>
        
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemsCount > 99 ? '99+' : itemsCount}
          </span>
        )}
      </button>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}