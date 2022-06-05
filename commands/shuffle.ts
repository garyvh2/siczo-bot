import { Client, Message } from "discord.js";
import { get } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  const queue = get();
  queue?.shuffle();
};
