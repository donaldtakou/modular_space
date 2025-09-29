"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Filter, HomeIcon } from 'lucide-react';
import ProductFilters from '@/app/components/ProductFilters';
import { ProductCard } from '@/app/components/ProductCard';
import SearchBar from '@/app/components/ui/SearchBar';
import { demoProducts } from '@/app/data/demoProducts';

interface Product {
  id: string;
  name: {
    fr: string;
    en: string;
    es: string;
    de: string;
  };
  type: 'folding' | 'capsule';
  description: {
    fr: string;
    en: string;
    es: string;
    de: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  dimensions: {
    deployed: {
      length: number;
      width: number;
      height: number;
    };
    folded?: {
      length: number;
      width: number;
      height: number;
    };
  };
  features: string[];
  images: string[];
  stock: number;
}

const ProductsClient = () => {
  const t = useTranslations('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    priceRange: [0, 10000],
    inStock: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simuler le chargement des produits
    setProducts(demoProducts);
    setFilteredProducts(demoProducts);
    setLoading(false);
  }, []);

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    let filtered = [...products];

    if (newFilters.type) {
      filtered = filtered.filter(p => p.type === newFilters.type);
    }

    if (newFilters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    filtered = filtered.filter(p => 
      p.price.amount >= newFilters.priceRange[0] && 
      p.price.amount <= newFilters.priceRange[1]
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.fr.toLowerCase().includes(query) ||
        p.description.fr.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pb-32 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={t('searchPlaceholder')}
              />
            </div>
            <ProductFilters 
              filters={filters}
              onFilterChange={applyFilters}
              translations={{
                type: t('filters.type'),
                price: t('filters.price'),
                inStock: t('filters.inStock')
              }}
            />
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          <AnimatePresence>
            {loading ? (
              // Skeleton loading
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </motion.div>
              ))
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-gray-500 text-lg">{t('noResults')}</p>
              </motion.div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  translations={{
                    price: t('price'),
                    dimensions: t('dimensions'),
                    features: t('features'),
                    stock: t('stock'),
                    addToCart: t('addToCart')
                  }}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsClient;