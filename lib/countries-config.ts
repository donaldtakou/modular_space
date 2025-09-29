// Configuration des pays pour les 3 continents (Europe, Amérique, Afrique)
export const COUNTRIES_BY_CONTINENT = {
  Europe: [
    { code: 'FR', name: 'France', phone: '+33' },
    { code: 'DE', name: 'Allemagne', phone: '+49' },
    { code: 'IT', name: 'Italie', phone: '+39' },
    { code: 'ES', name: 'Espagne', phone: '+34' },
    { code: 'PT', name: 'Portugal', phone: '+351' },
    { code: 'NL', name: 'Pays-Bas', phone: '+31' },
    { code: 'BE', name: 'Belgique', phone: '+32' },
    { code: 'CH', name: 'Suisse', phone: '+41' },
    { code: 'AT', name: 'Autriche', phone: '+43' },
    { code: 'LU', name: 'Luxembourg', phone: '+352' },
    { code: 'IE', name: 'Irlande', phone: '+353' },
    { code: 'UK', name: 'Royaume-Uni', phone: '+44' },
    { code: 'NO', name: 'Norvège', phone: '+47' },
    { code: 'SE', name: 'Suède', phone: '+46' },
    { code: 'DK', name: 'Danemark', phone: '+45' },
    { code: 'FI', name: 'Finlande', phone: '+358' },
    { code: 'PL', name: 'Pologne', phone: '+48' },
    { code: 'CZ', name: 'République Tchèque', phone: '+420' },
    { code: 'HU', name: 'Hongrie', phone: '+36' },
    { code: 'SK', name: 'Slovaquie', phone: '+421' },
    { code: 'SI', name: 'Slovénie', phone: '+386' },
    { code: 'HR', name: 'Croatie', phone: '+385' },
    { code: 'GR', name: 'Grèce', phone: '+30' },
    { code: 'CY', name: 'Chypre', phone: '+357' },
    { code: 'MT', name: 'Malte', phone: '+356' },
    { code: 'EE', name: 'Estonie', phone: '+372' },
    { code: 'LV', name: 'Lettonie', phone: '+371' },
    { code: 'LT', name: 'Lituanie', phone: '+370' },
    { code: 'RO', name: 'Roumanie', phone: '+40' },
    { code: 'BG', name: 'Bulgarie', phone: '+359' }
  ],
  Americas: [
    { code: 'US', name: 'États-Unis', phone: '+1' },
    { code: 'CA', name: 'Canada', phone: '+1' },
    { code: 'MX', name: 'Mexique', phone: '+52' },
    { code: 'BR', name: 'Brésil', phone: '+55' },
    { code: 'AR', name: 'Argentine', phone: '+54' },
    { code: 'CL', name: 'Chili', phone: '+56' },
    { code: 'CO', name: 'Colombie', phone: '+57' },
    { code: 'PE', name: 'Pérou', phone: '+51' },
    { code: 'VE', name: 'Venezuela', phone: '+58' },
    { code: 'EC', name: 'Équateur', phone: '+593' },
    { code: 'UY', name: 'Uruguay', phone: '+598' },
    { code: 'PY', name: 'Paraguay', phone: '+595' },
    { code: 'BO', name: 'Bolivie', phone: '+591' },
    { code: 'CR', name: 'Costa Rica', phone: '+506' },
    { code: 'PA', name: 'Panama', phone: '+507' },
    { code: 'GT', name: 'Guatemala', phone: '+502' },
    { code: 'HN', name: 'Honduras', phone: '+504' },
    { code: 'SV', name: 'Salvador', phone: '+503' },
    { code: 'NI', name: 'Nicaragua', phone: '+505' },
    { code: 'DO', name: 'République Dominicaine', phone: '+1' },
    { code: 'CU', name: 'Cuba', phone: '+53' },
    { code: 'JM', name: 'Jamaïque', phone: '+1' },
    { code: 'TT', name: 'Trinité-et-Tobago', phone: '+1' }
  ],
  Africa: [
    { code: 'MA', name: 'Maroc', phone: '+212' },
    { code: 'DZ', name: 'Algérie', phone: '+213' },
    { code: 'TN', name: 'Tunisie', phone: '+216' },
    { code: 'EG', name: 'Égypte', phone: '+20' },
    { code: 'LY', name: 'Libye', phone: '+218' },
    { code: 'ZA', name: 'Afrique du Sud', phone: '+27' },
    { code: 'NG', name: 'Nigeria', phone: '+234' },
    { code: 'KE', name: 'Kenya', phone: '+254' },
    { code: 'ET', name: 'Éthiopie', phone: '+251' },
    { code: 'GH', name: 'Ghana', phone: '+233' },
    { code: 'CI', name: 'Côte d\'Ivoire', phone: '+225' },
    { code: 'SN', name: 'Sénégal', phone: '+221' },
    { code: 'ML', name: 'Mali', phone: '+223' },
    { code: 'BF', name: 'Burkina Faso', phone: '+226' },
    { code: 'NE', name: 'Niger', phone: '+227' },
    { code: 'TD', name: 'Tchad', phone: '+235' },
    { code: 'CM', name: 'Cameroun', phone: '+237' },
    { code: 'CF', name: 'République Centrafricaine', phone: '+236' },
    { code: 'GA', name: 'Gabon', phone: '+241' },
    { code: 'CG', name: 'République du Congo', phone: '+242' },
    { code: 'CD', name: 'République Démocratique du Congo', phone: '+243' },
    { code: 'AO', name: 'Angola', phone: '+244' },
    { code: 'ZM', name: 'Zambie', phone: '+260' },
    { code: 'ZW', name: 'Zimbabwe', phone: '+263' },
    { code: 'BW', name: 'Botswana', phone: '+267' },
    { code: 'NA', name: 'Namibie', phone: '+264' },
    { code: 'MZ', name: 'Mozambique', phone: '+258' },
    { code: 'MG', name: 'Madagascar', phone: '+261' },
    { code: 'MU', name: 'Maurice', phone: '+230' },
    { code: 'SC', name: 'Seychelles', phone: '+248' }
  ]
};

