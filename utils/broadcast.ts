import { AudioPlayerStatus, createAudioPlayer, DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, PlayerSubscription, VoiceConnection } from '@discordjs/voice';
import { Message } from 'discord.js';
import { get } from '../commands/play';

export const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, () => {
  const queue = get();
  
  if (!queue?.isSkipping) {
    queue?.skip();
  }
});

let subscription: PlayerSubscription | undefined;

export const joinVoice = (message: Message) => {

  let connection = getVoiceConnection(message.guild?.id || '');
  
  if (!connection) {
    connection = joinVoiceChannel({
      channelId: message?.member?.voice?.channel?.id ?? "",
      guildId: message.guild?.id ?? "",
      adapterCreator: message.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
  } else {
    connection.rejoin({
      channelId: message?.member?.voice?.channel?.id ?? "",
      selfDeaf: true,
      selfMute: false
    });
  }

  subscription = connection.subscribe(player);
}


export const leaveVoice = (message: Message) => {
  let connection = getVoiceConnection(message.guild?.id || '');
  
  if (connection) {
    connection.disconnect();
    subscription?.unsubscribe();
  }
}
