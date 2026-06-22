import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../');
const uploadRoot = path.join(projectRoot, 'uploads', 'resources');

export const allowedResourceMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp',
  'video/mp4',
]);

export function inferResourceType(mimeType = '', url = '') {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType || /\.(pdf|docx?|pptx?|txt)$/i.test(url)) return 'document';
  if (/^https?:\/\//i.test(url)) return 'link';
  return 'other';
}

export async function storeResourceFile(file) {
  if (!file) return null;
  await fs.mkdir(uploadRoot, { recursive: true });
  const extension = path.extname(file.originalname || '').slice(0, 16);
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
  const destination = path.join(uploadRoot, filename);
  await fs.writeFile(destination, file.buffer);
  return {
    url: `${env.apiUrl}/uploads/resources/${filename}`,
    storageProvider: env.cloudinary.enabled ? 'cloudinary' : 'local',
    publicId: filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    type: inferResourceType(file.mimetype),
  };
}