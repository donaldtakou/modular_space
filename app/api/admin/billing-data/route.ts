import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Path to store billing data
    const dataPath = path.join(process.cwd(), 'data', 'billing-data.json');
    
    // Ensure directory exists
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let billingData = [];
    
    // Read existing data if file exists
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      billingData = JSON.parse(fileContent);
    }
    
    // Format data for real-time display
    const formattedData = billingData.map((item: any) => ({
      id: item.id,
      userId: item.userId,
      userName: item.userName || 'Utilisateur inconnu',
      email: item.email,
      amount: parseFloat(item.amount || 0).toFixed(2),
      currency: item.currency || 'EUR',
      status: item.status,
      paymentMethod: item.paymentMethod,
      products: item.products || [],
      billingAddress: item.billingAddress,
      timestamp: item.timestamp,
      formattedDate: new Date(item.timestamp).toLocaleString('fr-FR'),
      formattedAmount: `${parseFloat(item.amount || 0).toFixed(2)} ${item.currency || 'EUR'}`
    }));
    
    // Sort by timestamp (most recent first)
    formattedData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch billing data',
      data: [],
      total: 0
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataPath = path.join(process.cwd(), 'data', 'billing-data.json');
    
    // Ensure directory exists
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let billingData = [];
    
    // Read existing data
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      billingData = JSON.parse(fileContent);
    }
    
    // Add new billing record
    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };
    
    billingData.push(newRecord);
    
    // Save updated data
    fs.writeFileSync(dataPath, JSON.stringify(billingData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Billing data saved successfully',
      record: newRecord
    });
    
  } catch (error) {
    console.error('Error saving billing data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save billing data'
    }, { status: 500 });
  }
}