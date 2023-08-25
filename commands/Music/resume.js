const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "resume",
    aliases: ["rs"],
    description: "Tiếp tục bài hát",
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

    if (queue) {
      if (!queue.pause) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setDescription(`🚫 | Bài hát đang được phát!`),
          ],
          ephemeral: true,
        });
      }
    }

    if (queue) {
      queue.resume();
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorSuccess)
            .setDescription(`▶ | Tiếp tục bài hát!`),
        ],
        ephemeral: true,
      });
    }
  },
};
