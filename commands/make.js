const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require("discord.js");

const sessions = {};

module.exports = {
  name: "make",

  async execute(message) {

    sessions[message.author.id] = {
      title: "Titre",
      description: "Description",
      color: "#5865F2"
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("mk_title")
        .setLabel("Titre")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("mk_desc")
        .setLabel("Description")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("mk_color")
        .setLabel("Couleur")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("mk_preview")
        .setLabel("Preview")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("mk_send")
        .setLabel("Envoyer")
        .setStyle(ButtonStyle.Danger)
    );

    return message.channel.send({
      content: "🎛️ Créateur d'embed",
      components: [row]
    });
  },

  sessions
};
