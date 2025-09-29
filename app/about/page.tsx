'use client';

import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar: React.ReactNode;
}

interface Statistic {
  number: string;
  label: string;
  icon: React.ReactNode;
}

const teamMembers: TeamMember[] = [
  {
    name: "Elena Rodriguez",
    role: "CEO International",
    description: "20 ans d'expérience mondiale • Expert en développement multi-continents",
    avatar: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    )
  },
  {
    name: "Marcus Johnson",
    role: "CTO & Innovation",
    description: "Architecte de nos solutions IA • Systèmes de classification avancés",
    avatar: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )
  },
  {
    name: "Dr. Amara Diallo",
    role: "Directrice R&D Afrique",
    description: "Spécialiste adaptations climatiques • Solutions modulaires tropicales",
    avatar: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    )
  },
  {
    name: "James Chen",
    role: "VP Opérations Asie-Pacifique",
    description: "Expert logistique internationale • Déploiement multi-pays",
    avatar: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .35.07.69.18 1H9.82C9.93 5.69 10 5.35 10 5c0-1.66-1.34-3-3-3S4 3.34 4 5c0 .35.07.69.18 1H2C.9 6 0 6.9 0 8v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
      </svg>
    )
  }
];

const statistics: Statistic[] = [
  { 
    number: "950+", 
    label: "Modèles uniques", 
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    )
  },
  { 
    number: "50+", 
    label: "Pays desservis", 
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  },
  { 
    number: "15K+", 
    label: "Clients internationaux", 
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  },
  { 
    number: "3", 
    label: "Continents", 
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    )
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <span className="text-white font-medium">Excellence Mondiale • Europe • Amérique • Afrique</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Architecture Modulaire
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Sans Frontières
              </span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Depuis 2015, nous révolutionnons l'habitat mondial avec 950+ modèles exclusifs
              <br className="hidden md:block" />
              alliant innovation IA, qualité premium et déploiement international
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {statistics.map((stat, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4 text-gray-700">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  Innovation Mondiale • Impact Local
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>
                    Lancée en 2015 avec une vision révolutionnaire : démocratiser l'habitat 
                    modulaire premium sur tous les continents. Notre approche combine 
                    intelligence artificielle, déduplication avancée et logistique mondiale.
                  </p>
                  <p>
                    Aujourd'hui, nous sommes la référence internationale avec 950 modèles 
                    uniques, une présence sur 3 continents et plus de 15 000 clients satisfaits. 
                    Notre catalogue exclusif, optimisé par IA, garantit des solutions adaptées 
                    à chaque climat et réglementation locale.
                  </p>
                  <p>
                    De nos capsules spatiales futuristes aux solutions smart living connectées, 
                    nous repoussons les limites de l'architecture modulaire tout en respectant 
                    les spécificités culturelles et environnementales de chaque région.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Notre Mission</h3>
                  <p className="text-gray-600">
                    Rendre l'habitat modulaire premium accessible mondialement avec des solutions 
                    personnalisées et une qualité exceptionnelle.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation IA</h3>
                  <p className="text-gray-600">
                    Classification intelligente de 950+ modèles, déduplication avancée, 
                    et recommandations personnalisées par continent.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Impact Global</h3>
                  <p className="text-gray-600">
                    Présence confirmée en Europe, expansion active aux Amériques, 
                    développement stratégique en Afrique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Leadership International
              </h2>
              <p className="text-xl text-gray-600">
                Une équipe experte, multiculturelle et multi-continentale
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gray-900 rounded-xl mx-auto flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                      {member.avatar}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Valeurs Fondamentales
              </h2>
              <p className="text-xl text-gray-600">
                Les principes qui guident notre expansion mondiale
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence Globale</h3>
                <p className="text-gray-600">
                  Standards de qualité uniformes sur tous les continents avec adaptation aux 
                  spécificités locales et réglementations régionales.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation Continue</h3>
                <p className="text-gray-600">
                  R&D permanente, IA avancée, solutions émergentes et anticipation 
                  des besoins futurs du marché modulaire mondial.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Impact Durable</h3>
                <p className="text-gray-600">
                  Engagement environnemental, matériaux responsables, efficacité énergétique 
                  et contribution positive aux communautés locales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez la Révolution Modulaire Mondiale
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Découvrez nos 950+ modèles exclusifs et trouvez la solution parfaite pour votre projet, 
              où que vous soyez dans le monde.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/products"
                className="px-10 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorer le Catalogue Global
              </Link>
              <Link 
                href="/contact"
                className="px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-xl transition-colors font-medium text-lg"
              >
                Devis International
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}