'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  itemsCount: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  clearCartOnLogout: () => void;
  isInCart: (productId: number) => boolean;
  getCartItem: (productId: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('modularHouseCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Convertir les dates
          const cartWithDates = parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          setItems(cartWithDates);
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
          localStorage.removeItem('modularHouseCart');
        }
      }

      // Écouter l'événement de déconnexion pour vider le panier
      const handleLogout = () => {
        console.log('🛒 CartContext: Vidage du panier suite à la déconnexion');
        setItems([]);
        localStorage.removeItem('modularHouseCart');
        localStorage.removeItem('cartTimestamp');
        localStorage.removeItem('lastCartActivity');
      };

      window.addEventListener('auth-logout', handleLogout);
      
      // Nettoyer l'écouteur au démontage
      return () => {
        window.removeEventListener('auth-logout', handleLogout);
      };
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('modularHouseCart', JSON.stringify(items));
    }
  }, [items]);

  // Calculer le nombre total d'articles
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = items.reduce((total, item) => {
    const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
    return total + (price * item.quantity);
  }, 0);

  // Ajouter un produit au panier
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Sinon, ajouter un nouveau produit
        return [...currentItems, {
          product,
          quantity,
          addedAt: new Date()
        }];
      }
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId: number) => {
    setItems(currentItems => 
      currentItems.filter(item => item.product.id !== productId)
    );
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('modularHouseCart');
    }
  };

  // Vider le panier lors de la déconnexion (force la suppression)
  const clearCartOnLogout = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('modularHouseCart');
      // Supprimer aussi les autres données de session liées au panier
      localStorage.removeItem('cartTimestamp');
      localStorage.removeItem('lastCartActivity');
    }
  };

  // Vérifier si un produit est dans le panier
  const isInCart = (productId: number): boolean => {
    return items.some(item => item.product.id === productId);
  };

  // Obtenir un article du panier
  const getCartItem = (productId: number): CartItem | undefined => {
    return items.find(item => item.product.id === productId);
  };

  const value: CartContextType = {
    items,
    itemsCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCartOnLogout,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Hook pour obtenir un formatage des prix cohérent
export const useFormatPrice = () => {
  const formatPrice = (price: string | number): string => {
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numericPrice);
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return { formatPrice };
};