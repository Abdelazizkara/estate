import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Bed,
  Bath,
  Square,
  Heart,
  GitCompare,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePropertyStore } from "../store/usePropertyStore";
import { PropertyMap } from "../components/map";
import { useUserStore } from "../store/useUserStore";
import { fetchPropertyById } from "../services/properties";
import type { Property } from "../types";

import { socket } from "../services/socket";

export function PropertyDetailsPage() {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    properties,
    addProperty,
    toggleFavorite,
    addToCompare,
    removeFromCompare,
    compareList,
  } = usePropertyStore();
  const { user } = useUserStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | undefined>(() =>
    properties.find((p) => p.id === id),
  );
  const [loading, setLoading] = useState(!property && !!id);
  const [notFound, setNotFound] = useState(false);
  const favorites = usePropertyStore((state) => state.favorites);
  const isFavorite = property ? favorites.includes(property.id) : false;
  const isComparing = property ? compareList.includes(property.id) : false;

  useEffect(() => {
    const fromStore = properties.find((p) => p.id === id);
    if (fromStore) {
      setProperty(fromStore);
      setLoading(false);
      setNotFound(false);
      return;
    }
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    fetchPropertyById(id)
      .then((p) => {
        if (!cancelled) {
          addProperty(p);
          setProperty(p);
          setNotFound(false);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, properties, addProperty]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (!property || notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/properties"
            className="text-primary-600 hover:text-primary-700"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !property || sending) return;

    setSending(true);
    try {
      const res = await fetch("http://localhost:3001/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: property.agent.id,
          propertyId: property.id,
        }),
      });
      const data = await res.json();
      const conversationId = data.conversation.id;

      // send the first message once we have the conversation id
      socket.emit("send-message", {
        conversationId,
        content: messageText.trim(),
      });

      navigate(`/dashboard/messages?c=${conversationId}`);
    } catch (err) {
      console.error("Failed to start conversation", err);
    } finally {
      setSending(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev >= property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev <= 0 ? property.images.length - 1 : prev - 1,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-96">
            <img
              src={property.images[currentImageIndex] || "/placeholder.jpg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.location.address}, {property.location.city},{" "}
                      {property.location.state} {property.location.zipCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`p-2 rounded-lg transition ${
                      isFavorite
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50"
                    }`}
                  >
                    <Heart
                      className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() =>
                      isComparing
                        ? removeFromCompare(property.id)
                        : addToCompare(property.id)
                    }
                    className={`p-2 rounded-lg transition ${
                      isComparing
                        ? "bg-primary-50 text-primary-600"
                        : "bg-gray-100 text-gray-600 hover:bg-primary-50"
                    }`}
                  >
                    <GitCompare className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    property.status === "sale"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  For {property.status}
                </span>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700 capitalize">
                  {property.type}
                </span>
              </div>

              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(property.price)}
                {property.status === "rent" && (
                  <span className="text-lg text-gray-500">/month</span>
                )}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.features.bedrooms}
                    </p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.features.bathrooms}
                    </p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.features.area.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Sq Ft</p>
                  </div>
                </div>
                {property.features.yearBuilt && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {property.features.yearBuilt}
                      </p>
                      <p className="text-sm text-gray-600">Year Built</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Features */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.parking && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Parking ({property.features.parking} spots)</span>
                  </div>
                )}
                {property.features.furnished && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Furnished</span>
                  </div>
                )}
                {property.features.balcony && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Balcony</span>
                  </div>
                )}
                {property.features.garden && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Garden</span>
                  </div>
                )}
                {property.features.pool && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Pool</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <PropertyMap properties={[property]} height="300px" />
            </div>
          </div>

          {/* Sidebar - Agent Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Contact Agent
              </h2>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {property.agent.avatar ? (
                    <img
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-500">
                      {property.agent.name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {property.agent.name}
                  </p>
                  {property.agent.agency && (
                    <p className="text-sm text-gray-600">
                      {property.agent.agency}
                    </p>
                  )}
                  {property.agent.rating && (
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">
                        {property.agent.rating} ({property.agent.reviews}{" "}
                        reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <Phone className="h-5 w-5" />
                  <span>{property.agent.phone}</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <Mail className="h-5 w-5" />
                  <span>{property.agent.email}</span>
                </a>
              </div>

              {user ? (
                <form className="space-y-4" onSubmit={handleSendMessage}>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="I'm interested in this property..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-3">
                    Sign in to contact the agent
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
