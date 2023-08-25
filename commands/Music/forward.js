const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "forward",
    aliases: ["fw"],
    description: "Chuyển bài hát sang phút đã cho",
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

    const time = Number(args[0]);
    if (!time) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bạn phải nhập thời gian!`),
        ],
        ephemeral: true,
      });
    }

    if (isNaN(time)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Thời gian phải là số!`),
        ],
        ephemeral: true,
      });
    }

    if (time > queue.songs[0].duration) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Thời gian phải nhỏ hơn thời lượng bài hát!`),
        ],
        ephemeral: true,
      });
    }

    queue.seek(queue.currentTime + time);
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`✅ | Đã chuyển bài hát sang ${time} giây!`),
      ],
      ephemeral: true,
    });
  },
};
