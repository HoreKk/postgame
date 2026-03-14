import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { orpc } from "@/utils/orpc";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/sections/Navbar";
import "@fontsource-variable/jetbrains-mono/index.css";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@postgame/auth";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return session;
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
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
          <Outlet />
        </Provider>
        <Scripts />
      </body>
    </html>
  );
}
