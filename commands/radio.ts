import { Client, Message } from "discord.js";
import { Queue } from "../utils/queue";
import { set } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  const queue = set(new Queue(message));
  queue?.radio(args.shift() ?? "");
};
