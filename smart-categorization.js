const fs = require('fs');

console.log('=== RECATÉGORISATION INTELLIGENTE BASÉE SUR LES IMAGES ET DESCRIPTIONS ===');

// Lire les données
const data = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
console.log(`Données chargées: ${data.length} produits`);

// Fonction de catégorisation intelligente basée sur l'image et la description
function intelligentCategorization(product) {
    const title = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const imageUrl = product.image.toLowerCase();
    
    console.log(`\nAnalyse: ${product.name.substring(0, 60)}...`);
    console.log(`Image: ${product.image.substring(0, 80)}...`);
    
    // === FOLDING (Structures pliables/extensibles) ===
    if (
        // Mots-clés explicites de pliage
        title.includes('folding') || title.includes('pliable') || title.includes('fold') ||
        title.includes('extensible') || title.includes('expandable') || 
        title.includes('télescopique') || title.includes('rétractable') ||
        
        // Séchoirs et étendoirs (clairement pliables)
        title.includes('séchoir') || title.includes('étendoir') ||
        title.includes('clothes drying') || title.includes('drying rack') ||
        
        // Conteneurs extensibles
        (title.includes('conteneur') && title.includes('extensible')) ||
        (title.includes('container') && title.includes('expandable')) ||
        
        // Hauteur réglable = souvent pliable
        title.includes('hauteur réglable') || title.includes('adjustable height') ||
        
        // Description confirme le pliage
        description.includes('pliable') || description.includes('extensible') ||
        description.includes('folding') || description.includes('expandable')
    ) {
        console.log(`→ FOLDING (pliable/extensible détecté)`);
        return 'Folding';
    }
    
    // === SMART LIVING SPACE (Domotique et objets connectés) ===
    if (
        // Éclairage intelligent
        title.includes('led') || title.includes('projecteur') || title.includes('lampe') ||
        title.includes('éclairage') || title.includes('light') || title.includes('projector') ||
        
        // Rideaux automatiques
        title.includes('rideau') || title.includes('curtain') || title.includes('moteur') ||
        title.includes('motor') || title.includes('automatic') ||
        
        // Objets connectés
        title.includes('smart home') || title.includes('intelligent home') ||
        title.includes('alexa') || title.includes('google home') ||
        title.includes('zigbee') || title.includes('wifi') || title.includes('tuya') ||
        title.includes('télécommande') || title.includes('remote control') ||
        
        // Meubles intelligents (mais pas de maisons)
        (title.includes('intelligent') && (
            title.includes('table') || title.includes('canapé') || title.includes('sofa') ||
            title.includes('réfrigérateur') || title.includes('armoire') || title.includes('miroir') ||
            title.includes('furniture') || title.includes('meuble')
        )) ||
        
        // Appareils spécifiques
        title.includes('batterie') || title.includes('battery') ||
        title.includes('contrôle') || title.includes('control') ||
        
        // Exclusion des maisons/capsules
        (!title.includes('maison') && !title.includes('house') && 
         !title.includes('capsule') && !title.includes('cabin') &&
         !title.includes('villa') && !title.includes('conteneur') && !title.includes('container'))
    ) {
        console.log(`→ SMART LIVING SPACE (objet connecté détecté)`);
        return 'Smart Living Space';
    }
    
    // === CAPSULE (Capsules spatiales, cabines, pods) ===
    if (
        // Mots-clés explicites de capsules
        title.includes('capsule') || title.includes('pod') ||
        title.includes('cabin') || title.includes('cabine') ||
        
        // Spatial/futuriste
        title.includes('spatial') || title.includes('space') ||
        title.includes('futur') || title.includes('future') ||
        
        // Apple cabin (type spécifique de capsule)
        title.includes('apple cabin') ||
        
        // Forme sphérique/ovale suggérée par l'image
        imageUrl.includes('capsule') || imageUrl.includes('pod') ||
        imageUrl.includes('cabin') ||
        
        // Description mentionne capsule
        description.includes('capsule') || description.includes('pod') ||
        description.includes('spatial') || description.includes('cabin')
    ) {
        console.log(`→ CAPSULE (capsule/pod détecté)`);
        return 'Capsule';
    }
    
    // === NEW (Tout le reste: maisons modulaires, conteneurs standard, etc.) ===
    console.log(`→ NEW (catégorie par défaut)`);
    return 'New';
}

// Recatégoriser tous les produits
console.log('\n=== DÉBUT DE LA RECATÉGORISATION ===');
let changedCount = 0;

const recategorizedProducts = data.map((product, index) => {
    console.log(`\n[${index + 1}/${data.length}]`);
    const oldCategory = product.category;
    const newCategory = intelligentCategorization(product);
    
    if (oldCategory !== newCategory) {
        changedCount++;
        console.log(`✓ CHANGEMENT: ${oldCategory} → ${newCategory}`);
    } else {
        console.log(`= INCHANGÉ: ${oldCategory}`);
    }
    
    return {
        ...product,
        category: newCategory
    };
});

// Statistiques finales
const stats = {};
recategorizedProducts.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
});

console.log('\n=== RÉSULTATS DE LA RECATÉGORISATION ===');
console.log(`Produits modifiés: ${changedCount}/${data.length}`);

console.log('\n=== NOUVELLES STATISTIQUES ===');
Object.entries(stats).forEach(([category, count]) => {
    const percentage = ((count / recategorizedProducts.length) * 100).toFixed(1);
    console.log(`${category}: ${count} produits (${percentage}%)`);
});

// Exemples par catégorie
console.log('\n=== EXEMPLES PAR CATÉGORIE ===');
Object.entries(stats).forEach(([category, count]) => {
    console.log(`\n${category.toUpperCase()}:`);
    const examples = recategorizedProducts.filter(p => p.category === category).slice(0, 5);
    examples.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name.substring(0, 70)}...`);
    });
});

// Sauvegarder
fs.writeFileSync('alibaba_final_products.json', JSON.stringify(recategorizedProducts, null, 2));
fs.copyFileSync('alibaba_final_products.json', 'public/alibaba_final_products.json');

console.log('\n✅ Recatégorisation terminée et sauvegardée !');