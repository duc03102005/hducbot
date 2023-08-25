const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Information",
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Xem avatar của người dùng")
    .addUserOption((option) =>
      option.setName("user").setDescription("Người dùng")
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${user.tag}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(client.config.colorSuccess)
          .setImage(
            user.displayAvatarURL({
              size: 4096,
              dynamic: true,
            })
          ),
      ],
      ephemeral: true,
    });
  },
};
