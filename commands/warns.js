module.exports = {
  name: 'warns',
  async execute(message, args, { warns }) {

    const user = message.mentions.users.first() || message.author;

    const count = warns[user.id] || 0;

    message.channel.send(`⚠️ ${user.tag} a ${count} warn(s)`);
  }
};