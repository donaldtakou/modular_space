import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentInfo: {
    method: 'card' | 'wire' | 'other';
    transactionId?: string;
    status: 'pending' | 'completed' | 'failed';
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
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
      required: [true, 'Please provide state/province']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number']
    }
  },
  billingAddress: {
    street: {
      type: String,
      required: [true, 'Please provide billing street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide billing city']
    },
    state: {
      type: String,
      required: [true, 'Please provide billing state/province']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide billing postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide billing country']
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'wire', 'other'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

// Calculate total amount before saving
OrderSchema.pre('save', function(next) {
  if (this.isModified('products') || this.isModified('shippingCost')) {
    const productsTotal = this.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    this.totalAmount = productsTotal + this.shippingCost;
  }
  next();
});

// Update product stock after order confirmation
OrderSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'confirmed') {
    for (const item of this.products) {
      await mongoose.model('Product').findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }
  }
  next();
});

export default mongoose.model<IOrder>('Order', OrderSchema);