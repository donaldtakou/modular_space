import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fr',
  otherLanguages: ['en', 'es', 'de'],
});

export default NextI18NextInstance;
export const { appWithTranslation, withTranslation, i18n } = NextI18NextInstance;
