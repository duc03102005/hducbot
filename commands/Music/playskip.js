const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "playskip",
    aliases: ["ps"],
    description: "Phát bài hát mới và bỏ qua bài hát hiện tại",
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

    const string = args.join(" ");

    if (!string) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bạn phải nhập tên bài hát!`),
        ],
        ephemeral: true,
      });
    }

    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription("🔎 | Đang tìm kiếm..."),
      ],
    });

    client.distube.play(voiceChannel, string, {
      textChannel: message.channel,
      member: message.member,
      skip: true,
    });

    msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription("🔎 | Tìm kiếm thành công"),
      ],
    });

    // xóa tin nhắn sau 5s
    setTimeout(() => {
      msg.delete();
    }, 5000);
  },
};
