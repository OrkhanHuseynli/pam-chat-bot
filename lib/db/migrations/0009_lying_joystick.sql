CREATE TABLE IF NOT EXISTS "EmbeddedItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"shortDescription" text NOT NULL,
	"metadata" json NOT NULL,
	"embedding" vector(1536),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "EmbeddedItems" USING hnsw ("embedding" vector_cosine_ops);