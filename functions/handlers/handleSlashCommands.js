const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const Ascii = require("ascii-table");

module.exports = (client) => {
  client.handleSlashCommands = async () => {
    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { slashCommands, slashCommandArray } = client;

      const Table = new Ascii("Slash Commands Loaded");
      Table.setHeading("Command", "Status");

      for (const file of commandFiles) {
        const slashCommand = require(`../../slashCommands/${folder}/${file}`);
        slashCommands.set(slashCommand.data.name, slashCommand);
        slashCommandArray.push(slashCommand.data.toJSON());

        if (!slashCommand.data.name) {
          Table.addRow(slashCommand.data.name, "🔶 LỖI Ở TÊN LỆNH(NAME)");
        } else if (!slashCommand.data.description) {
          Table.addRow(slashCommand.data.name, "🔶 LỖI Ở MÔ TẢ LỆNH(DESCRIPTION)");
        }

        Table.addRow(slashCommand.data.name, "🔷 THÀNH CÔNG");
      }
      console.log(Table.toString());
    }

    const rest = new REST({ version: "10" }).setToken(client.config.token);
    const clientId = client.config.clientId;
    // const guildId = client.config.guildId;
    try {
      console.log(
        "[SLASH COMMANDS] Started refreshing application (/) commands."
      );

      // await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      //     body: client.commandArray,
      // });

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.slashCommandArray,
      });

      console.log(
        "[SLASH COMMANDS] Successfully reloaded application (/) commands."
      );
    } catch (error) {
      console.error(error);
    }
  };
};
