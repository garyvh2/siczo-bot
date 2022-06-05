import { Client, Message } from "discord.js";
import { player } from "../utils/broadcast";
import { remove } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  player.stop();
  remove();
  message.channel.send(`⚙️ | La queue hay sido vaciada.`);
};
