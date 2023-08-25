const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Format = Intl.NumberFormat();
const status = (queue) =>
  `Âm lượng: \`${queue.volume}%\` | Bộ lọc: \`${
    queue.filters.names.join(", ") || "Tắt"
  }\` | Lặp: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "Danh sách phát"
        : "Bài hát"
      : "Tắt"
  }\` | Autoplay: \`${queue.autoplay ? "Bật" : "Tắt"}\``;

module.exports = {
  categorySlash: "Music",
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Hiển thị bài hát đang phát hiện tại"),

  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    const queue = await client.distube.getQueue(interaction);

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colorError)
            .setDescription(
              `🚫 | Bạn phải ở trong một kênh thoại để dùng lệnh này!`,
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

    const song = queue.songs[0];
    const embed = new EmbedBuilder()
      .setColor(client.config.colorDefault)
      .setAuthor({
        name: "Bài hát hiện tại",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(`> [${song.name}](${song.url})`)
      .addFields([
        {
          name: "🔷 | Trạng thái",
          value: `${status(queue).toString()}`,
          inline: false,
        },
        {
          name: "👀 | Lượt xem",
          value: `${Format.format(song.views)}`,
          inline: true,
        },
        {
          name: "👍 | Lượt thích",
          value: `${Format.format(song.likes)}`,
          inline: true,
        },
        {
          name: "⏱️ | Đã phát",
          value: `${queue.formattedCurrentTime} / ${song.formattedDuration}`,
          inline: true,
        },
        {
          name: "🎵 | Đăng tải",
          value: `[${song.uploader.name}](${song.uploader.url})`,
          inline: true,
        },
        {
          name: "👌 | Yêu cầu",
          value: `${song.user}`,
          inline: true,
        },
        {
          name: "📻 | Phát nhạc tại",
          value: `
┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)}
┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
          inline: false,
        },
        {
          name: "🤖 | Đề xuất",
          value: `[${song.related[0].name}](${song.related[0].url})
┕⌛ | Thời gian: ${song.related[0].formattedDuration} | 🆙 | Đăng tải lên bởi: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`,
          inline: false,
        },
      ])
      .setImage(song.thumbnail)
      .setFooter({
        text: `${Format.format(queue.songs.length)} bài hát trong danh sách`,
      });

    interaction.reply({ embeds: [embed] });
  },
};
