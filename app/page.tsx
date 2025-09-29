'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const router = useRouter();
  
  const heroImages = [
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ];

  const handleQuoteRequest = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/contact');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section with Image Carousel */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Maison modulaire ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-white font-medium">Présent sur 3 Continents • Europe • Amérique • Afrique</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight">
              Architecture Modulaire
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Sans Frontières
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              950+ modèles uniques • Capsules spatiales • Smart Living • Solutions pliables
              <br className="hidden md:block" />
              Construction rapide • Livraison internationale • Installation clé en main
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link 
                href="/products"
                className="group px-10 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 flex items-center space-x-3"
              >
                <span>Explorer le Catalogue</span>
                <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
              </Link>
              <button 
                onClick={handleQuoteRequest}
                className="px-10 py-4 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-md text-lg font-medium rounded-xl transition-all duration-300"
              >
                {user ? 'Devis International Gratuit' : 'Obtenir un Devis'}
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 pt-8">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Statistics */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white min-w-[120px]">
              <div className="text-3xl font-bold mb-1">950+</div>
              <div className="text-sm opacity-90">Modèles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white min-w-[120px]">
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-sm opacity-90">Pays</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white min-w-[120px]">
              <div className="text-3xl font-bold mb-1">15K+</div>
              <div className="text-sm opacity-90">Clients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white min-w-[120px]">
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-sm opacity-90">Continents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section with Real Images */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4 Gammes • 950 Modèles Exclusifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solutions modulaires premium pour tous continents • Architecture intelligente • Livraison mondiale
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Capsule Houses - 515 products */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="https://s.alicdn.com/@sc04/kf/H92e0cab823fa4cf6a83e6ce61cebdf813.jpeg_300x300.jpeg"
                  alt="Capsule Houses"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                  515 modèles
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Capsules Spatiales</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Habitats futuristes • Design avant-gardiste • Technologie spatiale
                </p>
                <Link 
                  href="/products?category=Capsule"
                  className="w-full inline-block text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Explorer les Capsules
                </Link>
              </div>
            </div>

            {/* Smart Living Space - 317 products */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="https://s.alicdn.com/@sc04/kf/H5dfb15e03a144d8e8b66af37b3f7bf26L.jpg_300x300.jpg"
                  alt="Smart Living Space"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                  317 modèles
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Living</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Maisons connectées • IoT intégré • Intelligence artificielle
                </p>
                <Link 
                  href="/products?category=Smart%20Living%20Space"
                  className="w-full inline-block text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Découvrir le Smart
                </Link>
              </div>
            </div>

            {/* Folding Houses - 95 products */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="https://s.alicdn.com/@sc04/kf/H925ebde34e50418ba79a8448639ffca18.png_300x300.png"
                  alt="Folding Houses"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                  95 modèles
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Folding</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Solutions pliables • Transport optimisé • Déploiement rapide
                </p>
                <Link 
                  href="/products?category=Folding"
                  className="w-full inline-block text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Voir les Pliables
                </Link>
              </div>
            </div>

            {/* New Technology - 23 products */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="New Technology"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                  23 modèles
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nouvelles Tech</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Innovations récentes • R&D avancée • Prototypes exclusifs
                </p>
                <Link 
                  href="/products?category=New"
                  className="w-full inline-block text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Nouvelles Tech
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <Link 
              href="/products"
              className="inline-flex items-center space-x-3 bg-gray-900 text-white px-10 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Catalogue Complet • 950 Modèles</span>
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Processus Global • Installation Mondiale
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De la conception à l'installation • Europe • Amérique • Afrique • Processus unifié
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Consultation"
                  className="w-24 h-24 rounded-xl mx-auto object-cover border-2 border-gray-200 group-hover:border-gray-400 transition-colors shadow-lg"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Consultation</h3>
              <p className="text-gray-600">
                Étude de faisabilité • Réglementation locale • Adaptation climatique
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Conception"
                  className="w-24 h-24 rounded-xl mx-auto object-cover border-2 border-gray-200 group-hover:border-gray-400 transition-colors shadow-lg"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conception</h3>
              <p className="text-gray-600">
                Plans 3D personnalisés • Architecture certifiée • Design sur mesure
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Fabrication"
                  className="w-24 h-24 rounded-xl mx-auto object-cover border-2 border-gray-200 group-hover:border-gray-400 transition-colors shadow-lg"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fabrication</h3>
              <p className="text-gray-600">
                Ateliers high-tech • Contrôle qualité • Optimisation logistique
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Installation"
                  className="w-24 h-24 rounded-xl mx-auto object-cover border-2 border-gray-200 group-hover:border-gray-400 transition-colors shadow-lg"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Installation</h3>
              <p className="text-gray-600">
                Livraison internationale • Montage professionnel • Clé en main
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Excellence Mondiale • Innovation Continue
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              950 modèles uniques • Déduplication intelligente • Livraison sur tous continents
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M7 21H5m0 0H3m4 0V8m0 13h8V8m0 13h2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">515</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Capsules</h3>
              <p className="text-sm text-gray-600">Habitats futuristes</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">317</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Smart Living</h3>
              <p className="text-sm text-gray-600">Maisons connectées</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Folding</h3>
              <p className="text-sm text-gray-600">Solutions pliables</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">23</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Nouvelles Tech</h3>
              <p className="text-sm text-gray-600">Innovations R&D</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Présence Mondiale</h3>
              <p className="text-gray-600">
                Livraison sur 3 continents • 50+ pays desservis • Équipes locales
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Catalogue Unique</h3>
              <p className="text-gray-600">
                950 modèles exclusifs • Déduplication IA • Classification intelligente
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Livraison Rapide</h3>
              <p className="text-gray-600">
                Logistique optimisée • Installation professionnelle • Support continu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Combien de temps faut-il pour construire une maison modulaire ?
              </h3>
              <p className="text-gray-600">
                Le processus complet prend généralement entre 8 à 16 semaines, selon la complexité du projet. 
                La fabrication en atelier prend 6-12 semaines, et l'installation sur site 2-4 semaines.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quelle est la durée de vie d'une maison modulaire ?
              </h3>
              <p className="text-gray-600">
                Nos maisons modulaires sont conçues pour durer aussi longtemps que les constructions traditionnelles, 
                soit 50 ans ou plus avec un entretien approprié. Nous utilisons des matériaux de haute qualité et 
                respectons toutes les normes de construction.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Puis-je personnaliser entièrement ma maison ?
              </h3>
              <p className="text-gray-600">
                Absolument ! Nos maisons sont entièrement personnalisables : plans, finitions, couleurs, 
                équipements, et même l'ajout de modules supplémentaires. Notre équipe de design travaille 
                avec vous pour créer votre maison idéale.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quelles sont les options de financement disponibles ?
              </h3>
              <p className="text-gray-600">
                Nous proposons plusieurs options de financement flexibles, incluant des prêts bancaires 
                partenaires, des solutions de leasing, et des programmes de paiement échelonné. 
                Notre équipe vous accompagne dans le choix de la meilleure solution.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                La maison est-elle livrée complètement finie ?
              </h3>
              <p className="text-gray-600">
                Oui, nos maisons sont livrées clé en main avec toutes les finitions intérieures, 
                la plomberie, l'électricité, et les équipements choisis. Vous pouvez emménager 
                dès la fin de l'installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre projet ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Contactez notre équipe d'experts pour une consultation gratuite et découvrez comment nous pouvons réaliser vos ambitions.
          </p>
          <button 
            onClick={handleQuoteRequest}
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 text-lg font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            {user ? 'Commencer maintenant' : 'Se connecter pour commencer'}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}