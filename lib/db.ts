import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI environment variable.');
const globalForMongo = global as typeof globalThis & { mongo?: Promise<typeof mongoose> };
export const connectDb = async () => globalForMongo.mongo ??= mongoose.connect(uri).then(m => m);
