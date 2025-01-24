"use server"; // Add this line for server actions

import { ScrapItem } from "@/types/scrap";

// Mock data
const mockScrapItems: ScrapItem[] = [
  {
    _id: "1",
    partNumber: "JCB123",
    description: "Hydraulic Pump",
    quantity: 2,
    cost: 1500.5,
    reason: "Manufacturing Defect",
    category: "Hydraulics",
    dateScraped: new Date(),
    createdAt: new Date(),
  },
  {
    _id: "2",
    partNumber: "JCB456",
    description: "Control Valve",
    quantity: 1,
    cost: 750.25,
    reason: "Quality Control",
    category: "Controls",
    dateScraped: new Date(),
    createdAt: new Date(),
  },
  // Add more mock items as needed
];

export async function getScrapItems(): Promise<ScrapItem[]> {
  // Simulate async delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockScrapItems;
}
