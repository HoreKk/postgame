import { Box, Flex, Icon, Image, Status, Tag, Text } from "@chakra-ui/react";
import { MinusIcon } from "@phosphor-icons/react";

type MatchState = "unstarted" | "inProgress" | "completed";

interface TeamInfo {
  color: string;
  image: string;
  name: string;
  result?: { gameWins: number } | null;
}

interface MatchHeroProps {
  teams: [TeamInfo, TeamInfo];
  state: MatchState;
  py?: number | string;
}

const matchStateMap: Record<MatchState, { text: string; color: string }> = {
  unstarted: { text: "Upcoming", color: "gray" },
  inProgress: { text: "Live", color: "green" },
  completed: { text: "Finished", color: "red" },
};

function TeamDisplay({
  team,
  showResult,
  reverse = false,
}: {
  team: TeamInfo;
  showResult: boolean;
  reverse?: boolean;
}) {
  return (
    <Flex alignItems="center" gap={4} flexDir={reverse ? "row-reverse" : "row"}>
      <Image src={team.image} alt={team.name} boxSize="50px" />
      {team?.result && showResult && <Text fontSize="md">{team.result?.gameWins ?? 0}</Text>}
    </Flex>
  );
}

export function MatchHero({ teams, state, py = 12 }: MatchHeroProps) {
  const [team1, team2] = teams;
  const matchState = matchStateMap[state];

  return (
    <Box
      alignItems="center"
      py={py}
      position="relative"
      display="flex"
      justifyContent="center"
      style={{
        background: `linear-gradient(135deg, ${team1.color}99 0%, ${team1.color}00 65%), linear-gradient(315deg, ${team2.color}99 0%, ${team2.color}00 65%)`,
      }}
    >
      <Flex position="absolute" top={4} justifyContent="space-between" w="full" px={4}>
        <Tag.Root size="sm">
          <Tag.Label>LoL</Tag.Label>
        </Tag.Root>
        {state !== "completed" && (
          <Status.Root colorPalette={matchState.color} size="lg">
            <Text fontSize="xs" opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
              {matchState.text}
            </Text>
            <Status.Indicator />
          </Status.Root>
        )}
      </Flex>
      <Flex alignItems="center" gap={3}>
        <TeamDisplay team={team1} showResult={state !== "unstarted"} />
        <Icon asChild>
          <MinusIcon />
        </Icon>
        <TeamDisplay team={team2} showResult={state !== "unstarted"} reverse />
      </Flex>
    </Box>
  );
}
