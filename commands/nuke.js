module.exports = {
  name: "nuke",

  async execute(message) {

    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply("❌ Pas la permission.");
    }

    const channel = message.channel;

    const newChannel = await channel.clone();
    await channel.delete();

    newChannel.send("💥 Salon réinitialisé !");
  }
};
