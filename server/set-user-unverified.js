const mongoose = require('mongoose');

// Connection MongoDB
const MONGO_URI = 'mongodb+srv://ngouhouodonald:chrollolucifer@cluster1.ya216me.mongodb.net/house?retryWrites=true&w=majority';

// Schema utilisateur
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
  role: String,
  verificationCode: String,
  verificationExpires: Date
});

const User = mongoose.model('User', UserSchema);

async function setUserUnverified() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'ngouhouodonald1@gmail.com';

    // Générer un nouveau code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 4 * 60 * 1000); // 4 minutes

    // Marquer comme non vérifié et ajouter un code de vérification
    const result = await User.findOneAndUpdate(
      { email: email },
      { 
        isVerified: false,
        verificationCode: verificationCode,
        verificationExpires: verificationExpires
      },
      { new: true }
    );

    if (!result) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('✅ Utilisateur marqué comme NON VÉRIFIÉ');
    console.log('📧 Email:', email);
    console.log('🔐 Code de vérification:', verificationCode);
    console.log('⏰ Expire dans 4 minutes');
    console.log('');
    console.log('💡 Maintenant vous devez vérifier votre email avant de pouvoir vous connecter!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

setUserUnverified();