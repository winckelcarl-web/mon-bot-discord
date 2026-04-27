const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ActivityType
} = require("discord.js");

const fs = require("fs");
const express = require("express");

// ===== CONFIG =====
const TOKEN = process.env.DISCORD_TOKEN;

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== COMMANDS =====
client.commands = new Map();

if (fs.existsSync("./commands")) {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
}

// ===== WARN SYSTEM =====
let warns = fs.existsSync("./warns.json")
  ? JSON.parse(fs.readFileSync("./warns.json", "utf8"))
  : {};

const saveWarns = () => {
  fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));
};

// ===== EMBED MAKER SESSIONS =====
const makeCommand = require("./commands/make");
const sessions = makeCommand.sessions || {};

// ===== READY =====
client.once("ready", () => {
  console.log(`✅ Connecté : ${client.user.tag}`);

  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Bot en ligne",
        type: ActivityType.Playing
      }
    ]
  });
});

// ===== MESSAGE COMMANDS =====
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    return command.execute(message, args, client, {
      warns,
      saveWarns
    });
  }

  // fallback help / embed system handled in commands
});

// ===== INTERACTIONS =====
client.on("interactionCreate", async interaction => {

  const session = sessions[interaction.user.id];

  // ===== BUTTONS =====
  if (interaction.isButton()) {

    if (!session && interaction.customId.startsWith("mk_")) {
      return interaction.reply({
        content: "❌ Lance !make",
        ephemeral: true
      });
    }

    // PREVIEW
    if (interaction.customId === "mk_preview") {
      const embed = new EmbedBuilder()
        .setTitle(session.title)
        .setDescription(session.description)
        .setColor(session.color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // SEND
    if (interaction.customId === "mk_send") {

      const embed = new EmbedBuilder()
        .setTitle(session.title)
        .setDescription(session.description)
        .setColor(session.color);

      delete sessions[interaction.user.id];

      await interaction.reply({ content: "✅ Envoyé", ephemeral: true });
      return interaction.channel.send({ embeds: [embed] });
    }

    // MODALS
    const modal = new ModalBuilder();

    if (interaction.customId === "mk_title") {
      modal
        .setCustomId("mk_modal_title")
        .setTitle("Titre")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("title")
              .setLabel("Titre")
              .setStyle(TextInputStyle.Short)
          )
        );

      return interaction.showModal(modal);
    }

    if (interaction.customId === "mk_desc") {
      modal
        .setCustomId("mk_modal_desc")
        .setTitle("Description")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("desc")
              .setLabel("Description")
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return interaction.showModal(modal);
    }

    if (interaction.customId === "mk_color") {
      modal
        .setCustomId("mk_modal_color")
        .setTitle("Couleur HEX")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("color")
              .setLabel("#5865F2")
              .setStyle(TextInputStyle.Short)
          )
        );

      return interaction.showModal(modal);
    }
  }

  // ===== MODALS =====
  if (interaction.isModalSubmit()) {

    if (!session) return;

    if (interaction.customId === "mk_modal_title") {
      session.title = interaction.fields.getTextInputValue("title");
    }

    if (interaction.customId === "mk_modal_desc") {
      session.description = interaction.fields.getTextInputValue("desc");
    }

    if (interaction.customId === "mk_modal_color") {
      session.color = interaction.fields.getTextInputValue("color");
    }

    return interaction.reply({
      content: "✅ Sauvegardé",
      ephemeral: true
    });
  }
});

// ===== WEB SERVER =====
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Bot en ligne !");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Web actif sur ${PORT}`);
});

// ===== LOGIN =====
client.login(TOKEN);

// ===== ANTI CRASH =====
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
