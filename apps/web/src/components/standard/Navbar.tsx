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
import { ColorModeButton } from "../ui/color-mode";
import { FlagBannerFoldIcon } from "@phosphor-icons/react";
import { Link, type LinkOptions } from "@tanstack/react-router";

type NavLinkProps = {
  to: LinkOptions["to"];
  children: React.ReactNode;
};

const NavLink = ({ to, children }: NavLinkProps) => {
  return (
    <Link key={`${to}-${children?.toString()}`} to={to}>
      {({ isActive }) => (
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
      )}
    </Link>
  );
};

const Navbar = () => {
  return (
    <Flex
      position="sticky"
      top={0}
      borderBottomWidth="1px"
      bgColor="bg.panel"
      borderColor="secondary.bg"
      backdropFilter="blur(8px)"
    >
      <Container py={4.5}>
        <Flex as="nav" align="center" justify="space-between">
          <Link to="/">
            <Flex align="center" gap={2}>
              <Icon boxSize={8} fontStyle="bold" color="primary.solid">
                <FlagBannerFoldIcon weight="fill" />
              </Icon>
              <Heading as="h1" size="lg">
                Post-game
              </Heading>
              <Kbd fontSize="xs" color="secondary.fg" mt={1}>
                v0
              </Kbd>
            </Flex>
          </Link>
          <AbsoluteCenter>
            <Flex align="center" gap={5}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/lists">Lists</NavLink>
            </Flex>
          </AbsoluteCenter>
          <Flex>
            <ColorModeButton />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Navbar;
