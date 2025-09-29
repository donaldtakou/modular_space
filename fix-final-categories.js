const fs = require('fs');

// Lire les données
const data = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
console.log(`Données chargées: ${data.length} produits`);

// Fonction pour recatégoriser selon le nouvel ordre
function recategorizeProduct(product) {
    const title = product.name.toLowerCase();
    
    // Folding : structures pliables et extensibles
    if (title.includes('folding') || title.includes('pliable') || 
        title.includes('fold') || title.includes('extensible') ||
        title.includes('télescopique') || title.includes('rétractable') ||
        title.includes('étendoir') || title.includes('séchoir')) {
        return 'Folding';
    }
    
    // Capsule : toutes les capsules spatiales et cabines
    if (title.includes('capsule') || title.includes('cabin') || 
        title.includes('pod') || title.includes('spatial') ||
        title.includes('apple') && title.includes('cabin')) {
        return 'Capsule';
    }
    
    // Smart Living Space : domotique et technologie maison connectée
    if (title.includes('projecteur') || title.includes('led') || 
        title.includes('rideau') || title.includes('éclairage') || 
        title.includes('smart rgb') || title.includes('alexa') ||
        title.includes('google home') || title.includes('zigbee') || 
        title.includes('wifi') || title.includes('télécommande') || 
        title.includes('veilleuse') || title.includes('lampe') ||
        title.includes('réfrigérateur') && title.includes('intelligent')) {
        return 'Smart Living Space';
    }
    
    // New : tout le reste (conteneurs, modulaires, etc.)
    return 'New';
}

// Recatégoriser tous les produits
let changedCount = 0;
const updatedData = data.map(product => {
    const oldCategory = product.category;
    const newCategory = recategorizeProduct(product);
    
    if (oldCategory !== newCategory) {
        changedCount++;
    }
    
    return {
        ...product,
        category: newCategory
    };
});

// Statistiques finales
const stats = {};
updatedData.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
});

console.log(`\n=== NOUVELLE RÉPARTITION DES CATÉGORIES ===`);
console.log(`Produits recatégorisés: ${changedCount}`);
console.log('\n=== STATISTIQUES FINALES ===');
Object.entries(stats).forEach(([category, count]) => {
    const percentage = ((count / updatedData.length) * 100).toFixed(1);
    console.log(`${category}: ${count} produits (${percentage}%)`);
});

// Sauvegarder
fs.writeFileSync('alibaba_final_products.json', JSON.stringify(updatedData, null, 2));
fs.copyFileSync('alibaba_final_products.json', 'public/alibaba_final_products.json');

console.log('\n✅ Fichier mis à jour avec la nouvelle répartition des catégories !');