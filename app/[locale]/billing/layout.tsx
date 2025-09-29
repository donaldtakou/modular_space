import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('billing');
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getTranslations('billing');

  return (
    <NextIntlClientProvider messages={{ billing: messages }}>
      {children}
    </NextIntlClientProvider>
  );
}