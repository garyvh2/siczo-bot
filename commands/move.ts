import { Client, Message } from "discord.js";
import { Queue } from "../utils/queue";
import { get } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  const from = Number(args.shift() ?? "");
  const to = Number(args.shift() ?? "");

  const queue = get();
  const queueSize = queue?.items?.length ?? 0;
  const playingIndex = queue?.playingIndex ?? 0;

  if (from <= 0 || to <= 0 || to > queueSize || from > queueSize) {
    message.channel.send(`❌ | Uno de los valores es invalido.`);
  } else if (from === (playingIndex + 1) || to === (playingIndex + 1)) {
    message.channel.send(`❌ | No se puede alterar la cancion en reproduccion.`);
  } else {
    if (queue) {
      /**
       * Skip the song
       */
      queue?.move(from - 1, to - 1);
    } else {
      message.channel.send(`☠️ | No hay una cola activa.`)
    }
  }
};