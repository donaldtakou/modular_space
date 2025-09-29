import { NextRequest, NextResponse } from 'next/server';
import Product from '@/server/src/models/Product';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({})
      .select('-__v')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}