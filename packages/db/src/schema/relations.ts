import { defineRelations } from "drizzle-orm";
import * as schema from ".";

export const relations = defineRelations(schema, (r) => ({
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  user: {
    accounts: r.many.account(),
    sessions: r.many.session(),
    reviews: r.many.review(),
    seriesTags: r.many.seriesTag(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  series: {
    reviews: r.many.review(),
    seriesTags: r.many.seriesTag(),
  },
  review: {
    user: r.one.user({
      from: r.review.userId,
      to: r.user.id,
    }),
    series: r.one.series({
      from: r.review.seriesId,
      to: r.series.id,
    }),
  },
  tag: {
    seriesTags: r.many.seriesTag(),
  },
  seriesTag: {
    series: r.one.series({
      from: r.seriesTag.seriesId,
      to: r.series.id,
    }),
    tag: r.one.tag({
      from: r.seriesTag.tagId,
      to: r.tag.id,
    }),
    createdBy: r.one.user({
      from: r.seriesTag.createdByUserId,
      to: r.user.id,
    }),
  },
}));
