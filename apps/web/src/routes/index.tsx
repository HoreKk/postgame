import { createFileRoute } from "@tanstack/react-router";
import { getLeagues, getSchedule } from "@postgame/lol-client";
import { Image, Box, Card, Heading, Text, Flex, Grid, GridItem, Tag, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { CalendarBlankIcon } from "@phosphor-icons/react";

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
            <Card.Root
              overflow="hidden"
              h="full"
              shadow="md"
              _hover={{
                shadow: "lg",
                transform: "translateY(-1px)",
                borderColor: "border.emphasized",
              }}
              transition="all 0.2s"
            >
              <Card.Header alignItems="center" py={12}>
                <Flex position="absolute" top={4} justifyContent="space-between" w="full" px={4}>
                  <Tag.Root size="sm">
                    <Tag.Label>LoL</Tag.Label>
                  </Tag.Root>
                  <Tag.Root size="sm">
                    <Tag.Label>{match.league.name}</Tag.Label>
                  </Tag.Root>
                </Flex>
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
              <Card.Body gap={2} borderTop="1px solid" borderColor="gray.200">
                <Card.Title>{`${match.league.name} ${match.blockName}`}</Card.Title>
                <Card.Description>
                  {match.match.teams[0].name} vs {match.match.teams[1].name}
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="end">
                <Tag.Root size="sm">
                  <Icon size="xs" mr={1} asChild>
                    <CalendarBlankIcon />
                  </Icon>
                  <Tag.Label>
                    {Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(match.startTime))}
                  </Tag.Label>
                </Tag.Root>
              </Card.Footer>
            </Card.Root>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
