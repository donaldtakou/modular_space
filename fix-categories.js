const fs = require('fs');

// Lire les données
const data = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
console.log(`Données chargées: ${data.length} produits`);

// Fonction pour recatégoriser les produits Smart Living Space
function fixSmartLivingSpace(product) {
    const title = product.name.toLowerCase();
    
    // Si c'est vraiment de la domotique/technologie smart home
    if (title.includes('projecteur') || title.includes('led') || title.includes('rideau') ||
        title.includes('éclairage') || title.includes('smart rgb') || title.includes('alexa') ||
        title.includes('google home') || title.includes('zigbee') || title.includes('wifi') ||
        title.includes('télécommande') || title.includes('veilleuse') || title.includes('lampe')) {
        return 'Smart Living Space';
    }
    
    // Sinon, recatégoriser selon la logique normale
    if (title.includes('capsule') || title.includes('cabin') || title.includes('pod')) {
        return 'New'; // Mettre les capsules dans "New"
    }
    if (title.includes('conteneur') || title.includes('container') || title.includes('20ft') || title.includes('40ft')) {
        return 'New'; // Mettre les containers dans "New"
    }
    if (title.includes('modulaire') || title.includes('modular')) {
        return 'Modulaire';
    }
    if (title.includes('folding') || title.includes('pliable')) {
        return 'Folding';
    }
    
    // Par défaut
    return 'New';
}

// Recatégoriser tous les produits
let changedCount = 0;
const updatedData = data.map(product => {
    const oldCategory = product.category;
    const newCategory = fixSmartLivingSpace(product);
    
    if (oldCategory !== newCategory) {
        changedCount++;
        console.log(`${product.name} : ${oldCategory} → ${newCategory}`);
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

console.log(`\n=== CORRECTIONS EFFECTUÉES ===`);
console.log(`Produits recatégorisés: ${changedCount}`);
console.log('\n=== NOUVELLES STATISTIQUES ===');
Object.entries(stats).forEach(([category, count]) => {
    const percentage = ((count / updatedData.length) * 100).toFixed(1);
    console.log(`${category}: ${count} produits (${percentage}%)`);
});

// Sauvegarder
fs.writeFileSync('alibaba_final_products.json', JSON.stringify(updatedData, null, 2));
fs.copyFileSync('alibaba_final_products.json', 'public/alibaba_final_products.json');

console.log('\n✅ Fichier mis à jour avec les nouvelles catégories !');