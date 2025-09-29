export const countries = [
  { code: 'FR', name: 'France', nameEn: 'France', nameEs: 'Francia', nameDe: 'Frankreich', nameAr: 'فرنسا', namePt: 'França', phone: '+33', whatsapp: '33123456789', continent: 'Europe' },
  { code: 'DE', name: 'Allemagne', nameEn: 'Germany', nameEs: 'Alemania', nameDe: 'Deutschland', nameAr: 'ألمانيا', namePt: 'Alemanha', phone: '+49', whatsapp: '49123456789', continent: 'Europe' },
  { code: 'ES', name: 'Espagne', nameEn: 'Spain', nameEs: 'España', nameDe: 'Spanien', nameAr: 'إسبانيا', namePt: 'Espanha', phone: '+34', whatsapp: '34123456789', continent: 'Europe' },
  { code: 'IT', name: 'Italie', nameEn: 'Italy', nameEs: 'Italia', nameDe: 'Italien', nameAr: 'إيطاليا', namePt: 'Itália', phone: '+39', whatsapp: '39123456789', continent: 'Europe' },
  { code: 'UK', name: 'Royaume-Uni', nameEn: 'United Kingdom', nameEs: 'Reino Unido', nameDe: 'Vereinigtes Königreich', nameAr: 'المملكة المتحدة', namePt: 'Reino Unido', phone: '+44', whatsapp: '44123456789', continent: 'Europe' },
  { code: 'BE', name: 'Belgique', nameEn: 'Belgium', nameEs: 'Bélgica', nameDe: 'Belgien', nameAr: 'بلجيكا', namePt: 'Bélgica', phone: '+32', whatsapp: '32123456789', continent: 'Europe' },
  { code: 'CH', name: 'Suisse', nameEn: 'Switzerland', nameEs: 'Suiza', nameDe: 'Schweiz', nameAr: 'سويسرا', namePt: 'Suíça', phone: '+41', whatsapp: '41123456789', continent: 'Europe' },
  { code: 'NL', name: 'Pays-Bas', nameEn: 'Netherlands', nameEs: 'Países Bajos', nameDe: 'Niederlande', nameAr: 'هولندا', namePt: 'Países Baixos', phone: '+31', whatsapp: '31123456789', continent: 'Europe' },
  
  { code: 'US', name: 'États-Unis', nameEn: 'United States', nameEs: 'Estados Unidos', nameDe: 'Vereinigte Staaten', nameAr: 'الولايات المتحدة', namePt: 'Estados Unidos', phone: '+1', whatsapp: '1234567890', continent: 'Americas' },
  { code: 'CA', name: 'Canada', nameEn: 'Canada', nameEs: 'Canadá', nameDe: 'Kanada', nameAr: 'كندا', namePt: 'Canadá', phone: '+1', whatsapp: '1987654321', continent: 'Americas' },
  { code: 'MX', name: 'Mexique', nameEn: 'Mexico', nameEs: 'México', nameDe: 'Mexiko', nameAr: 'المكسيك', namePt: 'México', phone: '+52', whatsapp: '52123456789', continent: 'Americas' },
  { code: 'BR', name: 'Brésil', nameEn: 'Brazil', nameEs: 'Brasil', nameDe: 'Brasilien', nameAr: 'البرازيل', namePt: 'Brasil', phone: '+55', whatsapp: '55123456789', continent: 'Americas' },
  { code: 'AR', name: 'Argentine', nameEn: 'Argentina', nameEs: 'Argentina', nameDe: 'Argentinien', nameAr: 'الأرجنتين', namePt: 'Argentina', phone: '+54', whatsapp: '54123456789', continent: 'Americas' },
  
  { code: 'MA', name: 'Maroc', nameEn: 'Morocco', nameEs: 'Marruecos', nameDe: 'Marokko', nameAr: 'المغرب', namePt: 'Marrocos', phone: '+212', whatsapp: '212123456789', continent: 'Africa' },
  { code: 'TN', name: 'Tunisie', nameEn: 'Tunisia', nameEs: 'Túnez', nameDe: 'Tunesien', nameAr: 'تونس', namePt: 'Tunísia', phone: '+216', whatsapp: '216123456789', continent: 'Africa' },
  { code: 'DZ', name: 'Algérie', nameEn: 'Algeria', nameEs: 'Argelia', nameDe: 'Algerien', nameAr: 'الجزائر', namePt: 'Argélia', phone: '+213', whatsapp: '213123456789', continent: 'Africa' },
  { code: 'SN', name: 'Sénégal', nameEn: 'Senegal', nameEs: 'Senegal', nameDe: 'Senegal', nameAr: 'السنغال', namePt: 'Senegal', phone: '+221', whatsapp: '221123456789', continent: 'Africa' },
  { code: 'CI', name: 'Côte d\'Ivoire', nameEn: 'Ivory Coast', nameEs: 'Costa de Marfil', nameDe: 'Elfenbeinküste', nameAr: 'ساحل العاج', namePt: 'Costa do Marfim', phone: '+225', whatsapp: '225123456789', continent: 'Africa' },
  { code: 'ZA', name: 'Afrique du Sud', nameEn: 'South Africa', nameEs: 'Sudáfrica', nameDe: 'Südafrika', nameAr: 'جنوب أفريقيا', namePt: 'África do Sul', phone: '+27', whatsapp: '27123456789', continent: 'Africa' },
];

