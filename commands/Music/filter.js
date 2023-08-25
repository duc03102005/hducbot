const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "filter",
    aliases: ["fi"],
    description: "Bật/tắt bộ lọc âm thanh",
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

    const filter = args[0];
    if (filter === "off" && queue.filters.size) {
      queue.filter.clear();
    } else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) queue.filters.remove(filter);
      else queue.filters.add(filter);
    } else if (args[0]) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bộ lọc \`${args[0]}\` không tồn tại!`),
        ],
      });
    }

    message.react("👌");
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(
            `🎶 | Bộ lọc âm thanh: \`${
              queue.filters.names.join(", ") || "Off"
            }\``
          ),
      ],
    });
  },
};
