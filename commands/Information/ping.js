const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "⚙️ - Thông tin",
  data: {
    name: "ping",
    aliases: ["ping"],
    description: "Kiểm tra độ trễ của bot",
  },

  async execute(client, message, args) {
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setAuthor({
            name: "Đang kiểm tra...",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription("Vui lòng đợi trong giây lát..."),
      ],
      ephemeral: true,
    });

    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setAuthor({
            name: "Đã kiểm tra",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `Độ trễ của bot: \`${latency}ms\`\nĐộ trễ của API: \`${apiLatency}ms\``
          ),
      ],
    });
  },
};
