const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Thay đổi âm lượng bài hát đang phát")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("Âm lượng (1-100)")
        .setRequired(true)
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

    const volume = interaction.options.getInteger("volume");

    if (volume < 1 || volume > 100) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Vui lòng nhập số từ 1 đến 100!`),
        ],
        ephemeral: true,
      });
    }

    queue.setVolume(volume);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`✅ | Đã thay đổi âm lượng thành **${volume}%**!`),
      ],
      ephemeral: true,
    });
  },
};
