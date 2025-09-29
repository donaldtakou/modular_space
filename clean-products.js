// Script pour nettoyer les titres et ajuster les catégories
const fs = require('fs');

// Lire le fichier actuel
const data = JSON.parse(fs.readFileSync('./public/alibaba_final_products.json', 'utf8'));

console.log(`🔄 Nettoyage de ${data.length} produits...`);

// Fonction pour nettoyer les noms (enlever "Modular Space")
function cleanProductName(name) {
  return name.replace(/^Modular Space\s+/i, '').trim();
}

// Fonction pour ajuster les catégories selon les demandes
function adjustCategory(category, title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  // Smart Living Space pour les produits intelligents, modernes, high-tech
  if (text.includes('intelligent') || text.includes('smart') || 
      text.includes('moderne') || text.includes('high-tech') || 
      text.includes('luxury') || text.includes('luxe') ||
      text.includes('premium') || text.includes('advanced')) {
    return 'Smart Living Space';
  }
  
  // Capsule reste Capsule
  if (category === 'Capsule' || text.includes('capsule') || text.includes('pod')) {
    return 'Capsule';
  }
  
  // Folding pour tout ce qui est mobile, pliable, portable
  if (category === 'Folding' || text.includes('folding') || text.includes('pliable') || 
      text.includes('mobile') || text.includes('portable')) {
    return 'Folding';
  }
  
  // Tout le reste devient Smart Living Space par défaut
  return 'Smart Living Space';
}

// Nettoyer tous les produits
const cleanedProducts = data.map((product, index) => {
  if (index % 200 === 0) {
    console.log(`   Nettoyé ${index}/${data.length} produits...`);
  }
  
  return {
    ...product,
    name: cleanProductName(product.name),
    category: adjustCategory(product.category, product.name, product.description)
  };
});

// Sauvegarder
fs.writeFileSync('./public/alibaba_final_products.json', JSON.stringify(cleanedProducts, null, 2));

console.log('✅ Nettoyage terminé !');

// Statistiques des nouvelles catégories
const newCategories = cleanedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 Nouvelles catégories:');
Object.entries(newCategories).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} produits (${(count/cleanedProducts.length*100).toFixed(1)}%)`);
});

console.log('\n🎯 Aperçu des noms nettoyés:');
cleanedProducts.slice(0, 5).forEach((p, i) => {
  console.log(`${i+1}. "${p.name}" - ${p.category}`);
});