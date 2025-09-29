'use client';

import { useState } from 'react';

interface Invoice {
  id: string;
  date: string;
  project: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber: string;
}

interface CardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    date: "2024-01-15",
    project: "Maison Capsule - Acompte",
    amount: "7,500€",
    status: "paid",
    dueDate: "2024-01-30"
  },
  {
    id: "INV-002",
    date: "2024-01-20",
    project: "Villa Moderne - Plan architectural",
    amount: "2,500€",
    status: "pending",
    dueDate: "2024-02-20"
  },
  {
    id: "INV-003",
    date: "2024-01-10",
    project: "Maison Familiale - Consultation",
    amount: "500€",
    status: "overdue",
    dueDate: "2024-01-25"
  }
];

export default function BillingClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'payment' | 'invoices'>('overview');
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    vatNumber: ''
  });

  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const [savedBillingInfo, setSavedBillingInfo] = useState<BillingInfo | null>(null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulation de sauvegarde
    setTimeout(() => {
      setSavedBillingInfo(billingInfo);
      setShowBillingForm(false);
      setSuccessMessage('Informations de facturation enregistrées avec succès !');
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulation de sauvegarde de carte
    setTimeout(() => {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        last4: cardInfo.cardNumber.slice(-4),
        brand: 'Visa', // Simulation
        isDefault: savedPaymentMethods.length === 0
      };
      
      setSavedPaymentMethods([...savedPaymentMethods, newPaymentMethod]);
      setCardInfo({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: ''
      });
      setShowPaymentForm(false);
      setSuccessMessage('Méthode de paiement ajoutée avec succès !');
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handlePayInvoice = async (invoiceId: string) => {
    if (!savedBillingInfo || savedPaymentMethods.length === 0) {
      alert('Veuillez d\'abord ajouter vos informations de facturation et une méthode de paiement.');
      return;
    }

    setIsProcessing(true);
    setSelectedInvoice(invoiceId);

    // Simulation de paiement
    setTimeout(() => {
      setSuccessMessage(`Paiement effectué avec succès pour la facture ${invoiceId} !`);
      setSelectedInvoice(null);
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facturation & Paiements</h1>
          <p className="text-gray-600 mt-2">Gérez vos factures, informations de facturation et méthodes de paiement</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'billing', label: 'Informations de facturation' },
              { id: 'payment', label: 'Méthodes de paiement' },
              { id: 'invoices', label: 'Factures' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Total dû</h3>
                  <p className="text-2xl font-bold text-red-600">3,000€</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Payé ce mois</h3>
                  <p className="text-2xl font-bold text-green-600">7,500€</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Factures en attente</h3>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>
              </div>

              {/* Factures récentes */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Factures récentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockInvoices.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.project}</p>
                          <p className="text-sm text-gray-500">{invoice.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={getStatusBadge(invoice.status)}>
                            {invoice.status === 'paid' ? 'Payé' : 
                             invoice.status === 'pending' ? 'En attente' : 'En retard'}
                          </span>
                          <span className="font-semibold">{invoice.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mettre à jour mes informations
                  </button>
                  <button 
                    onClick={() => setActiveTab('payment')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ajouter une carte
                  </button>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Voir toutes les factures
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Statut</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Informations de facturation</span>
                    <span className={`px-2 py-1 rounded text-xs ${savedBillingInfo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {savedBillingInfo ? 'Complètes' : 'Manquantes'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Méthodes de paiement</span>
                    <span className={`px-2 py-1 rounded text-xs ${savedPaymentMethods.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {savedPaymentMethods.length > 0 ? `${savedPaymentMethods.length} carte(s)` : 'Aucune'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations de facturation */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Informations de facturation</h3>
              <p className="text-gray-600 mt-1">Gérez vos informations pour la facturation</p>
            </div>
            
            <div className="p-6">
              {savedBillingInfo && !showBillingForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="mt-1 text-gray-900">{savedBillingInfo.firstName} {savedBillingInfo.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Entreprise</label>
                      <p className="mt-1 text-gray-900">{savedBillingInfo.company || 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{savedBillingInfo.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="mt-1 text-gray-900">{savedBillingInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Adresse</label>
                      <p className="mt-1 text-gray-900">
                        {savedBillingInfo.address}<br/>
                        {savedBillingInfo.postalCode} {savedBillingInfo.city}<br/>
                        {savedBillingInfo.country}
                      </p>
                    </div>
                    {savedBillingInfo.vatNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">N° TVA</label>
                        <p className="mt-1 text-gray-900">{savedBillingInfo.vatNumber}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowBillingForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Modifier les informations
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveBilling} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                      <input
                        type="text"
                        value={billingInfo.company}
                        onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.postalCode}
                        onChange={(e) => setBillingInfo({...billingInfo, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                      <select
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">N° TVA intracommunautaire</label>
                      <input
                        type="text"
                        value={billingInfo.vatNumber}
                        onChange={(e) => setBillingInfo({...billingInfo, vatNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="FR12345678901"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isProcessing 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? 'Enregistrement...' : 'Enregistrer les informations'}
                    </button>
                    {showBillingForm && (
                      <button
                        type="button"
                        onClick={() => setShowBillingForm(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Méthodes de paiement */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Méthodes de paiement</h3>
              <p className="text-gray-600 mt-1">Gérez vos cartes de crédit et méthodes de paiement</p>
            </div>
            
            <div className="p-6">
              {/* Cartes enregistrées */}
              {savedPaymentMethods.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-4">Cartes enregistrées</h4>
                  <div className="space-y-3">
                    {savedPaymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">**** **** **** {method.last4}</p>
                            <p className="text-sm text-gray-500">{method.brand} {method.isDefault && '(Par défaut)'}</p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire d'ajout de carte */}
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter une nouvelle carte
                </button>
              ) : (
                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte *</label>
                      <input
                        type="text"
                        required
                        value={cardInfo.cardholderName}
                        onChange={(e) => setCardInfo({...cardInfo, cardholderName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
                      <input
                        type="text"
                        required
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mois d'expiration *</label>
                      <select
                        required
                        value={cardInfo.expiryMonth}
                        onChange={(e) => setCardInfo({...cardInfo, expiryMonth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Mois</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Année d'expiration *</label>
                      <select
                        required
                        value={cardInfo.expiryYear}
                        onChange={(e) => setCardInfo({...cardInfo, expiryYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Année</option>
                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isProcessing 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isProcessing ? 'Enregistrement...' : 'Enregistrer la carte'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setCardInfo({
                          cardNumber: '',
                          expiryMonth: '',
                          expiryYear: '',
                          cvv: '',
                          cardholderName: ''
                        });
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Factures */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Toutes les factures</h3>
              <p className="text-gray-600 mt-1">Consultez et payez vos factures</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{invoice.project}</h4>
                        <p className="text-sm text-gray-500">Facture #{invoice.id} • {invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{invoice.amount}</p>
                        <span className={getStatusBadge(invoice.status)}>
                          {invoice.status === 'paid' ? 'Payé' : 
                           invoice.status === 'pending' ? 'En attente' : 'En retard'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Échéance: {invoice.dueDate}
                      </p>
                      
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handlePayInvoice(invoice.id)}
                          disabled={isProcessing && selectedInvoice === invoice.id}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isProcessing && selectedInvoice === invoice.id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isProcessing && selectedInvoice === invoice.id ? 'Paiement...' : 'Payer maintenant'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}