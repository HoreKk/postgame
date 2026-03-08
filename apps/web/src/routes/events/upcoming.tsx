import { createFileRoute } from "@tanstack/react-router";
import { getEvents } from "@/functions/get-events";
import { useMemo, useState } from "react";
import EventCard from "@/components/cards/EventCard";
import { Box, Heading, Flex, Tag, Grid, GridItem, Text } from "@chakra-ui/react";

export const Route = createFileRoute("/events/upcoming")({
  component: RouteComponent,
  loader: () => getEvents({ data: { type: "upcoming" } }),
});

function RouteComponent() {
  const { events } = Route.useLoaderData();

  const defaultLeagues = ["all", ...new Set(events.map((event) => event.league.slug))];

  const [sortedLeagues, setSortedLeagues] = useState(["all"]);

  const filteredMatches = useMemo(() => {
    if (sortedLeagues.includes("all")) return events;
    return events.filter((event) => sortedLeagues.includes(event.league.slug));
  }, [sortedLeagues, events]);

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
        {filteredMatches.map((event) => (
          <GridItem key={event.match.id}>
            <EventCard event={event} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
