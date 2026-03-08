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
  const { id } = Route.useParams();
  const event = Route.useLoaderData();

  return (
    <Box>
      <BreadcrumbRoot>
        <BreadcrumbLink outline="none" asChild>
          <Link to="/">Home</Link>
        </BreadcrumbLink>
        <BreadcrumbCurrentLink>Match {id}</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <Box mt={6} borderRadius="lg" overflow="hidden">
        <MatchHero teams={[event.match.teams[0], event.match.teams[1]]} state="completed" />
      </Box>
    </Box>
  );
}
