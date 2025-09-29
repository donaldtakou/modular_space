import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: {
    fr: string;
    en: string;
    es: string;
    de: string;
  };
  type: 'folding' | 'capsule';
  description: {
    fr: string;
    en: string;
    es: string;
    de: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  dimensions: {
    folded?: {
      length: number;
      width: number;
      height: number;
    };
    deployed: {
      length: number;
      width: number;
      height: number;
    };
  };
  features: Array<{
    icon: string;
    title: {
      fr: string;
      en: string;
      es: string;
      de: string;
    };
    description: {
      fr: string;
      en: string;
      es: string;
      de: string;
    };
  }>;
  specifications: Array<{
    key: {
      fr: string;
      en: string;
      es: string;
      de: string;
    };
    value: {
      fr: string;
      en: string;
      es: string;
      de: string;
    };
  }>;
  images: Array<{
    url: string;
    alt: {
      fr: string;
      en: string;
      es: string;
      de: string;
    };
    isFeatured: boolean;
  }>;
  stock: number;
  isAvailable: boolean;
  // Métadonnées optionnelles
  etsyId?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: {
    fr: { type: String, required: [true, 'Veuillez ajouter un nom en français'] },
    en: { type: String, required: [true, 'Please add a name in English'] },
    es: { type: String, required: [true, 'Por favor, añada un nombre en español'] },
    de: { type: String, required: [true, 'Bitte fügen Sie einen Namen auf Deutsch hinzu'] }
  },
  type: {
    type: String,
    required: [true, 'Please specify the product type'],
    enum: ['folding', 'capsule']
  },
  description: {
    fr: { type: String, required: [true, 'Veuillez ajouter une description en français'] },
    en: { type: String, required: [true, 'Please add a description in English'] },
    es: { type: String, required: [true, 'Por favor, añada una descripción en español'] },
    de: { type: String, required: [true, 'Bitte fügen Sie eine Beschreibung auf Deutsch hinzu'] }
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Please add a price']
    },
    currency: {
      type: String,
      required: [true, 'Please specify the currency'],
      default: 'EUR'
    }
  },
  dimensions: {
    folded: {
      length: Number,
      width: Number,
      height: Number
    },
    deployed: {
      length: { type: Number, required: [true, 'Please specify deployed length'] },
      width: { type: Number, required: [true, 'Please specify deployed width'] },
      height: { type: Number, required: [true, 'Please specify deployed height'] }
    }
  },
  features: [{
    icon: String,
    title: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
      de: { type: String, required: true }
    },
    description: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
      de: { type: String, required: true }
    }
  }],
  specifications: [{
    key: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
      de: { type: String, required: true }
    },
    value: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
      de: { type: String, required: true }
    }
  }],
  images: [{
    url: { type: String, required: true },
    alt: {
      fr: { type: String, required: true },
      en: { type: String, required: true },
      es: { type: String, required: true },
      de: { type: String, required: true }
    },
    isFeatured: { type: Boolean, default: false }
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for search
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);