import { Client } from 'minio';

if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  console.warn('⚠️ MinIO environment variables not set. Image uploads will not work.');
}

export const minioClient = process.env.MINIO_ENDPOINT
  ? new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    })
  : null;

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'phone-master-images';

/**
 * Initialize MinIO bucket if it doesn't exist
 */
export async function ensureBucketExists(): Promise<void> {
  if (!minioClient) return;

  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    console.log(`✅ Created MinIO bucket: ${BUCKET_NAME}`);
  }

  // Ensure public read policy
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      },
    ],
  };

  try {
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
  } catch (err) {
    console.warn('⚠️ Failed to set bucket policy (ignore if already set):', err);
  }
}

/**
 * Generate a presigned URL for uploading images
 */
export async function getPresignedUploadUrl(
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> {
  if (!minioClient) {
    throw new Error('MinIO client not configured');
  }

  await ensureBucketExists();
  return await minioClient.presignedPutObject(BUCKET_NAME, objectName, expirySeconds);
}

/**
 * Generate a presigned URL for downloading/viewing images
 */
export async function getPresignedDownloadUrl(
  objectName: string,
  expirySeconds: number = 604800 // 7 days
): Promise<string> {
  if (!minioClient) {
    throw new Error('MinIO client not configured');
  }

  return await minioClient.presignedGetObject(BUCKET_NAME, objectName, expirySeconds);
}

/**
 * Get public URL for an image (if bucket is public)
 */
export function getPublicImageUrl(objectName: string): string {
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const protocol = useSSL ? 'https' : 'http';
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${objectName}`;
}

/**
 * Process image URL through imgproxy if configured
 */
export function getProcessedImageUrl(
  imageUrl: string,
  width?: number,
  height?: number,
  quality: number = 85
): string {
  const imgproxyUrl = process.env.IMGPROXY_URL;
  if (!imgproxyUrl) {
    return imageUrl;
  }

  const params: string[] = [];
  if (width) params.push(`w:${width}`);
  if (height) params.push(`h:${height}`);
  params.push(`q:${quality}`);

  return `${imgproxyUrl}/insecure/${params.join('/')}/${encodeURIComponent(imageUrl)}`;
}

