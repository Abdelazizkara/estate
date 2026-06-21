import { Heart, Bed, Bath, Square, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { usePropertyStore } from '../../store/usePropertyStore';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { favorites, toggleFavorite, compareList, addToCompare, removeFromCompare } =
    usePropertyStore();

  const isFavorite = favorites.includes(property.id);
  const isComparing = compareList.includes(property.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(property.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Link to={`/properties/${property.id}`}>
          <img
            src={property.images[0] || '/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              property.status === 'sale'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            For {property.status}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-900/80 text-white capitalize">
            {property.type}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-900 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isComparing
                ? 'bg-primary-600 text-white'
                : 'bg-white/90 text-gray-900 hover:bg-primary-50'
            }`}
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-1">
            {property.location.address}, {property.location.city}
          </p>
        </Link>

        {/* Features */}
        <div className="flex items-center space-x-4 mb-3 text-gray-600">
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span className="text-sm">{property.features.bedrooms} beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span className="text-sm">{property.features.bathrooms} baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="h-4 w-4" />
            <span className="text-sm">{property.features.area.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          <span className="text-xs text-gray-500">
            {property.status === 'rent' ? '/month' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
