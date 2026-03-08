import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import EventCard from "@/components/cards/EventCard";
import { client } from "@/utils/orpc";
import { ArrowRightIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: async () => {
    const [{ events: upcomingEvents }, { events: pastEvents }] = await Promise.all([
      client.events.getEvents({ type: "upcoming", limit: 3 }),
      client.events.getEvents({ type: "past", limit: 3 }),
    ]);

    return { upcomingEvents, pastEvents };
  },
});

function HomeComponent() {
  const { upcomingEvents, pastEvents } = Route.useLoaderData();

  return (
    <Box>
      <Flex flexDir="column" gap={10}>
        <Box>
          <Flex justify="space-between" align="end">
            <Heading size="2xl">Upcoming Matches</Heading>
            <ChakraLink colorPalette="primary" outline="none" asChild>
              <Link to="/events/upcoming">
                <Flex align="center" gap={1} className="group">
                  <Text fontWeight="bold">View All</Text>
                  <Icon>
                    <ArrowRightIcon weight="bold" />
                  </Icon>
                </Flex>
              </Link>
            </ChakraLink>
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
            {upcomingEvents.map((event) => (
              <GridItem key={event.match.id}>
                <EventCard event={event} />
              </GridItem>
            ))}
          </Grid>
        </Box>
        <Box>
          <Flex justify="space-between" align="end">
            <Heading size="2xl">Past Matches</Heading>
            <ChakraLink colorPalette="primary" outline="none" asChild>
              <Link to="/events/past">
                <Flex align="center" gap={1} className="group">
                  <Text fontWeight="bold">View All</Text>
                  <Icon>
                    <ArrowRightIcon weight="bold" />
                  </Icon>
                </Flex>
              </Link>
            </ChakraLink>
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
            {pastEvents.map((event) => (
              <GridItem key={event.match.id}>
                <EventCard event={event} />
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}
