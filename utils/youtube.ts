import ytdl from "ytdl-core";
import { exec } from "youtube-dl-exec";

export const info = async (url: string) => {
  const { videoDetails } = await ytdl.getInfo(url);

  return {
    url,
    title: videoDetails.title,
    youtube: true,
  };
};

export const process = (url: string) => {
  const video = exec(
    url,
    {
      output: "-",
      format:
        "bestaudio[ext=webm+acodec=opus+tbr>100]/bestaudio[ext=webm+acodec=opus]/bestaudio/best",
      limitRate: "1M",
      rmCacheDir: true,
      verbose: true,
    },
    { stdio: ["ignore", "pipe", "ignore"] }
  );
  return video.stdout!;
};

export const youtubeId = (url: string) => {
  if (/youtu\.?be/.test(url)) {
    // Look first for known patterns
    let i;
    const patterns = [
      /youtu\.be\/([^#&?]{11})/, // youtu.be/<id>
      /\?v=([^#&?]{11})/, // ?v=<id>
      /&v=([^#&?]{11})/, // &v=<id>
      /embed\/([^#&?]{11})/, // embed/<id>
      /\/v\/([^#&?]{11})/, // /v/<id>
    ];

    // If any pattern matches, return the ID
    for (i = 0; i < patterns.length; ++i) {
      if (patterns[i].test(url)) {
        return patterns?.[i].exec(url)?.[1];
      }
    }
  }
  return null;
};
