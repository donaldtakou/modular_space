import { Request, Response } from 'express';
import axios from 'axios';
import Product from '../models/Product';

// @desc    Import products from Alibaba
// @route   POST /api/alibaba/import
// @access  Private/Admin
export const importProducts = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    const importedProducts = [];
    const errors = [];

    return res.status(200).json({
      success: true,
      imported: importedProducts.length,
      products: importedProducts,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to import products'
    });
  }
};

function validateProduct(product: any) {
  const requiredFields = [
    'productId',
    'language.en.subject',
    'language.fr.subject',
    'language.en.description',
    'language.fr.description',
    'productImages',
    'attributes.dimensions',
    'prices.originalPrice',
    'stock'
  ];

  for (const field of requiredFields) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], product);
    if (!value) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!Array.isArray(product.productImages) || product.productImages.length === 0) {
    throw new Error('Product must have at least one image');
  }

  if (product.prices.originalPrice.min <= 0) {
    throw new Error('Product price must be greater than 0');
  }

  const dimensions = product.attributes.dimensions;
  if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error('Invalid dimensions');
  }

  return true;
}

function mapAlibabaProduct(alibabaProduct: AlibabaProduct) {
  return {
    name: {
      en: alibabaProduct.language.en.subject,
      fr: alibabaProduct.language.fr.subject,
    },
    description: {
      en: alibabaProduct.language.en.description,
      fr: alibabaProduct.language.fr.description,
    },
    type: determineHouseType(alibabaProduct),
    price: {
      amount: alibabaProduct.prices.originalPrice.min,
      currency: alibabaProduct.prices.originalPrice.currency,
    },
    dimensions: {
      deployed: {
        length: alibabaProduct.attributes.dimensions.length,
        width: alibabaProduct.attributes.dimensions.width,
        height: alibabaProduct.attributes.dimensions.height,
      },
    },
    images: alibabaProduct.productImages.map(url => ({
      url,
      alt: alibabaProduct.language.en.subject,
      isFeatured: false,
    })),
    specifications: [
      {
        key: {
          en: 'Weight',
          fr: 'Poids'
        },
        value: {
          en: `${alibabaProduct.attributes.weight.value} ${alibabaProduct.attributes.weight.unit}`,
          fr: `${alibabaProduct.attributes.weight.value} ${alibabaProduct.attributes.weight.unit}`
        }
      },
      {
        key: {
          en: 'Minimum Order Quantity',
          fr: 'Quantité minimum de commande'
        },
        value: {
          en: alibabaProduct.MOQ.toString(),
          fr: alibabaProduct.MOQ.toString()
        }
      }
    ],
    stock: alibabaProduct.stock.availableQuantity,
    isAvailable: alibabaProduct.stock.availableQuantity > 0,
    externalId: alibabaProduct.productId,
    source: 'alibaba' as const,
    bulkPrices: alibabaProduct.prices.bulkPrice
  };
}// Configuration Alibaba API
const ALIBABA_API_KEY = process.env.ALIBABA_API_KEY;
const ALIBABA_API_SECRET = process.env.ALIBABA_API_SECRET;
const ALIBABA_API_URL = 'https://api.alibaba.com/v2';

interface AlibabaProduct {
  productId: string;
  subject: string;
  description: string;
  language: {
    en: {
      subject: string;
      description: string;
    };
    fr: {
      subject: string;
      description: string;
    };
  };
  productImages: string[];
  attributes: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    weight: {
      value: number;
      unit: string;
    };
  };
  prices: {
    originalPrice: {
      min: number;
      max: number;
      currency: string;
    };
    bulkPrice: Array<{
      quantity: number;
      price: number;
    }>;
  };
  MOQ: number;
  stock: {
    totalQuantity: number;
    availableQuantity: number;
  };
}

// @desc    Search products on Alibaba
// @route   POST /api/products/search-alibaba
// @access  Private/Admin
export const searchAlibabaProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    if (!ALIBABA_API_KEY || !ALIBABA_API_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Alibaba API credentials not configured'
      });
    }

    // Search products on Alibaba
    const response = await axios.get(`${ALIBABA_API_URL}/products/search`, {
      headers: {
        'Authorization': `Bearer ${ALIBABA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        keywords: query,
        category: 'modular-houses',
        limit: 20
      }
    });

    // Valider les produits avant de les renvoyer
    const validatedProducts = [];
    const errors = [];

    for (const product of response.data.products) {
      try {
        if (validateProduct(product)) {
          validatedProducts.push(product);
        }
      } catch (error: any) {
        errors.push({
          productId: product.productId,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      products: validatedProducts,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('Alibaba Search Error:', err);
    res.status(500).json({
      success: false,
      error: 'Error searching products on Alibaba'
    });
  }
};

// @desc    Import products from Alibaba
// @route   POST /api/products/import-alibaba
// @access  Private/Admin
export const importFromAlibaba = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs array is required'
      });
    }

    if (!ALIBABA_API_KEY || !ALIBABA_API_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Alibaba API credentials not configured'
      });
    }

    const importedProducts = [];
    const errors = [];

    // Importer les produits en parallèle avec une limite de 5 à la fois
    const chunks = [];
    for (let i = 0; i < productIds.length; i += 5) {
      chunks.push(productIds.slice(i, i + 5));
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(
        chunk.map(async (productId) => {
          // Vérifier si le produit existe déjà
          const existingProduct = await Product.findOne({ externalId: productId });
          if (existingProduct) {
            throw new Error('Product already exists');
          }

          // Récupérer les détails du produit depuis Alibaba
          const response = await axios.get(`${ALIBABA_API_URL}/product/${productId}`, {
            headers: {
              'Authorization': `Bearer ${ALIBABA_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });

          const alibabaProduct = response.data;
          
          // Valider le produit
          validateProduct(alibabaProduct);

          // Créer le produit dans notre base
          const mappedProduct = mapAlibabaProduct(alibabaProduct);
          const product = await Product.create(mappedProduct);
          return product;
        })
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          importedProducts.push(result.value);
        } else {
          errors.push({
            productId: chunk[index],
            error: result.reason.message
          });
        }
      });
    }
          },
          description: {
            fr: aliProduct.description,
            en: aliProduct.description,
            es: aliProduct.description,
            de: aliProduct.description
          },
          price: aliProduct.price,
          type: aliProduct.attributes.type === 'folding' ? 'folding' : 'capsule',
          dimensions: {
            deployed: {
              length: parseFloat(aliProduct.attributes.length) || 0,
              width: parseFloat(aliProduct.attributes.width) || 0,
              height: parseFloat(aliProduct.attributes.height) || 0
            }
          },
          images: aliProduct.images.map(url => ({
            url,
            alt: {
              fr: aliProduct.subject,
              en: aliProduct.subject,
              es: aliProduct.subject,
              de: aliProduct.subject
            },
            isFeatured: false
          })),
          specifications: Object.entries(aliProduct.attributes).map(([key, value]) => ({
            key: {
              fr: key,
              en: key,
              es: key,
              de: key
            },
            value: {
              fr: value,
              en: value,
              es: value,
              de: value
            }
          })),
          stock: 0,
          alibabaId: aliProduct.productId
        };

        // Create new product
        const product = await Product.create(newProduct);
        importedProducts.push(product);
      }
    }

    res.status(201).json({
      success: true,
      count: importedProducts.length,
      data: importedProducts
    });
  } catch (err) {
    console.error('Alibaba Import Error:', err);
    res.status(500).json({
      success: false,
      error: 'Error importing products from Alibaba'
    });
  }
};