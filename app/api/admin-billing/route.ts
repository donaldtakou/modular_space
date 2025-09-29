import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Billing from '@/server/models/Billing';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const billings = await Billing.find({})
      .sort({ createdAt: -1 })
      .select('firstName lastName email address city country postalCode phone createdAt');

    return NextResponse.json(billings);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de facturation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}