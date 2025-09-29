import nodemailer from 'nodemailer';
import { generatePasswordChangedEmail } from './passwordChangedEmailTemplate';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export const generateVerificationEmail = (name: string, code: string) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .code-container {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            display: inline-block;
        }
        
        .code-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .verification-code {
            font-size: 32px;
            font-weight: 800;
            color: #1f2937;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        
        .expiry {
            font-size: 14px;
            color: #ef4444;
            margin-top: 8px;
            font-weight: 500;
        }
        
        .instructions {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: left;
        }
        
        .instructions-title {
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .instructions ul {
            color: #0c4a6e;
            margin-left: 16px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .company-info {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 16px;
        }
        
        .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            text-align: left;
        }
        
        .security-note-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .security-note p {
            color: #92400e;
            font-size: 14px;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 20px 10px;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .verification-code {
                font-size: 24px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🏠</div>
                <h1>ModularHouse</h1>
                <p>Plateforme de maisons modulaires</p>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${name} !</div>
                <p class="message">
                    Bienvenue sur ModularHouse ! Pour finaliser la création de votre compte et accéder à notre plateforme de paiement sécurisé, veuillez confirmer votre adresse email en utilisant le code de vérification ci-dessous.
                </p>
                
                <div class="code-container">
                    <div class="code-label">Votre code de vérification</div>
                    <div class="verification-code">${code}</div>
                    <div class="expiry">Expire dans 4 minutes</div>
                </div>
                
                <div class="instructions">
                    <div class="instructions-title">
                        📋 Instructions :
                    </div>
                    <ul>
                        <li>Copiez le code ci-dessus</li>
                        <li>Retournez sur la page de vérification</li>
                        <li>Collez ou saisissez le code dans le champ prévu</li>
                        <li>Votre compte sera activé immédiatement</li>
                    </ul>
                </div>
                
                <div class="security-note">
                    <div class="security-note-title">
                        🔒 Note de sécurité :
                    </div>
                    <p>
                        Si vous n'avez pas créé de compte sur ModularHouse, vous pouvez ignorer cet email en toute sécurité. Votre adresse email ne sera pas utilisée.
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Contactez notre support : <a href="mailto:support@modularhouse.com" style="color: #667eea;">support@modularhouse.com</a></p>
                
                <div class="company-info">
                    <p>ModularHouse - Solutions d'habitat modulaire</p>
                    <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generatePasswordResetEmail = (name: string, resetUrl: string) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            transition: all 0.3s ease;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }
        
        .alternative-link {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: left;
        }
        
        .alternative-link p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .link-text {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #4b5563;
            word-break: break-all;
            background: #f3f4f6;
            padding: 8px;
            border-radius: 4px;
        }
        
        .expiry-warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            text-align: left;
        }
        
        .expiry-warning-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .expiry-warning p {
            color: #92400e;
            font-size: 14px;
        }
        
        .security-tips {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: left;
        }
        
        .security-tips-title {
            font-weight: 600;
            color: #0c4a6e;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .security-tips ul {
            color: #0c4a6e;
            margin-left: 16px;
        }
        
        .security-tips li {
            margin-bottom: 8px;
        }
        
        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .company-info {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 16px;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 20px 10px;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .reset-button {
                padding: 14px 28px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🔑</div>
                <h1>Réinitialisation</h1>
                <p>Récupération de votre mot de passe</p>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${name},</div>
                <p class="message">
                    Vous avez demandé la réinitialisation de votre mot de passe sur ModularHouse. 
                    Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
                </p>
                
                <a href="${resetUrl}" class="reset-button">
                    Réinitialiser mon mot de passe
                </a>
                
                <div class="alternative-link">
                    <p><strong>Le bouton ne fonctionne pas ?</strong></p>
                    <p>Copiez et collez ce lien dans votre navigateur :</p>
                    <div class="link-text">${resetUrl}</div>
                </div>
                
                <div class="expiry-warning">
                    <div class="expiry-warning-title">
                        ⏰ Important :
                    </div>
                    <p>
                        Ce lien de réinitialisation expire dans 4 minutes pour votre sécurité. 
                        Si vous ne l'utilisez pas dans ce délai, vous devrez refaire une demande.
                    </p>
                </div>
                
                <div class="security-tips">
                    <div class="security-tips-title">
                        🛡️ Conseils de sécurité :
                    </div>
                    <ul>
                        <li>Choisissez un mot de passe d'au moins 8 caractères</li>
                        <li>Utilisez des lettres majuscules, minuscules et des chiffres</li>
                        <li>Évitez les mots du dictionnaire ou informations personnelles</li>
                        <li>N'hésitez pas à utiliser un gestionnaire de mots de passe</li>
                    </ul>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                    <strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br>
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. 
                    Votre mot de passe actuel reste inchangé et sécurisé.
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Besoin d'aide ?</strong></p>
                <p>Contactez notre support : <a href="mailto:support@modularhouse.com" style="color: #ef4444;">support@modularhouse.com</a></p>
                
                <div class="company-info">
                    <p>ModularHouse - Solutions d'habitat modulaire</p>
                    <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export { generatePasswordChangedEmail };
