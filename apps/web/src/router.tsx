import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { orpc, queryClient } from "./utils/orpc";
import { createClient } from "@postgame/lol-client/client";
import DefaultError from "./components/sections/DefaultError";

export const getRouter = () => {
  const lolClient = createClient({
    baseUrl: "https://esports-api.lolesports.com/persisted/gw",
    headers: {
      "x-api-key": process.env.VITE_LOL_API_KEY,
    },
  });

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient, lolClient },
    defaultPendingComponent: () => <div>Loading...</div>,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    defaultErrorComponent: ({ error }) => (
      <DefaultError error={error} navigateHome={() => router.navigate({ to: "/" })} />
    ),
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
