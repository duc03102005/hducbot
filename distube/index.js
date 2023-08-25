const { DisTube } = require("distube");
const client = require("../index.js");
const { EmbedBuilder } = require("discord.js");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const Format = Intl.NumberFormat();
let spotifyOptions = {
  parallel: true,
  emitEventsAfterFetching: false,
};
// const { getVoiceConnection }= require('@discordjs/voice');

client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnEmpty: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: true,
  emitAddListWhenCreatingQueue: true,
  youtubeCookie: client.config.cookie,
  youtubeIdentityToken: client.config.identify,
  ytdlOptions: {
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
    filter: "audioonly",
    requestOptions: {
      headers: {
        // Tip: ấn vào acc chính mình sẽ có request, xem tại đó
        cookie: client.config.cookie,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        // Ctrl + U => View Source => Ctrl + F => Find => ID_TOKEN => Replace
        "x-youtube-identity-token": client.config.identify,
      },
    },
    lang: "vi",
  },
  plugins: [
    new SpotifyPlugin(spotifyOptions),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

if (client.config.spotifyApi.enabled) {
  spotifyOptions.api = {
    clientId: client.config.spotifyApi.clientId,
    clientSecret: client.config.spotifyApi.clientSecret,
  };
}

const status = (queue) =>
  `Âm lượng: \`${queue.volume}%\` | Bộ lọc: \`${
    queue.filters.names.join(", ") || "Tắt"
  }\` | Lặp: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "Danh sách phát"
        : "Bài hát"
      : "Tắt"
  }\` | Autoplay: \`${queue.autoplay ? "Bật" : "Tắt"}\``;

client.distube.on("addSong", async (queue, song) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorDefault)
        .setAuthor({
          name: "Thêm bài hát vào danh sách phát",
          iconURL: client.user.avatarURL(),
        })
        .setDescription(`> [**${song.name}**](${song.url})`)
        .setThumbnail(song.user.displayAvatarURL())
        .addFields([
          {
            name: "⏱️ | Thời gian",
            value: `${song.formattedDuration}`,
            inline: true,
          },
          {
            name: "🎵 | Đăng tải",
            value: `[${song.uploader.name}](${song.uploader.url})`,
            inline: true,
          },
          {
            name: "👌 | Yêu cầu",
            value: `${song.user}`,
            inline: true,
          },
        ])
        .setImage(song.thumbnail)
        .setFooter({
          text: `${Format.format(queue.songs.length)} bài hát trong danh sách`,
        }),
    ],
  });

  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("addList", async (queue, playlist) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorDefault)
        .setAuthor({
          name: "Thêm danh sách phát",
          iconURL: client.user.avatarURL(),
        })
        .setThumbnail(playlist.user.displayAvatarURL())
        .setDescription(`> [**${playlist.name}**](${playlist.url})`)
        .addFields([
          {
            name: "⏱️ | Thời gian",
            value: `${playlist.formattedDuration}`,
            inline: true,
          },
          {
            name: "👌 | Yêu cầu",
            value: `${playlist.user}`,
            inline: true,
          },
        ])
        .setImage(playlist.thumbnail)
        .setFooter({
          text: `${Format.format(queue.songs.length)} bài hát trong danh sách`,
        }),
    ],
  });

  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("playSong", async (queue, song) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorDefault)
        .setAuthor({
          name: "Phát bài hát",
          iconURL: client.user.avatarURL(),
        })
        .setDescription(`> [**${song.name}**](${song.url})`)
        .setThumbnail(song.user.displayAvatarURL())
        .addFields([
          {
            name: "🔷 | Trạng thái",
            value: `${status(queue).toString()}`,
            inline: false,
          },
          {
            name: "👀 | Lượt xem",
            value: `${Format.format(song.views)}`,
            inline: true,
          },
          {
            name: "👍 | Lượt thích",
            value: `${Format.format(song.likes)}`,
            inline: true,
          },
          {
            name: "⏱️ | Thời gian",
            value: `${song.formattedDuration}`,
            inline: true,
          },
          {
            name: "🎵 | Đăng tải",
            value: `[${song.uploader.name}](${song.uploader.url})`,
            inline: true,
          },
          {
            name: "👌 | Yêu cầu",
            value: `${song.user}`,
            inline: true,
          },
          {
            name: "📻 | Phát nhạc tại",
            value: `
┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)}
┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
            inline: false,
          },
          {
            name: "🤖 | Đề xuất",
            value: `[${song.related[0].name}](${song.related[0].url})
┕⌛ | Thời gian: ${song.related[0].formattedDuration} | 🆙 | Đăng tải lên bởi: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`,
            inline: false,
          },
        ])
        .setImage(song.thumbnail)
        .setFooter({
          text: `${Format.format(queue.songs.length)} bài hát trong danh sách`,
        }),
    ],
  });

  setTimeout(
    () => {
      msg.delete();
    },
    1000 * 60 * 2,
  );
});

client.distube.on("empty", async (queue) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorError)
        .setDescription(`🚫 | Phòng trống, Bot tự động rời phòng!`),
    ],
  });
  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("error", async (channel, error) => {
  const msg = await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorError)
        .setDescription(
          `🚫 | Bot đã xảy ra lỗi!\n\n** ${error.toString().slice(0, 1974)}**`,
        ),
    ],
  });
  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("disconnect", async (queue) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorError)
        .setDescription(`🚫 | Bot đã được ngắt kết nối!`),
    ],
  });
  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("finish", async (queue) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorError)
        .setDescription(`🚫 | Đã phát hết bài hát trong danh sách phát!`),
    ],
  });
  setTimeout(() => {
    msg.delete();
  }, 20000);
});

client.distube.on("initQueue", async (queue) => {
  queue.autoplay = true;
  queue.volume = 100;
});

client.distube.on("noRelated", async (queue) => {
  const msg = await queue.textChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.colorError)
        .setDescription(`🚫 | Không tìm thấy bài hát để phát!`),
    ],
  });
  setTimeout(() => {
    msg.delete();
  }, 20000);
});
