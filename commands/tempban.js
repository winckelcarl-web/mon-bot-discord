const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'tempban',

  async execute(message, args, { hasRole }) {

    // 🔒 Permission
    if (!hasRole && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("❌ Permission refusée");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("❌ Mentionne un utilisateur");
    }

    // ⏱️ Durée
    const time = args[1];
    if (!time) {
      return message.reply("❌ Donne une durée (ex: 10s, 5m, 1h)");
    }

    const duration = parseDuration(time);
    if (!duration) {
      return message.reply("❌ Format invalide (ex: 10s, 5m, 1h)");
    }

    try {
      // 🔨 Ban
      await member.ban({ reason: "Tempban" });

      message.channel.send(`⛔ ${member.user.tag} a été ban pendant ${time}`);

      // ⏳ Unban après la durée
      setTimeout(async () => {
        try {
          await message.guild.members.unban(member.user.id);
          message.channel.send(`✅ ${member.user.tag} a été unban automatiquement`);
        } catch (err) {
          console.error(err);
        }
      }, duration);

    } catch (err) {
      console.error(err);
      message.reply("❌ Erreur lors du ban");
    }
  }
};

// ⏱️ Fonction durée
function parseDuration(time) {
  const match = time.match(/^(\d+)(s|m|h)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60000;
  if (unit === 'h') return value * 3600000;
}