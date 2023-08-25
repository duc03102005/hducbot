const fs = require("fs");
const Ascii = require("ascii-table");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;

      const Table = new Ascii("Prefix Commands Loaded");
      Table.setHeading("Command", "Status");

      for (const file of commandFiles) {
        let command = require(`../../commands/${folder}/${file}`);

        if (command.data.name) {
          commands.set(command.data.name, command);
        } else {
          Table.addRow(command.data.name, "🔶 LỖI Ở TÊN LỆNH(NAME)");
        }

        if (
          command.data.aliases &&
          Array.isArray(command.data.aliases)
        ) {
          command.data.aliases.forEach((alias) => {
            commands.set(alias, command);
          });
        }

        // console.log(`Loaded prefix command: ${command.data.name}`);

        if (!command.data.name) {
          Table.addRow(command.data.name, "🔶 LỖI Ở TÊN LỆNH(NAME)");
        }

        Table.addRow(command.data.name, "🔷 THÀNH CÔNG");
      }
      console.log(Table.toString());
    }
  };
};
