import {
  AbsoluteCenter,
  Container,
  Flex,
  Heading,
  Icon,
  Kbd,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import { FlagBannerFoldIcon } from "@phosphor-icons/react";
import { Link, useLocation, type LinkOptions } from "@tanstack/react-router";

type NavLinkProps = {
  to: LinkOptions["to"];
  startWith?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavLink = ({ to, children, startWith, onClick }: NavLinkProps) => {
  const location = useLocation();
  return (
    <Link key={`${to}-${children?.toString()}`} to={to} onClick={onClick}>
      {({ isActive }) => {
        if (startWith && !isActive) {
          isActive = location.pathname.startsWith(startWith);
        }
        return (
          <Flex direction="column" align="center" gap={0.5}>
            <ChakraLink
              outline="none"
              _hover={{ textDecor: "none" }}
              fontWeight={isActive ? "bold" : "medium"}
              pt={0.5}
              asChild
            >
              <span>{children}</span>
            </ChakraLink>
            <Box
              w="95%"
              h="1.5px"
              transition="background-color 0.2s"
              bgColor={isActive ? "primary.solid" : "transparent"}
            />
          </Flex>
        );
      }}
    </Link>
  );
};

const Navbar = () => {
  return (
    <>
      <Flex position="sticky" top={0} zIndex={10}>
        <Container py={{ base: 8, md: 3 }} fluid>
          <Flex
            justify="end"
            borderWidth={1}
            py={4}
            px={6}
            borderRadius="lg"
            bgColor="bg.panel/60"
            backdropFilter="blur(8px)"
            shadow="sm"
            hideBelow="md"
          >
            <Flex align="center" gap={5}>
              <NavLink to="/" startWith="/events">
                Matches
              </NavLink>
              <NavLink to="/lists">Lists</NavLink>
            </Flex>
          </Flex>
          <AbsoluteCenter
            bgColor="bg.panel"
            borderWidth={1}
            borderColor="primary.solid/20"
            shadow="sm"
            px={4}
            py={2}
            mt={{ base: 2, md: 0 }}
            borderRadius="full"
            _hover={{
              shadow: "md",
              borderColor: "primary.solid/50",
              transition: "all 0.2s",
            }}
          >
            <Link to="/">
              <Flex align="center" gap={2}>
                <Icon boxSize={7} fontStyle="bold" color="primary.solid">
                  <FlagBannerFoldIcon weight="fill" />
                </Icon>
                <Heading as="h1" size="md">
                  Post-game
                </Heading>
                <Kbd fontSize="xs" color="secondary.fg" mt={1}>
                  v0
                </Kbd>
              </Flex>
            </Link>
          </AbsoluteCenter>
        </Container>
      </Flex>
      <Box
        position="fixed"
        bottom={6}
        right={6}
        px={4}
        py={2}
        borderWidth={1}
        zIndex={20}
        display={{ base: "block", md: "none" }}
        borderRadius="lg"
        bgColor="bg.panel/60"
        backdropFilter="blur(8px)"
        shadow="sm"
      >
        <Flex justify="end" gap={5}>
          <NavLink to="/" startWith="/events">
            Matches
          </NavLink>
          <NavLink to="/lists">Lists</NavLink>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
