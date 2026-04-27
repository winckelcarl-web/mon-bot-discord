module.exports = {
  name: "ping",

  async execute(message, args, client) {

    const sent = await message.reply("🏓 Calcul du ping...");

    const latency = sent.createdTimestamp - message.createdTimestamp;

    sent.edit(`🏓 Pong !\n📡 Latence: ${latency}ms`);
  }
};
