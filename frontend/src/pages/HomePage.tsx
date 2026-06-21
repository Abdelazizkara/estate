import { Link } from 'react-router-dom';
import { Home, Search, Key, Users, Shield, ArrowRight } from 'lucide-react';
import { SearchFilters } from '../components/property';

import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyCard } from '../components/property/PropertyCard';

export function HomePage() {
  const { getFilteredProperties } = usePropertyStore();
  const allProperties = getFilteredProperties();
  const featuredProperties = allProperties.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover thousands of properties for sale and rent. Your perfect home is just a search away.
            </p>

            {/* Search Box */}
            <div className="max-w-4xl mx-auto">
              <SearchFilters />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">10K+</p>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">5K+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">500+</p>
              <p className="text-gray-600">Partner Agents</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">50+</p>
              <p className="text-gray-600">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of the best properties available
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/properties"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <span>View All Properties</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No properties available yet</p>
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                <span>Browse Properties</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Finding your perfect property in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Search
              </h3>
              <p className="text-gray-600">
                Browse thousands of properties using our advanced search filters
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Connect
              </h3>
              <p className="text-gray-600">
                Contact agents directly and schedule property viewings
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Move In
              </h3>
              <p className="text-gray-600">
                Complete the purchase or rental and get your keys
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EstateWork
            </h2>
            <p className="text-gray-600">
              We make real estate simple, transparent, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Users className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Agents
              </h3>
              <p className="text-gray-600 text-sm">
                Work with verified professionals who know the market
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trusted Platform
              </h3>
              <p className="text-gray-600 text-sm">
                Secure transactions and verified listings
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Search className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-600 text-sm">
                Find exactly what you need with powerful filters
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Home className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-600 text-sm">
                Thousands of properties across all categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with EstateWork
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
