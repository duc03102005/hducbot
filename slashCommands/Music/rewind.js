const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("rewind")
    .setDescription("Tua lại bài hát")
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("Thời gian tua lại (giây)")
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

    const time = interaction.options.getInteger("time");

    if (time < 0)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Thời gian phải lớn hơn 0!`),
        ],
        ephemeral: true,
      });

    if (time > queue.currentTime) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Thời gian phải nhỏ hơn thời lượng bài hát!`),
        ],
        ephemeral: true,
      });
    }

    queue.seek(queue.currentTime - time);

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(`⏪ | Đã tua lại **${time}** giây!`),
      ],
      ephemeral: true,
    });
  },
};
