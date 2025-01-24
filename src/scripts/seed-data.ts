import { MongoClient } from "mongodb";
import { ScrapItem } from "@/types/scrap";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/scrap-report-dashboard";

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const collection = db.collection<ScrapItem>("scraps");

    // Clear existing data
    await collection.deleteMany({});

    // Generate sample data
    const sampleData: ScrapItem[] = [];
    const facilities = ["PROD", "CAB", "HP"];
    const reasons = [
      "Manufacturing Defect",
      "Quality Control",
      "Handling Damage",
      "Material Defect",
    ];
    const materials = [
      { code: "JCB123", desc: "Hydraulic Pump" },
      { code: "JCB456", desc: "Control Valve" },
      { code: "JCB789", desc: "Engine Mount" },
      { code: "JCB234", desc: "Transmission Belt" },
      { code: "JCB567", desc: "Air Filter" },
    ];

    // Generate data for the last 12 months
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate 3-8 entries per day
      const entriesCount = Math.floor(Math.random() * 6) + 3;

      for (let j = 0; j < entriesCount; j++) {
        const material =
          materials[Math.floor(Math.random() * materials.length)];
        const facility =
          facilities[Math.floor(Math.random() * facilities.length)];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        const quantity = Math.floor(Math.random() * 10) + 1;
        const costPerUnit = Math.random() * 1000 + 100;

        sampleData.push({
          _id: `${date.toISOString()}-${j}`,
          material: material.code,
          materialDescription: material.desc,
          quantity,
          postingDate: date.toISOString().split("T")[0],
          cost: quantity * costPerUnit,
          movementType: 101,
          movementTypeText: "Scrap",
          materialDocument: Math.floor(Math.random() * 1000000),
          documentDate: date.toISOString().split("T")[0],
          storageLocation: facility,
          userName: "SYSTEM",
          timeOfEntry: date.toISOString(),
          reasonArea: reason,
        });
      }
    }

    // Insert the sample data
    const result = await collection.insertMany(sampleData);
    console.log(`Successfully inserted ${result.insertedCount} documents`);

    // Create indexes
    await collection.createIndex({ postingDate: 1 });
    await collection.createIndex({ storageLocation: 1 });
    await collection.createIndex({ material: 1 });

    await client.close();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
