import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
const usersDbPath = path.join(dataDir, 'users.json');

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'mahasiswa';
  created_at: string;
  updated_at: string;
}

interface UsersDatabase {
  users: User[];
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getDatabase(): UsersDatabase {
  ensureDataDir();
  
  if (!fs.existsSync(usersDbPath)) {
    const initialDb: UsersDatabase = { users: [] };
    fs.writeFileSync(usersDbPath, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }

  try {
    const data = fs.readFileSync(usersDbPath, 'utf-8');
    const parsed = JSON.parse(data);
    // Ensure users array exists
    if (!parsed.users || !Array.isArray(parsed.users)) {
      return { users: [] };
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [] };
  }
}

function saveDatabase(db: UsersDatabase) {
  ensureDataDir();
  fs.writeFileSync(usersDbPath, JSON.stringify(db, null, 2));
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'mahasiswa' = 'mahasiswa'
): User | null {
  const db = getDatabase();
  
  if (db.users.some(u => u.email === email)) {
    return null;
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password: hashPassword(password),
    name,
    role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.users.push(user);
  saveDatabase(db);
  return user;
}

export function getUserByEmail(email: string): User | null {
  const db = getDatabase();
  return db.users.find(u => u.email === email) || null;
}

export function getUserById(id: string): User | null {
  const db = getDatabase();
  return db.users.find(u => u.id === id) || null;
}

export function getAllUsers(): User[] {
  const db = getDatabase();
  return db.users;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = getDatabase();
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return null;

  const updatedUser: User = {
    ...db.users[userIndex],
    ...updates,
    id: db.users[userIndex].id,
    email: db.users[userIndex].email,
    password: db.users[userIndex].password,
    updated_at: new Date().toISOString(),
  };

  db.users[userIndex] = updatedUser;
  saveDatabase(db);
  return updatedUser;
}

export function deleteUser(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== id);
  
  if (db.users.length < initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}
