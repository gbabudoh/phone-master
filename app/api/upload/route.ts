import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth';
import { minioClient, ensureBucketExists, getPublicImageUrl } from '@/lib/minio';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'phone-master-images';

export async function POST(request: Request) {
  try {
    // 1. Authenticate User
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Validate File Type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only image and video files are allowed' }, { status: 400 });
    }

    // 4. Prepare File for Upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${uuidv4()}.${extension}`;
    
    // 5. Upload to MinIO
    if (!minioClient) {
      console.error('MinIO client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { status: 503 });
    }

    await ensureBucketExists();

    // Set meta data for content type to ensure browsers display it correctly
    const metaData = {
      'Content-Type': file.type,
    };

    await minioClient.putObject(BUCKET_NAME, filename, buffer, buffer.length, metaData);

    // 6. Generate Public URL
    // Note: This URL assumes the bucket is public or the MinIO instance is configured to redirect/proxy
    // If MinIO is internal only, we might need a proxy route or presigned URL.
    // For now, we generate the direct URL.
    const url = getPublicImageUrl(filename);

    return NextResponse.json({ 
      success: true, 
      url,
      filename 
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
