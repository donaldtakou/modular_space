import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    // Récupérer les paramètres de sécurité (simulation - à connecter à votre base de données)
    const defaultSecurity = {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true
    };

    return NextResponse.json(defaultSecurity);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paramètres de sécurité' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const securitySettings = await request.json();
    
    // Validation des paramètres de sécurité
    const validKeys = ['twoFactorEnabled', 'sessionTimeout', 'loginNotifications'];
    const isValid = Object.keys(securitySettings).every(key => validKeys.includes(key));
    
    if (!isValid) {
      return NextResponse.json({ message: 'Données de sécurité invalides' }, { status: 400 });
    }

    // Validation spécifique pour sessionTimeout
    if (securitySettings.sessionTimeout && 
        (securitySettings.sessionTimeout < 5 || securitySettings.sessionTimeout > 720)) {
      return NextResponse.json({ 
        message: 'Délai de session invalide (5-720 minutes)' 
      }, { status: 400 });
    }

    // Sauvegarder les paramètres de sécurité (simulation - à connecter à votre base de données)
    console.log('🔐 Paramètres de sécurité sauvegardés:', securitySettings);
    
    return NextResponse.json({ 
      message: 'Paramètres de sécurité mis à jour avec succès',
      securitySettings 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la sauvegarde des paramètres de sécurité' },
      { status: 500 }
    );
  }
}