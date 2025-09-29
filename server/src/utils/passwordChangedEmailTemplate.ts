export const generatePasswordChangedEmail = (name: string) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe modifié avec succès</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
        
        .success-info {
            background: #f0f9f4;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: left;
        }
        
        .success-info-title {
            font-weight: 600;
            color: #065f46;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .success-info ul {
            color: #065f46;
            margin-left: 16px;
        }
        
        .success-info li {
            margin-bottom: 8px;
        }
        
        .security-warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            text-align: left;
        }
        
        .security-warning-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .security-warning p {
            color: #92400e;
            font-size: 14px;
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
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">✅</div>
                <h1>Mot de passe modifié</h1>
                <p>Changement effectué avec succès</p>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${name},</div>
                <p class="message">
                    Votre mot de passe a été modifié avec succès. Cette notification vous confirme 
                    que le changement a bien été effectué sur votre compte ModularHouse.
                </p>
                
                <div class="success-info">
                    <div class="success-info-title">
                        🔒 Détails du changement :
                    </div>
                    <ul>
                        <li>Date : ${new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</li>
                        <li>Action : Modification du mot de passe</li>
                        <li>Statut : Confirmé et actif</li>
                        <li>Sécurité : Toutes vos autres sessions ont été déconnectées</li>
                    </ul>
                </div>
                
                <div class="security-warning">
                    <div class="security-warning-title">
                        ⚠️ Vous n'avez pas effectué ce changement ?
                    </div>
                    <p>
                        Si vous n'êtes pas à l'origine de cette modification, votre compte pourrait être compromis. 
                        Contactez immédiatement notre support à support@modularhouse.com ou connectez-vous 
                        pour sécuriser votre compte.
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                    <strong>Conseils de sécurité :</strong><br>
                    • Utilisez un mot de passe unique pour chaque service<br>
                    • Activez l'authentification à deux facteurs quand c'est possible<br>
                    • Ne partagez jamais vos identifiants<br>
                    • Déconnectez-vous des appareils publics
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Questions ou problèmes ?</strong></p>
                <p>Contactez notre support : <a href="mailto:support@modularhouse.com" style="color: #10b981;">support@modularhouse.com</a></p>
                
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