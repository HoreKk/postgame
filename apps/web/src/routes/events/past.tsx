import { createFileRoute } from "@tanstack/react-router";
import EventCard from "@/components/cards/EventCard";
import { Heading, Grid, GridItem, Skeleton, Icon } from "@chakra-ui/react";
import { client, orpc } from "@/utils/orpc";
import { LeagueFilter } from "@/components/LeagueFilter";
import BaseContainer from "@/components/layouts/BaseContainer";
import { PaginationControl } from "@/components/Pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/empty-state";
import { EmptyIcon } from "@phosphor-icons/react";

const PAGE_SIZE = 9;

export const Route = createFileRoute("/events/past")({
  component: RouteComponent,
  loader: () => client.events.getEvents({ type: "past", page: 1, pageSize: PAGE_SIZE }),
});

function RouteComponent() {
  const initialData = Route.useLoaderData();
  const [page, setPage] = useState(1);
  const [selectedLeague, setSelectedLeague] = useState("all");

  const { data: dataPerPage, isFetching: isLoadingEvents } = useQuery({
    ...orpc.events.getEvents.queryOptions({ input: { type: "past", page, pageSize: PAGE_SIZE } }),
    enabled: page !== 1,
    staleTime: 5 * 60 * 1000,
  });

  const data = page !== 1 && dataPerPage ? dataPerPage : initialData;

  const defaultLeagues = ["all", ...initialData.leagues.map((league) => league.slug)];

  const filteredMatches = data.events.filter(
    (e) => selectedLeague === "all" || e.league.slug === selectedLeague,
  );

  const isLoading = isLoadingEvents;

  return (
    <BaseContainer>
      <Heading size="3xl" mb={2}>
        Past Matches
      </Heading>
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
        {filteredMatches.length === 0 ? (
          <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
            <EmptyState
              title="No past matches found"
              description="Try selecting a different league or check back later."
              icon={
                <Icon asChild>
                  <EmptyIcon />
                </Icon>
              }
            />
          </GridItem>
        ) : (
          filteredMatches.map((event) => (
            <GridItem key={event.match.id}>
              <Skeleton loading={isLoading}>
                <EventCard event={event} />
              </Skeleton>
            </GridItem>
          ))
        )}
      </Grid>
      <PaginationControl
        count={data.total}
        pageSize={PAGE_SIZE}
        page={page}
        onPageChange={setPage}
      />
    </BaseContainer>
  );
}
