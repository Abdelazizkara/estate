import { Link } from 'react-router-dom';
import { Home, Heart, MessageSquare, Settings, User, Plus } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { PropertyCard } from '../components/property';

export function DashboardPage() {
  const { user } = useUserStore();
  const { properties, favorites } = usePropertyStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Please sign in
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be signed in to view your dashboard
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const favoriteProperties = properties.filter((p) =>
    favorites.includes(p.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg"
                >
                  <Home className="h-5 w-5" />
                  <span>Overview</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Heart className="h-5 w-5" />
                  <span>Favorites</span>
                </Link>
                <Link
                  to="/dashboard/messages"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </Link>
                {user.role === 'seller' || user.role === 'agent' ? (
                  <Link
                    to="/dashboard/properties"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Home className="h-5 w-5" />
                    <span>My Properties</span>
                  </Link>
                ) : null}
                {user.role === 'agent' && (
                  <Link
                    to="/dashboard/add-property"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Property</span>
                  </Link>
                )}
                <Link
                  to="/dashboard/settings"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Saved Properties</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {favorites.length}
                    </p>
                  </div>
                  <Heart className="h-10 w-10 text-primary-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <MessageSquare className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <User className="h-10 w-10 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Favorite Properties */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Favorite Properties
                </h2>
                <Link
                  to="/favorites"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View All
                </Link>
              </div>

              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favoriteProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">
                    You haven't saved any properties yet
                  </p>
                  <Link
                    to="/properties"
                    className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
                  >
                    Browse Properties
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
