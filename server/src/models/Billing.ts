import mongoose, { Document, Schema } from 'mongoose';

export interface IBilling extends Document {
  user: mongoose.Types.ObjectId;
  cardDetails: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  isDefault: boolean;
  createdAt: Date;
}

const BillingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardDetails: {
    last4: {
      type: String,
      required: [true, 'Please provide last 4 digits of card']
    },
    brand: {
      type: String,
      required: [true, 'Please provide card brand']
    },
    expiryMonth: {
      type: Number,
      required: [true, 'Please provide expiry month']
    },
    expiryYear: {
      type: Number,
      required: [true, 'Please provide expiry year']
    }
  },
  billingAddress: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure user can only have one default billing method
BillingSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.model('Billing').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export default mongoose.model<IBilling>('Billing', BillingSchema);