const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`[READY] ${client.user.tag} is ready!`);
    const activities = [
      {
        name: `cho ${
          client.guilds.cache.size
        } máy chủ với ${client.guilds.cache.reduce(
          (a, b) => a + b.memberCount,
          0
        )} người xem`,
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/",
      },
      { name: "nhạc cùng hduc", type: ActivityType.Listening },
    ];
    client.user.setPresence({ status: "online", activity: activities[0] });
    let activity = 1;
    setInterval(() => {
      activities[2] = {
        name: `🏓Ping: ${client.ws.ping}ms !`,
        type: ActivityType.Playing,
      };
      if (activity > 2) activity = 0;
      client.user.setActivity(activities[activity]);
      activity++;
    }, 5000);
  },
};
