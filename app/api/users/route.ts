import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, getAllUsers } from '../../../lib/db';

function getTokenUserId(token: string): string | null {
  const parts = token.split('-');
  return parts[0] || null;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Anda belum login' },
        { status: 401 }
      );
    }

    const userId = getTokenUserId(token);
    const user = getUserById(userId || '');

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Anda tidak memiliki akses' },
        { status: 403 }
      );
    }

    const users = getAllUsers();

    const userStats = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      created_at: u.created_at,
    }));

    return NextResponse.json(
      { 
        total_users: users.length,
        users: userStats,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Get users error:', err);
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
}
