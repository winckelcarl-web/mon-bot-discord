module.exports = {
  name: 'unwarn',
  async execute(message, args, { warns, saveWarns, hasRole }) {

    if (!hasRole) return message.reply("❌ Permission refusée");

    const user = message.mentions.users.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur");

    if (!warns[user.id]) return message.reply("❌ Aucun warn");

    warns[user.id]--;

    if (warns[user.id] <= 0) delete warns[user.id];

    saveWarns();

    message.channel.send(`✅ Warn retiré`);
  }
};