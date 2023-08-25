const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Bật tắt bộ lọc âm thanh")
    .addStringOption((option) =>
      option
        .setName("thể_loại")
        .setDescription("Thể loại hình ảnh")
        .setRequired(true)
        .addChoices(
          {
            name: "Tắt",
            value: "off",
          },
          {
            name: "3D",
            value: "3d",
          },
          {
            name: "Bassboost",
            value: "bassboost",
          },
          {
            name: "Echo",
            value: "echo",
          },
          {
            name: "Karaoke",
            value: "karaoke",
          },
          {
            name: "Nightcore",
            value: "nightcore",
          },
          {
            name: "Vaporwave",
            value: "vaporwave",
          },
          {
            name: "Flanger",
            value: "flanger",
          },
          {
            name: "Gate",
            value: "gate",
          },
          {
            name: "Haas",
            value: "haas",
          },
          {
            name: "Reverse",
            value: "reverse",
          },
          {
            name: "Surround",
            value: "surround",
          },
          {
            name: "Mcompand",
            value: "mcompand",
          },
          {
            name: "Phaser",
            value: "phaser",
          }
        )
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

    const filter = interaction.options.getString("type");

    if (filter === "off" && queue.filters.size) {
      queue.filter.clear();
    } else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) queue.filters.remove(filter);
      else queue.filters.add(filter);
    } else {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(`🚫 | Bộ lọc không hợp lệ!`),
        ],
        ephemeral: true,
      });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorSuccess)
          .setDescription(
            `🎶 | Bộ lọc âm thanh: \`${
              queue.filters.names.join(", ") || "Off"
            }\``
          ),
      ],
      ephemeral: true,
    });
  },
};
