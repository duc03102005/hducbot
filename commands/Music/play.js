const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "🎵 - Music",
  data: {
    name: "play",
    aliases: ["p"],
    description: "Phát nhạc theo từ khóa hoặc đường dẫn",
  },

  async execute(client, message, args) {
    const query = args.join(" ");

    if (!query) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setAuthor({
              name: "Lỗi",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription("Vui lòng nhập từ khóa hoặc đường dẫn!"),
        ],
        ephemeral: true,
      });
    }

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

    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription("🔎 | Đang tìm kiếm..."),
      ],
    });

    client.distube.play(voiceChannel, query, {
      textChannel: message.channel,
      member: message.member,
    });

    msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription('🔎 | Tìm kiếm thành công'),
      ],
    });

    // xóa tin nhắn sau 5s
    setTimeout(() => {
      msg.delete();
    }, 5000);
  },
};
