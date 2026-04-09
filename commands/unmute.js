const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',

  async execute(message, args, { hasRole }) {

    // 🔒 Vérif permission
    if (!hasRole && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Permission refusée");
    }

    // 👤 Utilisateur
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("❌ Mentionne un utilisateur");
    }

    // 🔓 Vérifier si il est mute
    if (!member.isCommunicationDisabled()) {
      return message.reply("❌ Cet utilisateur n'est pas mute");
    }

    try {
      // ⛔ Retirer le timeout
      await member.timeout(null);

      return message.channel.send(`🔊 ${member.user.tag} a été unmute`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Erreur lors du unmute");
    }
  }
};