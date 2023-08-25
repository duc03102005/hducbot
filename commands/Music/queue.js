const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "queue",
    aliases: ["q"],
    description: "Xem danh sách bài hát",
  },

  async execute(client, message, args) {
    const voiceChannel = message.member.voice.channel;
    const queue = await client.distube.getQueue(message);

    if (!voiceChannel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(
              `🚫 | Bạn phải ở trong một kênh thoại để dùng lệnh này!`
            ),
        ],
        ephemeral: true,
      });
    }

    if (queue) {
      if (
        message.guild.members.me.voice.channelId !==
        message.member.voice.channelId
      ) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setDescription(`🚫 | Bạn cần vào cùng kênh thoại với Bot!`),
          ],
          ephemeral: true,
        });
      }
    }

    if (!queue) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Không có bài hát nào đang phát!`),
        ],
        ephemeral: true,
      });
    }

    const q = queue.songs
      .map(
        (song, i) =>
          `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${
            song.formattedDuration
          }\``
      )
      .join("\n");

    const tracks = queue.songs.map(
      (song, i) => `**${i + 1}** - [${song.name}](${song.url}) | ${
        song.formattedDuration
      }
        Yêu cầu bởi : ${song.user}`
    );

    const songs = queue.songs.length;
    const nextSongs =
      songs > 10
        ? `Và **${songs - 10}** bài hát khác...`
        : `Trong danh sách phát **${songs}** bài hát...`;

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setAuthor({
            name: "Danh sách phát",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(`${tracks.slice(0, 10).join("\n")}\n\n${nextSongs}`)
          .addFields([
            {
              name: "> Đang phát:",
              value: `[${queue.songs[0].name}](${queue.songs[0].url}) - ${queue.songs[0].formattedDuration} | Yêu cầu bởi: ${queue.songs[0].user}`,
              inline: true,
            },
            {
              name: "> Tổng thời gian phát:",
              value: `${queue.formattedDuration}`,
              inline: true,
            },
            {
              name: "> Tổng số bài hát:",
              value: `${songs}`,
              inline: true,
            },
          ]),
      ],
    });
  },
};
