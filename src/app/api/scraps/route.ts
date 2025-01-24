import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { convertCurrency, defaultCurrency } from "@/lib/currency";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facility = searchParams.get("facility") || "PROD";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const targetCurrency = searchParams.get("currency") || defaultCurrency;

    console.log("[API] Request parameters:", {
      facility,
      startDate,
      endDate,
      targetCurrency,
    });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("jcb-starter-template");
    const collection = db.collection("scraps");

    // If no dates provided, return empty response instead of error
    if (!startDate || !endDate) {
      return NextResponse.json({
        summary: {
          totalCost: 0,
          partsCount: 0,
          averageCPM: 0,
          currency: targetCurrency,
        },
        monthlyData: [],
        topParts: [],
      });
    }

    // Build query with date range only (facility is not in schema)
    const query: any = {
      documentDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // Log query for debugging
    console.log("[API] Query:", query);

    // Get sample document to verify query
    const sampleDoc = await collection.findOne(query);
    console.log("[API] Sample matching document:", sampleDoc);

    // Execute aggregation pipeline
    const pipeline = [
      { $match: query },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalCost: { $sum: "$cost" },
                partsCount: { $sum: 1 },
              },
            },
          ],
          monthlyData: [
            {
              $group: {
                _id: {
                  $substr: ["$documentDate", 0, 7], // Extract YYYY-MM from the date
                },
                totalCost: { $sum: "$cost" },
                quantity: { $sum: "$quantity" },
              },
            },
            { $sort: { totalCost: -1 } },
            { $limit: 10 },
            { $sort: { _id: 1 } }, // Sort by date after limiting to maintain chronological order
          ],
          topParts: [
            {
              $group: {
                _id: "$material",
                material: { $first: "$material" },
                materialDescription: { $first: "$materialDescription" },
                totalCost: { $sum: "$cost" },
                quantity: { $sum: "$quantity" },
                reasonArea: { $first: "$reasonArea" },
                userName: { $first: "$userName" },
                documentDate: { $first: "$documentDate" },
              },
            },
            { $sort: { totalCost: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ];

    const [result] = await collection.aggregate(pipeline).toArray();
    console.log("[API] Raw aggregation result:", result);

    if (!result) {
      return NextResponse.json({
        summary: {
          totalCost: 0,
          partsCount: 0,
          averageCPM: 0,
          currency: targetCurrency,
        },
        monthlyData: [],
        topParts: [],
      });
    }

    // Transform the results
    const summary = result.summary[0] || { totalCost: 0, partsCount: 0 };
    const convertedTotalCost = convertCurrency(
      summary.totalCost,
      defaultCurrency,
      targetCurrency
    );
    const averageCPM =
      summary.partsCount > 0 ? convertedTotalCost / summary.partsCount : 0;

    const response = {
      summary: {
        totalCost: convertedTotalCost,
        partsCount: summary.partsCount,
        averageCPM,
        currency: targetCurrency,
      },
      monthlyData: (result.monthlyData || []).map((item: any) => ({
        month: item._id,
        totalCost: convertCurrency(
          item.totalCost,
          defaultCurrency,
          targetCurrency
        ),
        quantity: item.quantity,
        cpm:
          item.quantity > 0
            ? convertCurrency(item.totalCost, defaultCurrency, targetCurrency) /
              item.quantity
            : 0,
        currency: targetCurrency,
      })),
      topParts: (result.topParts || []).map((part: any) => ({
        material: part.material,
        materialDescription: part.materialDescription,
        cost: convertCurrency(part.totalCost, defaultCurrency, targetCurrency),
        quantity: part.quantity,
        reasonArea: part.reasonArea,
        userName: part.userName,
        documentDate: part.documentDate,
        currency: targetCurrency,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
