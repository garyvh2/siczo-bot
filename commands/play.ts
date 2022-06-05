
import { Client, Message } from "discord.js";
import { joinVoice } from "../utils/broadcast";
import { Queue } from "../utils/queue";

let queue: Queue | null;

export const run = async (_: Client, message: Message, args: Array<string>) => {
  /**
   * If there is no Queue, define one
   */
  if (!queue) {
    queue = new Queue(message);
  }

  /**
   * Get the song name
   */
  const song = (args.shift() ?? "").trim();

  if (song) {
    queue.add(song);
  } else {
    joinVoice(message);
    queue.play()
  }
};

export const get = () => queue;
export const set = (_: Queue) => {
  queue = _;
  return queue;
};
export const remove = () => queue = null;