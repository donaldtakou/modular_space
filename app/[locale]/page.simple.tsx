export default function SimplePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ModularHouse</h1>
        <p className="text-xl text-gray-600">Bienvenue sur notre site !</p>
        <div className="mt-8 space-x-4">
          <a href="/fr/products" className="px-6 py-3 bg-blue-600 text-white rounded-lg inline-block">
            Produits
          </a>
          <a href="/fr/billing" className="px-6 py-3 bg-gray-100 text-blue-600 rounded-lg inline-block">
            Facturation
          </a>
        </div>
      </div>
    </div>
  );
}