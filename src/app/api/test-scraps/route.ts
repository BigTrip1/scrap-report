import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facility = searchParams.get("facility") || "PROD";

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("jcb-starter-template");
    const collection = db.collection("scraps");

    // Get total document count
    const totalDocuments = await collection.countDocuments();

    // Get sample documents
    const sampleDocuments = await collection.find().limit(3).toArray();
    console.log(
      "[Test API] Sample documents:",
      JSON.stringify(sampleDocuments, null, 2)
    );

    // Get date range count for 2024
    const dateRangeCount = await collection.countDocuments({
      documentDate: {
        $gte: "2024-01-01",
        $lte: "2024-12-31",
      },
    });

    // Get unique dates and ensure they are sorted correctly
    const uniqueDates = await collection.distinct("documentDate");
    const sortedDates = uniqueDates.sort((a, b) => a.localeCompare(b));

    // Get date statistics with proper date handling
    const dateStats = {
      earliest: sortedDates[0] || null,
      latest:
        sortedDates[sortedDates.length - 1] ||
        new Date().toISOString().split("T")[0],
      totalDates: sortedDates.length,
    };

    return NextResponse.json({
      status: "success",
      totalDocuments,
      dateRangeCount,
      sampleDocuments,
      uniqueDates: sortedDates,
      dateStats,
      query: {
        facility,
      },
    });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to test database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
