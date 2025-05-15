import { embed, embedMany } from "ai";
import { openai } from "./providers";
import type { IMetadata, IEmbeddedEntity } from "../db/models";
import { searchEntitiesByVector } from "../db/queries";
import type { EmbeddedData } from "../db/schema";

const embeddingModel = openai.embedding("text-embedding-3-large");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export async function embedDino(dino: IMetadata): Promise<number[]> {
  const json = JSON.stringify(dino);
  const { embedding } = await embed({
    model: embeddingModel,
    value: json,
  });
  return embedding;
}
export async function embedManyDino(dinos: IMetadata[]): Promise<number[][]> {
  const jsons = dinos.map((dino) => JSON.stringify(dino));
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: jsons,
  });
  return embeddings;
}

export async function embedDinoWithMetadata(
  dino: IMetadata
): Promise<IEmbeddedEntity> {
  const json = JSON.stringify(dino);
  const { embedding } = await embed({
    model: embeddingModel,
    value: json,
  });
  return { embedding, ...dino, id: dino.name };
}

export async function embedManyDinoWithMetadata(
  dinos: IMetadata[]
): Promise<IEmbeddedEntity[]> {
  const jsons = dinos.map((dino) => JSON.stringify(dino));
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: jsons,
  });
  return embeddings.map((embedding, i) => ({
    ...dinos[i],
    id: dinos[i].name,
    embedding,
  }));
}

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  let searchResult: any = [];
  try {
    searchResult = await searchEntitiesByVector(userQuery, 10);
  } catch (e) {
    console.error("Error during search from AI prompt", e);
  }
  // Flatten the array of arrays and remove duplicates based on 'name'
  const uniqueResults = Array.from(
    new Map(
      searchResult.flat().map((item: EmbeddedData) => [item?.name, item])
    ).values()
  );
  return uniqueResults;
};
