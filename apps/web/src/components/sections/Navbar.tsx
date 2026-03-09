import { Box, Container, Flex, Heading, Icon, Kbd } from "@chakra-ui/react";
import { FlagBannerFoldIcon } from "@phosphor-icons/react";
import { Link, useLocation, type LinkProps } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

type NavLink = {
  value: string;
  to: LinkProps["to"];
  startWith?: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { value: "matches", to: "/", startWith: "/events", label: "Matches" },
  { value: "lists", to: "/lists", label: "Lists" },
];

const Navbar = () => {
  const location = useLocation();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const activeIndex = useMemo(
    () =>
      NAV_LINKS.findIndex(({ to, startWith }) =>
        startWith
          ? location.pathname === to || location.pathname.startsWith(startWith)
          : location.pathname === to,
      ),
    [location.pathname],
  );

  useEffect(() => {
    const update = () => {
      const el = itemRefs.current[activeIndex];
      const list = listRef.current;
      if (!el || !list) return;
      const listRect = list.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({ left: elRect.left - listRect.left, width: elRect.width });
    };

    update();
    const observer = new ResizeObserver(update);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    <Flex
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottomWidth={1}
      bgColor="bg.panel/80"
      backdropFilter="blur(10px)"
    >
      <Container fluid>
        <Flex align="center" justify="space-between">
          <Link to="/">
            <Flex align="center" gap={2} py={3}>
              <Icon boxSize={6} color="primary.solid">
                <FlagBannerFoldIcon weight="fill" />
              </Icon>
              <Heading as="h1" size="sm" letterSpacing="tight">
                Post-game
              </Heading>
              <Kbd fontSize="xs" color="fg.subtle">
                v0
              </Kbd>
            </Flex>
          </Link>
          <Flex ref={listRef} align="center" gap={4} position="relative" pb={0.5}>
            {NAV_LINKS.map(({ value, to, label }, i) => {
              const isActive = i === activeIndex;
              return (
                <Link key={value} to={to}>
                  <Box
                    ref={(el: HTMLSpanElement | null) => (itemRefs.current[i] = el)}
                    as="span"
                    fontSize="sm"
                    fontWeight={isActive ? "semibold" : "medium"}
                    color={isActive ? "fg" : "fg.muted"}
                    _hover={{ color: "fg" }}
                    transition="color 0.2s"
                  >
                    {label}
                  </Box>
                </Link>
              );
            })}
            <Box
              position="absolute"
              bottom={0}
              h="2px"
              bgColor="primary.solid"
              borderRadius="sm"
              transition="left 0.25s ease, width 0.25s ease, opacity 0.2s"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.width === 0 ? 0 : 1,
              }}
            />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Navbar;
