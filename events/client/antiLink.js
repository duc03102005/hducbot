const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const client = require("../../index.js");

const type = {
  scam: "Link lừa đảo",
};

const level = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    antiSendInvite(message);
    antiLinkChongLuaDao(message);
    antiLinkScam(message);
  },
};

const antiSendInvite = (message) => {
  let blackListed = ["discord.gg/", "discord.com/invite/"];
  let foundInText = false;
  for (var i in blackListed) {
    if (message.content.toLowerCase().includes(blackListed[i].toLowerCase()))
      foundInText = true;
  }

  if (foundInText) {
    message.delete();
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Link mời vào server")
          .setColor(client.config.colorError)
          .setDescription(
            `🚫 | ${message.author}, sao bạn lại gửi link mời vào server ở đây!`
          )
          .setFooter({
            text: `Nếu bạn thấy link này không phải là link mời vào server, hãy bỏ qua tin nhắn này!`,
          }),
      ],
    });
  }
};

const antiLinkChongLuaDao = async (message) => {
  await axios.get("https://api.chongluadao.vn/v1/blacklist").then((res) => {
    // lấy các url trong res.data
    const links = res.data.map((item) => item.url);

    let blackListed = links;
    let foundInText = false;
    for (var i in blackListed) {
      if (message.content.toLowerCase().includes(blackListed[i].toLowerCase()))
        foundInText = true;
    }

    if (foundInText) {
      message.delete();
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Link lừa đảo")
            .setColor(client.config.colorError)
            .setDescription(
              `🚫 | ${message.author}, sao bạn lại gửi link lừa đảo ở đây!`
            )
            .addFields([
              {
                name: "Loại link",
                value: `${type[res.data[0].type]}`,
              },
              {
                name: "Mức độ",
                value: `${level[res.data[0].level]}`,
              },
            ])
            .setFooter({
              text: `Nếu bạn thấy link này không phải là link lừa đảo, hãy bỏ qua tin nhắn này! - Chongluadao.vn`,
            }),
        ],
      });
    }
  });
};

const antiLinkScam = async (message) => {
  const scamLinkArr = require("../../scam.json");

  let blackListed = scamLinkArr;

  let foundInText = false;
  for (var i in blackListed) {
    if (message.content.toLowerCase().includes(blackListed[i].toLowerCase()))
      foundInText = true;
  }

  if (foundInText) {
    message.delete();
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Link lừa đảo")
          .setColor(client.config.colorError)
          .setDescription(
            `🚫 | ${message.author}, sao bạn lại gửi link lừa đảo ở đây!`
          )
          .setFooter({
            text: `Nếu bạn thấy link này không phải là link lừa đảo, hãy bỏ qua tin nhắn này!`,
          }),
      ],
    });
  }
};
