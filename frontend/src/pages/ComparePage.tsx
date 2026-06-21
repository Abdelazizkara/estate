import { Link } from 'react-router-dom';
import { X, Bed, Bath, Square, MapPin } from 'lucide-react';
import { usePropertyStore } from '../store/usePropertyStore';

export function ComparePage() {
  const { properties, compareList, removeFromCompare, clearCompare } =
    usePropertyStore();

  const compareProperties = properties.filter((p) =>
    compareList.includes(p.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (compareProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Compare Properties
          </h1>
          <p className="text-gray-600 mb-6">
            Select properties to compare them side by side
          </p>
          <Link
            to="/properties"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compare Properties
            </h1>
            <p className="text-gray-600">
              {compareProperties.length} properties selected
            </p>
          </div>
          <button
            onClick={clearCompare}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left w-48 bg-gray-50">Feature</th>
                {compareProperties.map((property) => (
                  <th key={property.id} className="p-4 w-72">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(property.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={property.images[0] || '/placeholder.jpg'}
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-primary-600 hover:underline font-semibold"
                      >
                        {property.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {property.location.city}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">Price</td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(property.price)}
                    </span>
                    {property.status === 'rent' && (
                      <span className="text-sm text-gray-500">/month</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Type */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">Type</td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center capitalize">
                    {property.type}
                  </td>
                ))}
              </tr>

              {/* Status */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">Status</td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        property.status === 'sale'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      For {property.status}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Bedrooms */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Bed className="h-4 w-4" />
                    <span>Bedrooms</span>
                  </div>
                </td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.features.bedrooms}
                  </td>
                ))}
              </tr>

              {/* Bathrooms */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Bath className="h-4 w-4" />
                    <span>Bathrooms</span>
                  </div>
                </td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.features.bathrooms}
                  </td>
                ))}
              </tr>

              {/* Area */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Square className="h-4 w-4" />
                    <span>Area</span>
                  </div>
                </td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.features.area.toLocaleString()} sqft
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4 text-center text-sm">
                    {property.location.address}, {property.location.city}
                  </td>
                ))}
              </tr>

              {/* Features */}
              <tr className="border-b">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50">
                  Features
                </td>
                {compareProperties.map((property) => (
                  <td key={property.id} className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {property.features.parking && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Parking
                        </span>
                      )}
                      {property.features.furnished && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Furnished
                        </span>
                      )}
                      {property.features.balcony && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Balcony
                        </span>
                      )}
                      {property.features.garden && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Garden
                        </span>
                      )}
                      {property.features.pool && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Pool
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/properties"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Add More Properties to Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
