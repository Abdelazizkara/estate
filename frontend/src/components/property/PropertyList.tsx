import type { Property } from '../../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  title?: string;
}

export function PropertyList({ properties, title }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search filters or check back later for new listings.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
