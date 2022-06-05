import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { Message } from "discord.js";
import ytpl, { Result } from "ytpl";
import { remove } from "../commands/play";
import { joinVoice, player } from "./broadcast";

const ytmpl = require("yt-mix-playlist");

/**
 * Utils
 */
import { isPlaylist, isYoutube } from "./urlCheck";
import { info, process, youtubeId } from "./youtube";
import { arrayMove, shuffleArray } from "./array";

export class Queue {
  items: Array<QueueItem>;
  message: Message;
  isPlaying: boolean = false;
  isSkipping: boolean = false;
  isLoop: boolean = false;
  isLoopQueue: boolean = false;

  playingIndex: number;

  constructor(message: Message) {
    this.items = [];
    this.playingIndex = 0;
    this.message = message;
  }

  /**
   * Get the current song by playing index
   */
  get currentlyPlaying(): QueueItem | null {
    return this.items[this.playingIndex];
  }

  /**
   * Get the empty status
   */
  get isEmpty() {
    return this.items.length === 0;
  }

  get isOver() {
    return this.playingIndex >= this.items.length;
  }

  play() {
    joinVoice(this.message);

    let url = this.currentlyPlaying?.url;
    if (this.currentlyPlaying?.youtube) {
      url = process(url);
    }

    player.play(
      createAudioResource(url, {
        inlineVolume: true,
      })
    );

    this.message.channel
      .send(`🎵 | Reproduciendo ${this.currentlyPlaying?.title}.`)
      .then(() => {
        this.isSkipping = false;
      });
  }

  /**
   * Adds an item to the queue
   * @param url
   */
  async add(url: string) {
    if (!url.trim()) return;

    let items: Array<QueueItem>;

    /**
     * Add to queue from Youtube
     */
    if (isYoutube(url)) {
      const list = isPlaylist(url) ? await ytpl(url) : { items: [{ url }] };
      items = await Promise.all(list.items.map((item) => info(item.url)));
    } else {
      items = [
        {
          url: `./audios/${url}.mpeg`,
          title: url,
        },
      ];
    }

    this.items = this.items.concat(items);

    if (player.state.status === AudioPlayerStatus.Idle) {
      this.play();
    }

    let text = `\`\`\`📚 | Agregado(s) a la cola (${items.length})\n`;
    items.slice(0, 15).forEach(({ title }, index) => {
      text += `${index + 1}. ${title}\n`;
    });
    text += "```";

    this.message.channel.send(text);
  }

  /**
   * Adds an item to the queue
   * @param url
   */
  async radio(url: string) {
    if (!url.trim()) return;

    player.stop();

    /**
     * Add to queue from Youtube
     */
    if (isYoutube(url)) {
      const list: Result = await ytmpl(youtubeId(url)) ?? [{ items : [] }];
      const items = await Promise.all(list.items.map((item) => info(item.url)));

      this.items = this.items.concat(items);

      if (player.state.status === AudioPlayerStatus.Idle) {
        this.play();
      }

      let text = `\`\`\`📚 | Se ha creado una radio.\n`;
      items.forEach(({ title }, index) => {
        text += `${index + 1}. ${title}\n`;
      });
      text += "```";

      this.message.channel.send(text);
    } else {
      this.message.channel.send(`❌ | Debe proveer un link de Youtube.`);
    }
  }

  /**
   * Remove and item from the queue
   * @param index
   */
  remove(index: number) {
    if (index === this.playingIndex)
      this.message.channel.send(
        `❌ | ${index}. ${this.currentlyPlaying?.title} is already playing.`
      );
    if (index < this.playingIndex) {
      this.playingIndex -= 1;
    }

    const [{ title }] = this.items.splice(index, 1);
    this.message.channel.send(`🪚 | ${title} removido de la cola.`);
    this.checkEmpty();
  }

  /**
   * Skip an item
   * @returns
   */
  skip(command?: boolean) {
    const loop = this.isLoop || this.isLoopQueue;
    if (!loop) {
      this.playingIndex += 1;
    }

    if (!loop && command && this.currentlyPlaying) {
      this.message.channel.send(
        `🪚 | Saltando  a: ${this.currentlyPlaying?.title}.`
      );
    }

    // Agregar loop aca
    if (!this.checkEmpty()) {
      this.isSkipping = true;
      const stopped = player.stop(true);
      if (stopped) {
        this.play();
      }
    }
  }

  /**
   * Skip an item
   * @returns
   */
  go(index: number) {
    this.playingIndex = index;

    if (this.currentlyPlaying) {
      this.message.channel.send(
        `🪚 | Saltando  a: ${this.currentlyPlaying?.title}.`
      );
    }
    
    if (!this.checkEmpty()) {
      this.isSkipping = true;
      const stopped = player.stop(true);
      if (stopped) {
        this.play();
      }
    }
  }

  /**
   * Skip an item
   * @returns
   */
  prev(command?: boolean) {
    this.playingIndex -= 1;

    if (this.playingIndex <= 0) {
      this.playingIndex = this.items.length - 1;
    }

    if (command && this.currentlyPlaying) {
      this.message.channel.send(
        `🪚 | Saltando  a: ${this.currentlyPlaying?.title}.`
      );
    }

    if (!this.checkEmpty()) {
      this.isSkipping = true;
      const stopped = player.stop(true);
      if (stopped) {
        this.play();
      }
    }
  }

  /**
   * Skip an item
   * @returns
   */
  move(from: number, to: number) {
    arrayMove(this.items, from, to);
    this.items = [...this.items];
    this.message.channel.send(
      `🪦 | ${this.items[to].title} has sido movida a ${to + 1}.`
    );
  }

  /**
   * Skip an item
   * @returns
   */
  shuffle() {
    shuffleArray(this.items);
    this.items = [...this.items];
    this.message.channel.send(`🔗 | La cola ha sido ordenada aleatoriamente.`);

    this.playingIndex = 0;

    if (!this.checkEmpty()) {
      this.play();
    }
  }

  /**
   * Skip an item
   */
  checkEmpty() {
    if (this.isOver) {
      this.message.channel.send(`🪦 | La cola ha sido completada.`);
      return true;
    }

    if (this.isEmpty) {
      this.message.channel.send(`🪦 | La cola esta vacia.`);
      remove();
      return true;
    }
    return false;
  }
}
