import { BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { MatchHero } from "@/components/MatchHero";
import { lolClient } from "@/utils/lol-client";
import { Box, BreadcrumbCurrentLink, BreadcrumbLink } from "@chakra-ui/react";
import { getEventDetails } from "@postgame/lol-client";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getDominantColor, type ScheduleEvent } from "@/functions/get-events";
import system from "@/utils/chakra-theme";

const getMatchData = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const { data: resultEvent } = await getEventDetails({
      client: lolClient,
      query: {
        hl: "en-US",
        id: id as unknown as bigint,
      },
    });

    if (!resultEvent) throw new Error(`No event found for ID ${id}`);

    let event = resultEvent.data.event as unknown as ScheduleEvent;

    const uniqueImageUrls = [
      ...new Set(event.match.teams.filter((team) => team.code !== "TBD").map((team) => team.image)),
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

    event.match.teams.forEach((team, index) => {
      event.match.teams[index] = {
        ...team,
        color: team.code !== "TBD" ? (colorCache.get(team.image) ?? fallbackColor) : fallbackColor,
      };
    });

    return event;
  });

export const Route = createFileRoute("/events/$id")({
  component: RouteComponent,
  loader: ({ params }) => getMatchData({ data: params.id }),
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
