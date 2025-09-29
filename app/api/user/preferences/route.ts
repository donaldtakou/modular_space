import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    // Récupérer les préférences utilisateur (simulation - à connecter à votre base de données)
    const defaultPreferences = {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      productUpdates: true,
      securityAlerts: true,
      timeZone: 'Europe/Paris',
      currency: 'EUR'
    };

    return NextResponse.json(defaultPreferences);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des préférences' },
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

    const preferences = await request.json();
    
    // Validation des préférences
    const validKeys = [
      'emailNotifications', 'smsNotifications', 'marketingEmails', 
      'productUpdates', 'securityAlerts', 'timeZone', 'currency'
    ];
    
    const isValid = Object.keys(preferences).every(key => validKeys.includes(key));
    
    if (!isValid) {
      return NextResponse.json({ message: 'Données de préférences invalides' }, { status: 400 });
    }

    // Sauvegarder les préférences (simulation - à connecter à votre base de données)
    console.log('🔄 Préférences sauvegardées:', preferences);
    
    return NextResponse.json({ 
      message: 'Préférences mises à jour avec succès',
      preferences 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la sauvegarde des préférences' },
      { status: 500 }
    );
  }
}