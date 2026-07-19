import LoginFormClient from './LoginFormClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'admin') {
        redirect('/admin');
      } else {
        redirect('/user');
      }
    } catch (error) {
      // Stale token, catch silently to permit clean client mount re-auth
    }
  }

  return <LoginFormClient />;
}