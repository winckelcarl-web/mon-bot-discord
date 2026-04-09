const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor("#0e582a")
      .setTitle("📚 Aide du bot")
      .setDescription("Voici toutes les commandes disponibles :")

      .addFields(
        {
          name: "🛠️ Modération",
          value:
            "`!warn @user [raison]`\n" +
            "`!unwarn @user`\n" +
            "`!warns @user`\n" +
            "`!mute @user [temps]`\n" +
            "`!unmute @user`\n" +
            "`!tempban @user [temps]`",
          inline: false
        },
        {
          name: "🔒 Gestion des salons",
          value:
            "`!lock`\n" +
            "`!unlock`",
          inline: false
        },
        {
          name: "📊 Utilitaires",
          value:
            "`!help` → affiche ce menu",
          inline: false
        }
      )

      .setFooter({
        text: `Demandé par ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      })

      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};