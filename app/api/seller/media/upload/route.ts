import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/lib/minio';
// Generate unique ID without external dependency
function generateUUID() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique object name
    const extension = fileName.split('.').pop();
    const objectName = `uploads/${generateUUID()}.${extension}`;

    // Get presigned URL
    const uploadUrl = await getPresignedUploadUrl(objectName, 3600); // 1 hour expiry

    return NextResponse.json({
      uploadUrl,
      objectName,
      expiresIn: 3600,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