export const continentalOffices = {
  Europe: {
    name: { fr: 'Europe', en: 'Europe', es: 'Europa', de: 'Europa', ar: 'أوروبا', pt: 'Europa' },
    headquarters: { 
      fr: 'Siège Social - Paris', 
      en: 'Headquarters - Paris',
      es: 'Sede Central - París',
      de: 'Hauptsitz - Paris',
      ar: 'المقر الرئيسي - باريس',
      pt: 'Sede - Paris'
    },
    address: {
      fr: '123 Avenue de l\'Innovation Modulaire, 75001 Paris, France',
      en: '123 Avenue de l\'Innovation Modulaire, 75001 Paris, France',
      es: '123 Avenue de l\'Innovation Modulaire, 75001 París, Francia',
      de: '123 Avenue de l\'Innovation Modulaire, 75001 Paris, Frankreich',
      ar: '123 طريق الابتكار المتحرك، 75001 باريس، فرنسا',
      pt: '123 Avenue de l\'Innovation Modulaire, 75001 Paris, França'
    },
    phone: '+33 1 23 45 67 89',
    email: 'europe@modularhouse-international.com',
    whatsapp: '33123456789',
    hours: {
      fr: 'Lun - Ven: 9h00 - 18h00 CET',
      en: 'Mon - Fri: 9:00 AM - 6:00 PM CET',
      es: 'Lun - Vie: 9:00 - 18:00 CET',
      de: 'Mo - Fr: 9:00 - 18:00 CET',
      ar: 'الإثنين - الجمعة: 9:00 - 18:00 CET',
      pt: 'Seg - Sex: 9:00 - 18:00 CET'
    },
    countries: ['FR', 'DE', 'ES', 'IT', 'UK', 'BE', 'CH', 'NL'],
    timezone: 'Europe/Paris'
  },
  Americas: {
    name: { fr: 'Amériques', en: 'Americas', es: 'Américas', de: 'Amerika', ar: 'الأمريكتان', pt: 'Américas' },
    headquarters: { 
      fr: 'Bureau Régional - New York', 
      en: 'Regional Office - New York',
      es: 'Oficina Regional - Nueva York',
      de: 'Regionalbüro - New York',
      ar: 'المكتب الإقليمي - نيويورك',
      pt: 'Escritório Regional - Nova York'
    },
    address: {
      fr: '456 International Business Center, New York, NY 10001, USA',
      en: '456 International Business Center, New York, NY 10001, USA',
      es: '456 International Business Center, Nueva York, NY 10001, EE.UU.',
      de: '456 International Business Center, New York, NY 10001, USA',
      ar: '456 مركز الأعمال الدولي، نيويورك، NY 10001، الولايات المتحدة',
      pt: '456 International Business Center, Nova York, NY 10001, EUA'
    },
    phone: '+1 234 567 8900',
    email: 'americas@modularhouse-international.com',
    whatsapp: '1234567890',
    hours: {
      fr: 'Lun - Ven: 9h00 - 17h00 EST',
      en: 'Mon - Fri: 9:00 AM - 5:00 PM EST',
      es: 'Lun - Vie: 9:00 - 17:00 EST',
      de: 'Mo - Fr: 9:00 - 17:00 EST',
      ar: 'الإثنين - الجمعة: 9:00 - 17:00 EST',
      pt: 'Seg - Sex: 9:00 - 17:00 EST'
    },
    countries: ['US', 'CA', 'MX', 'BR', 'AR'],
    timezone: 'America/New_York'
  },
  Africa: {
    name: { fr: 'Afrique', en: 'Africa', es: 'África', de: 'Afrika', ar: 'أفريقيا', pt: 'África' },
    headquarters: { 
      fr: 'Bureau Régional - Casablanca', 
      en: 'Regional Office - Casablanca',
      es: 'Oficina Regional - Casablanca',
      de: 'Regionalbüro - Casablanca',
      ar: 'المكتب الإقليمي - الدار البيضاء',
      pt: 'Escritório Regional - Casablanca'
    },
    address: {
      fr: '789 Boulevard Hassan II, Casablanca 20000, Maroc',
      en: '789 Boulevard Hassan II, Casablanca 20000, Morocco',
      es: '789 Boulevard Hassan II, Casablanca 20000, Marruecos',
      de: '789 Boulevard Hassan II, Casablanca 20000, Marokko',
      ar: '789 شارع الحسن الثاني، الدار البيضاء 20000، المغرب',
      pt: '789 Boulevard Hassan II, Casablanca 20000, Marrocos'
    },
    phone: '+212 522 123 456',
    email: 'africa@modularhouse-international.com',
    whatsapp: '212522123456',
    hours: {
      fr: 'Lun - Ven: 8h30 - 17h30 WET',
      en: 'Mon - Fri: 8:30 AM - 5:30 PM WET',
      es: 'Lun - Vie: 8:30 - 17:30 WET',
      de: 'Mo - Fr: 8:30 - 17:30 WET',
      ar: 'الإثنين - الجمعة: 8:30 - 17:30 WET',
      pt: 'Seg - Sex: 8:30 - 17:30 WET'
    },
    countries: ['MA', 'TN', 'DZ', 'SN', 'CI', 'ZA'],
    timezone: 'Africa/Casablanca'
  }
};

