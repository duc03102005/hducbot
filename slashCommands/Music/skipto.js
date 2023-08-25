const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Chuyển đến bài hát trong danh sách phát")
    .addIntegerOption((option) =>
      option.setName("id").setDescription("ID của bài hát").setRequired(true)
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

    const id = interaction.options.getInteger("id");

    if (id < 1 || id > queue.songs.length) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | ID không hợp lệ!`),
        ],
        ephemeral: true,
      });
    }

    await client.distube
      .jump(message, num)
      .then((song) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorSuccess)
              .setDescription(`✅ | Đã chuyển đến bài hát **${song.name}**!`),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setDescription(`🚫 | ${err}`),
          ],
          ephemeral: true,
        });
      });
  },
};
