import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    const client = await clientPromise;
    console.log("Client connected");

    const db = client.db("jcb-starter-template");
    console.log("Database selected:", db.databaseName);

    const collections = await db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    const collection = db.collection("scraps");
    const count = await collection.countDocuments();
    console.log("Documents in scraps collection:", count);

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB",
      details: {
        database: db.databaseName,
        collections: collections.map((c) => c.name),
        scrapCount: count,
      },
    });
  } catch (error) {
    console.error("Database Connection Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