export const getCountryInfo = (countryCode: string) => {
  return countries.find(country => country.code === countryCode) || countries[0];
};

export const getContinentalOffice = (countryCode: string) => {
  const country = getCountryInfo(countryCode);
  return continentalOffices[country.continent as keyof typeof continentalOffices];
};

export const getCountryName = (country: typeof countries[0], language: Language): string => {
  switch (language) {
    case 'fr': return country.name;
    case 'en': return country.nameEn;
    case 'es': return country.nameEs;
    case 'de': return country.nameDe;
    case 'ar': return country.nameAr;
    case 'pt': return country.namePt;
    default: return country.name;
  }
};

export const getOfficeValue = (office: any, field: string, language: Language): string => {
  const fieldValue = office[field];
  if (typeof fieldValue === 'object' && fieldValue[language]) {
    return fieldValue[language];
  }
  return fieldValue[language] || fieldValue.fr || fieldValue.en || fieldValue;
};

export const translations = {
  fr: {
    // Navigation et titre
    contact: 'Contact',
    contactUs: 'Nous contacter',
    contactInfo: 'Informations de contact',
    getInTouch: 'Contactez-nous',
    
    // Formulaire
    name: 'Nom complet',
    email: 'Adresse email',
    phone: 'Téléphone',
    country: 'Pays',
    subject: 'Sujet',
    message: 'Message',
    send: 'Envoyer le message',
    sending: 'Envoi en cours...',
    
    // Messages de statut
    success: 'Message envoyé avec succès!',
    successMessage: 'Nous vous contacterons dans les plus brefs délais.',
    error: 'Erreur lors de l\'envoi du message',
    errorMessage: 'Veuillez réessayer plus tard ou nous contacter directement.',
    
    // Validation
    required: 'Ce champ est requis',
    invalidEmail: 'Adresse email invalide',
    
    // Informations de contact
    businessHours: 'Heures d\'ouverture',
    followUs: 'Suivez-nous',
    address: 'Adresse',
    
    // Continents
    globalPresence: 'Présence Mondiale',
    globalDescription: 'Nous sommes présents sur 3 continents pour mieux vous servir',
    selectRegion: 'Sélectionnez votre région pour des informations spécifiques',
    
    // Sujets prédéfinis
    subjects: {
      general: 'Demande générale',
      quote: 'Demande de devis',
      technical: 'Question technique',
      after_sales: 'Service après-vente',
      partnership: 'Partenariat',
      distribution: 'Devenir distributeur',
      other: 'Autre'
    },
    
    // Descriptions
    contactDescription: 'Nous sommes là pour répondre à toutes vos questions sur nos maisons modulaires.',
    whatsappMessage: 'Nous contacter sur WhatsApp',
    
    // Boutons d'action
    openWhatsApp: 'Ouvrir WhatsApp',
    callUs: 'Nous appeler',
    emailUs: 'Nous écrire',
    
    // Bureaux régionaux
    regionalOffices: 'Bureaux Régionaux',
    headquarters: 'Siège Social',
    regionalOffice: 'Bureau Régional'
  },
  en: {
    // Navigation et titre
    contact: 'Contact',
    contactUs: 'Contact Us',
    contactInfo: 'Contact Information',
    getInTouch: 'Get in touch',
    
    // Formulaire
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone',
    country: 'Country',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    
    // Messages de statut
    success: 'Message sent successfully!',
    successMessage: 'We will contact you shortly.',
    error: 'Error sending message',
    errorMessage: 'Please try again later or contact us directly.',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    
    // Informations de contact
    businessHours: 'Business Hours',
    followUs: 'Follow Us',
    address: 'Address',
    
    // Continents
    globalPresence: 'Global Presence',
    globalDescription: 'We are present on 3 continents to better serve you',
    selectRegion: 'Select your region for specific information',
    
    // Sujets prédéfinis
    subjects: {
      general: 'General Inquiry',
      quote: 'Quote Request',
      technical: 'Technical Question',
      after_sales: 'After Sales Service',
      partnership: 'Partnership',
      distribution: 'Become a Distributor',
      other: 'Other'
    },
    
    // Descriptions
    contactDescription: 'We are here to answer all your questions about our modular houses.',
    whatsappMessage: 'Contact us on WhatsApp',
    
    // Boutons d'action
    openWhatsApp: 'Open WhatsApp',
    callUs: 'Call Us',
    emailUs: 'Email Us',
    
    // Bureaux régionaux
    regionalOffices: 'Regional Offices',
    headquarters: 'Headquarters',
    regionalOffice: 'Regional Office'
  },
  es: {
    // Navigation et titre
    contact: 'Contacto',
    contactUs: 'Contáctanos',
    contactInfo: 'Información de contacto',
    getInTouch: 'Póngase en contacto',
    
    // Formulaire
    name: 'Nombre completo',
    email: 'Dirección de correo',
    phone: 'Teléfono',
    country: 'País',
    subject: 'Asunto',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    
    // Messages de statut
    success: '¡Mensaje enviado exitosamente!',
    successMessage: 'Nos pondremos en contacto contigo pronto.',
    error: 'Error al enviar mensaje',
    errorMessage: 'Por favor intente de nuevo más tarde o contáctenos directamente.',
    
    // Validation
    required: 'Este campo es obligatorio',
    invalidEmail: 'Dirección de correo inválida',
    
    // Informations de contact
    businessHours: 'Horario de atención',
    followUs: 'Síguenos',
    address: 'Dirección',
    
    // Continents
    globalPresence: 'Presencia Global',
    globalDescription: 'Estamos presentes en 3 continentes para servirle mejor',
    selectRegion: 'Seleccione su región para información específica',
    
    // Sujets prédéfinis
    subjects: {
      general: 'Consulta general',
      quote: 'Solicitud de cotización',
      technical: 'Pregunta técnica',
      after_sales: 'Servicio postventa',
      partnership: 'Asociación',
      distribution: 'Convertirse en distribuidor',
      other: 'Otro'
    },
    
    // Descriptions
    contactDescription: 'Estamos aquí para responder todas sus preguntas sobre nuestras casas modulares.',
    whatsappMessage: 'Contáctanos en WhatsApp',
    
    // Boutons d'action
    openWhatsApp: 'Abrir WhatsApp',
    callUs: 'Llámanos',
    emailUs: 'Escríbenos',
    
    // Bureaux régionaux
    regionalOffices: 'Oficinas Regionales',
    headquarters: 'Sede Central',
    regionalOffice: 'Oficina Regional'
  },
  de: {
    // Navigation et titre
    contact: 'Kontakt',
    contactUs: 'Kontaktieren Sie uns',
    contactInfo: 'Kontaktinformationen',
    getInTouch: 'Kontakt aufnehmen',
    
    // Formulaire
    name: 'Vollständiger Name',
    email: 'E-Mail-Adresse',
    phone: 'Telefon',
    country: 'Land',
    subject: 'Betreff',
    message: 'Nachricht',
    send: 'Nachricht senden',
    sending: 'Wird gesendet...',
    
    // Messages de statut
    success: 'Nachricht erfolgreich gesendet!',
    successMessage: 'Wir werden uns in Kürze bei Ihnen melden.',
    error: 'Fehler beim Senden der Nachricht',
    errorMessage: 'Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
    
    // Validation
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    
    // Informations de contact
    businessHours: 'Geschäftszeiten',
    followUs: 'Folgen Sie uns',
    address: 'Adresse',
    
    // Continents
    globalPresence: 'Globale Präsenz',
    globalDescription: 'Wir sind auf 3 Kontinenten präsent, um Ihnen besser zu dienen',
    selectRegion: 'Wählen Sie Ihre Region für spezifische Informationen',
    
    // Sujets prédéfinis
    subjects: {
      general: 'Allgemeine Anfrage',
      quote: 'Kostenvoranschlag',
      technical: 'Technische Frage',
      after_sales: 'Kundendienst',
      partnership: 'Partnerschaft',
      distribution: 'Händler werden',
      other: 'Andere'
    },
    
    // Descriptions
    contactDescription: 'Wir sind hier, um alle Ihre Fragen zu unseren modularen Häusern zu beantworten.',
    whatsappMessage: 'Kontaktieren Sie uns über WhatsApp',
    
    // Boutons d'action
    openWhatsApp: 'WhatsApp öffnen',
    callUs: 'Rufen Sie uns an',
    emailUs: 'Schreiben Sie uns',
    
    // Bureaux régionaux
    regionalOffices: 'Regionalbüros',
    headquarters: 'Hauptsitz',
    regionalOffice: 'Regionalbüro'
  },
  ar: {
    // Navigation et titre
    contact: 'اتصل بنا',
    contactUs: 'تواصل معنا',
    contactInfo: 'معلومات الاتصال',
    getInTouch: 'تواصل معنا',
    
    // Formulaire
    name: 'الاسم الكامل',
    email: 'عنوان البريد الإلكتروني',
    phone: 'الهاتف',
    country: 'البلد',
    subject: 'الموضوع',
    message: 'الرسالة',
    send: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال...',
    
    // Messages de statut
    success: 'تم إرسال الرسالة بنجاح!',
    successMessage: 'سنتواصل معك قريباً.',
    error: 'خطأ في إرسال الرسالة',
    errorMessage: 'يرجى المحاولة مرة أخرى لاحقاً أو التواصل معنا مباشرة.',
    
    // Validation
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
    
    // Informations de contact
    businessHours: 'ساعات العمل',
    followUs: 'تابعنا',
    address: 'العنوان',
    
    // Continents
    globalPresence: 'الحضور العالمي',
    globalDescription: 'نحن موجودون في 3 قارات لخدمتك بشكل أفضل',
    selectRegion: 'اختر منطقتك للحصول على معلومات محددة',
    
    // Sujets prédéfinis
    subjects: {
      general: 'استفسار عام',
      quote: 'طلب عرض أسعار',
      technical: 'سؤال تقني',
      after_sales: 'خدمة ما بعد البيع',
      partnership: 'شراكة',
      distribution: 'كن موزعاً',
      other: 'أخرى'
    },
    
    // Descriptions
    contactDescription: 'نحن هنا للإجابة على جميع أسئلتك حول منازلنا المتحركة.',
    whatsappMessage: 'تواصل معنا عبر واتساب',
    
    // Boutons d'action
    openWhatsApp: 'فتح واتساب',
    callUs: 'اتصل بنا',
    emailUs: 'راسلنا',
    
    // Bureaux régionaux
    regionalOffices: 'المكاتب الإقليمية',
    headquarters: 'المقر الرئيسي',
    regionalOffice: 'المكتب الإقليمي'
  },
  pt: {
    // Navigation et titre
    contact: 'Contato',
    contactUs: 'Entre em contato',
    contactInfo: 'Informações de contato',
    getInTouch: 'Entrar em contato',
    
    // Formulaire
    name: 'Nome completo',
    email: 'Endereço de e-mail',
    phone: 'Telefone',
    country: 'País',
    subject: 'Assunto',
    message: 'Mensagem',
    send: 'Enviar mensagem',
    sending: 'Enviando...',
    
    // Messages de statut
    success: 'Mensagem enviada com sucesso!',
    successMessage: 'Entraremos em contato em breve.',
    error: 'Erro ao enviar mensagem',
    errorMessage: 'Tente novamente mais tarde ou entre em contato diretamente.',
    
    // Validation
    required: 'Este campo é obrigatório',
    invalidEmail: 'Endereço de e-mail inválido',
    
    // Informations de contact
    businessHours: 'Horário de funcionamento',
    followUs: 'Siga-nos',
    address: 'Endereço',
    
    // Continents
    globalPresence: 'Presença Global',
    globalDescription: 'Estamos presentes em 3 continentes para melhor atendê-lo',
    selectRegion: 'Selecione sua região para informações específicas',
    
    // Sujets prédéfinis
    subjects: {
      general: 'Consulta geral',
      quote: 'Solicitação de orçamento',
      technical: 'Pergunta técnica',
      after_sales: 'Pós-venda',
      partnership: 'Parceria',
      distribution: 'Torne-se distribuidor',
      other: 'Outro'
    },
    
    // Descriptions
    contactDescription: 'Estamos aqui para responder todas as suas perguntas sobre nossas casas modulares.',
    whatsappMessage: 'Entre em contato pelo WhatsApp',
    
    // Boutons d'action
    openWhatsApp: 'Abrir WhatsApp',
    callUs: 'Ligue para nós',
    emailUs: 'Envie-nos um e-mail',
    
    // Bureaux régionaux
    regionalOffices: 'Escritórios Regionais',
    headquarters: 'Sede',
    regionalOffice: 'Escritório Regional'
  }
};

export type Language = 'fr' | 'en' | 'es' | 'de' | 'ar' | 'pt';
export type TranslationKey = keyof typeof translations.fr;