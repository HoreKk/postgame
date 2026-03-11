import { createFileRoute } from "@tanstack/react-router";
import { client } from "@/utils/orpc";
import { useState } from "react";
import EventCard from "@/components/cards/EventCard";
import { Heading, Grid, GridItem } from "@chakra-ui/react";
import { LeagueFilter } from "@/components/LeagueFilter";
import BaseContainer from "@/components/layouts/BaseContainer";

export const Route = createFileRoute("/events/upcoming")({
  component: RouteComponent,
  loader: () => client.events.getEvents({ type: "upcoming" }),
});

function RouteComponent() {
  const { events } = Route.useLoaderData();

  const defaultLeagues = ["all", ...new Set(events.map((event) => event.league.slug))];

  const [selectedLeague, setSelectedLeague] = useState("all");

  const filteredMatches =
    selectedLeague === "all" ? events : events.filter((e) => e.league.slug === selectedLeague);

  return (
    <BaseContainer>
      <Heading size="2xl">Upcoming Matches</Heading>
      <LeagueFilter
        leagues={defaultLeagues}
        selected={selectedLeague}
        onChange={setSelectedLeague}
      />
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
    </BaseContainer>
  );
}
