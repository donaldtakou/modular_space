'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Preferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  timeZone: string;
  currency: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

export default function SettingsClient() {
  const { user, logout, changePassword, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // États de synchronisation
  const [syncStatus, setSyncStatus] = useState<{
    profile: 'idle' | 'syncing' | 'synced' | 'error';
    preferences: 'idle' | 'syncing' | 'synced' | 'error';
    security: 'idle' | 'syncing' | 'synced' | 'error';
  }>({
    profile: 'idle',
    preferences: 'idle',
    security: 'idle'
  });

  // Redirection si pas connecté
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    productUpdates: true,
    securityAlerts: true,
    timeZone: 'Europe/Paris',
    currency: 'EUR'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Validation du mot de passe sécurisé
  const validatePassword = (password: string) => {
    const requirements = [
      { text: "Au moins 8 caractères", met: password.length >= 8 },
      { text: "Une majuscule (A-Z)", met: /[A-Z]/.test(password) },
      { text: "Une minuscule (a-z)", met: /[a-z]/.test(password) },
      { text: "Un chiffre (0-9)", met: /\d/.test(password) },
      { text: "Un symbole (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];
    return requirements;
  };

  const passwordRequirements = validatePassword(passwordForm.newPassword);
  const isNewPasswordValid = passwordRequirements.every(req => req.met);

  // Synchronisation avec les données utilisateur
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setProfile({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'France'
      });
    }
  }, [user]);

  // Synchronisation des préférences avec le serveur et localStorage
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      setSyncStatus(prev => ({ ...prev, preferences: 'syncing' }));
      
      try {
        const response = await fetch('/api/user/preferences', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const serverPrefs = await response.json();
          setPreferences(serverPrefs);
          localStorage.setItem('userPreferences', JSON.stringify(serverPrefs));
          setSyncStatus(prev => ({ ...prev, preferences: 'synced' }));
          console.log('✅ Préférences synchronisées depuis le serveur');
        } else {
          throw new Error('Serveur indisponible');
        }
      } catch (error) {
        // Fallback vers localStorage
        const savedPrefs = localStorage.getItem('userPreferences');
        if (savedPrefs) {
          try {
            setPreferences(JSON.parse(savedPrefs));
            setSyncStatus(prev => ({ ...prev, preferences: 'synced' }));
            console.log('📱 Préférences chargées depuis le stockage local');
          } catch (parseError) {
            setSyncStatus(prev => ({ ...prev, preferences: 'error' }));
            console.error('Erreur lors du parsing des préférences:', parseError);
          }
        } else {
          setSyncStatus(prev => ({ ...prev, preferences: 'error' }));
        }
      }

      // Auto-réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setSyncStatus(prev => ({ ...prev, preferences: 'idle' }));
      }, 3000);
    };

    loadPreferences();
  }, [user]);

  // Synchronisation des paramètres de sécurité avec le serveur
  useEffect(() => {
    const loadSecuritySettings = async () => {
      if (!user) return;
      
      setSyncStatus(prev => ({ ...prev, security: 'syncing' }));
      
      try {
        const response = await fetch('/api/user/security', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const serverSecurity = await response.json();
          setSecuritySettings(serverSecurity);
          localStorage.setItem('securitySettings', JSON.stringify(serverSecurity));
          setSyncStatus(prev => ({ ...prev, security: 'synced' }));
          console.log('✅ Paramètres de sécurité synchronisés depuis le serveur');
        } else {
          throw new Error('Serveur indisponible');
        }
      } catch (error) {
        // Fallback vers localStorage
        const savedSecurity = localStorage.getItem('securitySettings');
        if (savedSecurity) {
          try {
            setSecuritySettings(JSON.parse(savedSecurity));
            setSyncStatus(prev => ({ ...prev, security: 'synced' }));
            console.log('📱 Paramètres de sécurité chargés depuis le stockage local');
          } catch (parseError) {
            setSyncStatus(prev => ({ ...prev, security: 'error' }));
            console.error('Erreur lors du parsing des paramètres de sécurité:', parseError);
          }
        } else {
          setSyncStatus(prev => ({ ...prev, security: 'error' }));
        }
      }

      // Auto-réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setSyncStatus(prev => ({ ...prev, security: 'idle' }));
      }, 3000);
    };

    loadSecuritySettings();
  }, [user]);

  // Fonctions de gestion des messages
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  // Indicateur de synchronisation
  const SyncIndicator = ({ status, label }: { status: 'idle' | 'syncing' | 'synced' | 'error', label: string }) => {
    const getIcon = () => {
      switch (status) {
        case 'syncing':
          return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>;
        case 'synced':
          return <CheckIcon className="h-4 w-4 text-green-600" />;
        case 'error':
          return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
        default:
          return null;
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'syncing':
          return 'Synchronisation...';
        case 'synced':
          return 'Synchronisé';
        case 'error':
          return 'Erreur de sync';
        default:
          return '';
      }
    };

    if (status === 'idle') return null;

    return (
      <div className="flex items-center text-xs text-gray-500 mt-2">
        {getIcon()}
        <span className="ml-2">{getStatusText()}</span>
      </div>
    );
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSyncStatus(prev => ({ ...prev, profile: 'syncing' }));
    
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      
      const profileData = { 
        name: fullName, 
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country
      };

      // Sauvegarder localement d'abord
      localStorage.setItem('userProfile', JSON.stringify(profile));

      // Mettre à jour via AuthContext
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSyncStatus(prev => ({ ...prev, profile: 'synced' }));
        showSuccess('Profil mis à jour et synchronisé avec succès');
        setIsEditing(false);
        
        // Auto-réinitialiser le statut après 3 secondes
        setTimeout(() => {
          setSyncStatus(prev => ({ ...prev, profile: 'idle' }));
        }, 3000);
      } else {
        setSyncStatus(prev => ({ ...prev, profile: 'error' }));
        showError(result.errors?.[0]?.msg || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, profile: 'error' }));
      localStorage.setItem('userProfile', JSON.stringify(profile));
      showError('Connexion serveur impossible - profil sauvegardé localement');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction spécifique pour gérer les notifications avec synchronisation instantanée
  const handleNotificationChange = async (notificationType: keyof Preferences, value: boolean) => {
    const updatedPreferences = { ...preferences, [notificationType]: value };
    setPreferences(updatedPreferences);
    setSyncStatus(prev => ({ ...prev, preferences: 'syncing' }));

    try {
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      
      // Synchronisation serveur en arrière-plan
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedPreferences)
      });

      if (response.ok) {
        setSyncStatus(prev => ({ ...prev, preferences: 'synced' }));
        console.log(`🔔 Notification ${notificationType} synchronisée: ${value}`);
      } else {
        setSyncStatus(prev => ({ ...prev, preferences: 'error' }));
        console.log(`📱 Notification ${notificationType} sauvegardée localement: ${value}`);
      }

      showSuccess(`Notification ${notificationType} ${value ? 'activée' : 'désactivée'} et synchronisée`);
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, preferences: 'error' }));
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }

    // Auto-réinitialiser le statut après 2 secondes
    setTimeout(() => {
      setSyncStatus(prev => ({ ...prev, preferences: 'idle' }));
    }, 2000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!isNewPasswordValid) {
      showError('Le nouveau mot de passe ne respecte pas tous les critères de sécurité');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (result.success) {
        showSuccess(result.message || 'Mot de passe modifié avec succès ! Un email de confirmation a été envoyé.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showError(result.errors?.[0]?.msg || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      showError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Le useEffect redirige déjà
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: UserIcon },
    { id: 'security' as const, label: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'preferences' as const, label: 'Préférences', icon: CogIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: BellIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos informations personnelles et préférences avec synchronisation automatique
          </p>
        </div>

        {/* Messages de succès et d'erreur */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckIcon className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <XMarkIcon className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  <SyncIndicator 
                    status={syncStatus[tab.id === 'notifications' ? 'preferences' : tab.id]} 
                    label={tab.label} 
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            
            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                  <SyncIndicator status={syncStatus.profile} label="Profil" />
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {isEditing ? (
                      <div className="space-x-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="w-4 h-4 mr-2" />
                              Sauvegarder
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Modifier le profil
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Préférences de notifications
                  </h3>
                  <SyncIndicator status={syncStatus.preferences} label="Notifications" />
                  <p className="text-gray-600">
                    Choisissez comment vous souhaitez être informé des activités importantes (synchronisation automatique).
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Notifications par email</h4>
                      <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('emailNotifications', !preferences.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Notifications SMS</h4>
                      <p className="text-sm text-gray-600">Alertes importantes par SMS</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('smsNotifications', !preferences.smsNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.smsNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Mises à jour produit</h4>
                      <p className="text-sm text-gray-600">Nouveautés, améliorations et annonces</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('productUpdates', !preferences.productUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.productUpdates ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.productUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Emails marketing</h4>
                      <p className="text-sm text-gray-600">Promotions et offres spéciales</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('marketingEmails', !preferences.marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketingEmails ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Alertes de sécurité</h4>
                      <p className="text-sm text-gray-600">Connexions suspectes et changements de sécurité</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('securityAlerts', !preferences.securityAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.securityAlerts ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Sécurité avec changement de mot de passe */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité du compte</h3>
                  <SyncIndicator status={syncStatus.security} label="Sécurité" />
                </div>

                {/* Changement de mot de passe */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Changer le mot de passe</h4>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.current ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                          placeholder="Nouveau mot de passe sécurisé"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Indicateur de force du mot de passe */}
                      {passwordForm.newPassword && (
                        <div className="mt-3 space-y-2">
                          <div className="text-sm font-medium text-gray-700">
                            Critères de sécurité :
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {passwordRequirements.map((req, index) => (
                              <div key={index} className={`flex items-center text-xs ${req.met ? 'text-green-600' : 'text-red-500'}`}>
                                <span className="mr-2 text-sm">{req.met ? '✓' : '✗'}</span>
                                {req.text}
                              </div>
                            ))}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isNewPasswordValid ? 'bg-green-500' : 
                                passwordRequirements.filter(req => req.met).length >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${(passwordRequirements.filter(req => req.met).length / passwordRequirements.length) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isNewPasswordValid || passwordForm.newPassword !== passwordForm.confirmPassword}
                      className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-200 ${
                        isNewPasswordValid && passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.currentPassword
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="w-4 h-4 mr-2" />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}