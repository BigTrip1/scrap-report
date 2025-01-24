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

const generateScrapData = (count: number) => {
  const scraps = [];
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  for (let i = 0; i < count; i++) {
    const postingDate = faker.date.between({
      from: startOfYear,
      to: today,
    });

    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitCost = faker.number.float({ min: 50, max: 500, precision: 0.01 });

    scraps.push({
      material: faker.string.alphanumeric({ length: 8, casing: "upper" }),
      materialDescription: faker.commerce.productName(),
      quantity,
      unitCost,
      cost: quantity * unitCost,
      storageLocation: faker.helpers.arrayElement(facilities),
      reasonArea: faker.helpers.arrayElement(reasons),
      postingDate: postingDate.toISOString().split("T")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return scraps;
};

export const scrapData = generateScrapData(1000); // Generate 1000 scrap records