export const ALL_COUNTRIES = [
  ...COUNTRIES_BY_CONTINENT.Europe,
  ...COUNTRIES_BY_CONTINENT.Americas,
  ...COUNTRIES_BY_CONTINENT.Africa
];

// Templates d'adresses professionnelles par pays
export const ADDRESS_TEMPLATES = {
  FR: {
    format: 'Numéro et nom de rue\nCode postal Ville\nRégion',
    example: '12 Avenue des Champs-Élysées\n75008 Paris\nÎle-de-France',
    postalCodePattern: /^\d{5}$/,
    phoneFormat: '0X XX XX XX XX'
  },
  DE: {
    format: 'Straße Hausnummer\nPLZ Stadt\nBundesland',
    example: 'Musterstraße 123\n12345 Berlin\nBerlin',
    postalCodePattern: /^\d{5}$/,
    phoneFormat: '0XXX XXXXXXX'
  },
  US: {
    format: 'Street Address\nCity, State ZIP Code\nCountry',
    example: '123 Main Street\nNew York, NY 10001\nUnited States',
    postalCodePattern: /^\d{5}(-\d{4})?$/,
    phoneFormat: '+1 (XXX) XXX-XXXX'
  },
  CA: {
    format: 'Street Address\nCity, Province Postal Code\nCountry',
    example: '123 Main Street\nToronto, ON M5V 3A8\nCanada',
    postalCodePattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/,
    phoneFormat: '+1 (XXX) XXX-XXXX'
  },
  MA: {
    format: 'Adresse\nCode postal Ville\nPays',
    example: 'Avenue Mohammed V, 123\n10000 Rabat\nMaroc',
    postalCodePattern: /^\d{5}$/,
    phoneFormat: '0XXX-XXXXXX'
  },
  // Template par défaut
  default: {
    format: 'Adresse complète\nCode postal Ville\nPays',
    example: 'Rue/Avenue, Numéro\nCode postal Ville\nPays',
    postalCodePattern: /^.+$/,
    phoneFormat: '+XXX XXXXXXXX'
  }
};

export const SUPPORT_CONFIG = {
  whatsapp: '+33123456789',
  supportEmail: 'support@modular-homes.com',
  supportHours: '9h00 - 18h00 (Lun-Ven)',
  languages: ['fr', 'en', 'es', 'de', 'ar', 'pt'],
  responseTime: '< 2 minutes'
};