import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    let users: any[] = [];
    try {
      const result = getAllUsers();
      if (Array.isArray(result)) {
        users = result;
      }
    } catch (e) {
      console.error('getAllUsers error:', e);
      users = [];
    }
    
    return NextResponse.json({
      message: 'Current users in database',
      total: users ? users.length : 0,
      users: users ? users.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        created_at: u.created_at,
      })) : [],
    });
  } catch (err) {
    console.error('Get users error:', err);
    return NextResponse.json(
      { message: 'Internal error', error: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name, role } = body as {
      email?: string;
      password?: string;
      name?: string;
      role?: 'admin' | 'mahasiswa';
    };

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, dan nama harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const userRole = role === 'admin' ? 'admin' : 'mahasiswa';
    const newUser = createUser(email, password, name, userRole);

    if (!newUser) {
      return NextResponse.json(
        { message: 'Gagal membuat user atau email sudah terdaftar' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'User berhasil dibuat',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          created_at: newUser.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json(
      { message: 'Internal error', error: String(err) },
      { status: 500 }
    );
  }
}
