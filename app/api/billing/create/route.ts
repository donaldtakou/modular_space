import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Billing from '@/server/models/Billing';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Valider les données reçues
    if (!data.firstName || !data.lastName || !data.email || !data.address || 
        !data.city || !data.country || !data.postalCode || !data.phone) {
      return NextResponse.json(
        { error: 'Toutes les informations sont requises' },
        { status: 400 }
      );
    }

    // Sauvegarder les informations de facturation
    const billing = await Billing.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      phone: data.phone
    });

    return NextResponse.json({ 
      success: true, 
      billingId: billing.id 
    });
  } catch (error) {
    console.error('Erreur de facturation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement des données' },
      { status: 500 }
    );
  }
}