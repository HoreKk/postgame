import { Box, Flex, Icon, Image, Status, Text } from "@chakra-ui/react";
import { MinusIcon } from "@phosphor-icons/react";
import type { DetailsEvent, ScheduleEvent } from "@postgame/api/routers/events";

type MatchState = "unstarted" | "inProgress" | "completed";

const matchStateMap: Record<MatchState, { text: string; color: string }> = {
  unstarted: { text: "Upcoming", color: "gray" },
  inProgress: { text: "Live", color: "green" },
  completed: { text: "Finished", color: "red" },
};

interface MatchHeroProps {
  teams: [
    (DetailsEvent | ScheduleEvent)["match"]["teams"][number],
    (DetailsEvent | ScheduleEvent)["match"]["teams"][number],
  ];
  state: MatchState;
  size?: "md" | "lg";
}

export function MatchHero({ teams, state, size = "md" }: MatchHeroProps) {
  const [team1, team2] = teams;
  const matchState = matchStateMap[state];

  const isMd = size === "md";

  return (
    <Box
      alignItems="center"
      py={isMd ? 12 : 16}
      position="relative"
      display="flex"
      justifyContent="center"
      style={{
        background: `linear-gradient(135deg, ${team1.color}99 0%, ${team1.color}00 65%), linear-gradient(315deg, ${team2.color}99 0%, ${team2.color}00 65%)`,
      }}
    >
      <Flex position="absolute" top={4} justifyContent="end" w="full" px={4}>
        {state !== "completed" && (
          <Status.Root colorPalette={matchState.color} size="lg">
            <Text fontSize="xs" opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
              {matchState.text}
            </Text>
            <Status.Indicator />
          </Status.Root>
        )}
      </Flex>
      <Flex alignItems="center" gap={state === "unstarted" ? 4 : 3}>
        <Flex alignItems="center" gap={4}>
          <Image src={team1.image} alt={team1.name} boxSize="50px" />
          {team1?.result && state !== "unstarted" && (
            <Text fontSize={`${isMd ? 2 : 4}xl`} fontWeight="bold">
              {team1.result?.gameWins ?? 0}
            </Text>
          )}
        </Flex>
        <Flex flexDir="column" alignItems="center" gap={1}>
          <Icon color="fg.muted" asChild>
            <MinusIcon weight="bold" />
          </Icon>
        </Flex>
        <Flex alignItems="center" gap={4}>
          {team2?.result && state !== "unstarted" && (
            <Text fontSize={`${isMd ? 2 : 4}xl`} fontWeight="bold">
              {team2.result?.gameWins ?? 0}
            </Text>
          )}
          <Image src={team2.image} alt={team2.name} boxSize="50px" />
        </Flex>
      </Flex>
    </Box>
  );
}
