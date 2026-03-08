import type { ScheduleEvent } from "@postgame/api/routers/events";
import { MatchHero } from "@/components/MatchHero";
import { Card, Tag, Icon } from "@chakra-ui/react";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

interface EventCardProps {
  event: ScheduleEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link to="/events/$id" params={{ id: event.match.id }} style={{ textDecoration: "none" }}>
      <Card.Root
        overflow="hidden"
        h="full"
        shadow="md"
        className="group"
        _hover={{
          shadow: "lg",
          transform: "translateY(-1px)",
          borderColor: "border.emphasized",
        }}
        transition="all 0.2s"
      >
        <MatchHero
          teams={[event.match.teams[0], event.match.teams[1]]}
          state={event.state as "unstarted" | "inProgress" | "completed"}
        />
        <Card.Body
          gap={2}
          borderTop="1px solid"
          borderColor={{ base: "border.emphasized", _dark: "border.inverted" }}
          py={4}
        >
          <Card.Title>{`${event.league.name} ${event.blockName}`}</Card.Title>
          <Card.Description>
            {event.match.teams[0].name} vs {event.match.teams[1].name}
          </Card.Description>
        </Card.Body>
        {event.state === "unstarted" && (
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
                }).format(new Date(event.startTime))}
              </Tag.Label>
            </Tag.Root>
          </Card.Footer>
        )}
      </Card.Root>
    </Link>
  );
}
