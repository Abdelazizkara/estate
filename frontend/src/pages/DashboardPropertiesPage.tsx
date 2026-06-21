import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Pencil, Home } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { fetchMyProperties, deletePropertyById } from '../services/properties';
import type { Property } from '../types';
import { usePropertyStore } from '../store/usePropertyStore';

export function DashboardPropertiesPage() {
  const { user } = useUserStore();
  const { deleteProperty: removeFromStore, setProperties } = usePropertyStore();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canManage = user?.role === 'agent' || user?.role === 'seller' || user?.role === 'admin';

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchMyProperties();
        if (cancelled) return;
        setItems(data);
        // Keep global store in sync so cards/details work immediately.
        setProperties(data);
        setError(null);
      } catch {
        if (!cancelled) setError('Could not load your properties.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setProperties]);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [items]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deletePropertyById(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      removeFromStore(id);
    } catch {
      alert('Could not delete property.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to manage properties.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not available</h1>
          <p className="text-gray-600 mb-4">
            Only agents and sellers can manage listings.
          </p>
          <Link to="/dashboard" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Home className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600">{sorted.length} listing(s)</p>
          </div>
          <Link
            to="/dashboard/add-property"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600">Loading…</div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-red-600">{error}</div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <p className="text-gray-700 font-medium mb-2">No listings yet</p>
            <p className="text-gray-600 mb-6">Create your first property listing to start receiving inquiries.</p>
            <Link
              to="/dashboard/add-property"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={p.images?.[0] || '/placeholder-property.jpg'}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 capitalize">{p.type} • {p.status}</p>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {p.location.city}, {p.location.state}
                      </p>
                    </div>
                    <Link to={`/properties/${p.id}`} className="text-sm text-primary-600 hover:text-primary-700">
                      View
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Link
                      to={`/dashboard/properties/${p.id}/edit`}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-200 rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === p.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

