import Discord from "discord.js";

export const setPresence = (client: NonNullable<Discord.Client>) =>
  client?.user?.setPresence({
    status: "online",
    activities: [
      // {
      //   name: "Mimir 😴",
      //   url: "https://www.baxter.com/",
      //   type: "PLAYING",
      // },
      {
        name: "BAXTER 👷",
        url: "https://www.baxter.com/",
        type: "COMPETING",
      },
    ],
  });
