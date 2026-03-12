import { Box, Icon } from "@chakra-ui/react";
import { EmptyState } from "./ui/empty-state";
import { SpinnerGapIcon } from "@phosphor-icons/react";

export function RouterLoader() {
  return (
    <Box position="fixed" top={12} left={0} right={0} zIndex="toast" h="3px" bg="transparent">
      <Box
        h="full"
        bg="primary.solid"
        style={{ animation: "router-progress 1.5s ease-in-out infinite" }}
      />
      <EmptyState
        title="Loading..."
        icon={
          <Icon animation="spin 1.25s linear infinite" asChild>
            <SpinnerGapIcon weight="light" />
          </Icon>
        }
      />
      <style>{`
        @keyframes router-progress {
          0% { width: 0%; opacity: 1; }
          80% { width: 90%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </Box>
  );
}
