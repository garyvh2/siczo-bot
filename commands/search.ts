import { Client, Message } from "discord.js";
import { Queue } from "../utils/queue";
import { get, set } from "./play";

const yts = require("yt-search");

export const run = async (_: Client, message: Message, args: Array<string>) => {
  /**
   * If there is no Queue, define one
   */
  const { videos } = await yts(args.join(" "));

  message.channel.send(`🔎 | Buscando ${args.join(" ")}.`);

  let queue = get();
  if (!queue) {
    queue = set(new Queue(message));
  } 

  if (videos.length > 0) {
    queue?.add(videos?.[0]?.url);
  } else {
    message.channel.send(`❌ | No se encontro ningun resultado.`);
  }
};