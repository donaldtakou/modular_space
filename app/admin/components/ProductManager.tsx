'use client';

import { useState, useEffect } from 'react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: 'Folding' | 'Container' | 'Capsule' | '';
  features: string[];
  image: string;
}

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Folding' | 'Container' | 'Capsule';
  features: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

const VALID_CATEGORIES = ['Folding', 'Container', 'Capsule'] as const;

export default function ProductManager() {
  const [savedProducts, setSavedProducts] = useState<AdminProduct[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    features: [''],
    image: ''
  });
  
  const [preview, setPreview] = useState<ProductFormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Charger les produits sauvegardés au montage
  useEffect(() => {
    loadSavedProducts();
  }, []);

  const loadSavedProducts = async () => {
    try {
      // D'abord essayer de charger depuis localStorage
      const localProducts = localStorage.getItem('admin_products');
      if (localProducts) {
        const products = JSON.parse(localProducts);
        setSavedProducts(products);
      }

      // Puis essayer l'API
      const response = await fetch('/api/admin-products', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const products = await response.json();
        setSavedProducts(products);
        localStorage.setItem('admin_products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({type, text});
    setTimeout(() => setMessage(null), 5000);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Le prix est requis';
    } else if (!/^\$[\d,]+$/.test(formData.price)) {
      newErrors.price = 'Format de prix invalide (exemple: $15,000)';
    }

    if (!formData.category || !VALID_CATEGORIES.includes(formData.category as any)) {
      newErrors.category = 'Catégorie invalide. Choisissez: Folding, Container, ou Capsule';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'L\'URL de l\'image est requise';
    } else if (!formData.image.startsWith('http')) {
      newErrors.image = 'URL d\'image invalide';
    }

    if (formData.features.filter(f => f.trim()).length === 0) {
      newErrors.features = 'Au moins une caractéristique est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handlePreview = () => {
    if (validateForm()) {
      setPreview(formData);
      setShowPreview(true);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        features: formData.features.filter(f => f.trim()),
        image: formData.image
      };

      const response = await fetch('/api/admin-products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (response.ok) {
        // Succès
        showMessage('success', result.message || 'Produit sauvegardé avec succès !');
        
        // Recharger la liste des produits
        await loadSavedProducts();
        
        // Reset du formulaire
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          features: [''],
          image: ''
        });
        setPreview(null);
        setShowPreview(false);
        setEditingProduct(null);
        
        // Sauvegarder aussi en localStorage comme backup
        const updatedProducts = editingProduct 
          ? savedProducts.map(p => p.id === editingProduct.id ? result.product : p)
          : [...savedProducts, result.product];
          
        localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
        
      } else {
        // Erreur
        showMessage('error', result.error || 'Erreur lors de la sauvegarde');
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showMessage('error', 'Erreur de connexion lors de la sauvegarde');
      
      // Fallback: sauvegarder en localStorage uniquement
      try {
        const productData = {
          id: editingProduct?.id || `local_${Date.now()}`,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category as 'Folding' | 'Container' | 'Capsule',
          features: formData.features.filter(f => f.trim()),
          image: formData.image,
          createdAt: editingProduct?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const localProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
        const updatedProducts = editingProduct
          ? localProducts.map((p: AdminProduct) => p.id === editingProduct.id ? productData : p)
          : [...localProducts, productData];
          
        localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
        setSavedProducts(updatedProducts);
        
        showMessage('success', 'Produit sauvegardé localement (mode hors ligne)');
        
        // Reset du formulaire
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          features: [''],
          image: ''
        });
        setPreview(null);
        setShowPreview(false);
        setEditingProduct(null);
        
      } catch (localError) {
        console.error('Erreur sauvegarde locale:', localError);
        showMessage('error', 'Impossible de sauvegarder le produit');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      features: product.features.length ? product.features : [''],
      image: product.image
    });
    setEditingProduct(product);
    setPreview(product);
    setShowPreview(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/admin-products?id=${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadSavedProducts();
        showMessage('success', 'Produit supprimé avec succès');
      } else {
        const result = await response.json();
        showMessage('error', result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      // Fallback: supprimer de localStorage
      const localProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
      const updatedProducts = localProducts.filter((p: AdminProduct) => p.id !== productId);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      setSavedProducts(updatedProducts);
      showMessage('success', 'Produit supprimé localement');
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      features: [''],
      image: ''
    });
    setPreview(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <div className="text-sm text-gray-500">
          {savedProducts.length} produit{savedProducts.length !== 1 ? 's' : ''} enregistré{savedProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Messages de feedback */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h3>
            {editingProduct && (
              <button
                onClick={cancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <form className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 20ft Container House Deluxe"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description détaillée du produit..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="$15,000"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choisir une catégorie</option>
                <option value="Folding">Folding Houses</option>
                <option value="Container">Container Houses</option>
                <option value="Capsule">Capsule Houses</option>
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* URL de l'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Caractéristiques */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caractéristiques *
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 2-3 Bedrooms"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Ajouter une caractéristique</span>
              </button>
              {errors.features && <p className="text-red-600 text-sm mt-1">{errors.features}</p>}
            </div>

            {/* Boutons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handlePreview}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Prévisualiser
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !preview}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  editingProduct 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? 'Sauvegarde...' : editingProduct ? 'Modifier' : 'Valider & Ajouter'}
              </button>
            </div>
          </form>
        </div>

        {/* Prévisualisation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Prévisualisation</h3>
          
          {showPreview && preview ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {preview.image && (
                  <img
                    src={preview.image}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/200';
                    }}
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  {preview.category}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{preview.name}</h4>
                  <div className="text-lg font-bold text-blue-600">{preview.price}</div>
                </div>
                
                <p className="text-gray-600 mb-4">{preview.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {preview.features.filter(f => f.trim()).map((feature, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Remplissez le formulaire et cliquez sur "Prévisualiser"</p>
            </div>
          )}
        </div>
      </div>

      {/* Liste des produits sauvegardés */}
      {savedProducts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Produits sauvegardés ({savedProducts.length})</h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedProducts.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden">
                <div className="relative h-32 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/200';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                    <div className="text-sm font-bold text-blue-600">{product.price}</div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                    {product.features.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{product.features.length - 2} autres
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Créé le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}