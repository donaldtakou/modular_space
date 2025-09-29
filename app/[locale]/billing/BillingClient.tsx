"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import BillingForm from '@/app/components/BillingForm';

const BillingClient = () => {
  const t = useTranslations('billing');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pb-32 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Section with Negative Margin for Overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-200" />
            <div className="relative flex items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('form.features.security.title')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('form.features.security.description')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-200" />
            <div className="relative flex items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('form.features.payment.title')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('form.features.payment.description')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-200" />
            <div className="relative flex items-center p-6 bg-white rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('form.features.privacy.title')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('form.features.privacy.description')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <BillingForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-b from-gray-50 to-white px-3 text-lg font-medium text-gray-900">
                {t('securitySection')}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{t('securePayment')}</h3>
                </div>
                <p className="mt-4 text-gray-500">{t('securePaymentDescription')}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex items-center">
                <img src="/images/secure-payment.svg" alt={t('securePaymentAlt')} className="h-10 mr-4" />
                <img src="/images/pci-compliant.svg" alt={t('pciCompliantAlt')} className="h-10" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">{t('privacyNotice')}</h3>
                </div>
                <p className="mt-4 text-gray-500">{t('privacyDescription')}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center text-sm text-gray-500">
                  <Lock className="h-5 w-5 text-green-500 mr-2" />
                  {t('sslConnection')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingClient;