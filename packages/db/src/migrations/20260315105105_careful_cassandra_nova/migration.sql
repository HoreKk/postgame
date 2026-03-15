ALTER INDEX "series_game_type_idx" RENAME TO "series_external_id_idx";--> statement-breakpoint
DROP INDEX "series_external_id_idx";--> statement-breakpoint
CREATE INDEX "series_external_id_idx" ON "series" ("external_id");