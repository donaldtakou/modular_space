'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductComparison from '../../components/ProductComparison';
import Toast from '../../components/Toast';
import { useCart } from '@/lib/CartContext';
import { useProducts } from '@/lib/useProducts';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features: string[];
}

const categories = ["Toutes", "Folding", "Capsule", "Smart Living Space", "New"];

export default function ProductsPage() {
  // Charger TOUS les produits dynamiquement
  const { products, loading, error } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24); // 24 produits par page
const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info' | 'cart', isVisible: boolean, productName?: string, productImage?: string}>({
  message: '',
  type: 'success',
  isVisible: false
});  const { addToCart } = useCart();
  
  const formatPrice = (price: string) => {
    return price; // Prix déjà formaté
  };

  // Fonction de tri
  const sortProducts = (products: Product[], sortBy: string) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          const priceA = parseInt(a.price.replace(/[$,]/g, ''));
          const priceB = parseInt(b.price.replace(/[$,]/g, ''));
          return priceA - priceB;
        case 'price-high':
          const priceA2 = parseInt(a.price.replace(/[$,]/g, ''));
          const priceB2 = parseInt(b.price.replace(/[$,]/g, ''));
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });
  };

  // Filtrage et tri des produits
  const filteredProducts = useMemo(() => {
    if (loading || !products.length) return [];
    
    let filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "Toutes" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

    return sortProducts(filtered, sortBy);
  }, [products, selectedCategory, searchTerm, sortBy, loading]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

const showToast = (message: string, type: 'success' | 'error' | 'info' | 'cart' = 'success', productName?: string, productImage?: string) => {
  setToast({ message, type, isVisible: true, productName, productImage });
  setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), type === 'cart' ? 4000 : 3000);
};  const toggleComparison = (product: Product) => {
    const isInComparison = comparisonProducts.find(p => p.id === product.id);
    
    if (isInComparison) {
      setComparisonProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`${product.name} retiré de la comparaison`, 'info');
    } else if (comparisonProducts.length < 3) {
      setComparisonProducts(prev => [...prev, product]);
      showToast(`${product.name} ajouté à la comparaison`, 'success');
    } else {
      showToast('Vous pouvez comparer maximum 3 produits', 'error');
    }
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    showToast('Comparaison vidée', 'info');
  };

const handleAddToCart = (product: Product) => {
  addToCart(product, 1);
  showToast(`${product.name} ajouté au panier`, 'cart', product.name, product.image);
};  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Chargement du catalogue...</h2>
          <p className="text-gray-600 mt-2">Chargement en cours</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Toast */}
      <Toast 
        {...toast} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Catalogue Complet
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              {products.length.toLocaleString()} produits disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-center lg:text-left">Rechercher</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, description ou caractéristiques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Categories */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 text-center lg:text-left">Catégories</h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold mb-3 text-center">Trier par</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="name">Nom A-Z</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-6 text-center text-gray-600">
            <span className="font-medium">{filteredProducts.length.toLocaleString()}</span> produits trouvés
            {searchTerm && (
              <span className="ml-2">pour "<span className="font-medium text-blue-600">{searchTerm}</span>"</span>
            )}
            {totalPages > 1 && (
              <span className="ml-4 text-sm">Page {currentPage} sur {totalPages}</span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((product) => {
            const isInComparison = comparisonProducts.find(p => p.id === product.id);
            
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isInComparison ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  
                  {/* Comparison Badge */}
                  {isInComparison && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      En comparaison
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{product.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {formatPrice(product.price)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Ajouter au panier
                    </button>
                    
                    <button
                      onClick={() => toggleComparison(product)}
                      className={`p-2 rounded-lg transition-colors ${
                        isInComparison
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isInComparison ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Toutes");
                setSearchTerm("");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              ← Précédent
            </button>
            
            <div className="flex space-x-2">
              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      {/* Comparison Panel */}
      {comparisonProducts.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Comparaison ({comparisonProducts.length})</h4>
            <button
              onClick={clearComparison}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 mb-3">
            {comparisonProducts.map(product => (
              <div key={product.id} className="text-sm text-gray-600 truncate">
                • {product.name}
              </div>
            ))}
          </div>

          {comparisonProducts.length >= 2 && (
            <div className="text-center">
              <button
                onClick={() => {
                  // Ici on peut ouvrir une modal de comparaison détaillée
                  console.log('Ouvrir comparaison détaillée', comparisonProducts);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Comparer ({comparisonProducts.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}