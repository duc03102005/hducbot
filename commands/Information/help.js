const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "⚙️ - Thông tin",
  data: {
    name: "help",
    aliases: ["help", "h"],
    description: "Hiển thị danh sách lệnh",
  },

  async execute(client, message, args) {
    if (!args[0]) return getAll(client, message);
    return getCMD(client, message, args[0]);
  },
};

const getAll = (client, message) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: "📫 | Danh sách lệnh của bot", iconURL: client.user.displayAvatarURL() })
    .setColor(client.config.colorDefault)
    .setTitle(`Sử dụng {prefix}help [tên lệnh] để biết thêm chi tiết!`)
    
    .setTimestamp();

  const categories = client.commands
    .map((c) => c.category)
    .filter((c, i, a) => a.indexOf(c) === i);
  categories.forEach((category) => {
    const commands = client.commands.filter((c) => c.category === category);
    embed.addFields({
      name: `> ${category}[${commands.size}] `,
      value: commands.map((c) => `\`${c.data.name}\``).join(" | "),
    });
  });

  // embed.setDescription(info);
  return message.channel.send({ embeds: [embed] });
};

const getCMD = (client, message, input) => {
  const commanData =
    client.commands.get(input.toLowerCase()) ||
    client.commands.get(client.aliases.get(input.toLowerCase()));

  if (!commanData)
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: "📫 | Danh sách lệnh của bot", iconURL: client.user.displayAvatarURL() })
          .setColor(client.config.colorError)
          .setDescription(`Không tìm thấy lệnh \`${input.toLowerCase()}\``),
      ],
    });

  const embed = new EmbedBuilder()
    .setAuthor({ name: "📫 | Danh sách lệnh của bot", iconURL: client.user.displayAvatarURL() })
    .setColor(client.config.colorDefault)
    .setTitle(`Thông tin lệnh: \`${commanData.data.name}\``)
    .addFields([
      {
        name: "> Tên lệnh",
        value: commanData.data.name,
        inline: true,
      },
      {
        name: "> Có thể gọi",
        value: commanData.data.aliases
          ? `\`${commanData.data.aliases.join("`, `")}\``
          : "Không có",
        inline: true,
      },
      {
        name: "> Mô tả",
        value: commanData.data.description || "Không có",
      },
    ]);

  return message.channel.send({ embeds: [embed] });
};
