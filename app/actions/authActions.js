// src/app/actions/authActions.js
'use server';

import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Server Action: Authenticate using Phone Number and Password
 */
export async function handleLoginAction(formData) {
  try {
    await dbConnect();

    const phoneNumber = formData.get('phoneNumber')?.trim();
    const password = formData.get('password');

    if (!phoneNumber || !password) {
      return { error: 'Both Phone Number and password fields are required.' };
    }

    // 1. Find user profile in MongoDB via Phone Number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return { error: 'Invalid credentials provided.' };
    }

    // 2. Verify hashed password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid credentials provided.' };
    }

    // 3. Create payload structure for route guarding
    const tokenPayload = {
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role, // 'admin' or 'user'
    };

    // 4. Sign the token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    // 5. Drop the secure httpOnly cookie session token
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 12,
      path: '/',
    });

    return {
      success: true,
      user: {
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'Internal system fault occurred during authentication.' };
  }
}

/**
 * Server Action: Terminate session
 */
export async function handleLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  return { success: true };
}

/**
 * Server Action: Register user with phone and password
 */
export async function handleRegisterAction(formData) {
  try {
    await dbConnect();

    const username = formData.get('username')?.trim();
    const phoneNumber = formData.get('phoneNumber')?.trim();
    const password = formData.get('password');

    if (!username || !phoneNumber || !password) {
      return { error: 'Name, Phone Number, and Password are all strictly required.' };
    }

    // Check if phone number is already registered
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return { error: 'This phone number is already registered.' };
    }

    // Hash the plain text credential string safely via bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the database record
    await User.create({
      username,
      phoneNumber,
      role: 'user', // Defaults to standard user profile
      password: hashedPassword,
    });

    return { success: true };

  } catch (error) {
    console.error('Registration Failure:', error);
    return { error: 'Internal server fault encountered during worker generation.' };
  }
}