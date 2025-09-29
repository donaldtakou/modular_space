# Guide d'Administration - Persistance des Données

## Vue d'ensemble
La page administrateur utilise un système de persistance hybride qui combine localStorage et API pour assurer la sauvegarde des données.

## Authentification
- **Mot de passe**: `chrollolucifer`
- **Session**: Stockée dans sessionStorage
- **Durée**: Persistante jusqu'à fermeture du navigateur

## Gestion des Produits

### Système de Persistance
1. **Sauvegarde Principale**: API `/api/admin-products`
2. **Sauvegarde de Secours**: localStorage navigateur
3. **Stratégie de Fallback**: Si l'API échoue, sauvegarde automatique en local

### Fonctionnalités Disponibles
- ✅ **Ajout de produits** avec validation complète
- ✅ **Modification** de produits existants
- ✅ **Suppression** avec confirmation
- ✅ **Prévisualisation** avant validation
- ✅ **Persistance** après rechargement de page

### Validation des Données
- **Catégories autorisées**: Folding, Container, Capsule uniquement
- **Prix**: Format requis "$X,XXX"
- **Nom unique**: Vérification des doublons
- **Image**: URL valide requise
- **Caractéristiques**: Au moins une requise

### Messages de Feedback
- ✅ Succès en vert avec icône de validation
- ❌ Erreurs en rouge avec icône d'alerte
- ⏳ États de chargement pendant les opérations

## Gestion des Clients

### État Actuel
- **Lecture seule**: Affichage des données clients via API
- **Export TXT**: Téléchargement des données complètes
- **Données sensibles**: Mots de passe et informations bancaires visibles
- **Recherche**: Filtrage par nom, email, ville

### API Endpoint
- **GET** `/api/admin-clients` - Récupération des données
- **POST** `/api/admin-clients` - Ajout de nouveaux clients (disponible mais pas utilisé dans l'UI)

## Stockage des Données

### localStorage
```javascript
// Clé de stockage des produits
'admin_products' -> Array<AdminProduct>

// Structure d'un produit
{
  id: string,
  name: string,
  description: string,
  price: string,
  category: 'Folding' | 'Container' | 'Capsule',
  features: string[],
  image: string,
  createdAt: string,
  updatedAt: string
}
```

### API Endpoints Produits
- **GET** `/api/admin-products` - Lister tous les produits
- **POST** `/api/admin-products` - Créer un nouveau produit
- **PUT** `/api/admin-products?id={id}` - Modifier un produit
- **DELETE** `/api/admin-products?id={id}` - Supprimer un produit

## Comportement en Cas d'Erreur

### Stratégie de Récupération
1. **API disponible**: Sauvegarde normale via serveur
2. **API indisponible**: Fallback automatique vers localStorage
3. **Double échec**: Message d'erreur utilisateur

### Messages d'État
- "Produit sauvegardé avec succès !" (API réussie)
- "Produit sauvegardé localement (mode hors ligne)" (Fallback)
- "Impossible de sauvegarder le produit" (Échec total)

## Recommandations d'Usage

### Pour l'Administrateur
1. **Testez toujours la prévisualisation** avant validation
2. **Vérifiez la catégorie** (limitée à 3 types)
3. **Utilisez des URLs d'images valides** (https://)
4. **Rechargez la page** pour vérifier la persistance

### Limitations Actuelles
- Pas d'édition des clients (lecture seule)
- Validation d'image basique (URL uniquement)
- Stockage en mémoire côté serveur (non persistant au redémarrage)

### Améliorations Possibles
- Intégration base de données (Prisma configuré)
- Upload d'images local
- Éditeur WYSIWYG pour descriptions
- Historique des modifications
- Système de versions des produits

## Dépannage

### Problèmes Courants
1. **"Produit non sauvegardé"**: Vérifier la console navigateur pour erreurs réseau
2. **"Catégorie invalide"**: Utiliser uniquement Folding, Container, ou Capsule
3. **"Nom déjà existant"**: Choisir un nom de produit unique

### Console de Développement
Ouvrez F12 > Console pour voir les messages de débogage :
- Erreurs API
- Statuts de sauvegarde
- Données localStorage

## Sécurité

### Accès Admin
- Session basée sur mot de passe fixe
- Pas de token JWT actuellement
- Accès complet aux données sensibles clients

### Données Sensibles
⚠️ **Attention**: Les données clients incluent :
- Mots de passe en clair
- Numéros de carte bancaire complets
- CVV et dates d'expiration

**Recommandation**: Implémenter chiffrement/hachage en production.

## Version
Dernière mise à jour : 25 septembre 2025
Système de persistance : v2.0 (localStorage + API)