module.exports = {
  name: 'warn',
  async execute(message, args, { warns, saveWarns, hasRole }) {

    if (!hasRole) return message.reply("❌ Permission refusée");

    const user = message.mentions.users.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur");

    if (!warns[user.id]) warns[user.id] = 0;

    warns[user.id]++;

    saveWarns();

    message.channel.send(`⚠️ ${user.tag} a été warn (${warns[user.id]})`);
  }
};