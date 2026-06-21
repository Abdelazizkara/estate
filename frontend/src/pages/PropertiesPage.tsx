import { useState } from 'react';
import { SearchFilters, PropertyList } from '../components/property';
import { PropertyMap } from '../components/map';
import { usePropertyStore } from '../store/usePropertyStore';
import { Map, List } from 'lucide-react';

export function PropertiesPage() {
  const { getFilteredProperties } = usePropertyStore();
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list');

  const filteredProperties = getFilteredProperties();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SearchFilters />
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
                viewMode === 'split'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' && (
          <PropertyList properties={filteredProperties} />
        )}

        {viewMode === 'map' && (
          <PropertyMap
            properties={filteredProperties}
            height="600px"
          />
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="flex">
                    <img
                      src={property.images[0] || '/placeholder.jpg'}
                      alt={property.title}
                      className="w-48 h-32 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {property.location.address}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{property.features.bedrooms} beds</span>
                        <span>{property.features.bathrooms} baths</span>
                        <span>{property.features.area.toLocaleString()} sqft</span>
                      </div>
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        ${property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky top-20">
              <PropertyMap
                properties={filteredProperties}
                height="500px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
