const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    let client = message.client;

    if (
      message.author.bot ||
      !message.guild ||
      !message.content.toLowerCase().startsWith(client.config.prefix)
    )
      return;

    if(message.content.startsWith(client.config.prefix)) {
      const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(/ +/g);

      const command =
        client.commands.get(cmd.toLowerCase()) ||
        client.commands.find((c) =>
          c.aliases?.includes(cmd.toLowerCase())
        );

      if (!command) return;

      try {
        if (command.ownerOnly) {
          if (!client.config.owner.includes(message.author.id)) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Lỗi")
                  .setDescription("Bạn không có quyền sử dụng lệnh này!")
                  .setColor(client.config.colorError),
              ],
              ephemeral: true,
            });
          }
        }

        if (command.userPermissions) {
          if (
            !message.member.permissions.has(
              PermissionFlagsBits.resolve(command.userPermissions || [])
            )
          ) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Lỗi")
                  .setDescription(
                    `Bạn cần có quyền \`${command.userPermissions.join(
                      ", "
                    )}\` để sử dụng lệnh này!`
                  )
                  .setColor(client.config.colorError),
              ],
              ephemeral: true,
            });
          }
        }

        if (command.botPermissions) {
          if (
            !message.guild.me.permissions.has(
              PermissionFlagsBits.resolve(command.botPermissions || [])
            )
          ) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Lỗi")
                  .setDescription(
                    `Mình cần có quyền \`${command.botPermissions.join(
                      ", "
                    )}\` để sử dụng lệnh này!`
                  )
                  .setColor(client.config.colorError),
              ],
              ephemeral: true,
            });
          }
        }

        command.execute(client, message, args);
      } catch (err) {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Lỗi")
              .setDescription(
                `Đã có lỗi xảy ra khi thực thi lệnh! \n\`\`\`${err}\`\`\``
              )
              .setColor(client.config.colorError),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
