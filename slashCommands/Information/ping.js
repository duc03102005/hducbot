const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
  categorySlash: "Information",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Hiển thị độ trễ của bot!"),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const d = moment.duration(interaction.client.uptime);
    const days = d.days() == 1 ? `${d.days()} ngày` : `${d.days()} ngày`;
    const hours = d.hours() == 1 ? `${d.hours()} giờ` : `${d.hours()} giờ`;
    const minutes =
      d.minutes() == 1 ? `${d.minutes()} phút` : `${d.minutes()} phút`;
    const seconds =
      d.seconds() == 1 ? `${d.seconds()} giây` : `${d.seconds()} giây`;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Ping",
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.config.colorDefault)
      .addFields([
        {
          name: "> API Latency",
          value: `${client.ws.ping}ms`,
          inline: true,
        },
        {
          name: "> Discord Latency",
          value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
          inline: true,
        },
        {
          name: "> Uptime",
          value: `${days} ${hours} ${minutes} ${seconds}`,
          inline: true,
        },
      ])
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
