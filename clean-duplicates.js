const fs = require('fs');

console.log('=== NETTOYAGE DES DOUBLONS ===');

// Lire les données
const data = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
console.log(`Données originales: ${data.length} produits`);

// 1. Supprimer les doublons par image (exact)
console.log('\n1. Suppression des doublons par image exacte...');
const imageMap = new Map();
const uniqueByImage = [];

data.forEach(product => {
    if (!imageMap.has(product.image)) {
        imageMap.set(product.image, true);
        uniqueByImage.push(product);
    }
});

console.log(`Après suppression des doublons par image: ${uniqueByImage.length} produits`);
console.log(`Doublons supprimés: ${data.length - uniqueByImage.length}`);

// 2. Supprimer les doublons par nom très similaire (>90% similarité)
console.log('\n2. Suppression des doublons par nom très similaire...');

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

const uniqueByNameAndImage = [];
const processedNames = new Set();

for (let i = 0; i < uniqueByImage.length; i++) {
    if (processedNames.has(i)) continue;
    
    const currentProduct = uniqueByImage[i];
    let bestProduct = currentProduct;
    let bestPriceNum = parseInt(currentProduct.price.replace(/[^0-9]/g, '')) || 0;
    
    // Chercher les produits similaires
    for (let j = i + 1; j < uniqueByImage.length; j++) {
        if (processedNames.has(j)) continue;
        
        const compareProduct = uniqueByImage[j];
        const similarity = calculateSimilarity(currentProduct.name, compareProduct.name);
        
        if (similarity > 0.9) { // 90% de similarité
            processedNames.add(j);
            
            // Garder celui avec le meilleur prix (plus réaliste)
            const comparePriceNum = parseInt(compareProduct.price.replace(/[^0-9]/g, '')) || 0;
            if (comparePriceNum > bestPriceNum && comparePriceNum < 10000) {
                bestProduct = compareProduct;
                bestPriceNum = comparePriceNum;
            }
        }
    }
    
    uniqueByNameAndImage.push(bestProduct);
    processedNames.add(i);
}

console.log(`Après suppression des doublons par nom: ${uniqueByNameAndImage.length} produits`);
console.log(`Doublons supprimés: ${uniqueByImage.length - uniqueByNameAndImage.length}`);

// 3. Recatégoriser correctement les produits restants
console.log('\n3. Recatégorisation des produits...');

function categorizeProduct(product) {
    const title = product.name.toLowerCase();
    
    // Folding : structures pliables et extensibles
    if (title.includes('folding') || title.includes('pliable') || 
        title.includes('fold') || title.includes('extensible') ||
        title.includes('télescopique') || title.includes('rétractable') ||
        title.includes('étendoir') || title.includes('séchoir') ||
        title.includes('expandable') || title.includes('hauteur réglable')) {
        return 'Folding';
    }
    
    // Capsule : toutes les capsules spatiales et cabines
    if (title.includes('capsule') || title.includes('cabin') || 
        title.includes('pod') || title.includes('spatial') ||
        (title.includes('apple') && title.includes('cabin'))) {
        return 'Capsule';
    }
    
    // Smart Living Space : domotique et technologie maison connectée
    if (title.includes('projecteur') || title.includes('led') || 
        title.includes('rideau') || title.includes('éclairage') || 
        title.includes('smart rgb') || title.includes('alexa') ||
        title.includes('google home') || title.includes('zigbee') || 
        title.includes('wifi') || title.includes('télécommande') || 
        title.includes('veilleuse') || title.includes('lampe') ||
        title.includes('miroir') || title.includes('moteur') ||
        (title.includes('réfrigérateur') && title.includes('intelligent')) ||
        (title.includes('table') && title.includes('intelligent')) ||
        (title.includes('canapé') && title.includes('intelligent')) ||
        title.includes('armoire intelligent') || title.includes('batterie intelligent')) {
        return 'Smart Living Space';
    }
    
    // New : tout le reste (conteneurs, modulaires, maisons, etc.)
    return 'New';
}

// Appliquer la nouvelle catégorisation et réassigner les IDs
const finalProducts = uniqueByNameAndImage.map((product, index) => ({
    ...product,
    id: index + 1,
    category: categorizeProduct(product)
}));

// 4. Statistiques finales
const finalStats = {};
finalProducts.forEach(product => {
    finalStats[product.category] = (finalStats[product.category] || 0) + 1;
});

console.log('\n=== STATISTIQUES FINALES APRÈS NETTOYAGE ===');
console.log(`Total de produits uniques: ${finalProducts.length}`);
Object.entries(finalStats).forEach(([category, count]) => {
    const percentage = ((count / finalProducts.length) * 100).toFixed(1);
    console.log(`${category}: ${count} produits (${percentage}%)`);
});

console.log('\n=== RÉDUCTION ===');
console.log(`Produits originaux: ${data.length}`);
console.log(`Produits après nettoyage: ${finalProducts.length}`);
console.log(`Doublons supprimés: ${data.length - finalProducts.length}`);
console.log(`Réduction: ${(((data.length - finalProducts.length) / data.length) * 100).toFixed(1)}%`);

// 5. Sauvegarder les données nettoyées
fs.writeFileSync('alibaba_final_products.json', JSON.stringify(finalProducts, null, 2));
fs.copyFileSync('alibaba_final_products.json', 'public/alibaba_final_products.json');

console.log('\n✅ Fichier nettoyé sauvegardé !');

// 6. Vérification finale des catégories Folding
const foldingProducts = finalProducts.filter(p => p.category === 'Folding');
console.log(`\n=== VÉRIFICATION CATÉGORIE FOLDING ===`);
console.log(`Nombre de produits Folding après nettoyage: ${foldingProducts.length}`);

if (foldingProducts.length > 0) {
    console.log('\nExemples de produits Folding:');
    foldingProducts.slice(0, 10).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name.substring(0, 80)}...`);
    });
}