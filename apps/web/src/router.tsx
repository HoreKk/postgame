import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { orpc, queryClient } from "./utils/orpc";
import DefaultError from "./components/sections/DefaultError";
import { RouterLoader } from "@/components/RouterLoader";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    defaultViewTransition: true,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient },
    defaultPendingComponent: () => <RouterLoader />,
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
