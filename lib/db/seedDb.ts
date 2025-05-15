import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  dinosaurs,
} from './schema';
import { generateUUID } from '../utils';
import { DinosaurEntity, dinosaursData, Dinosaur } from './seedData';
import { createOpenAI } from '@ai-sdk/openai';
import { embedMany } from 'ai';
config({
  path: '.env.local',
});

const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GPT_MODEL = process.env.GPT_MODEL || "o3-mini"; // "ChatGPT-4o"; // "gpt-4o-mini"; //"gpt-4o";
const dbUrl = process.env.POSTGRES_URL || "postgres://postgres:password@localhost:5432/postgres";
const connection = postgres(dbUrl, { max: 1 });
const db = drizzle(connection);

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: BASE_URL});

const embeddingModel = openai.embedding("text-embedding-3-small");

async function embedManyDinoWithMetadata(dinos: Dinosaur[]):Promise<DinosaurEntity[]> {
  const jsons = dinos.map((dino) => JSON.stringify(dino));
  const { embeddings } = await embedMany({
      model: embeddingModel,
      values: jsons,
      });
  return embeddings.map((embedding, i) => ({...dinos[i], id: dinos[i].name, embedding}));
}

async function createDinos(dinos: DinosaurEntity[]) {
    try {
      return await db.insert(dinosaurs).values(dinos.map((dino) => ({...dino,id: generateUUID(), createdAt: new Date(), updatedAt: new Date()})));
    } catch (error) {
      console.error('Failed to create user in database');
      throw error;
    }
}


async function seedDb(){
    console.log("Seeding database...");
    const dinosWithEmbed = await embedManyDinoWithMetadata(dinosaursData);
    const result = await createDinos(dinosWithEmbed);
    console.log("Database seeded successfully.");
    return result;
}


seedDb().then(r=>{
  console.log(r);
    console.log("Database seed result...");
    process.exit(0);
}).catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
}
);


