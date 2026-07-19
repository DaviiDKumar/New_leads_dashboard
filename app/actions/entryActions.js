// src/app/actions/entryActions.js
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Entry from '@/models/Entry';
import jwt from 'jsonwebtoken';

/**
 * Helper: Securely pull payload details from the httpOnly session cookie
 */
async function getSessionPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

/**
 * Action: Commit a new lead entry (User Node Workspace)
 */
// src/app/actions/entryActions.js

export async function handleCreateEntry(data) {
    try {
        await dbConnect();
        const session = await getSessionPayload();

        // Verify session state and route protection rules
        if (!session || session.role !== 'user') {
            return { error: 'Unauthorized profile authorization context.' };
        }

        // Verify parameter integrity
        if (
            !data.clientName ||
            !data.email ||
            !data.phoneNo ||
            !data.address ||
            !data.currentEndDate ||
            !data.finalReportDate
        ) {
            return { error: 'All primary record parameters are strictly required.' };
        }

        // Write straight to MongoDB Atlas collection
        await Entry.create({
            userId: session.userId,
            operatorName: session.phoneNumber,

            // FIXED: Read the passed username prop from the data payload context, 
            // falling back to the session phone number only if missing entirely.
            username: data.username || session.phoneNumber,

            clientName: data.clientName.trim(),
            email: data.email.trim().toLowerCase(),
            phoneNo: data.phoneNo.trim(),
            address: data.address.trim(),
            currentEndDate: new Date(data.currentEndDate),
            extensionDays: Number(data.extensionDays) || 0,
            newEndDate: new Date(data.newEndDate),
            finalReportDate: new Date(data.finalReportDate),
        });

        revalidatePath('/user');
        return { success: true };
    } catch (error) {
        console.error('Entry database storage failure:', error);
        return { error: 'Failed to safely log entry record to secure data cluster.' };
    }
}

/**
 * Action: Retrieve all workspace submissions (Admin Audit Panel Matrix)
 */
export async function handleGetAllEntries() {
    try {
        await dbConnect();
        const session = await getSessionPayload();

        // Block non-administrators from inspecting database structures
        if (!session || session.role !== 'admin') {
            throw new Error('Unauthorized asset pull.');
        }

        // Pull all documents sorted by newest submissions first
        const entries = await Entry.find({}).sort({ createdAt: -1 }).lean();

        // Stringify ObjectIDs and Dates cleanly to resolve Next.js hydrations constraints
        return JSON.parse(JSON.stringify(entries));
    } catch (error) {
        console.error('Fetch administrative collection failure:', error);
        return [];
    }
}