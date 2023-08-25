const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "skipto",
    aliases: ["st"],
    description: "Bỏ qua bài hát đang phát và chuyển đến bài hát được chỉ định",
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
            .setDescription(`🚫 | Bạn chưa chỉ định bài hát!`),
        ],
        ephemeral: true,
      });
    }

    if (isNaN(args[0])) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Vị trí bài hát phải là một số!`),
        ],
        ephemeral: true,
      });
    }

    if (args[0] > queue.songs.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Vị trí bài hát không hợp lệ!`),
        ],
        ephemeral: true,
      });
    }

    await client.distube
      .jump(message, num)
      .then((song) => {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorSuccess)
              .setDescription(
                `✅ | Đã bỏ qua bài hát đang phát và chuyển đến bài hát thứ ${num} - ${song.name}!`
              ),
          ],
          ephemeral: true,
        });
      })
      .catch((err) =>
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setDescription(`🚫 | Đã xảy ra lỗi khi bỏ qua bài hát!`),
          ],
          ephemeral: true,
        })
      );
  },
};
