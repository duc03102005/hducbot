const {
  InteractionType,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { slashCommands } = client;
      const { commandName } = interaction;
      const slashCommand = slashCommands.get(commandName);
      if (!slashCommand) return interaction.reply("Khong  co");

      try {
        if (slashCommand.ownerOnly) {
          if (!client.config.owner.includes(interaction.user.id)) {
            return interaction.reply({
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

        if (slashCommand.userPermissions) {
          if (
            !interaction.member.permissions.has(
              PermissionsBitField.resolve(slashCommand.userPermissions || [])
            )
          ) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Lỗi")
                  .setDescription(
                    `Bạn cần có quyền \`${slashCommand.userPermissions.join(
                      ", "
                    )}\` để sử dụng lệnh này!`
                  )
                  .setColor(client.config.colorError),
              ],
              ephemeral: true,
            });
          }
        }

        if (slashCommand.botPermissions) {
          if (
            !interaction.guild.members.cache
              .get(client.user.id)
              .permissions.has(
                PermissionsBitField.resolve(slashCommand.botPermissions || [])
              )
          ) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Lỗi")
                  .setDescription(
                    `Tôi cần có quyền \`${slashCommand.botPermissions.join(
                      ", "
                    )}\` để sử dụng lệnh này!`
                  )
                  .setColor(client.config.colorError),
              ],
              ephemeral: true,
            });
          }
        }

        await slashCommand.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colorError)
              .setAuthor({
                name: "Lỗi",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription("Đã xảy ra lỗi khi thực thi lệnh!" + error),
          ],
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);

      if (!button) return;
      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: `An error has occurred!\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        });
      }
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const selectMenu = selectMenus.get(customId);

      if (!selectMenu) return;
      try {
        await selectMenu.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: `An error has occurred!\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        });
      }
    } else if (interaction.isContextMenuCommand()) {
      const { slashCommands } = client;
      const { commandName } = interaction;

      const contextCommand = slashCommands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: `An error has occurred!\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        });
      }
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      const { slashCommands } = client;
      const { commandName } = interaction;

      const slashCommand = slashCommands.get(commandName);
      if (!slashCommand) return;

      try {
        await slashCommand.autocomplete(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: `An error has occurred!\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        });
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);

      if (!modal) return new Error("Modal not found!");
      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: `An error has occurred!\n\`\`\`${error}\`\`\``,
          ephemeral: true,
        });
      }
    }
  },
};
