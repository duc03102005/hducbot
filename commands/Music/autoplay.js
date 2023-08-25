const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "autoplay",
    aliases: ["ap"],
    description: "Tắt/bật chế độ tự động phát nhạc",
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

    const mode = queue.toggleAutoplay();
    message.react("👌");
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(
            `🔀 | Chế độ tự động phát nhạc đã được **${mode ? "bật" : "tắt"}**!`
          ),
      ],
    });
  },
};
