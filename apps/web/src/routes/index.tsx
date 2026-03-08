import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  getLeagues,
  getLive,
  getSchedule,
  type GetLeaguesResponses,
  type GetScheduleResponses,
  type Result,
  type Outcome,
  type Record as LolRecord,
  type Team,
} from "@postgame/lol-client";
import { Box, Heading, Text, Flex, Grid, GridItem, Tag } from "@chakra-ui/react";
import { useState } from "react";
import { UpcomingMatchCard } from "@/components/cards/UpcomingMatchCard";
import { getColor } from "colorthief";
import system from "@/utils/chakra-theme";
import { lolClient } from "@/utils/lol-client";

async function getDominantColor(url: string): Promise<string | null> {
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

const getHomeData = createServerFn().handler(async () => {
  const { data: resultLeagues } = await getLeagues({
    client: lolClient,
    query: { hl: "en-US" },
  });

  if (!resultLeagues) throw new Error("Failed to fetch leagues");

  const leagues = resultLeagues.data.leagues as League[];

  const curatedLeagues = leagues.filter((league) => league.displayPriority?.position < 3);

  const leagueId = curatedLeagues.map((league) => league.id);

  async function fetchAllPages(pageToken?: string): Promise<ScheduleEvent[]> {
    const { data } = await getSchedule({
      client: lolClient,
      query: {
        hl: "en-US",
        leagueId: leagueId.join(",") as unknown as bigint[],
        ...(pageToken && { pageToken }),
      },
    });
    if (!data) throw new Error("Failed to fetch schedule");
    const events = data.data.schedule.events as unknown as ScheduleEvent[];
    if (data.data.schedule.pages.newer) {
      const nextEvents = await fetchAllPages(data.data.schedule.pages.newer);
      events.push(...nextEvents);
    }
    return events;
  }

  let events = await fetchAllPages();

  const { data: liveSchedule } = await getLive({
    client: lolClient,
    query: { hl: "en-US" },
  });

  const liveEvents = liveSchedule?.data?.schedule?.events as unknown as ScheduleEvent[];

  if (liveEvents) {
    const curatedLeagueSlugs = new Set(curatedLeagues.map((league) => league.slug));
    events.unshift(...liveEvents.filter((liveEvent) => curatedLeagueSlugs.has(liveEvent.league.slug)));
  }

  const filteredEvents = events
    .map((event) => ({
      ...event,
      state:
        event.match.teams[0]?.result?.outcome === null && new Date(event.startTime) <= new Date()
          ? "inProgress"
          : event.state,
    }))
    .filter((event) => event.state === "unstarted" || event.state === "inProgress");

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

  const upcomingMatches = filteredEvents.map((event) => ({
    ...event,
    match: {
      ...event.match,
      teams: event.match.teams.map((team) => ({
        ...team,
        color:
          team.code !== "TBD"
            ? (colorCache.get(team.image) ?? system.token("colors.gray.500"))
            : system.token("colors.gray.500"),
      })),
    },
  }));

  return { leagues, upcomingMatches };
});

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: () => getHomeData(),
});

function HomeComponent() {
  const { upcomingMatches } = Route.useLoaderData();

  const defaultLeagues = ["all", ...new Set(upcomingMatches.map((match) => match.league.slug))];

  const [sortedLeagues, setSortedLeagues] = useState(["all"]);

  const filteredMatches = sortedLeagues.includes("all")
    ? upcomingMatches
    : upcomingMatches.filter((match) => sortedLeagues.includes(match.league.slug));

  return (
    <Box>
      <Heading size="2xl">Upcoming Matches</Heading>
      <Flex gap="4" mt="4">
        <Text>Filter by League:</Text>
        {defaultLeagues.map((league) => (
          <Tag.Root
            key={league}
            cursor="pointer"
            colorPalette={sortedLeagues.includes(league) ? "primary" : "gray"}
            onClick={() =>
              setSortedLeagues((prev) => {
                if (league === "all") return ["all"];
                if (prev.includes("all")) return [league];
                if (prev.includes(league)) {
                  let prevFiltered = prev.filter((l) => l !== league);
                  return prevFiltered.length === 0 ? ["all"] : prevFiltered;
                }
                return [...prev, league];
              })
            }
          >
            <Tag.Label>
              {league
                .split("_")
                .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
                .join(" ")}
            </Tag.Label>
          </Tag.Root>
        ))}
      </Flex>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, minmax(300px, 1fr))",
          lg: "repeat(3, minmax(300px, 1fr))",
        }}
        gap={6}
        mt={4}
      >
        {filteredMatches.map((match) => (
          <GridItem key={match.match.id}>
            <UpcomingMatchCard match={match} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
