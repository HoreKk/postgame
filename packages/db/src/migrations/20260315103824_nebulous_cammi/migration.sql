CREATE TYPE "game_type" AS ENUM('lol');--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"series_id" text NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_user_series_unique" UNIQUE("user_id","series_id")
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" text PRIMARY KEY,
	"game_type" "game_type" NOT NULL,
	"external_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "series_game_type_external_id_unique" UNIQUE("game_type","external_id")
);
--> statement-breakpoint
CREATE TABLE "series_tag" (
	"series_id" text,
	"tag_id" text,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "series_tag_pkey" PRIMARY KEY("series_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL CONSTRAINT "tag_name_unique" UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "review_series_id_idx" ON "review" ("series_id");--> statement-breakpoint
CREATE INDEX "review_user_id_idx" ON "review" ("user_id");--> statement-breakpoint
CREATE INDEX "series_game_type_idx" ON "series" ("game_type");--> statement-breakpoint
CREATE INDEX "series_tag_tag_id_idx" ON "series_tag" ("tag_id");--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_series_id_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "series_tag" ADD CONSTRAINT "series_tag_series_id_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "series_tag" ADD CONSTRAINT "series_tag_tag_id_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "series_tag" ADD CONSTRAINT "series_tag_created_by_user_id_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE CASCADE;