import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'CRITICAL FAILURE: Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global cache object to persist the database connection across fast-refresh hot reloads
 * during local development, preventing connection pool leaks.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // If a connection already exists in the execution context, reuse it.
    if (cached.conn) {
        return cached.conn;
    }

    // If a connection attempt isn't already active, create a new promise pool.
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Optimized connection limit for 1 admin + 10 telecallers
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('🚀 Successfully connected to MongoDB Atlas (Unified Leads DB)');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // Clear the bad promise so subsequent calls try fresh
        console.error('❌ MongoDB Atlas connection error:', error);
        throw error;
    }

    return cached.conn;
}

export default dbConnect;