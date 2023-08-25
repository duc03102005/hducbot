const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Dừng phát nhạc và ngắt kết nối bot"),

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

    client.distube.voices.leave(interaction);
    queue.stop();
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(`🔇 | Ngắt kết nối bot với voice channel!`),
      ],
      ephemeral: true,
    });
  },
};
