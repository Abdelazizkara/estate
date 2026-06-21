import type { Property, User } from '@prisma/client';

type PropertyWithAgent = Property & { agent: User };

export interface ApiProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
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
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    agency?: string;
    licenseNumber?: string;
    rating?: number;
    reviews?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function mapProperty(row: PropertyWithAgent): ApiProperty {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    type: row.type,
    status: row.status,
    location: {
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zipCode,
      country: row.country,
      lat: row.lat,
      lng: row.lng,
    },
    features: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      area: row.area,
      ...(row.yearBuilt != null && { yearBuilt: row.yearBuilt }),
      ...(row.parking != null && { parking: row.parking }),
      furnished: row.furnished,
      balcony: row.balcony,
      garden: row.garden,
      pool: row.pool,
    },
    images: JSON.parse(row.images) as string[],
    agent: {
      id: row.agent.id,
      name: row.agent.name,
      email: row.agent.email,
      phone: row.agent.phone ?? '',
      ...(row.agent.agency && { agency: row.agent.agency }),
      ...(row.agent.licenseNumber && { licenseNumber: row.agent.licenseNumber }),
      ...(row.agent.rating != null && { rating: row.agent.rating }),
      ...(row.agent.reviews != null && { reviews: row.agent.reviews }),
    },
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function mapUser(user: User): ApiUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
