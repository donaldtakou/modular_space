interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
  };
  message?: string;
  errors?: Array<{ msg: string }>;
}

class AuthService {
  private baseURL = 'http://localhost:3002/api/auth';

  // Obtenir le token (avec vérification SSR)
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Sauvegarder le token
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Supprimer le token
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Sauvegarder l'utilisateur
  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Obtenir l'utilisateur stocké
  getStoredUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const token = this.getToken();
    const user = this.getStoredUser();
    const isAuth = !!(token && user && user.isVerified);
    console.log('🔍 AuthService.isAuthenticated:', { token: !!token, user: !!user, isVerified: user?.isVerified, result: isAuth });
    return isAuth;
  }

  // Nettoyer complètement la session
  clearSession(): void {
    console.log('🧹 AuthService: Nettoyage complet de la session');
    this.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Inscription
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔄 Tentative d\'inscription:', { name, email });
      
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log('📡 Réponse serveur status:', response.status);
      
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Erreur lors de l\'inscription' }],
        };
      }

      return {
        success: true,
        message: data.message || 'Un email de vérification a été envoyé',
        email: data.email,
      };
    } catch (error) {
      console.error('❌ Erreur réseau inscription:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Vérification email
  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Code de vérification invalide' }],
        };
      }

      // Si on reçoit un token et un utilisateur, on les stocke
      if (data.token && data.user) {
        this.setToken(data.token);
        this.setUser(data.user);
        return {
          success: true,
          token: data.token,
          user: data.user,
          message: data.message || 'Email vérifié avec succès',
        };
      }

      return {
        success: true,
        message: data.message || 'Email vérifié avec succès',
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Connexion
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔄 AuthService: Tentative de connexion vers', `${this.baseURL}/login`);
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 AuthService: Status de la réponse:', response.status);
      const data = await response.json();
      console.log('📦 AuthService: Données reçues:', data);

      if (!response.ok) {
        console.log('❌ AuthService: Réponse not ok, retour d\'erreur');
        return {
          success: false,
          errors: data.errors || [{ msg: 'Email ou mot de passe incorrect' }],
          errorType: data.errorType // Transmettre le type d'erreur du serveur
        };
      }

      console.log('✅ AuthService: Connexion API réussie, sauvegarde du token');
      this.setToken(data.token);
      
      // Si on reçoit directement les informations utilisateur
      if (data.user) {
        console.log('👤 AuthService: Informations utilisateur reçues directement:', data.user);
        this.setUser(data.user);
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      }
      
      // Sinon, essayer de récupérer les informations utilisateur
      console.log('👤 AuthService: Récupération des informations utilisateur');
      const userInfo = await this.getUserInfo();
      if (userInfo.success && userInfo.user) {
        console.log('✅ AuthService: Informations utilisateur récupérées:', userInfo.user);
        this.setUser(userInfo.user);
        return {
          success: true,
          token: data.token,
          user: userInfo.user
        };
      }

      // Si getUserInfo échoue, on retourne quand même le succès avec le token
      // L'utilisateur pourra être récupéré lors du prochain appel
      console.warn('⚠️ AuthService: Impossible de récupérer les informations utilisateur immédiatement');
      return {
        success: true,
        token: data.token,
        message: 'Connexion réussie'
      };
    } catch (error) {
      console.error('💥 AuthService: Erreur de connexion:', error);
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Récupérer les informations utilisateur
  async getUserInfo(): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          errors: [{ msg: 'Aucun token trouvé' }],
        };
      }

      const response = await fetch(`${this.baseURL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: [{ msg: 'Token invalide' }],
        };
      }

      return {
        success: true,
        user: data,
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Erreur lors de l\'envoi de l\'email' }],
        };
      }

      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé',
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(resetToken: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/resetpassword/${resetToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Token invalide ou expiré' }],
        };
      }

      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Déconnexion
  logout(): void {
    this.removeToken();
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(userData: any): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          errors: [{ msg: 'Aucun token trouvé' }],
        };
      }

      const response = await fetch(`${this.baseURL}/updatedetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Erreur lors de la mise à jour' }],
        };
      }

      // Mettre à jour l'utilisateur stocké
      if (data) {
        this.setUser(data);
      }

      return {
        success: true,
        user: data,
        message: 'Profil mis à jour avec succès',
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          errors: [{ msg: 'Aucun token trouvé' }],
        };
      }

      const response = await fetch(`${this.baseURL}/updatepassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [{ msg: 'Erreur lors du changement de mot de passe' }],
        };
      }

      return {
        success: true,
        message: 'Mot de passe modifié avec succès',
      };
    } catch (error) {
      return {
        success: false,
        errors: [{ msg: 'Erreur de connexion au serveur' }],
      };
    }
  }
}

export default new AuthService();