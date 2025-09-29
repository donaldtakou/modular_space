const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connection MongoDB
const MONGO_URI = 'mongodb+srv://ngouhouodonald:chrollolucifer@cluster1.ya216me.mongodb.net/house?retryWrites=true&w=majority';

// Schema utilisateur simple pour la vérification
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
  role: String
});

const User = mongoose.model('User', UserSchema);

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const user = await User.findOne({ email: 'ngouhouodonald1@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé avec cet email');
      return;
    }

    console.log('✅ Utilisateur trouvé:');
    console.log('- Nom:', user.name);
    console.log('- Email:', user.email);
    console.log('- Vérifié:', user.isVerified);
    console.log('- Rôle:', user.role);
    console.log('- Mot de passe hashé:', user.password ? 'Oui' : 'Non');

    // Test des mots de passe courants
    const passwords = ['123123', 'test123456', 'password', 'modularhouse'];
    
    for (const pwd of passwords) {
      if (user.password) {
        const isMatch = await bcrypt.compare(pwd, user.password);
        console.log(`- Test mot de passe "${pwd}":`, isMatch ? '✅ CORRECT' : '❌ Incorrect');
      }
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkUser();