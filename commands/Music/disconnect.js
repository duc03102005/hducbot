const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "disconnect",
    aliases: ["dc", "leave", "stop"],
    description: "Dừng phát nhạc và rời khỏi voice channel",
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

    client.distube.voices.leave(message);
    queue.stop();
    message.react("👋");
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(`🔇 | Ngắt kết nối bot với voice channel!`),
      ],
    });

    setTimeout(() => {
      msg.delete();
    }, 5000);
  },
};
