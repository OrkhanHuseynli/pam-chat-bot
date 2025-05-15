import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { embeddedItems } from "./schema";
import { generateUUID } from "../utils";
import { IEmbeddedEntity, seedData, IMetadata } from "./seedData";
import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";
config({
  path: ".env.local",
});

const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const dbUrl =
  process.env.POSTGRES_URL ||
  "postgres://postgres:password@localhost:5432/postgres";
const connection = postgres(dbUrl, { max: 1 });
const db = drizzle(connection);

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: BASE_URL,
});

const embeddingModel = openai.embedding("text-embedding-3-small");

async function embedManyWithMetadata(
  metas: IMetadata[]
): Promise<IEmbeddedEntity[]> {
  const jsons = metas.map((meta) => JSON.stringify(meta));
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: jsons,
  });
  return embeddings.map((embedding, i) => ({
    id: generateUUID(),
    name: metas[i].name || "no name provided",
    shortDescription:
    metas[i].shortDescription || "no short description provided",
    metadata: jsons[i],
    embedding,
  }));
}

async function createDinos(dinos: IEmbeddedEntity[]) {
  try {
    return await db.insert(embeddedItems).values(
      dinos.map((dino) => ({
        ...dino,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

async function seedDb() {
  console.log("Seeding database...");
  const dinosWithEmbed = await embedManyWithMetadata(seedData);
  const result = await createDinos(dinosWithEmbed);
  console.log("Database seeded successfully.");
  return result;
}

seedDb()
  .then((r) => {
    console.log(r);
    console.log("Database seed result...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
