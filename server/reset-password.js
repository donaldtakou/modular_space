const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connection MongoDB
const MONGO_URI = 'mongodb+srv://ngouhouodonald:chrollolucifer@cluster1.ya216me.mongodb.net/house?retryWrites=true&w=majority';

// Schema utilisateur simple pour la modification
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
  role: String
});

const User = mongoose.model('User', UserSchema);

async function resetPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'ngouhouodonald1@gmail.com';
    const newPassword = '123123';

    // Hash du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mise à jour de l'utilisateur
    const result = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (!result) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('✅ Mot de passe réinitialisé avec succès !');
    console.log('📧 Email:', email);
    console.log('🔑 Nouveau mot de passe:', newPassword);

    // Vérification
    const verification = await bcrypt.compare(newPassword, hashedPassword);
    console.log('✅ Vérification:', verification ? 'Mot de passe correct' : 'Erreur de hash');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.disconnect();
  }
}

resetPassword();