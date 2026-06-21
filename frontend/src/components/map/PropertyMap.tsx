import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Property } from '../../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PropertyMapProps {
  properties?: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPropertyClick?: (property: Property) => void;
}

export function PropertyMap({
  properties = [],
  center = [40.7128, -74.0060], // Default: New York
  zoom = 12,
  height = '400px',
  onPropertyClick,
}: PropertyMapProps) {
  // If properties are provided, calculate center from them
  const mapCenter =
    properties.length > 0
      ? ([
          properties.reduce((sum, p) => sum + p.location.lat, 0) / properties.length,
          properties.reduce((sum, p) => sum + p.location.lng, 0) / properties.length,
        ] as [number, number])
      : center;

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.location.lat, property.location.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onPropertyClick?.(property),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location.address}</p>
                <p className="text-primary-600 font-bold mt-1">
                  ${property.price.toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
