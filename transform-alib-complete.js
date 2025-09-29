const fs = require('fs');

// Lire les données Alib.json
const alibData = JSON.parse(fs.readFileSync('Alib.json', 'utf8'));
console.log(`Données Alib.json chargées: ${alibData.length} produits`);

// Lire les données existantes
let existingData = [];
try {
    existingData = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
    console.log(`Données existantes chargées: ${existingData.length} produits`);
} catch (error) {
    console.log('Aucune donnée existante trouvée, création d\'un nouveau fichier');
}

// Fonction pour générer des caractéristiques basées sur le titre et les détails
function generateFeatures(title, price, company) {
    const features = [];
    const titleLower = title.toLowerCase();
    
    // Caractéristiques basées sur le titre
    if (titleLower.includes('intelligent') || titleLower.includes('smart')) {
        features.push('Système intelligent');
    }
    if (titleLower.includes('solaire') || titleLower.includes('solar')) {
        features.push('Énergie solaire');
    }
    if (titleLower.includes('luxe') || titleLower.includes('luxury')) {
        features.push('Design luxueux');
    }
    if (titleLower.includes('mobile') || titleLower.includes('portable')) {
        features.push('Structure mobile');
    }
    if (titleLower.includes('étanche') || titleLower.includes('waterproof')) {
        features.push('Résistant à l\'eau');
    }
    if (titleLower.includes('écologique') || titleLower.includes('eco')) {
        features.push('Écologique');
    }
    if (titleLower.includes('modulaire') || titleLower.includes('modular')) {
        features.push('Construction modulaire');
    }
    if (titleLower.includes('prefab') || titleLower.includes('préfab')) {
        features.push('Préfabriqué');
    }
    if (titleLower.includes('acier') || titleLower.includes('steel')) {
        features.push('Structure acier');
    }
    if (titleLower.includes('conteneur') || titleLower.includes('container')) {
        features.push('Type conteneur');
    }
    
    // Dimensions basées sur les mentions dans le titre
    if (titleLower.includes('20ft') || titleLower.includes('20 ft')) {
        features.push('20 pieds');
    }
    if (titleLower.includes('40ft') || titleLower.includes('40 ft')) {
        features.push('40 pieds');
    }
    if (titleLower.includes('2 chambres') || titleLower.includes('deux chambres')) {
        features.push('2 chambres');
    }
    if (titleLower.includes('cuisine')) {
        features.push('Cuisine équipée');
    }
    if (titleLower.includes('salle de bain') || titleLower.includes('bathroom')) {
        features.push('Salle de bain');
    }
    
    // Ajouter des caractéristiques par défaut si pas assez
    if (features.length < 3) {
        features.push('Installation rapide');
        features.push('Certification CE');
        features.push('Garantie fabricant');
    }
    
    return features.slice(0, 6); // Maximum 6 caractéristiques
}

// Fonction pour catégoriser les produits
function categorizeProduct(title) {
    const titleLower = title.toLowerCase();
    
    // Catégorie Smart Living Space pour les produits non-maisons
    if (titleLower.includes('projecteur') || titleLower.includes('projector') ||
        titleLower.includes('led') || titleLower.includes('éclairage') ||
        titleLower.includes('rideau') || titleLower.includes('curtain') ||
        titleLower.includes('smart home') || titleLower.includes('domotique') ||
        titleLower.includes('zigbee') || titleLower.includes('wifi') ||
        titleLower.includes('alexa') || titleLower.includes('google home')) {
        return 'Smart Living Space';
    }
    
    // Catégorie Folding pour les structures pliables
    if (titleLower.includes('folding') || titleLower.includes('pliable') ||
        titleLower.includes('fold') || titleLower.includes('expandable') ||
        titleLower.includes('extensible')) {
        return 'Folding';
    }
    
    // Catégorie Modulaire pour les constructions modulaires
    if (titleLower.includes('modulaire') || titleLower.includes('modular') ||
        titleLower.includes('module') || titleLower.includes('assemblage')) {
        return 'Modulaire';
    }
    
    // Catégorie Container pour les maisons containers
    if (titleLower.includes('conteneur') || titleLower.includes('container') ||
        titleLower.includes('20ft') || titleLower.includes('40ft') ||
        titleLower.includes('shipping')) {
        return 'Container';
    }
    
    // Par défaut, Capsule pour toutes les autres maisons/cabines
    return 'Capsule';
}

// Fonction pour nettoyer et normaliser le prix
function normalizePrice(priceStr) {
    if (!priceStr || priceStr === '') return '$150';
    
    // Nettoyer le prix
    const cleanPrice = priceStr.replace(/[^\d,-]/g, '');
    const numbers = cleanPrice.split(/[-,]/).map(n => parseInt(n)).filter(n => !isNaN(n) && n > 0);
    
    if (numbers.length === 0) return '$150';
    
    // Prendre le prix le plus bas s'il y a une gamme
    const price = Math.min(...numbers);
    
    // Ajuster les prix trop bas ou trop élevés
    if (price < 50) return '$150';
    if (price > 50000) return '$25000';
    
    return `$${price}`;
}

// Fonction pour nettoyer le titre (enlever "Modular Space" et autres préfixes)
function cleanTitle(title) {
    return title
        .replace(/^Modular Space\s*/i, '')
        .replace(/^Smart\s*/i, '')
        .replace(/^Modern\s*/i, '')
        .replace(/^Luxury\s*/i, '')
        .trim();
}

// Transformer les produits Alib.json
console.log('Transformation des produits en cours...');

const transformedProducts = alibData.map((product, index) => {
    const title = cleanTitle(product.Title || `Produit ${index + 1}`);
    const category = categorizeProduct(title);
    const price = normalizePrice(product.Price);
    const features = generateFeatures(title, price, product.Company);
    
    return {
        id: existingData.length + index + 1, // Continuer la numérotation
        name: title,
        description: `${title} - Solution d'habitat moderne et innovante avec finitions de qualité. Fabriqué par ${product.Company || 'fabricant certifié'}.`,
        price: price,
        image: product.Image || '/images/placeholder-product.jpg',
        category: category,
        features: features
    };
});

// Fusionner avec les données existantes
const allProducts = [...existingData, ...transformedProducts];

// Statistiques
const stats = {};
allProducts.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
});

console.log('\n=== STATISTIQUES FINALES ===');
console.log(`Total produits: ${allProducts.length}`);
Object.entries(stats).forEach(([category, count]) => {
    const percentage = ((count / allProducts.length) * 100).toFixed(1);
    console.log(`${category}: ${count} produits (${percentage}%)`);
});

// Calculer les prix
const prices = allProducts.map(p => parseInt(p.price.replace('$', '').replace(',', '')));
const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
console.log(`Prix moyen: $${avgPrice}`);
console.log(`Prix min: $${Math.min(...prices)} - Prix max: $${Math.max(...prices)}`);

// Sauvegarder le fichier final
fs.writeFileSync('alibaba_final_products.json', JSON.stringify(allProducts, null, 2));
console.log('\n✅ Fichier alibaba_final_products.json créé avec succès !');
console.log(`📦 ${allProducts.length} produits disponibles dans toutes les catégories`);

// Copier vers le répertoire public
fs.copyFileSync('alibaba_final_products.json', 'public/alibaba_final_products.json');
console.log('✅ Fichier copié vers public/ pour l\'application React');