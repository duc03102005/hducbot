const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  category: "⚙️ - Thông tin",
  data: {
    name: "serverinfo",
    aliases: ["serverinfo", "server-info", "server"],
    description: "Get information about the server",
  },

  async execute(client, message, args) {
    let boosts = message.guild.premiumSubscriptionCount;
    let boostLevel = message.guild.premiumTier;

    const embed = new EmbedBuilder()
      .setColor(client.config.colorSuccess)
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setThumbnail(message.guild.iconURL())
      .setDescription(message.guild.description || "Không có mô tả")
      .addFields([
        {
          name: "> Chủ sở hữu",
          value: `<@${message.guild.ownerId}>`,
          inline: true,
        },
        {
          name: "> Ngày tạo",
          value: `<t:${parseInt(
            message.guild.createdAt / 1000
          )}:F>(<t:${parseInt(message.guild.createdAt / 1000)}:R>)`,
          inline: true,
        },
        {
          name: "> Boost",
          value: `Level ${boostLevel} (${boosts} boosts)`,
          inline: true,
        },
        {
          name: "> Thành viên",
          value: `Tổng: ${message.guild.memberCount}\nNgười: ${
            message.guild.members.cache.filter((m) => !m.user.bot).size
          }\nBot: ${
            message.guild.members.cache.filter((m) => m.user.bot).size
          }`,
          inline: true,
        },
        {
          name: "> Kênh",
          value: `Danh mục: ${
            message.guild.channels.cache.filter(
              (channel) => channel.type == ChannelType.GuildCategory
            ).size
          }\nKênh văn bản: ${
            message.guild.channels.cache.filter(
              (channel) => channel.type == ChannelType.GuildText
            ).size
          }\nKênh thoại: ${
            message.guild.channels.cache.filter(
              (channel) => channel.type == ChannelType.GuildVoice
            ).size
          }\nSân khấu: ${
            message.guild.channels.cache.filter(
              (channel) => channel.type == ChannelType.GuildStageVoice
            ).size
          }`,
          inline: true,
        },
        {
          name: "> Khác",
          value: `Vai trò: ${message.guild.roles.cache.size}\nEmojis: ${message.guild.emojis.cache.size}\n Stickers: ${message.guild.stickers.cache.size}`,
          inline: true,
        },
      ]);

    message.reply({ embeds: [embed] });
  },
};
