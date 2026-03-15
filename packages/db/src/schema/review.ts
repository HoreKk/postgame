import {
  pgTable,
  pgEnum,
  text,
  smallint,
  timestamp,
  index,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { user } from "./auth";

export const gameTypeEnum = pgEnum("game_type", ["lol"]);

export const series = pgTable(
  "series",
  {
    id: text().primaryKey(),
    gameType: gameTypeEnum("game_type").notNull(),
    externalId: text("external_id").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    unique("series_game_type_external_id_unique").on(table.gameType, table.externalId),
    index("series_game_type_idx").using("btree", table.gameType.asc().nullsLast()),
  ],
);

export const review = pgTable(
  "review",
  {
    id: text().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    seriesId: text("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    rating: smallint().notNull(),
    comment: text(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    unique("review_user_series_unique").on(table.userId, table.seriesId),
    index("review_series_id_idx").using("btree", table.seriesId.asc().nullsLast()),
    index("review_user_id_idx").using("btree", table.userId.asc().nullsLast()),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique("tag_name_unique").on(table.name)],
);

// Tags are shared at the series level — any user can add a tag to a series,
// visible to all. createdByUserId tracks who first associated a tag with a series.
export const seriesTag = pgTable(
  "series_tag",
  {
    seriesId: text("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.seriesId, table.tagId] }),
    index("series_tag_tag_id_idx").using("btree", table.tagId.asc().nullsLast()),
  ],
);
