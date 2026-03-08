import { Image, Card, Text, Flex, Tag, Icon, Status } from "@chakra-ui/react";
import { CalendarBlankIcon, MinusIcon } from "@phosphor-icons/react";
import type { ScheduleEvent } from "@/routes";

interface UpcomingMatchCardProps {
  match: ScheduleEvent;
}

interface TeamDisplayProps {
  team: ScheduleEvent["match"]["teams"][number];
  showResult: boolean;
  reverse?: boolean;
}

function TeamDisplay({ team, showResult, reverse = false }: TeamDisplayProps) {
  return (
    <Flex alignItems="center" gap={4} flexDir={reverse ? "row-reverse" : "row"}>
      <Image src={team.image} alt={team.name} boxSize="50px" />
      {team?.result && showResult && <Text fontSize="md">{team.result?.gameWins ?? 0}</Text>}
    </Flex>
  );
}

export function UpcomingMatchCard({ match }: UpcomingMatchCardProps) {
  const matchState =
    match.state === "unstarted"
      ? { text: "Upcoming", color: "gray" }
      : match.state === "inProgress"
        ? { text: "Live", color: "green" }
        : { text: "Finished", color: "red" };

  return (
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
      <Card.Header alignItems="center" py={12} position="relative">
        <Flex position="absolute" top={4} justifyContent="space-between" w="full" px={4}>
          <Tag.Root size="sm" colorPalette="primary">
            <Tag.Label>LoL</Tag.Label>
          </Tag.Root>
          <Status.Root colorPalette={matchState.color} size="lg">
            <Text fontSize="xs" opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
              {matchState.text}
            </Text>
            <Status.Indicator />
          </Status.Root>
        </Flex>
        <Flex alignItems="center" gap={3}>
          <TeamDisplay team={match.match.teams[0]} showResult={match.state !== "unstarted"} />
          <Icon asChild>
            <MinusIcon />
          </Icon>
          <TeamDisplay
            team={match.match.teams[1]}
            showResult={match.state !== "unstarted"}
            reverse
          />
        </Flex>
      </Card.Header>
      <Card.Body
        gap={2}
        borderTop="1px solid"
        borderColor={{ base: "border.emphasized", _dark: "border.inverted" }}
        py={4}
      >
        <Card.Title>{`${match.league.name} ${match.blockName}`}</Card.Title>
        <Card.Description>
          {match.match.teams[0].name} vs {match.match.teams[1].name}
        </Card.Description>
      </Card.Body>
      {match.state === "unstarted" && (
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
      )}
    </Card.Root>
  );
}
