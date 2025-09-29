const demoProducts = [
  {
    id: '1',
    name: {
      fr: 'Maison Pliable Moderne',
      en: 'Modern Folding House',
      es: 'Casa Plegable Moderna',
      de: 'Modernes Falthaus',
    },
    description: {
      fr: 'Une maison pliable élégante et moderne, parfaite pour les terrains flexibles. Installation rapide et design contemporain.',
      en: 'An elegant and modern folding house, perfect for flexible locations. Quick setup and contemporary design.',
      es: 'Una casa plegable elegante y moderna, perfecta para terrenos flexibles. Instalación rápida y diseño contemporáneo.',
      de: 'Ein elegantes und modernes Falthaus, perfekt für flexible Standorte. Schneller Aufbau und zeitgemäßes Design.',
    },
    type: 'folding',
    price: {
      amount: 75000,
      currency: 'EUR',
    },
    dimensions: {
      deployed: {
        length: 12,
        width: 6,
        height: 3,
      },
      folded: {
        length: 6,
        width: 2.5,
        height: 3,
      },
    },
    features: [
      'Installation en 4 heures',
      'Isolation thermique renforcée',
      'Panneaux solaires intégrés',
      'Domotique intelligente',
      'Matériaux écologiques',
    ],
    images: ['/images/folding-1.jpg', '/images/folding-1-interior.jpg'],
    stock: 5,
  },
  {
    id: '2',
    name: {
      fr: 'Capsule House Urban',
      en: 'Urban Capsule House',
      es: 'Casa Cápsula Urbana',
      de: 'Urbanes Kapselhaus',
    },
    description: {
      fr: 'Une capsule urbaine compacte et futuriste. Parfaite pour les espaces restreints avec tout le confort moderne.',
      en: 'A compact and futuristic urban capsule. Perfect for tight spaces with all modern comforts.',
      es: 'Una cápsula urbana compacta y futurista. Perfecta para espacios reducidos con todas las comodidades modernas.',
      de: 'Eine kompakte und futuristische Stadtkapsel. Perfekt für enge Räume mit allem modernen Komfort.',
    },
    type: 'capsule',
    price: {
      amount: 45000,
      currency: 'EUR',
    },
    dimensions: {
      deployed: {
        length: 6,
        width: 3,
        height: 3,
      },
    },
    features: [
      'Design compact',
      'Vue panoramique',
      'Système de ventilation avancé',
      'Mobilier multifonction',
    ],
    images: ['/images/capsule-1.jpg', '/images/capsule-1-interior.jpg'],
    stock: 3,
  },
  {
    id: '3',
    name: {
      fr: 'Maison Pliable Familiale',
      en: 'Family Folding House',
      es: 'Casa Plegable Familiar',
      de: 'Faltbares Familienhaus',
    },
    description: {
      fr: 'Une maison pliable spacieuse conçue pour les familles. Espaces modulables et grand confort.',
      en: 'A spacious folding house designed for families. Modular spaces and great comfort.',
      es: 'Una casa plegable espaciosa diseñada para familias. Espacios modulares y gran comodidad.',
      de: 'Ein geräumiges Falthaus für Familien. Modulare Räume und großer Komfort.',
    },
    type: 'folding',
    price: {
      amount: 95000,
      currency: 'EUR',
    },
    dimensions: {
      deployed: {
        length: 15,
        width: 8,
        height: 3.5,
      },
      folded: {
        length: 8,
        width: 3,
        height: 3.5,
      },
    },
    features: [
      '4 chambres modulables',
      'Grande cuisine équipée',
      'Espace bureau intégré',
      'Système domotique avancé',
      'Récupération d\'eau de pluie',
    ],
    images: ['/images/folding-2.jpg', '/images/folding-2-interior.jpg'],
    stock: 2,
  },
  {
    id: '4',
    name: {
      fr: 'Capsule House Luxe',
      en: 'Luxury Capsule House',
      es: 'Casa Cápsula de Lujo',
      de: 'Luxus-Kapselhaus',
    },
    description: {
      fr: 'Une capsule premium avec finitions haut de gamme. L\'alliance parfaite entre luxe et efficacité spatiale.',
      en: 'A premium capsule with high-end finishes. The perfect alliance between luxury and spatial efficiency.',
      es: 'Una cápsula premium con acabados de alta gama. La alianza perfecta entre lujo y eficiencia espacial.',
      de: 'Eine Premium-Kapsel mit hochwertiger Ausstattung. Die perfekte Verbindung von Luxus und räumlicher Effizienz.',
    },
    type: 'capsule',
    price: {
      amount: 65000,
      currency: 'EUR',
    },
    dimensions: {
      deployed: {
        length: 8,
        width: 4,
        height: 3.2,
      },
    },
    features: [
      'Matériaux premium',
      'Domotique intégrée',
      'Système audio surround',
      'Éclairage ambiant',
      'Mini spa intégré',
    ],
    images: ['/images/capsule-2.jpg', '/images/capsule-2-interior.jpg'],
    stock: 1,
  },
];