import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'development-secret-change-before-deploy');
export async function makeSession(email: string) { return new SignJWT({ role: 'admin', email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(key()); }
export async function isAdmin() { const token = (await cookies()).get('freshhire_session')?.value; if (!token) return false; try { return (await jwtVerify(token, key())).payload.role === 'admin'; } catch { return false; } }
export async function requireAdmin() { if (!(await isAdmin())) redirect('/admin/login'); }

