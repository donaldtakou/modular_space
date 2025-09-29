import { NextRequest, NextResponse } from 'next/server';

// Type pour un client avec historique et rétention
interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  cardType?: string;
  lastFourDigits?: string;
  status: 'active' | 'pending_payment' | 'payment_failed' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string; // Dernière fois vu en temps réel
  expiresAt?: string; // Expire 24h après lastSeenAt
  totalAmount?: number;
  paymentAttempts: number;
  isFromRealtime?: boolean; // Vient du temps réel
}

// Type pour l'historique des modifications
interface ClientHistoryEntry {
  id: string;
  clientId: string;
  clientEmail: string;
  timestamp: string;
  changes: Partial<Client>;
  previousData?: Partial<Client>;
  changeType: 'create' | 'update' | 'realtime_activity' | 'realtime_disconnect';
}

// Base de données en mémoire pour les vrais clients
let realClients: Client[] = [];

// Historique complet des modifications
let clientHistory: ClientHistoryEntry[] = [];

// Fonction pour nettoyer les clients expirés (24h)
const cleanExpiredClients = () => {
  const now = new Date().getTime();
  const initialLength = realClients.length;
  
  realClients = realClients.filter(client => {
    if (client.isFromRealtime && client.expiresAt) {
      const expirationTime = new Date(client.expiresAt).getTime();
      if (now > expirationTime) {
        // Sauvegarder dans l'historique avant suppression
        clientHistory.push({
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clientId: client.id,
          clientEmail: client.email,
          timestamp: new Date().toISOString(),
          changes: { status: 'expired' },
          previousData: { ...client },
          changeType: 'realtime_disconnect'
        });
        return false; // Supprimer le client
      }
    }
    return true; // Garder le client
  });
  
  if (realClients.length !== initialLength) {
    console.log(`🧹 Nettoyage: ${initialLength - realClients.length} clients expirés supprimés`);
  }
};

