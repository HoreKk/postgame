import { auth } from "@postgame/auth";
import { createClient } from "@postgame/lol-client/client";

export async function createContext({ req }: { req: Request }) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const lolClient = createClient({
    baseUrl: "https://esports-api.lolesports.com/persisted/gw",
    headers: {
      "x-api-key": process.env.LOL_API_KEY!,
    },
  });

  return {
    session,
    lolClient,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
