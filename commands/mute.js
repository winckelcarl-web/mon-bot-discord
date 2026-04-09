module.exports = {
  name: 'mute',
  async execute(message, args, { hasRole }) {

    if (!hasRole) return message.reply("❌ Permission refusée");

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur");

    const time = args[1];
    if (!time) return message.reply("❌ Donne une durée (ex: 10s, 5m)");

    await user.timeout(parseDuration(time));

    message.channel.send(`🔇 ${user.user.tag} mute`);
  }
};

function parseDuration(time) {
  const match = time.match(/^(\d+)(s|m|h)$/);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60000;
  if (unit === 'h') return value * 3600000;
}