import { NextRequest, NextResponse } from 'next/server';

// Types pour les produits admin
interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Folding' | 'Container' | 'Capsule';
  features: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Stockage en mémoire (remplace localStorage côté serveur)
let adminProducts: AdminProduct[] = [];

// Charger les produits existants depuis localStorage si disponible
const loadProductsFromStorage = (): AdminProduct[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin_products');
    return stored ? JSON.parse(stored) : [];
  }
  return adminProducts;
};

// Sauvegarder vers localStorage
const saveProductsToStorage = (products: AdminProduct[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_products', JSON.stringify(products));
  }
  adminProducts = products;
};

// GET - Récupérer tous les produits admin
export async function GET(request: NextRequest) {
  try {
    // En production, vérifier l'authentification admin
    const authHeader = request.headers.get('authorization');
    
    return NextResponse.json(adminProducts, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Erreur API admin products GET:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validation
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Nom, description, prix et catégorie requis' },
        { status: 400 }
      );
    }

    // Vérifier la catégorie
    const validCategories = ['Folding', 'Container', 'Capsule'];
    if (!validCategories.includes(productData.category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide. Utilisez: Folding, Container, ou Capsule' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe déjà
    const existingProduct = adminProducts.find(p => 
      p.name.toLowerCase() === productData.name.toLowerCase()
    );
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Un produit avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    // Créer le nouveau produit
    const newProduct: AdminProduct = {
      id: `admin_product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: productData.name.trim(),
      description: productData.description.trim(),
      price: productData.price.trim(),
      category: productData.category,
      features: productData.features.filter((f: string) => f.trim()).map((f: string) => f.trim()),
      image: productData.image.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Ajouter à la liste
    adminProducts.push(newProduct);
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Produit ajouté avec succès'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur création produit admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un produit existant
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      );
    }
    
    const productData = await request.json();
    const productIndex = adminProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    // Mettre à jour le produit
    adminProducts[productIndex] = {
      ...adminProducts[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      product: adminProducts[productIndex],
      message: 'Produit modifié avec succès'
    });
    
  } catch (error) {
    console.error('Erreur modification produit admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du produit' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      );
    }
    
    const productIndex = adminProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    const deletedProduct = adminProducts.splice(productIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      product: deletedProduct,
      message: 'Produit supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur suppression produit admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}