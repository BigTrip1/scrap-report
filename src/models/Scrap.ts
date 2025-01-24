import { Schema, model, models } from "mongoose";

const scrapSchema = new Schema(
  {
    partNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    dateScraped: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Scrap = models?.Scrap || model("Scrap", scrapSchema);

export default Scrap;
