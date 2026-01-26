import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/user';

interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: Date;
}

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key);
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: { id?: string; _id?: string; email: string; role: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ 
    userId: user.id || user._id, 
    email: user.email, 
    role: user.role,
    expiresAt 
  });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  if (!session) return null;
  
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function requireAuth(requiredRole?: UserRole) {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  const payload = session as unknown as SessionPayload;

  if (requiredRole && payload.role !== requiredRole) {
    throw new Error('Forbidden');
  }

  return payload;
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAdmin(role: UserRole): boolean {
  return role === 'wholesale_seller'; // Or create a separate admin role
}

