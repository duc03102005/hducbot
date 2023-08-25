const {
  EmbedBuilder
} = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "volume",
    aliases: ["v"],
    description: "Đặt âm lượng cho bài hát",
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

    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bạn chưa chỉ định âm lượng!`),
        ],
        ephemeral: true,
      });
    }

    if (isNaN(args[0])) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Âm lượng phải là một con số!`),
        ],
        ephemeral: true,
      });
    }

    if (args[0] < 0 || args[0] > 100) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Âm lượng phải nằm trong khoảng từ 0 đến 100!`),
        ],
        ephemeral: true,
      });
    }

    queue.setVolume(args[0]);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`✅ | Đã đặt âm lượng cho bài hát thành **${args[0]}%**!`),
      ],
      ephemeral: true,
    });
  }
}