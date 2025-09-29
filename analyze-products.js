const fs = require('fs');

console.log('=== ANALYSE DES DONNÉES PRODUITS ===');

// Lire les données
const data = JSON.parse(fs.readFileSync('alibaba_final_products.json', 'utf8'));
console.log(`Total de produits: ${data.length}`);

// 1. Statistiques par catégorie
console.log('\n=== STATISTIQUES PAR CATÉGORIE ===');
const stats = {};
data.forEach(product => {
    stats[product.category] = (stats[product.category] || 0) + 1;
});

Object.entries(stats).forEach(([category, count]) => {
    console.log(`${category}: ${count} produits`);
});

// 2. Vérification des produits Folding
console.log('\n=== ANALYSE DES PRODUITS FOLDING ===');
const foldingProducts = data.filter(p => p.category === 'Folding');
console.log(`Nombre de produits Folding: ${foldingProducts.length}`);

foldingProducts.forEach((product, index) => {
    console.log(`${index + 1}. "${product.name}"`);
    console.log(`   Image: ${product.image}`);
    console.log(`   Prix: ${product.price}`);
    console.log('');
});

// 3. Recherche de doublons basés sur l'image
console.log('\n=== RECHERCHE DE DOUBLONS PAR IMAGE ===');
const imageMap = {};
let duplicatesByImage = 0;

data.forEach(product => {
    if (imageMap[product.image]) {
        imageMap[product.image].push(product);
    } else {
        imageMap[product.image] = [product];
    }
});

Object.entries(imageMap).forEach(([image, products]) => {
    if (products.length > 1) {
        duplicatesByImage += products.length - 1;
        console.log(`Image dupliquée (${products.length} fois): ${image}`);
        products.forEach((product, index) => {
            console.log(`  ${index + 1}. [${product.category}] ${product.name.substring(0, 50)}...`);
        });
        console.log('');
    }
});

console.log(`Total de doublons par image: ${duplicatesByImage}`);

// 4. Recherche de doublons basés sur le nom (similitude)
console.log('\n=== RECHERCHE DE DOUBLONS PAR NOM SIMILAIRE ===');
let duplicatesByName = 0;
const processedNames = new Set();

for (let i = 0; i < data.length; i++) {
    const product1 = data[i];
    if (processedNames.has(i)) continue;
    
    const similarProducts = [product1];
    
    for (let j = i + 1; j < data.length; j++) {
        const product2 = data[j];
        
        // Calculer la similarité des noms
        const similarity = calculateSimilarity(product1.name, product2.name);
        if (similarity > 0.8) { // 80% de similarité
            similarProducts.push(product2);
            processedNames.add(j);
        }
    }
    
    if (similarProducts.length > 1) {
        duplicatesByName += similarProducts.length - 1;
        console.log(`Noms similaires (${similarProducts.length} produits):`);
        similarProducts.forEach((product, index) => {
            console.log(`  ${index + 1}. [${product.category}] ${product.name.substring(0, 60)}...`);
        });
        console.log('');
    }
    
    processedNames.add(i);
}

console.log(`Total de doublons par nom similaire: ${duplicatesByName}`);

// 5. Analyse des mots-clés pour améliorer la catégorisation
console.log('\n=== MOTS-CLÉS POUR AMÉLIORER LA CATÉGORISATION ===');

// Recherche de produits qui devraient être Folding
const potentialFolding = data.filter(product => {
    const name = product.name.toLowerCase();
    return (name.includes('fold') || name.includes('pliable') || 
            name.includes('extensible') || name.includes('rétractable') ||
            name.includes('télescopique') || name.includes('étendoir') ||
            name.includes('séchoir')) && product.category !== 'Folding';
});

console.log(`Produits qui devraient peut-être être Folding: ${potentialFolding.length}`);
potentialFolding.slice(0, 10).forEach((product, index) => {
    console.log(`${index + 1}. [${product.category}] ${product.name.substring(0, 60)}...`);
});

// Fonction de calcul de similarité
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