// src/app/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // If token verification fails (expired/malformed), force a fresh login
    redirect('/auth/login');
  }

  // Pure server routing logic out of the try/catch context to avoid catch collision
  if (decoded?.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/user');
  }
}