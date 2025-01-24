import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/jcb";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: Cached = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
