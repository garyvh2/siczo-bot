import { Client, Message } from "discord.js";
import { player } from "../utils/broadcast";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  player.pause();

  const reaction = args.shift() === "no-reaction";
  if (!reaction) {
    message.channel.send(`⏸️ | La queue hay sido pausada.`);
  }
};
