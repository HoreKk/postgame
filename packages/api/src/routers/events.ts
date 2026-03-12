import {
  type GetLeaguesResponses,
  type GetScheduleResponses,
  type Team,
  type Result,
  type Record as LolRecord,
  Outcome,
  getLeagues,
  getSchedule,
  getLive,
  getEventDetails,
  type GetEventDetailsResponses,
} from "@postgame/lol-client";
import { getColor } from "colorthief";
import z from "zod";

import { publicProcedure } from "../index";

export async function getDominantColor(url: string): Promise<string | null> {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  return (await getColor(buffer).catch(() => null))?.hex() ?? null;
}

// Custom types to work around missing/incorrect fields in the generated openapi spec
type RawLeague = GetLeaguesResponses[200]["data"]["leagues"][number];
export type League = RawLeague & {
  displayPriority: { position: number; status: string };
};

type RawScheduleEvent = GetScheduleResponses[200]["data"]["schedule"]["events"][number];
type ScheduleTeam = Team & {
  record: LolRecord;
  result: (Result & { outcome: Outcome | null }) | null;
};
export type ScheduleEvent = Omit<RawScheduleEvent, "match"> & {
  match: Omit<RawScheduleEvent["match"], "teams"> & { teams: (ScheduleTeam & { color: string })[] };
};

type RawDetailsEvent = GetEventDetailsResponses[200]["data"]["event"];
export type DetailsEvent = Omit<RawDetailsEvent, "match"> & {
  match: Omit<RawDetailsEvent["match"], "teams"> & {
    teams: (RawDetailsEvent["match"]["teams"][number] & { color: string })[];
  };
};

const FALLBACK_COLOR = "#718096";

export const eventsRouter = {
  getEvents: publicProcedure
    .input(
      z.object({
        type: z.enum(["upcoming", "past"]),
        limit: z.number().optional(),
      }),
    )
    .handler(
      async ({ input, context }): Promise<{ leagues: League[]; events: ScheduleEvent[] }> => {
        const { lolClient } = context;
        const { type, limit } = input;

        const { data: resultLeagues } = await getLeagues({
          client: lolClient,
          query: { hl: "en-US" },
        });

        if (!resultLeagues) throw new Error("Failed to fetch leagues");

        const leagues = resultLeagues.data.leagues as League[];
        const curatedLeagues = leagues.filter((league) => league.displayPriority?.position < 3);
        const leagueId = curatedLeagues.map((league) => league.id);

        const { data: scheduleData } = await getSchedule({
          client: lolClient,
          query: {
            hl: "en-US",
            leagueId: leagueId.join(",") as unknown as bigint[],
          },
        });

        if (!scheduleData) throw new Error("Failed to fetch schedule");

        let events = scheduleData.data.schedule.events as unknown as ScheduleEvent[];

        let filteredEvents: ScheduleEvent[];

        if (type === "upcoming") {
          const { data: liveSchedule } = await getLive({
            client: lolClient,
            query: { hl: "en-US" },
          });

          const liveEvents = liveSchedule?.data?.schedule?.events as unknown as ScheduleEvent[];

          if (liveEvents) {
            const curatedLeagueSlugs = new Set(curatedLeagues.map((league) => league.slug));
            events.unshift(
              ...liveEvents.filter((liveEvent) => curatedLeagueSlugs.has(liveEvent.league.slug)),
            );
          }

          filteredEvents = events
            .map((event) => ({
              ...event,
              state:
                event.match?.teams[0]?.result?.outcome === null &&
                new Date(event.startTime) <= new Date()
                  ? "inProgress"
                  : event.state,
            }))
            .filter(
              (event) =>
                (event.state === "unstarted" || event.state === "inProgress") &&
                event.type === "match",
            );
        } else {
          filteredEvents = events
            .filter((event) => event.state === "completed" && event.type === "match")
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        }

        if (limit) {
          filteredEvents = filteredEvents.slice(0, limit);
        }

        const uniqueImageUrls = [
          ...new Set(
            filteredEvents.flatMap(
              (event) =>
                event.match.teams.filter((team) => team.code !== "TBD").map((team) => team.image) ??
                [],
            ),
          ),
        ];

        const colorCache = new Map(
          await Promise.all(
            uniqueImageUrls.map(async (url) => {
              const color = (await getDominantColor(url)) ?? FALLBACK_COLOR;
              return [url, color] as const;
            }),
          ),
        );

        const result = filteredEvents.map((event) => ({
          ...event,
          match: {
            ...event.match,
            teams: event.match.teams.map((team) => ({
              ...team,
              color:
                team.code !== "TBD"
                  ? (colorCache.get(team.image) ?? FALLBACK_COLOR)
                  : FALLBACK_COLOR,
            })),
          },
        }));

        return { leagues, events: result };
      },
    ),

  getEventById: publicProcedure
    .input(z.string())
    .handler(async ({ input: id, context }): Promise<DetailsEvent> => {
      const { lolClient } = context;

      const { data: resultEvent } = await getEventDetails({
        client: lolClient,
        query: {
          hl: "en-US",
          id: id as unknown as bigint,
        },
      });

      if (!resultEvent) throw new Error(`No event found for ID ${id}`);

      const event = resultEvent.data.event as unknown as DetailsEvent;

      const uniqueImageUrls = [
        ...new Set(
          event.match.teams.filter((team) => team.code !== "TBD").map((team) => team.image),
        ),
      ];

      const colorCache = new Map(
        await Promise.all(
          uniqueImageUrls.map(async (url) => {
            const color = (await getDominantColor(url)) ?? FALLBACK_COLOR;
            return [url, color] as const;
          }),
        ),
      );

      event.match.teams = event.match.teams.map((team) => ({
        ...team,
        color:
          team.code !== "TBD" ? (colorCache.get(team.image) ?? FALLBACK_COLOR) : FALLBACK_COLOR,
      }));

      return event;
    }),
};
