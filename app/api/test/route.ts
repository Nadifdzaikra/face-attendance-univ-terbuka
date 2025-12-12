import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    return NextResponse.json({
      token_exists: !!token,
      token_value: token?.value ? 'has-token' : 'no-token',
      user_id: token?.value ? token.value.split('-')[0] : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
