import { Client, Message } from "discord.js";
import { Queue } from "../utils/queue";
import { get, remove } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  /**
   * If there is no Queue, define one
   */
  const queue: Queue | null = get();

  if (queue) {
    /**
     * Skip the song
     */
    queue.skip();
  } else {
    message.channel.send(`☠️ | No hay una cola activa.`)
  }
};