// Simulation de données clients avec informations complètes (mots de passe et cartes) - DONNÉES DEMO
const mockClientData = [
  {
    id: 'client_001',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    password: 'JeanDupont123!',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    cardNumber: '4532 1234 5678 1234',
    cvv: '123',
    expiryDate: '12/26',
    cardHolderName: 'JEAN DUPONT',
    cardType: 'Visa',
    createdAt: '2025-01-15T10:30:00Z',
    lastLogin: '2025-09-20T14:22:00Z'
  },
  {
    id: 'client_002',
    name: 'Marie Martin',
    email: 'marie.martin@gmail.com',
    password: 'MarieSecure456',
    phone: '+33 6 98 76 54 32',
    address: '456 Avenue des Champs',
    city: 'Lyon',
    postalCode: '69001',
    country: 'France',
    cardNumber: '5412 9876 5432 5678',
    cvv: '456',
    expiryDate: '08/27',
    cardHolderName: 'MARIE MARTIN',
    cardType: 'MasterCard',
    createdAt: '2025-02-20T14:15:00Z',
    lastLogin: '2025-09-24T09:15:00Z'
  },
  {
    id: 'client_003',
    name: 'Pierre Durand',
    email: 'p.durand@hotmail.fr',
    password: 'Pierre789@',
    phone: '+33 6 11 22 33 44',
    address: '789 Boulevard Saint-Germain',
    city: 'Marseille',
    postalCode: '13001',
    country: 'France',
    cardNumber: '4111 1111 1111 9012',
    cvv: '789',
    expiryDate: '03/25',
    cardHolderName: 'PIERRE DURAND',
    cardType: 'Visa',
    createdAt: '2025-03-10T09:45:00Z'
  },
  {
    id: 'client_004',
    name: 'Sophie Leroy',
    email: 'sophie.leroy@yahoo.fr',
    password: 'SophieLeroy321!',
    phone: '+33 6 55 44 33 22',
    address: '321 Rue de la République',
    city: 'Toulouse',
    postalCode: '31000',
    country: 'France',
    cardNumber: '5555 5555 5555 3456',
    cvv: '321',
    expiryDate: '11/26',
    cardHolderName: 'SOPHIE LEROY',
    cardType: 'MasterCard',
    createdAt: '2025-03-25T16:20:00Z',
    lastLogin: '2025-09-23T18:45:00Z'
  },
  {
    id: 'client_005',
    name: 'Thomas Bernard',
    email: 'thomas.bernard@free.fr',
    password: 'ThomasB654#',
    phone: '+33 6 77 88 99 00',
    address: '654 Place de la Comédie',
    city: 'Montpellier',
    postalCode: '34000',
    country: 'France',
    cardNumber: '4000 0000 0000 7890',
    cvv: '654',
    expiryDate: '07/28',
    cardHolderName: 'THOMAS BERNARD',
    cardType: 'Visa',
    createdAt: '2025-04-05T11:30:00Z',
    lastLogin: '2025-09-25T11:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Nettoyer les clients expirés automatiquement
    cleanExpiredClients();
    
    // Récupérer le paramètre pour savoir si on veut les vrais clients, les données demo ou l'historique
    const { searchParams } = new URL(request.url);
    const showDemo = searchParams.get('demo') === 'true';
    const getHistory = searchParams.get('history') === 'true';
    
    if (getHistory) {
      // Retourner l'historique complet
      return NextResponse.json({
        success: true,
        history: clientHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        type: 'history'
      });
    } else if (showDemo) {
      // Retourner les données demo
      return NextResponse.json({
        success: true,
        clients: mockClientData,
        type: 'demo'
      });
    } else {
      // Retourner les vrais clients sauvegardés (non expirés)
      return NextResponse.json({
        success: true,
        clients: realClients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        type: 'real',
        totalHistory: clientHistory.length
      });
    }
    
  } catch (error) {
    console.error('Erreur API admin clients:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

// POST - Ajouter ou mettre à jour un client
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Vérifier les champs requis
    if (!data.email || !data.firstName || !data.lastName) {
      return NextResponse.json(
        { success: false, error: 'Email, prénom et nom sont requis' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    
    // Chercher un client existant par email
    const existingIndex = realClients.findIndex(client => client.email === data.email);
    
    if (existingIndex >= 0) {
      // Mettre à jour le client existant
      realClients[existingIndex] = {
        ...realClients[existingIndex],
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || realClients[existingIndex].company || '',
        address: data.address || realClients[existingIndex].address || '',
        city: data.city || realClients[existingIndex].city || '',
        postalCode: data.postalCode || realClients[existingIndex].postalCode || '',
        country: data.country || realClients[existingIndex].country || '',
        phone: data.phone || realClients[existingIndex].phone || '',
        cardType: data.cardType || realClients[existingIndex].cardType,
        lastFourDigits: data.lastFourDigits || realClients[existingIndex].lastFourDigits,
        status: data.status || realClients[existingIndex].status,
        totalAmount: data.totalAmount || realClients[existingIndex].totalAmount || 0,
        updatedAt: now,
        paymentAttempts: realClients[existingIndex].paymentAttempts + (data.status === 'payment_failed' ? 1 : 0)
      };
      
      return NextResponse.json({
        success: true,
        client: realClients[existingIndex],
        message: 'Client mis à jour avec succès'
      });
    } else {
      // Créer un nouveau client
      const newClient: Client = {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || '',
        address: data.address || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        country: data.country || '',
        phone: data.phone || '',
        cardType: data.cardType,
        lastFourDigits: data.lastFourDigits,
        status: data.status || 'active',
        createdAt: now,
        updatedAt: now,
        totalAmount: data.totalAmount || 0,
        paymentAttempts: data.status === 'payment_failed' ? 1 : 0
      };
      
      realClients.push(newClient);
      
      return NextResponse.json({
        success: true,
        client: newClient,
        message: 'Client créé avec succès'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un client spécifique
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'ID du client requis' },
        { status: 400 }
      );
    }

    const clientIndex = realClients.findIndex(client => client.id === data.id);
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    realClients[clientIndex] = {
      ...realClients[clientIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      client: realClients[clientIndex],
      message: 'Client mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un client
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'ID du client requis' },
        { status: 400 }
      );
    }

    const initialLength = realClients.length;
    realClients = realClients.filter(client => client.id !== clientId);
    
    if (realClients.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Client supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}