const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Lặp lại bài hát, danh sách nhạc")
    .addStringOption((option) =>
      option
        .setName("loại")
        .setDescription("Loại lặp lại")
        .setRequired(true)
        .addChoices(
          {
            name: "Tắt",
            value: "0",
          },
          {
            name: "Bài hát",
            value: "1",
          },
          {
            name: "Danh sách phát",
            value: "2",
          }
        )
    ),

  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    const queue = await client.distube.getQueue(interaction);

    if (!voiceChannel) {
      return interaction.reply({
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
        interaction.guild.members.me.voice.channelId !==
        interaction.member.voice.channelId
      ) {
        return interaction.reply({
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
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Không có bài hát nào đang phát!`),
        ],
        ephemeral: true,
      });
    }

    const repeatMode = interaction.options.getString("loại");

    queue.setRepeatMode(parseInt(repeatMode));

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(
            `🔁 | Đã ${
              parseInt(repeatMode) === 0
                ? "tắt"
                : parseInt(repeatMode) === 1
                ? "bật"
                : "lặp lại"
            } lặp lại ${
              parseInt(repeatMode) === 0
                ? "bài hát"
                : parseInt(repeatMode) === 1
                ? "bài hát"
                : "danh sách phát"
            }!`
          ),
      ],
      ephemeral: true,
    });
  },
};
