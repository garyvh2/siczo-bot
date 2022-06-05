import { MessageReaction, PartialMessageReaction } from "discord.js"
import { get } from "../commands/play";

export const reactionsManager = async (reaction: MessageReaction | PartialMessageReaction) => { 
  const queue = get();  

  let command;
  switch(reaction.emoji.name) {
    case '⏮':
      command = 'prev';
      break;
    case '⏸':
      command = 'pause';
      break;
      case '▶️':
      command = 'unpause';
      break;
    case '⏭':
      command = 'next';
      break;
    case '🆕':
      command = 'rejoin';
      break;
    default:
      return;
  }

  try {
    const { run } = await import(`../commands/${command}`);
    await run(reaction.client, reaction.message, ['no-reaction']);
    
    if (queue) {
      let text = "```📚 | Cola de reproduccion\n";
      text += `Status: ${queue.isPlaying ? "▶️" : "⏸"} - Loop: ${queue.isLoop ? "🔂" : queue.isLoopQueue ? "🔁" : "💠"}\n`;
      queue.items.forEach(({ title }, index) => {
        const current = queue.playingIndex === index;
        text += `${current ? "*" : ""} ${index + 1}. ${title.slice(0, 20)}\n`;
      });
      text += "```";
  
      reaction.message.edit(text);
    }

  } catch (error) {
    console.log(error);
  }
}