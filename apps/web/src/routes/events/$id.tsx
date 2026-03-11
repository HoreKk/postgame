import { BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { MatchHero } from "@/components/MatchHero";
import { Box, BreadcrumbCurrentLink, BreadcrumbLink } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { client } from "@/utils/orpc";

export const Route = createFileRoute("/events/$id")({
  component: RouteComponent,
  loader: ({ params }) => client.events.getEventById(params.id),
});

function RouteComponent() {
  const event = Route.useLoaderData();

  const matchName = `${event.match.teams[0].name} vs ${event.match.teams[1].name}`;

  return (
    <Box>
      <Box position="relative">
        <BreadcrumbRoot
          position="absolute"
          top={4}
          left={4}
          zIndex={1}
          bg="bg.surface"
          borderRadius="md"
          px={3}
          py={1}
        >
          <BreadcrumbLink outline="none" asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
          <BreadcrumbCurrentLink>{matchName}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
        <MatchHero
          teams={[event.match.teams[0], event.match.teams[1]]}
          state="completed"
          size="lg"
        />
      </Box>
    </Box>
  );
}
