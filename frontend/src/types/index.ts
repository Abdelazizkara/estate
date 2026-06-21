export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  status: 'sale' | 'rent';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    lat: number;
    lng: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt?: number;
    parking?: number;
    furnished?: boolean;
    balcony?: boolean;
    garden?: boolean;
    pool?: boolean;
  };
  images: string[];
  agent: Agent;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  agency?: string;
  licenseNumber?: string;
  rating?: number;
  reviews?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  type?: Property['type'];
  status?: Property['status'];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minArea?: number;
  city?: string;
}

export interface ContactMessage {
  id: string;
  propertyId: string;
  senderId: string;
  recipientId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
