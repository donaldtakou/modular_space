// Script pour nettoyer localStorage
console.log('🧹 Nettoyage du localStorage...');

// Vérifier ce qui est stocké actuellement
console.log('📦 Token actuel:', localStorage.getItem('token'));
console.log('👤 Utilisateur actuel:', localStorage.getItem('user'));

// Nettoyer complètement
localStorage.removeItem('token');
localStorage.removeItem('user');

console.log('✅ localStorage nettoyé !');
console.log('📦 Token après nettoyage:', localStorage.getItem('token'));
console.log('👤 Utilisateur après nettoyage:', localStorage.getItem('user'));

// Recharger la page
window.location.reload();