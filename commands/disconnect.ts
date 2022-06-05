import { Client, Message } from "discord.js";
import { leaveVoice } from "../utils/broadcast";

export const run = async (_: Client, message: Message, args: Array<string>) => {
  leaveVoice(message);
};
