const { Configuration, OpenAIApi } = require("openai");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  category: "♨️ - Tools",
  data: {
    name: "chatgpt",
    aliases: ["chatgpt", "chat-gpt", "chat"],
    description: "Trò chuyện cùng ChatGPT",
  },

  async execute(client, message, args) {
    const content = args.join(" ");

    if (!content) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Lỗi")
            .setDescription("Vui lòng nhập nội dung để trò chuyện")
            .setColor(client.config.colorError),
        ],
      });
    }

    const configuration = new Configuration({
      apiKey: client.config.open_ai_key,
    });

    const openai = new OpenAIApi(configuration);

    const embed = new EmbedBuilder()
      .setColor(client.config.colorSuccess)
      .setTitle("Chat với bot GPT-3")
      .setDescription("Đang tải dữ liệu...");

    const msg = await message.reply({
      embeds: [embed],
    });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: content }],
      });

      const result = completion.data.choices[0].message.content;
      embed.setDescription(result);

      msg.edit({
        embeds: [embed],
      });
    } catch (error) {
      embed.setColor(client.config.colorError);
      embed.setDescription("Đã xảy ra lỗi khi trò chuyện");

      msg.edit({
        embeds: [embed],
      });
    }
  },
};
