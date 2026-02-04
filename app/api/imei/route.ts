import { NextRequest, NextResponse } from 'next/server';
import { checkIMEI } from '@/lib/ai/gemini-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imei } = body;

    if (!imei) {
      return NextResponse.json(
        { error: 'IMEI is required' },
        { status: 400 }
      );
    }

    // Clean the IMEI (remove any non-digit characters)
    const cleanIMEI = imei.replace(/\D/g, '');

    if (cleanIMEI.length !== 15) {
      return NextResponse.json({
        isValid: false,
        isBlacklisted: false,
        status: 'invalid - IMEI must be exactly 15 digits',
      });
    }

    // Check the IMEI using the Gemini-powered function
    const result = await checkIMEI(cleanIMEI);

    return NextResponse.json(result);
  } catch (error) {
    console.error('IMEI check error:', error);
    return NextResponse.json(
      { 
        isValid: false,
        isBlacklisted: false,
        status: 'error - Unable to check IMEI at this time',
        error: 'Failed to check IMEI' 
      },
      { status: 500 }
    );
  }
}
