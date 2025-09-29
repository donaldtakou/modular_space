// Script de transformation des données Alibaba vers notre schéma Modular Space
const fs = require('fs');

// Lire les données scrapées
const rawData = fs.readFileSync('./scraped-data/je .txt', 'utf8');
const alibabaProducts = JSON.parse(rawData);

console.log(`Trouvé ${alibabaProducts.length} produits Alibaba`);

// Fonction pour nettoyer et normaliser les prix
function normalizePrice(price) {
  // Extraire le prix minimum de plages comme "600-700 $US"
  const match = price.match(/(\d+(?:[â€¯,\s]*\d+)*)/);
  if (match) {
    const numPrice = parseInt(match[1].replace(/[â€¯,\s]/g, ''));
    return `$${numPrice.toLocaleString()}`;
  }
  return '$1,500'; // Prix par défaut
}

// Fonction pour déterminer la catégorie
function determineCategory(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('pliable') || text.includes('folding') || text.includes('portable') || text.includes('mobile')) {
    return 'Folding';
  }
  if (text.includes('capsule') || text.includes('pod') || text.includes('space')) {
    return 'Capsule';
  }
  if (text.includes('modulaire') || text.includes('modular') || text.includes('extensible')) {
    return 'Modulaire';
  }
  return 'Container';
}

// Fonction pour générer des features pertinentes
function generateFeatures(title, description, price) {
  const text = (title + ' ' + description).toLowerCase();
  const features = [];
  
  // Taille
  if (text.includes('20')) features.push('20ft');
  if (text.includes('40')) features.push('40ft');
  if (text.includes('petit') || text.includes('tiny') || text.includes('micro')) features.push('Compact');
  
  // Caractéristiques
  if (text.includes('luxe') || text.includes('luxury') || text.includes('haut de gamme')) features.push('Luxe');
  if (text.includes('solaire') || text.includes('solar') || text.includes('écologique')) features.push('Écologique');
  if (text.includes('intelligent') || text.includes('smart')) features.push('Intelligent');
  if (text.includes('cuisine') || text.includes('kitchen')) features.push('Cuisine équipée');
  if (text.includes('salle de bain') || text.includes('bathroom')) features.push('Salle de bain');
  if (text.includes('chambre') || text.includes('bedroom')) features.push('Chambres');
  if (text.includes('étanche') || text.includes('waterproof')) features.push('Étanche');
  if (text.includes('mobile') || text.includes('portable')) features.push('Mobile');
  
  // Si pas assez de features, ajouter des génériques
  if (features.length < 3) {
    features.push('Prêt à vivre', 'Installation rapide', 'Garantie qualité');
  }
  
  return features.slice(0, 5); // Maximum 5 features
}

// Fonction pour créer un nom Modular Space
function createModularName(title, index) {
  const text = title.toLowerCase();
  
  let type = 'Container';
  let size = '';
  let variant = '';
  
  // Déterminer le type
  if (text.includes('capsule')) type = 'Capsule';
  else if (text.includes('pliable') || text.includes('mobile')) type = 'Mobile';
  else if (text.includes('villa') || text.includes('luxury')) type = 'Villa';
  else if (text.includes('bureau') || text.includes('office')) type = 'Bureau';
  
  // Taille
  if (text.includes('20')) size = '20ft';
  else if (text.includes('40')) size = '40ft';
  else if (text.includes('petit') || text.includes('tiny')) size = 'Compact';
  else size = 'Standard';
  
  // Variante
  if (text.includes('luxe') || text.includes('luxury')) variant = 'Luxe';
  else if (text.includes('moderne') || text.includes('modern')) variant = 'Moderne';
  else if (text.includes('intelligent') || text.includes('smart')) variant = 'Smart';
  else variant = 'Pro';
  
  return `Modular Space ${type} ${size} ${variant}`;
}

// Transformer les produits
const transformedProducts = alibabaProducts.map((product, index) => {
  return {
    id: index + 1,
    name: createModularName(product.Title, index),
    description: product.Title, // Utiliser le titre original comme description
    price: normalizePrice(product.Price),
    image: product.Image, // Utiliser les vraies images Alibaba
    category: determineCategory(product.Title, product.Title),
    features: generateFeatures(product.Title, product.Title, product.Price)
  };
});

// Limiter à 30 produits pour éviter la surcharge
const finalProducts = transformedProducts.slice(0, 30);

// Sauvegarder le résultat
fs.writeFileSync('./scraped-data/modular-space-products.json', JSON.stringify(finalProducts, null, 2));

console.log(`✅ Transformation terminée ! ${finalProducts.length} produits Modular Space créés`);
console.log('📁 Fichier sauvé: ./scraped-data/modular-space-products.json');

// Afficher un aperçu
console.log('\n🎯 Aperçu des 3 premiers produits:');
finalProducts.slice(0, 3).forEach((p, i) => {
  console.log(`\n${i+1}. ${p.name}`);
  console.log(`   Prix: ${p.price}`);
  console.log(`   Catégorie: ${p.category}`);
  console.log(`   Features: ${p.features.join(', ')}`);
});