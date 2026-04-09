const ROLE_AUTORISES = [
  "1451906852777627710",
  "1485265258984505545",
  "1451906853955965150",
];

module.exports = {
  name: "unlock",

  async execute(message) {

    const hasPermission = ROLE_AUTORISES.some(roleId =>
      message.member.roles.cache.has(roleId)
    );

    if (!hasPermission) {
      return message.reply("❌ Tu n’as pas la permission.");
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: null
      });

      message.channel.send("🔓 Salon déverrouillé !");
    } catch (err) {
      console.error(err);
      message.reply("❌ Erreur");
    }
  }
};