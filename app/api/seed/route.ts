import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers } from '../../../lib/db';

const SEED_USERS = [
  {
    email: 'admin@universitas-terbuka.ac.id',
    password: 'admin123456',
    name: 'Admin Universitas',
    role: 'admin' as const,
  },
  {
    email: 'dosen@universitas-terbuka.ac.id',
    password: 'dosen123456',
    name: 'Ir. Fulan, M.T',
    role: 'mahasiswa' as const,
  },
  {
    email: 'mahasiswa1@universitas-terbuka.ac.id',
    password: 'mahasiswa123456',
    name: 'Fulan Bin Fulanah',
    role: 'mahasiswa' as const,
  },
  {
    email: 'admin@indismart.co.id',
    password: '1ndis*#!',
    name: 'Admin Indismart',
    role: 'admin' as const,
  },
];

export async function POST(req: NextRequest) {
  try {
    let existingUsers: any[] = [];
    try {
      const result = getAllUsers();
      if (Array.isArray(result)) {
        existingUsers = result;
      }
    } catch (e) {
      console.error('getAllUsers error:', e);
      existingUsers = [];
    }
    
    // Check if already seeded
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        {
          message: 'Database sudah ada data',
          warning: 'Seed tidak dijalankan untuk menghindari duplikasi',
          current_users: existingUsers.length,
          users: existingUsers.map(u => ({
            email: u.email,
            name: u.name,
            role: u.role,
          })),
        },
        { status: 200 }
      );
    }

    // Create seed users
    const createdUsers = [];
    for (const seedUser of SEED_USERS) {
      const user = createUser(
        seedUser.email,
        seedUser.password,
        seedUser.name,
        seedUser.role
      );
      if (user) {
        createdUsers.push({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          password_for_testing: seedUser.password,
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Seed user berhasil dibuat',
        total_created: createdUsers.length,
        users: createdUsers,
        info: 'Simpan password di atas untuk testing. Password adalah: password123456 untuk semua (kecuali yang tertulis)',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { message: 'Internal error', error: String(err) },
      { status: 500 }
    );
  }
}

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
      message: 'Seed status',
      is_seeded: users && users.length > 0,
      total_users: users ? users.length : 0,
      users: users ? users.map((u: any) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        created_at: u.created_at,
      })) : [],
      instructions: !users || users.length === 0 ? 
        'Database kosong. Lakukan POST /api/seed untuk menjalankan seed.' :
        'Database sudah di-seed. Gunakan email dan password untuk login.',
    });
  } catch (err) {
    console.error('Get seed status error:', err);
    return NextResponse.json(
      { message: 'Internal error', error: String(err) },
      { status: 500 }
    );
  }
}
