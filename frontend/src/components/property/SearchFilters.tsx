import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

interface SearchFiltersProps {
  onSearch?: () => void; 
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { filters, setFilters, clearFilters } = usePropertyStore();

  const [localFilters, setLocalFilters] = useState(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(localFilters);
    onSearch?.();
  };

  const handleClear = () => {
    setLocalFilters({});
    clearFilters();
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City, address, or ZIP"
              value={localFilters.query || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, query: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            value={localFilters.type || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                type: e.target.value as any || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                status: e.target.value as any || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <select
            value={localFilters.maxPrice || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Price</option>
            <option value="100000">$100,000</option>
            <option value="250000">$250,000</option>
            <option value="500000">$500,000</option>
            <option value="750000">$750,000</option>
            <option value="1000000">$1,000,000</option>
            <option value="2000000">$2,000,000+</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <select
            value={localFilters.minBedrooms || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                minBedrooms: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Area (sqft)
          </label>
          <input
            type="number"
            placeholder="Any size"
            value={localFilters.minArea || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                minArea: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="Specific city"
            value={localFilters.city || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, city: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary-600 text-dark border border-gray-300 rounded-lg hover:bg-primary-700 transition flex items-center justify-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      {(Object.keys(localFilters).length > 0 || Object.keys(filters).length > 0) && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-primary-600 hover:text-primary-700 transition"
          >
            Clear all filters
          </button>
        </div>
      )}
    </form>
  );
}
