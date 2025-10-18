import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { paramsToSign } = data;
  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.cloudinaryAPISecret || ''
    );
    return NextResponse.json({
      signature,
    });
  } catch (error: any) {
    return NextResponse.json({
      error,
    });
  }
}
