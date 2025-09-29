const mongoose = require('mongoose');

// Connection MongoDB
const MONGO_URI = 'mongodb+srv://ngouhouodonald:chrollolucifer@cluster1.ya216me.mongodb.net/house?retryWrites=true&w=majority';

async function listAllUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Lister toutes les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections disponibles:', collections.map(c => c.name));

    // Essayer avec différents noms de collection
    const possibleCollections = ['users', 'Users'];
    
    for (const collectionName of possibleCollections) {
      try {
        const UserSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model(collectionName, UserSchema, collectionName);
        
        const users = await User.find({ email: 'ngouhouodonald1@gmail.com' });
        if (users.length > 0) {
          console.log(`✅ Utilisateur trouvé dans collection "${collectionName}":`, users[0]);
        }
      } catch (err) {
        // Ignorer les erreurs de modèle déjà compilé
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

listAllUsers();