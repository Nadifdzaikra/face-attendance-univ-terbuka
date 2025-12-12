import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name, role } = body as {
      email?: string;
      password?: string;
      name?: string;
      role?: 'admin' | 'mahasiswa';
    };

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

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    const userRole = role === 'admin' ? 'admin' : 'mahasiswa';
    const newUser = createUser(email, password, name, userRole);

    if (!newUser) {
      return NextResponse.json(
        { message: 'Gagal membuat user' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registrasi berhasil',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
}
