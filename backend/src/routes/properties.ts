import { Router } from 'express';
import type { Prisma } from '@prisma/client';
import { getPrisma } from '../lib/prisma.js';
import { mapProperty } from '../utils/mapProperty.js';


const router = Router();

router.get('/', async (req, res) => {
  // If DATABASE_URL is missing/invalid, avoid crashing the dev server.
  // (Fix expected: set backend/.env -> DATABASE_URL = postgresql://...)

  try {
    const {
      query,
      type,
      status,
      city,
      minPrice,
      maxPrice,
      minBedrooms,
      minArea,
    } = req.query;

    const where: Prisma.PropertyWhereInput = {};

    if (type && typeof type === 'string') {
      where.type = type as Prisma.EnumPropertyTypeFilter['equals'];
    }
    if (status && typeof status === 'string') {
      where.status = status as Prisma.EnumPropertyStatusFilter['equals'];
    }
    if (city && typeof city === 'string') {
      where.city = { equals: city };
    }
    if (minPrice || maxPrice) {
      const priceFilter: Prisma.FloatFilter = {};
      if (minPrice) priceFilter.gte = Number(minPrice);
      if (maxPrice) priceFilter.lte = Number(maxPrice);
      where.price = priceFilter;
    }
    if (minBedrooms) where.bedrooms = { gte: Number(minBedrooms) };
    if (minArea) where.area = { gte: Number(minArea) };

    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { city: { contains: q } },
        { address: { contains: q } },
      ];
    }

    const prisma = getPrisma();
    if (!prisma) {
      res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
      return;
    }

    const rows = await prisma.property.findMany({
      where,

      include: { agent: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(rows.map(mapProperty));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  const prisma = getPrisma();
  if (!prisma) {
    res.status(500).json({ error: 'Database is not configured (DATABASE_URL invalid)' });
    return;
  }

  try {
    const row = await prisma.property.findUnique({

      where: { id: req.params.id },
      include: { agent: true },
    });

    if (!row) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json(mapProperty(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

export default router;
