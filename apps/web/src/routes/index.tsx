import { createFileRoute } from "@tanstack/react-router";
import { Box, Button, Heading } from "@chakra-ui/react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <Box>
      <Heading>Home</Heading>
      <Button colorPalette="primary">Click Me</Button>
    </Box>
  );
}
