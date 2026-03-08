import { createClient } from "@postgame/lol-client/client";

const createLolClient = () => {
  return createClient({
    baseUrl: "https://esports-api.lolesports.com/persisted/gw",
    headers: {
      "x-api-key": import.meta.env.VITE_LOL_API_KEY,
    },
  });
};

export const lolClient = createLolClient();
