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

async function checkVerificationCode() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const user = await User.findOne({ email: 'ngouhouodonald1@gmail.com' });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('📧 Email:', user.email);
    console.log('✅ Vérifié:', user.isVerified);
    console.log('🔐 Code de vérification:', user.verificationCode);
    
    if (user.verificationExpires) {
      const now = new Date();
      const isExpired = now > user.verificationExpires;
      console.log('⏰ Code expire le:', user.verificationExpires.toLocaleString());
      console.log('📅 Statut:', isExpired ? '❌ EXPIRÉ' : '✅ VALIDE');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkVerificationCode();