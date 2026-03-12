import { Flex, Tag, Text } from "@chakra-ui/react";

interface LeagueFilterProps {
  leagues: string[];
  selected: string;
  onChange: (selected: string) => void;
}

export function LeagueFilter({ leagues, selected, onChange }: LeagueFilterProps) {
  return (
    <Flex gap={4}>
      <Text fontSize="sm" whiteSpace="nowrap" flexShrink={0}>
        By League :
      </Text>
      <Flex
        align="center"
        overflowX="auto"
        gap={4}
        css={{ "&::-webkit-scrollbar": { display: "none" } }}
        mr="1px"
      >
        {leagues.map((league) => (
          <Tag.Root
            key={league}
            cursor="pointer"
            colorPalette={selected === league ? "primary" : "gray"}
            onClick={() => onChange(league)}
          >
            <Tag.Label>
              {league
                .split("_")
                .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
                .join(" ")}
            </Tag.Label>
          </Tag.Root>
        ))}
      </Flex>
    </Flex>
  );
}
