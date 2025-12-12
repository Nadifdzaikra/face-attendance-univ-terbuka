import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById, updateUser } from '../../../lib/db';

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
    if (!userId) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Get profile error:', err);
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    if (!userId) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name } = body as { name?: string };

    if (!name) {
      return NextResponse.json(
        { message: 'Nama harus diisi' },
        { status: 400 }
      );
    }

    const updatedUser = updateUser(userId, { name });

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Gagal update profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Profile updated',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          updated_at: updatedUser.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
}
