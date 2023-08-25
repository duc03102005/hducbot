const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "repeat",
    aliases: ["loop",'l'],
    description: "Lặp lại bài hát đang phát",
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
              `🚫 | Bạn phải ở trong một kênh thoại để dùng lệnh này!`,
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

    let mode = 1;
    switch (args[0]) {
      case "off":
        mode = 0;
        break;
      case "song":
        mode = 1;
        break;
      case "queue":
        mode = 2;
        break;
    }

    mode = queue.setRepeatMode(mode);
    mode = mode
      ? mode === 2
        ? "🔁 | Lặp lại toàn bộ hàng đợi"
        : "🔂 | Lặp lại bài hát"
      : "▶️ | Tắt lặp lại";

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`${mode}`),
      ],
      ephemeral: true,
    });
  },
};
