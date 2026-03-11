import { Container } from "@chakra-ui/react";

const BaseContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container maxW="container.lg" py={6}>
      {children}
    </Container>
  );
};

export default BaseContainer;
