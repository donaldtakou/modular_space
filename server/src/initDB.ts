import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from 'path';
import connectDB from './db';
import Billing from './models/Billing';

// Configure dotenv to look for .env in the correct location
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const initializeDB = async () => {
  try {
    console.log('Initialisation de la base de données...');
    console.log('URI MongoDB:', process.env.MONGO_URI ? 'Configuré' : 'Non configuré');
    
    await connectDB();
    console.log('Connexion à MongoDB établie');

    // Vérifier et créer les index pour Billing
    console.log('Vérification des index de facturation...');
    const billingIndexes = await Billing.listIndexes();
    if (billingIndexes.length <= 1) { // 1 est l'index _id par défaut
      console.log('Création des index de facturation...');
      await Billing.createIndexes();
      console.log('Index de facturation créés avec succès');
    } else {
      console.log('Les index de facturation existent déjà');
    }

    // Vérifier les collections existantes
    const collections = await mongoose.connection.db.collections();
    console.log('Collections existantes:', collections.map(c => c.collectionName));

    console.log('Base de données initialisée avec succès');
    process.exit(0);
  } catch (error: any) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Exécuter l'initialisation
console.log('Démarrage du script d\'initialisation...');
initializeDB();