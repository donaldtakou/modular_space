'use client';
import { useEffect, useCallback } from 'react';

interface FormData {
  [key: string]: any;
}

export const useDataCapture = () => {
  const capturePartialData = useCallback(async (formData: FormData, formType: string) => {
    try {
      await fetch('/api/admin/client-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'partial_data',
          data: {
            ...formData,
            formType,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            status: 'DONNÉES_PARTIELLES'
          }
        })
      });
    } catch (error) {
      console.error('Failed to capture partial data:', error);
    }
  }, []);

  const captureOnUnload = useCallback((formData: FormData, formType: string) => {
    // Capturer les données même si l'utilisateur quitte la page
    const handleUnload = () => {
      // Utiliser sendBeacon pour envoyer les données même lors de la fermeture
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          type: 'partial_data',
          data: {
            ...formData,
            formType,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            status: 'ABANDONNÉ'
          }
        });
        
        navigator.sendBeacon('/api/admin/client-data', data);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        capturePartialData(formData, formType);
      }
    };

    // Événements pour capturer l'abandon
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Nettoyage
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [capturePartialData]);

  // Auto-sauvegarde périodique
  const startAutoCapture = useCallback((formData: FormData, formType: string, intervalMs: number = 30000) => {
    const interval = setInterval(() => {
      // Ne sauvegarder que si au moins un champ est rempli
      const hasData = Object.values(formData).some(value => 
        value && value.toString().trim() !== ''
      );
      
      if (hasData) {
        capturePartialData(formData, formType);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [capturePartialData]);

  return {
    capturePartialData,
    captureOnUnload,
    startAutoCapture
  };
};