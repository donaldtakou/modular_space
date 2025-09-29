// Hook pour charger tous les produits Alibaba
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features: string[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('🚀 Chargement des produits Alibaba...');
        
        // Charger le fichier JSON complet avec tous les produits
        const response = await fetch('/alibaba_final_products.json');
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ ${data.length} produits Modular Space chargés !`);
        
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des produits:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}