const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("playskip")
    .setDescription(
      "Phát một bài hát theo từ khóa hoặc URL, bỏ qua bài hát hiện tại"
    )
    .addStringOption((option) =>
      option
        .setName("nhập_từ_khóa_tìm_kiếm_hoặc_url")
        .setDescription("Nhập từ khóa hoặc URL để tìm kiếm bài hát")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction, client) {
    const keyword = interaction.options.getString(
      "nhập_từ_khóa_tìm_kiếm_hoặc_url"
    );

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

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(`🔍 | Đang tìm bài hát...`),
      ],
      ephemeral: true,
    });

    client.distube.play(voiceChannel, keyword, {
      textChannel: interaction.channel,
      member: interaction.member,
      skip: true,
    });
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.colorDefault)
          .setDescription(`🔍 | Tìm kiếm thành công!`),
      ],
      ephemeral: true,
    });
  },

  async autocomplete(interaction, client) {
    const keyword = interaction.options.getString(
      "nhập_từ_khóa_tìm_kiếm_hoặc_url"
    );
    const data = await getQuery(keyword);
    return interaction.respond(data);
  },
};

const checkURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const getQuery = async (query) => {
  if (!query || query.length == 0) return [];
  if (checkURL(query)) {
    return [
      {
        name: `URL: ${query}`,
        value: query,
      },
    ];
  }
  const res = await axios
    .get(
      `http://suggestqueries.google.com/complete/search?client=chrome&ds=yt&q=${encodeURIComponent(
        query
      )}`,
      { responseType: "arraybuffer" }
    )
    .catch(() => {});
  let data = [];
  if (res) {
    data = JSON.parse(res.data.toString("latin1"))[1].map(
      (item) =>
        new Object({
          name: item,
          value: item,
        })
    );
  }
  data = [
    {
      name: `${query}`,
      value: query,
    },
    ...data,
  ];
  return data;
};
