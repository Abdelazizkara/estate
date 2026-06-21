import { Router } from 'express';
import type { Prisma, PropertyType, PropertyStatus } from '@prisma/client';
import { getPrisma } from '../lib/prisma.js';

import { requireAuth } from '../middleware/auth.js';
import { mapProperty } from '../utils/mapProperty.js';

const router = Router();

function isAgentOrSeller(role?: string) {
  return role === 'agent' || role === 'seller' || role === 'admin';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

type CreatePropertyBody = {
  title?: string;
  description?: string;
  price?: number | string;
  type?: PropertyType;
  status?: PropertyStatus;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    lat?: number | string;
    lng?: number | string;
  };
  features?: {
    bedrooms?: number | string;
    bathrooms?: number | string;
    area?: number | string;
    yearBuilt?: number | string;
    parking?: number | string;
    furnished?: boolean | 'true' | 'false';
    balcony?: boolean | 'true' | 'false';
    garden?: boolean | 'true' | 'false';
    pool?: boolean | 'true' | 'false';
  };
  images?: string[];
};

router.get('/properties', requireAuth, async (req, res) => {
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  if (!isAgentOrSeller(req.auth?.role)) {

    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const rows = await prisma.property.findMany({
    where: { agentId: req.auth!.userId },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(rows.map(mapProperty));
});

router.post('/properties', requireAuth, async (req, res) => {
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  if (!isAgentOrSeller(req.auth?.role)) {

    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const body = req.body as CreatePropertyBody;
  const title = body.title?.trim();
  const description = body.description?.trim();
  const price = asNumber(body.price);
  const type = body.type;
  const status = body.status;

  const location = body.location ?? {};
  const address = location.address?.trim();
  const city = location.city?.trim();
  const state = location.state?.trim();
  const zipCode = location.zipCode?.trim();
  const country = location.country?.trim();
  const lat = asNumber(location.lat);
  const lng = asNumber(location.lng);

  const features = body.features ?? {};
  const bedrooms = asNumber(features.bedrooms);
  const bathrooms = asNumber(features.bathrooms);
  const area = asNumber(features.area);
  const yearBuilt = asNumber(features.yearBuilt);
  const parking = asNumber(features.parking);

  if (!title || !description || price == null || !type || !status) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (!address || !city || !state || !zipCode || !country || lat == null || lng == null) {
    res.status(400).json({ error: 'Missing required location fields' });
    return;
  }
  if (bedrooms == null || bathrooms == null || area == null) {
    res.status(400).json({ error: 'Missing required feature fields' });
    return;
  }

  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  const data: Prisma.PropertyCreateInput = {
    title,
    description,
    price,
    type,
    status,
    address,
    city,
    state,
    zipCode,
    country,
    lat,
    lng,
    bedrooms: Math.floor(bedrooms),
    bathrooms: Math.floor(bathrooms),
    area,
    yearBuilt: yearBuilt != null ? Math.floor(yearBuilt) : null,
    parking: parking != null ? Math.floor(parking) : null,
    furnished: asBoolean(features.furnished) ?? false,
    balcony: asBoolean(features.balcony) ?? false,
    garden: asBoolean(features.garden) ?? false,
    pool: asBoolean(features.pool) ?? false,
    images: JSON.stringify(images),
    agent: { connect: { id: req.auth!.userId } },
  };

  const created = await prisma.property.create({ data, include: { agent: true } });
  res.status(201).json(mapProperty(created));
});

router.patch('/properties/:id', requireAuth, async (req, res) => {
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  if (!isAgentOrSeller(req.auth?.role)) {

    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const existing = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: { agent: true },
  });
  if (!existing) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  if (req.auth!.role !== 'admin' && existing.agentId !== req.auth!.userId) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const body = req.body as Partial<CreatePropertyBody>;
  const update: Prisma.PropertyUpdateInput = {};

  if (typeof body.title === 'string') update.title = body.title.trim();
  if (typeof body.description === 'string') update.description = body.description.trim();
  if (body.price != null) {
    const p = asNumber(body.price);
    if (p == null) {
      res.status(400).json({ error: 'Invalid price' });
      return;
    }
    update.price = p;
  }
  if (body.type) update.type = body.type;
  if (body.status) update.status = body.status;

  if (body.location) {
    if (typeof body.location.address === 'string') update.address = body.location.address.trim();
    if (typeof body.location.city === 'string') update.city = body.location.city.trim();
    if (typeof body.location.state === 'string') update.state = body.location.state.trim();
    if (typeof body.location.zipCode === 'string') update.zipCode = body.location.zipCode.trim();
    if (typeof body.location.country === 'string') update.country = body.location.country.trim();
    if (body.location.lat != null) {
      const v = asNumber(body.location.lat);
      if (v == null) return void res.status(400).json({ error: 'Invalid lat' });
      update.lat = v;
    }
    if (body.location.lng != null) {
      const v = asNumber(body.location.lng);
      if (v == null) return void res.status(400).json({ error: 'Invalid lng' });
      update.lng = v;
    }
  }

  if (body.features) {
    if (body.features.bedrooms != null) {
      const v = asNumber(body.features.bedrooms);
      if (v == null) return void res.status(400).json({ error: 'Invalid bedrooms' });
      update.bedrooms = Math.floor(v);
    }
    if (body.features.bathrooms != null) {
      const v = asNumber(body.features.bathrooms);
      if (v == null) return void res.status(400).json({ error: 'Invalid bathrooms' });
      update.bathrooms = Math.floor(v);
    }
    if (body.features.area != null) {
      const v = asNumber(body.features.area);
      if (v == null) return void res.status(400).json({ error: 'Invalid area' });
      update.area = v;
    }
    if (body.features.yearBuilt != null) {
      const v = asNumber(body.features.yearBuilt);
      if (v == null) return void res.status(400).json({ error: 'Invalid yearBuilt' });
      update.yearBuilt = Math.floor(v);
    }
    if (body.features.parking != null) {
      const v = asNumber(body.features.parking);
      if (v == null) return void res.status(400).json({ error: 'Invalid parking' });
      update.parking = Math.floor(v);
    }
    if (body.features.furnished != null) update.furnished = asBoolean(body.features.furnished) ?? undefined;
    if (body.features.balcony != null) update.balcony = asBoolean(body.features.balcony) ?? undefined;
    if (body.features.garden != null) update.garden = asBoolean(body.features.garden) ?? undefined;
    if (body.features.pool != null) update.pool = asBoolean(body.features.pool) ?? undefined;
  }

  if (Array.isArray(body.images)) {
    update.images = JSON.stringify(body.images.filter(Boolean));
  }

  const updated = await prisma.property.update({
    where: { id: req.params.id },
    data: update,
    include: { agent: true },
  });

  res.json(mapProperty(updated));
});

router.delete('/properties/:id', requireAuth, async (req, res) => {
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  if (!isAgentOrSeller(req.auth?.role)) {

    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  if (req.auth!.role !== 'admin' && existing.agentId !== req.auth!.userId) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  await prisma.property.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;

