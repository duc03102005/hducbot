const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Tắt/bật chế độ tự động phát nhạc")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Chế độ tự động phát nhạc")
        .addChoices(
          {
            name: "Tắt",
            value: "off",
          },
          {
            name: "Bật",
            value: "on",
          }
        )
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const mode = interaction.options.getString("mode");

    const voiceChannel = interaction.member.voice.channel;
    const queue = await client.distube.getQueue(interaction);
    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color.colorError)
            .setDescription(
              `🚫 | Bạn phải ở trong một kênh thoại để dùng lệnh này!`
            ),
        ],
        ephemeral: true,
      });
    }
    if (
      interaction.guild.members.me.voice.channelId !==
      interaction.member.voice.channelId
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color.colorError)
            .setDescription(`🚫 | Bạn cần vào cùng kênh thoại với Bot!`),
        ],
        ephemeral: true,
      });
    }

    if (mode === "on") {
      await client.distube.toggleAutoplay(interaction);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorDefault)
            .setAuthor({
              name: "Tự động phát nhạc",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`🎵 | Bật chế độ tự động phát nhạc`),
        ],
        ephemeral: true,
      });
    } else if (mode === "off") {
      await client.distube.toggleAutoplay(interaction);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorDefault)
            .setAuthor({
              name: "Tự động phát nhạc",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`🎵 | Tắt chế độ tự động phát nhạc`),
        ],
        ephemeral: true,
      });
    }
  },
};
