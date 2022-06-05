import { Client, Emoji, Message } from "discord.js";
import { Queue } from "../utils/queue";
import { get } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  /**
   * If there is no Queue, define one
   */
  const queue: Queue | null = get();

  if (queue) {
    /**
     * Remove the song
     */
    let text = "```📚 | Cola de reproduccion\n";
    text += `Status: ${queue.isPlaying ? "▶️" : "⏸"} - Loop: ${queue.isLoop ? "🔂" : queue.isLoopQueue ? "🔁" : "💠"}\n`;
    queue.items.forEach(({ title }, index) => {
      const current = queue.playingIndex === index;
      text += `${current ? "*" : ""} ${index + 1}. ${title.slice(0, 20)}\n`;
    });
    text += "```";

    const queueMessage = await message.channel.send(text);
    await Promise.all([
      queueMessage.react("⏮"),
      queueMessage.react("⏸"),
      queueMessage.react("▶️"),
      queueMessage.react("⏭"),
      queueMessage.react("🔂"),
      queueMessage.react("🔁"),
      queueMessage.react("🆕"),
    ]);
  } else {
    message.channel.send(`☠️ | No hay una cola activa.`);
  }
};
