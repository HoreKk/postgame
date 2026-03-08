import { createFileRoute } from "@tanstack/react-router";
import { getLeagues, getSchedule } from "@postgame/lol-client";
import { Image, Box, Card, Heading, Text, Flex, Grid, GridItem, Tag } from "@chakra-ui/react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: async ({ context }) => {
    const { lolClient } = context;

    try {
      const { data: leagues } = await getLeagues({
        client: lolClient,
        query: { hl: "en-US" },
      });

      if (!leagues) throw new Error("Failed to fetch leagues");

      const curatedLeagues = (leagues.data.leagues as any[]).filter(
        (league) => league.displayPriority?.position < 4,
      );

      if (!curatedLeagues) throw new Error("Failed to find leagues");

      const leagueId = curatedLeagues.map((league) => BigInt(league.id)) as unknown as number[];

      async function fetchAllPages(
        pageToken?: string,
      ): Promise<
        NonNullable<Awaited<ReturnType<typeof getSchedule>>["data"]>["data"]["schedule"]["events"]
      > {
        const { data } = await getSchedule({
          client: lolClient,
          query: {
            hl: "en-US",
            leagueId: leagueId.join(",") as unknown as number[],
            ...(pageToken && { pageToken }),
          },
        });
        if (!data) throw new Error("Failed to fetch schedule");
        const events = data.data.schedule.events;
        if (data.data.schedule.pages.newer) {
          const nextEvents = await fetchAllPages(data.data.schedule.pages.newer);
          events.push(...nextEvents);
        }
        return events;
      }

      const events = await fetchAllPages();

      const upcomingMatches = events.filter(
        (event) => event.state === "unstarted" || event.state === "inProgress",
      );

      return { leagues: leagues.data.leagues, upcomingMatches };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
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
            {league.toUpperCase()}
          </Tag.Root>
        ))}
      </Flex>
      <Grid templateColumns="repeat(3, minmax(300px, 1fr))" gap={4} mt={4}>
        {filteredMatches.map((match) => (
          <GridItem key={match.match.id}>
            <Card.Root overflow="hidden" h="full">
              <Card.Header alignItems="center">
                <Flex alignItems="center" gap="4">
                  <Image
                    src={match.match.teams[0].image}
                    alt={match.match.teams[0].name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="full"
                  />
                  <Text>vs</Text>
                  <Image
                    src={match.match.teams[1].image}
                    alt={match.match.teams[1].name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="full"
                  />
                </Flex>
              </Card.Header>
              <Card.Body gap="2">
                <Card.Title>
                  {match.match.teams[0].name} vs {match.match.teams[1].name}
                </Card.Title>
                <Card.Description>
                  Match starts at:{" "}
                  {Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(match.startTime))}
                </Card.Description>
                <Tag.Root size="sm" w="fit-content">
                  {match.league.slug}
                </Tag.Root>
              </Card.Body>
            </Card.Root>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
