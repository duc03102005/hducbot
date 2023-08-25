const { EmbedBuilder } = require("discord.js");
const { getMember } = require("../../utils");

module.exports = {
  category: "⚙️ - Thông tin",
  data: {
    name: "avatar",
    aliases: ["avt"],
    description: "Xem avatar của người dùng",
  },

  async execute(client, message, args) {
    const member = await getMember(message, args.join(" "));

    if (!member) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setAuthor({
              name: "Lỗi",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription("Không tìm thấy người dùng!"),
        ],
        ephemeral: true,
      });
    }

    const avatarServer =
      member.avatar &&
      `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${member.id}/avatars/${member.avatar}.png?size=512`;

    const embed = new EmbedBuilder()
      .setColor(client.config.colorSuccess)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setImage(avatarServer || member.user.displayAvatarURL({ size: 512 }));

    message.reply({ embeds: [embed] });
  },
};
