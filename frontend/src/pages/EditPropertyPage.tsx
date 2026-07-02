import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { fetchMyProperties, updatePropertyById } from '../services/properties';
import type { Property } from '../types';
import { usePropertyStore } from '../store/usePropertyStore';
import { uploadImage } from '../services/uploads';

type PropertyType = Property['type'];
type PropertyStatus = Property['status'];

const propertyTypes: PropertyType[] = ['apartment', 'house', 'villa', 'land', 'commercial'];
const propertyStatuses: PropertyStatus[] = ['sale', 'rent'];

export function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const updateInStore = usePropertyStore((s) => s.updateProperty);

  const canManage = user?.role === 'agent' || user?.role === 'seller' || user?.role === 'admin';

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartment' as PropertyType,
    status: 'sale' as PropertyStatus,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    lat: '',
    lng: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    parking: '',
    furnished: false,
    balcony: false,
    garden: false,
    pool: false,
    image1: '',
    image2: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) {
        setNotFound(true);
        setInitialLoading(false);
        return;
      }

      try {
        const list = await fetchMyProperties();
        const p = list.find((x) => x.id === id);
        if (!p) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (cancelled) return;

        setForm({
          title: p.title ?? '',
          description: p.description ?? '',
          price: String(p.price ?? ''),
          type: p.type,
          status: p.status,
          address: p.location.address ?? '',
          city: p.location.city ?? '',
          state: p.location.state ?? '',
          zipCode: p.location.zipCode ?? '',
          country: p.location.country ?? 'USA',
          lat: String(p.location.lat ?? ''),
          lng: String(p.location.lng ?? ''),
          bedrooms: String(p.features.bedrooms ?? ''),
          bathrooms: String(p.features.bathrooms ?? ''),
          area: String(p.features.area ?? ''),
          yearBuilt: p.features.yearBuilt != null ? String(p.features.yearBuilt) : '',
          parking: p.features.parking != null ? String(p.features.parking) : '',
          furnished: !!p.features.furnished,
          balcony: !!p.features.balcony,
          garden: !!p.features.garden,
          pool: !!p.features.pool,
          image1: p.images?.[0] ?? '',
          image2: p.images?.[1] ?? '',
        });
      } catch {
        if (!cancelled) setError('Could not load this property.');
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isRent = form.status === 'rent';
  const priceLabel = isRent ? 'Monthly rent' : 'Price';

  const patch = useMemo(() => {
    const images = [form.image1, form.image2].map((s) => s.trim()).filter(Boolean);
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      type: form.type,
      status: form.status,
      location: {
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zipCode: form.zipCode.trim(),
        country: form.country.trim(),
        lat: Number(form.lat),
        lng: Number(form.lng),
      },
      features: {
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        ...(form.yearBuilt ? { yearBuilt: Number(form.yearBuilt) } : {}),
        ...(form.parking ? { parking: Number(form.parking) } : {}),
        furnished: form.furnished,
        balcony: form.balcony,
        garden: form.garden,
        pool: form.pool,
      },
      images,
    } satisfies Partial<Omit<Property, 'id' | 'agent' | 'createdAt' | 'updatedAt'>>;
  }, [form]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to edit a listing.</p>
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
          <p className="text-gray-600 mb-4">Only agents and sellers can edit listings.</p>
          <Link to="/dashboard" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
          <p className="text-gray-600 mb-4">This listing may have been deleted or you don’t have access.</p>
          <Link to="/dashboard/properties" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            Back to My Properties
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!id) return;

    if (!patch.title || !patch.description) {
      setError('Please add a title and description.');
      return;
    }
    if (!Number.isFinite(patch.price) || (patch.price as number) <= 0) {
      setError(`Please enter a valid ${priceLabel.toLowerCase()}.`);
      return;
    }
    if (!patch.location?.address || !patch.location.city || !patch.location.state || !patch.location.zipCode) {
      setError('Please complete the address fields.');
      return;
    }
    if (!Number.isFinite(patch.location.lat) || !Number.isFinite(patch.location.lng)) {
      setError('Please enter valid latitude and longitude.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePropertyById(id, patch);
      updateInStore(updated);
      navigate('/dashboard/properties');
    } catch {
      setError('Could not save changes. Make sure the API is running and you’re logged in.');
    } finally {
      setSaving(false);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const picked = Array.from(files).slice(0, 2);
      const results = await Promise.all(picked.map((f) => uploadImage(f)));
      setForm((prev) => ({
        ...prev,
        image1: results[0]?.url ?? prev.image1,
        image2: results[1]?.url ?? prev.image2,
      }));
    } catch {
      setError('Image upload failed. Make sure Cloudinary is configured on the backend.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard/properties" className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 transition">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-gray-500">
            <Home className="h-4 w-4" />
            <span className="text-sm">Edit listing</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit property</h1>
          <p className="text-gray-600 mb-6">Update details and keep your listing fresh.</p>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{priceLabel}</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  inputMode="decimal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {propertyTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {propertyStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip code</label>
                    <input
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      value={form.bedrooms}
                      onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      value={form.bathrooms}
                      onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                    <input
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year built (optional)</label>
                    <input
                      value={form.yearBuilt}
                      onChange={(e) => setForm({ ...form, yearBuilt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parking (optional)</label>
                    <input
                      value={form.parking}
                      onChange={(e) => setForm({ ...form, parking: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {(['furnished', 'balcony', 'garden', 'pool'] as const).map((k) => (
                        <label key={k} className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={form[k]}
                            onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="capitalize">{k}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Images (optional)</h2>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload images (max 2)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Uploaded images will fill the URL fields below.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL #1</label>
                    <input
                      value={form.image1}
                      onChange={(e) => setForm({ ...form, image1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL #2</label>
                    <input
                      value={form.image2}
                      onChange={(e) => setForm({ ...form, image2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/dashboard/properties"
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

