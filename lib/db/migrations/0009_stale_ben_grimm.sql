CREATE TABLE IF NOT EXISTS "Dinosaurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"diet" text NOT NULL,
	"habitat" text NOT NULL,
	"image" text,
	"embedding" vector(1536),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "Dinosaurs" USING hnsw ("embedding" vector_cosine_ops);