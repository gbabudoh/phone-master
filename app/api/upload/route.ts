import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

// Image size configurations per folder type
const IMAGE_CONFIGS: Record<string, { width: number; height: number; quality: number }> = {
  products: { width: 800, height: 800, quality: 85 },
  banners: { width: 1920, height: 600, quality: 90 },
  avatars: { width: 200, height: 200, quality: 80 },
  thumbnails: { width: 300, height: 300, quality: 75 },
};

const DEFAULT_CONFIG = { width: 1200, height: 1200, quality: 85 };

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'banners';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB before processing)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Get image config for this folder
    const config = IMAGE_CONFIGS[folder] || DEFAULT_CONFIG;

    // Create unique filename (always save as webp for better compression)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomStr}.webp`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Process and resize image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const processedImage = await sharp(buffer)
      .resize(config.width, config.height, {
        fit: 'inside', // Maintain aspect ratio, fit within dimensions
        withoutEnlargement: true, // Don't upscale smaller images
      })
      .webp({ quality: config.quality })
      .toBuffer();

    // Write processed file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, processedImage);

    // Return the public URL
    const url = `/uploads/${folder}/${filename}`;

    // Get final image dimensions
    const metadata = await sharp(processedImage).metadata();

    return NextResponse.json({
      success: true,
      url,
      filename,
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
      originalSize: file.size,
      processedSize: processedImage.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
