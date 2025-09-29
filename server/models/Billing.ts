import mongoose from 'mongoose';

const BillingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email invalide']
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise']
  },
  city: {
    type: String,
    required: [true, 'La ville est requise']
  },
  country: {
    type: String,
    required: [true, 'Le pays est requis']
  },
  postalCode: {
    type: String,
    required: [true, 'Le code postal est requis']
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est requis']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Billing || mongoose.model('Billing', BillingSchema);