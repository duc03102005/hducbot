const { Configuration, OpenAIApi } = require("openai");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  categorySlash: "Tools",
  data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Trò chuyện cùng ChatGPT")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("Nội dung để trò chuyện")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const content = interaction.options.getString("content");

    const configuration = new Configuration({
      apiKey: client.config.open_ai_key,
    });

    const openai = new OpenAIApi(configuration);

    const embed = new EmbedBuilder()
      .setColor(client.config.colorSuccess)
      .setTitle("Chat với bot GPT-3")
      .setDescription("Đang tải dữ liệu...");

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: content }],
      });

      const result = completion.data.choices[0].message.content;
      embed.setDescription(result);

      interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      embed.setColor(client.config.colorError);
      embed.setDescription("Đã xảy ra lỗi khi trò chuyện");

      interaction.editReply({
        embeds: [embed],
      });
    }
  },
};
