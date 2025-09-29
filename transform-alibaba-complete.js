// Script pour traiter TOUS les 1,929 produits Alibaba - Version COMPLÈTE
const fs = require('fs');

// Lire les données scrapées
const rawData = fs.readFileSync('./scraped-data/je .txt', 'utf8');
const alibabaProducts = JSON.parse(rawData);

console.log(`🚀 Traitement de TOUS les ${alibabaProducts.length} produits Alibaba !`);

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

// Fonction pour déterminer la catégorie avec plus de précision
function determineCategory(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('capsule') || text.includes('pod') || text.includes('space')) {
    return 'Capsule';
  }
  if (text.includes('pliable') || text.includes('folding') || text.includes('portable') || text.includes('mobile')) {
    return 'Folding';
  }
  if (text.includes('modulaire') || text.includes('modular') || text.includes('extensible')) {
    return 'Modulaire';
  }
  if (text.includes('villa') || text.includes('luxury') || text.includes('luxe')) {
    return 'Villa';
  }
  return 'Container';
}

// Fonction pour générer des features pertinentes et variées
function generateFeatures(title, description, price) {
  const text = (title + ' ' + description).toLowerCase();
  const features = [];
  
  // Taille
  if (text.includes('20')) features.push('20ft');
  if (text.includes('40')) features.push('40ft');
  if (text.includes('petit') || text.includes('tiny') || text.includes('micro')) features.push('Compact');
  
  // Caractéristiques Premium
  if (text.includes('luxe') || text.includes('luxury') || text.includes('haut de gamme')) features.push('Luxe');
  if (text.includes('solaire') || text.includes('solar') || text.includes('écologique')) features.push('Écologique');
  if (text.includes('intelligent') || text.includes('smart')) features.push('Intelligent');
  if (text.includes('moderne') || text.includes('modern')) features.push('Moderne');
  
  // Équipements
  if (text.includes('cuisine') || text.includes('kitchen')) features.push('Cuisine équipée');
  if (text.includes('salle de bain') || text.includes('bathroom')) features.push('Salle de bain');
  if (text.includes('chambre') || text.includes('bedroom')) features.push('Chambres');
  if (text.includes('bureau') || text.includes('office')) features.push('Bureau');
  
  // Propriétés techniques
  if (text.includes('étanche') || text.includes('waterproof')) features.push('Étanche');
  if (text.includes('mobile') || text.includes('portable')) features.push('Mobile');
  if (text.includes('pliable') || text.includes('folding')) features.push('Pliable');
  if (text.includes('extensible') || text.includes('expandable')) features.push('Extensible');
  
  // Usage
  if (text.includes('hôtel') || text.includes('hotel')) features.push('Usage hôtelier');
  if (text.includes('camping')) features.push('Camping');
  if (text.includes('villa')) features.push('Villa');
  if (text.includes('appartement') || text.includes('apartment')) features.push('Résidentiel');
  
  // Si pas assez de features, ajouter des génériques
  if (features.length < 3) {
    const generics = ['Prêt à vivre', 'Installation rapide', 'Garantie qualité', 'Durable', 'Économique'];
    features.push(...generics.slice(0, 5 - features.length));
  }
  
  return features.slice(0, 5); // Maximum 5 features
}

// Fonction pour créer des noms Modular Space variés
function createModularName(title, index) {
  const text = title.toLowerCase();
  
  let type = 'Container';
  let size = '';
  let variant = '';
  
  // Déterminer le type avec plus de variété
  if (text.includes('capsule')) type = 'Capsule';
  else if (text.includes('villa') || text.includes('luxury')) type = 'Villa';
  else if (text.includes('pliable') || text.includes('mobile')) type = 'Mobile';
  else if (text.includes('bureau') || text.includes('office')) type = 'Bureau';
  else if (text.includes('hotel') || text.includes('hôtel')) type = 'Hôtel';
  else if (text.includes('pod')) type = 'Pod';
  
  // Taille avec plus de variété
  if (text.includes('20')) size = '20ft';
  else if (text.includes('40')) size = '40ft';
  else if (text.includes('petit') || text.includes('tiny')) size = 'Compact';
  else if (text.includes('grand') || text.includes('large')) size = 'Grande';
  else size = 'Standard';
  
  // Variante avec plus de créativité
  if (text.includes('luxe') || text.includes('luxury')) variant = 'Luxe';
  else if (text.includes('moderne') || text.includes('modern')) variant = 'Moderne';
  else if (text.includes('intelligent') || text.includes('smart')) variant = 'Smart';
  else if (text.includes('écologique') || text.includes('eco')) variant = 'Eco';
  else if (text.includes('premium')) variant = 'Premium';
  else if (index % 4 === 0) variant = 'Pro';
  else if (index % 4 === 1) variant = 'Elite';
  else if (index % 4 === 2) variant = 'Advanced';
  else variant = 'Ultimate';
  
  return `Modular Space ${type} ${size} ${variant}`;
}

// Transformer TOUS les produits
console.log('🔄 Transformation en cours...');
const transformedProducts = alibabaProducts.map((product, index) => {
  if (index % 100 === 0) {
    console.log(`   Traité ${index}/${alibabaProducts.length} produits...`);
  }
  
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

console.log('💾 Sauvegarde du fichier complet...');

// Sauvegarder TOUS les produits
fs.writeFileSync('./scraped-data/modular-space-complete.json', JSON.stringify(transformedProducts, null, 2));

console.log(`✅ MASTER CLASS COMPLÈTE ! ${transformedProducts.length} produits Modular Space créés`);
console.log('📁 Fichier complet: ./scraped-data/modular-space-complete.json');

// Statistiques
const categoriesCount = transformedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 Répartition par catégories:');
Object.entries(categoriesCount).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} produits (${(count/transformedProducts.length*100).toFixed(1)}%)`);
});

// Prix statistiques
const prices = transformedProducts.map(p => parseInt(p.price.replace(/[$,]/g, '')));
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const avgPrice = Math.round(prices.reduce((a,b) => a+b) / prices.length);

console.log(`\n💰 Gamme de prix:`);
console.log(`   Minimum: $${minPrice.toLocaleString()}`);
console.log(`   Maximum: $${maxPrice.toLocaleString()}`);
console.log(`   Moyenne: $${avgPrice.toLocaleString()}`);

console.log(`\n🎯 Aperçu de quelques produits:`);
[0, 500, 1000, 1500].forEach(i => {
  if (transformedProducts[i]) {
    const p = transformedProducts[i];
    console.log(`\n${i+1}. ${p.name}`);
    console.log(`   Prix: ${p.price}`);
    console.log(`   Catégorie: ${p.category}`);
    console.log(`   Features: ${p.features.join(', ')}`);
  }
});