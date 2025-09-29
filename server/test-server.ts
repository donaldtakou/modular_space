import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Base de données temporaire en mémoire (pour les tests uniquement)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationExpires?: Date;
}

const users: User[] = [];
const verificationCodes: { [email: string]: { code: string, expires: Date } } = {};

// Utilitaire pour générer un code de vérification
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Utilitaire pour envoyer un "email" (simulation console)
const sendVerificationEmail = (email: string, name: string, code: string) => {
  console.log('\n=== EMAIL DE VÉRIFICATION ===');
  console.log(`To: ${email}`);
  console.log(`Subject: Vérification de votre compte ModularHouse`);
  console.log(`Bonjour ${name},`);
  console.log(`Votre code de vérification est: ${code}`);
  console.log(`Ce code expire dans 10 minutes.`);
  console.log('==============================\n');
};

// Route d'inscription
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation simple
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Tous les champs sont requis' }]
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Le mot de passe doit contenir au moins 6 caractères' }]
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Un utilisateur avec cet email existe déjà' }]
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Générer code de vérification
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Créer l'utilisateur
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationExpires
    };

    users.push(user);

    // Stocker le code de vérification
    verificationCodes[email] = {
      code: verificationCode,
      expires: verificationExpires
    };

    // "Envoyer" l'email (afficher dans console)
    sendVerificationEmail(email, name, verificationCode);

    // Token simple (pas de JWT pour la démonstration)
    const token = `token_${user.id}`;

    return res.status(201).json({
      success: true,
      token,
      message: 'Inscription réussie. Vérifiez votre email (console) pour le code de vérification.'
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({
      success: false,
      errors: [{ msg: 'Erreur serveur' }]
    });
  }
});

// Route de vérification email
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Email et code requis' }]
      });
    }

    // Vérifier le code
    const verificationData = verificationCodes[email];
    if (!verificationData) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Code de vérification non trouvé' }]
      });
    }

    if (new Date() > verificationData.expires) {
      delete verificationCodes[email];
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Code de vérification expiré' }]
      });
    }

    if (verificationData.code !== code) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Code de vérification invalide' }]
      });
    }

    // Mettre à jour l'utilisateur
    const user = users.find(u => u.email === email);
    if (user) {
      user.isVerified = true;
      delete user.verificationCode;
      delete user.verificationExpires;
      delete verificationCodes[email];

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified
        },
        message: 'Email vérifié avec succès'
      });
    } else {
      return res.status(404).json({
        success: false,
        errors: [{ msg: 'Utilisateur non trouvé' }]
      });
    }

  } catch (error) {
    console.error('Erreur vérification:', error);
    return res.status(500).json({
      success: false,
      errors: [{ msg: 'Erreur serveur' }]
    });
  }
});

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Email et mot de passe requis' }]
      });
    }

    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Email ou mot de passe incorrect' }]
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Email ou mot de passe incorrect' }]
      });
    }

    // Vérifier si l'utilisateur a vérifié son email
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Veuillez vérifier votre email avant de vous connecter' }]
      });
    }

    // Vérifier si l'email est vérifié
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Veuillez vérifier votre email avant de vous connecter' }]
      });
    }

    const token = `token_${user.id}`;

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    return res.status(500).json({
      success: false,
      errors: [{ msg: 'Erreur serveur' }]
    });
  }
});

// Route mot de passe oublié (simulation)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      // On ne révèle pas que l'email n'existe pas
      return res.json({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
      });
    }

    console.log('\n=== EMAIL RÉINITIALISATION ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Réinitialisation de votre mot de passe`);
    console.log(`Lien de réinitialisation: http://localhost:3000/reset-password?token=reset_${user.id}`);
    console.log('===============================\n');

    return res.json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé (vérifiez la console)'
    });

  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    return res.status(500).json({
      success: false,
      errors: [{ msg: 'Erreur serveur' }]
    });
  }
});

// Route de réinitialisation du mot de passe
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Token et nouveau mot de passe requis' }]
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Le mot de passe doit faire au moins 6 caractères' }]
      });
    }

    // Extraire l'ID utilisateur du token (format: "reset_userId")
    const userId = token.replace('reset_', '');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Token invalide ou expiré' }]
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;

    console.log(`Mot de passe réinitialisé pour: ${user.email}`);

    return res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur réinitialisation:', error);
    return res.status(500).json({
      success: false,
      errors: [{ msg: 'Erreur serveur' }]
    });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('🚀 Serveur de test démarré sur le port', PORT);
  console.log('📧 Les emails de vérification seront affichés dans cette console');
  console.log('💡 Serveur temporaire pour les tests - remplacer par le vrai serveur MongoDB plus tard');
});

export default app;