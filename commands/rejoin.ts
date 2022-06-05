import { Client, Message } from "discord.js";
import { joinVoice, leaveVoice } from "../utils/broadcast";
import { Queue } from "../utils/queue";
import { get } from "./play";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  leaveVoice(message);
  joinVoice(message);
};