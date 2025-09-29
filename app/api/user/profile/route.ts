import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    // Récupérer le profil utilisateur (simulation - à connecter à votre base de données)
    const defaultProfile = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France'
    };

    return NextResponse.json(defaultProfile);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du profil' },
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

    const profileData = await request.json();
    
    // Validation des données du profil
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        message: `Champs requis manquants: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      return NextResponse.json({ 
        message: 'Format d\'email invalide' 
      }, { status: 400 });
    }

    // Sauvegarder le profil (simulation - à connecter à votre base de données)
    console.log('👤 Profil sauvegardé:', profileData);
    
    return NextResponse.json({ 
      message: 'Profil mis à jour avec succès',
      profile: profileData 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la sauvegarde du profil' },
      { status: 500 }
    );
  }
}