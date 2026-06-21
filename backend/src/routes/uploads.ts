import { Router } from 'express';
import type { RequestHandler } from 'express';
// NOTE: Uploads are not required for auth/properties pages.
// Keep this route resilient to missing optional deps.

import { requireAuth } from '../middleware/auth.js';

const router = Router();

function isAgentOrSeller(role?: string) {
  return role === 'agent' || role === 'seller' || role === 'admin';
}

function ensureCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(cloudName && apiKey && apiSecret);
}

async function getUploadHandler(): Promise<RequestHandler | null> {
  // Uploads should not prevent backend startup.
  const multerMod = await import('multer').catch(() => null);
  if (!multerMod) return null;

  const multer = (multerMod as any).default ?? multerMod;

  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).single('file') as RequestHandler;
}

router.post('/image', requireAuth, async (req, res) => {
  if (!isAgentOrSeller(req.auth?.role)) {
    res.status(403).json({ error: 'Not allowed' });
    return;
  }

  if (!ensureCloudinaryConfigured()) {
    res.status(500).json({ error: 'Cloudinary is not configured' });
    return;
  }

  const uploadHandler = await getUploadHandler();
  if (!uploadHandler) {
    res.status(500).json({ error: 'multer is not available' });
    return;
  }

  // Run multer to populate req.file
  await new Promise<void>((resolve, reject) => {
    uploadHandler(req as any, res as any, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const file = (req as any).file as { buffer?: Buffer; mimetype?: string } | undefined;
  if (!file) {
    res.status(400).json({ error: 'Missing file' });
    return;
  }

  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    res.status(400).json({ error: 'Only image uploads are supported' });
    return;
  }

  const cloudinaryMod = await import('cloudinary').catch(() => null);
  const cloudinary = cloudinaryMod
    ? (cloudinaryMod as any).v2 ?? (cloudinaryMod as any).default?.v2 ?? null
    : null

  if (!cloudinary) {
    res.status(500).json({ error: 'cloudinary is not available' });
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const folder = process.env.CLOUDINARY_FOLDER || 'estatework';

  try {
    const b64 = file.buffer?.toString('base64');
    if (!b64) {
      res.status(400).json({ error: 'Invalid file buffer' });
      return;
    }

    const dataUri = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });

    res.status(201).json({
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;

