import { Client, Message } from "discord.js";
import { ratas } from "../data/ratas";
import { randomNumber } from "../utils/random";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  message.channel.send(`${ratas[randomNumber(0, 2)]}`)
  message.channel.send({
    files: [
      `./images/ratas/${randomNumber(1, 19)}.gif`
    ]
  });
};