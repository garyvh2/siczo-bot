import { Client, Message } from "discord.js";

export const run = async (client: Client, message: Message, args: Array<string>) => {
  await message.channel.messages.fetch()
    .then(async (messages) => {
      const deletableMessages = messages.filter(message => message.author?.id === client.user?.id);
      return await Promise.all(deletableMessages.map(message => message.delete()));
    });
};