const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "rolebutton",

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#8991e6")
      .setTitle("🎭 Obtenir le rôle @Updates")
      .setDescription("Clique sur le bouton pour recevoir ton rôle !");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('Rôle @Updates')
        .setLabel('🎉 Recevoir le rôle')
        .setStyle(ButtonStyle.Success)
    );

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};