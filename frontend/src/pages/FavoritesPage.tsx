import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyCard } from '../components/property';

export function FavoritesPage() {
  const { properties, favorites } = usePropertyStore();

  const favoriteProperties = properties.filter((p) =>
    favorites.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {favoriteProperties.length} saved properties
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start saving properties you like to compare them later
            </p>
            <Link
              to="/properties"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
