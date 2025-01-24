import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { faker } from "@faker-js/faker";

const facilities = ["PROD", "CAB", "HP"];
const reasons = [
  "Manufacturing Defect",
  "Material Quality",
  "Operator Error",
  "Equipment Malfunction",
  "Process Deviation",
  "Quality Control Rejection",
  "Handling Damage",
  "Tool Wear",
];

const users = [
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Sarah Davis",
  "James Johnson",
];

const generateScrapData = (count: number) => {
  const scraps = [];
  const today = new Date();
  const startOfYear = new Date(2024, 0, 1);
  const endOfYear = new Date(2024, 11, 31);

  for (let i = 0; i < count; i++) {
    const documentDate = faker.date.between({
      from: startOfYear,
      to: endOfYear,
    });

    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitCost = faker.number.float({ min: 50, max: 500, precision: 0.01 });

    scraps.push({
      material: faker.string.alphanumeric({ length: 8, casing: "upper" }),
      materialDescription: faker.commerce.productName(),
      quantity,
      cost: quantity * unitCost,
      documentDate: documentDate.toISOString().split("T")[0],
      userName: faker.helpers.arrayElement(users),
      reasonArea: faker.helpers.arrayElement(reasons),
    });
  }

  return scraps;
};

export async function GET() {
  try {
    console.log("[Seed] Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("[Seed] Connected successfully");

    const db = client.db("jcb-starter-template");
    const collection = db.collection("scraps");

    // Clear existing data
    console.log("[Seed] Clearing existing data...");
    await collection.deleteMany({});

    // Generate and insert new data
    console.log("[Seed] Generating new data...");
    const scrapData = generateScrapData(1000); // Generate 1000 scrap records

    console.log("[Seed] Inserting data...");
    const result = await collection.insertMany(scrapData);

    // Create indexes
    console.log("[Seed] Creating indexes...");
    await collection.createIndex({ documentDate: 1 });
    await collection.createIndex({ material: 1 });

    console.log("[Seed] Database seeded successfully");
    return NextResponse.json({
      success: true,
      message: `Successfully seeded database with ${result.insertedCount} records`,
      details: {
        insertedCount: result.insertedCount,
        indexes: ["documentDate", "material"],
        sampleRecord: scrapData[0],
      },
    });
  } catch (error) {
    console.error("[Seed] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
