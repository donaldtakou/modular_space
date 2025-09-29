import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Sécurité : vérifier que le nom de fichier est valide
    if (!filename || !filename.endsWith('.txt') || filename.includes('..')) {
      return NextResponse.json({
        success: false,
        error: 'Nom de fichier invalide'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data', 'clients');
    const filePath = path.join(dataDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Fichier non trouvé'
      }, { status: 404 });
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
    
  } catch (error) {
    console.error('Error reading client file:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la lecture du fichier'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Sécurité : vérifier que le nom de fichier est valide
    if (!filename || !filename.endsWith('.txt') || filename.includes('..')) {
      return NextResponse.json({
        success: false,
        error: 'Nom de fichier invalide'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data', 'clients');
    const filePath = path.join(dataDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        error: 'Fichier non trouvé'
      }, { status: 404 });
    }
    
    fs.unlinkSync(filePath);
    
    return NextResponse.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Error deleting client file:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression du fichier'
    }, { status: 500 });
  }
}