import {
  Client,
  Intents,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
  UserResolvable,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Utils
 */
import { setPresence } from "./utils/presence";
import { reactionsManager } from "./utils/reactions";

const prefix = process.env.PREFIX;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.login(process.env.TOKEN);

client.on("error", (error: Error) => console.log(error));

client.on("ready", () => {
  console.log("Online! 💖");
  setPresence(client);
});

client.on("messageCreate", async (message: Message) => {
  if (message.content.startsWith(`${prefix}`)) {
    console.log(
      `${message?.guild?.toString()}:` +
        ` ${message?.channel?.toString()}:` +
        ` ${message?.author?.username}: ` +
        message.content
    );

    let [command, ...args] = message.content
      .slice(prefix?.length)
      .trim()
      .split(/ +/g);

    /**
     * Skip bot messages
     */
    if (message.author.bot) return;

    await message.delete();

    try {
      const { run } = await import(`./commands/${command}`);
      run(client, message, args);
    } catch (error) {
      console.log(error);
    }
  }
});

client.on(
  "messageReactionAdd",
  async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.users.cache.has(client.user?.id ?? "")) {
      /**
       * Skip bot messages
       */
      if (user.bot) return;

      await reaction.users.remove(user as UserResolvable);
      
      await reactionsManager(reaction);
    }
  }
);
