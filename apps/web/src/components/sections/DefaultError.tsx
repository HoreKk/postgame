import { Button, ButtonGroup, EmptyState, Icon, VStack } from "@chakra-ui/react";
import { BugIcon } from "@phosphor-icons/react";

const DefaultError = ({ error, navigateHome }: { error: Error; navigateHome: () => void }) => {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <Icon boxSize={12} color="fg.error">
            <BugIcon />
          </Icon>
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{error.name}</EmptyState.Title>
          <EmptyState.Description>{error.message}</EmptyState.Description>
        </VStack>
        <ButtonGroup>
          <Button colorPalette="primary" onClick={navigateHome}>
            Go Home
          </Button>
        </ButtonGroup>
      </EmptyState.Content>
    </EmptyState.Root>
  );
};

export default DefaultError;
