import { lolClient } from "@/utils/lol-client";
import { system } from "@chakra-ui/react/preset";
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
} from "@postgame/lol-client";
import { createServerFn } from "@tanstack/react-start";
import { getColor } from "colorthief";
import z from "zod";

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

export const getEvents = createServerFn()
  .inputValidator(
    z.object({
      type: z.enum(["upcoming", "past"]),
      limit: z.number().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { type, limit } = data;

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
            event.match.teams[0]?.result?.outcome === null &&
            new Date(event.startTime) <= new Date()
              ? "inProgress"
              : event.state,
        }))
        .filter((event) => event.state === "unstarted" || event.state === "inProgress");
    } else {
      filteredEvents = events
        .filter((event) => event.state === "completed")
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    }

    const uniqueImageUrls = [
      ...new Set(
        filteredEvents.flatMap((event) =>
          event.match.teams.filter((team) => team.code !== "TBD").map((team) => team.image),
        ),
      ),
    ];

    const colorCache = new Map(
      await Promise.all(
        uniqueImageUrls.map(async (url) => {
          const color = (await getDominantColor(url)) ?? system.token("colors.gray.500");
          return [url, color] as const;
        }),
      ),
    );

    const fallbackColor = system.token("colors.gray.500");

    let result = filteredEvents.map((event) => ({
      ...event,
      match: {
        ...event.match,
        teams: event.match.teams.map((team) => ({
          ...team,
          color:
            team.code !== "TBD" ? (colorCache.get(team.image) ?? fallbackColor) : fallbackColor,
        })),
      },
    }));

    if (limit) {
      result = result.slice(0, limit);
    }

    return { leagues, events: result };
  });
