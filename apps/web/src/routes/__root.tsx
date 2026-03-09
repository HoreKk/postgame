import type { QueryClient } from "@tanstack/react-query";

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import type { orpc } from "@/utils/orpc";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/sections/Navbar";
import { Container } from "@chakra-ui/react";
import "@fontsource-variable/jetbrains-mono/index.css";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Postgame",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Provider>
          <Navbar />
          <Container maxW="container.lg" py={6}>
            <Outlet />
          </Container>
          {/* <TanStackDevtools
            config={{ position: "bottom-left", hideUntilHover: true }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtools />,
              },
            ]}
          /> */}
        </Provider>
        <Scripts />
      </body>
    </html>
  );
}
