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
} = require('discord.js');

const fs = require('fs');
const express = require('express');

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

if (fs.existsSync('./commands')) {
  const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
}

// ===== WARN SYSTEM =====
let warns = fs.existsSync('./warns.json')
  ? JSON.parse(fs.readFileSync('./warns.json', 'utf8'))
  : {};

const saveWarns = () => {
  fs.writeFileSync('./warns.json', JSON.stringify(warns, null, 2));
};

// ===== SESSIONS =====
const sessions = {};

// ===== READY =====
client.once('ready', () => {
  console.log(`✅ Connecté : ${client.user.tag}`);

  // ⭐ AJOUT IMPORTANT : statut en ligne
  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: 'je suis en ligne 👀',
        type: ActivityType.Playing
      }
    ]
  });
});

// ===== MESSAGE =====
client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    return command.execute(message, args, client, {
      warns,
      saveWarns
    });
  }

  if (commandName === 'embed') {

    sessions[message.author.id] = {
      title: '',
      description: '',
      color: '#5865F2'
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('title').setLabel('Titre').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('desc').setLabel('Description').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('color').setLabel('Couleur').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('preview').setLabel('Preview').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('send').setLabel('Envoyer').setStyle(ButtonStyle.Danger)
    );

    return message.channel.send({
      content: "🎛️ Création d'embed",
      components: [row]
    });
  }
});

// ===== INTERACTIONS =====
client.on('interactionCreate', async interaction => {

  const session = sessions[interaction.user.id];

  if (interaction.isButton()) {

    if (!session && interaction.customId !== 'give_role') {
      return interaction.reply({
        content: "❌ Lance !embed",
        ephemeral: true
      });
    }

    if (interaction.customId === 'give_role') {

      const roleId = "TON_ID_ROLE";

      try {
        await interaction.member.roles.add(roleId);

        return interaction.reply({
          content: "✅ Rôle ajouté !",
          ephemeral: true
        });

      } catch {
        return interaction.reply({
          content: "❌ Permission refusée",
          ephemeral: true
        });
      }
    }

    if (interaction.customId === 'preview') {

      const embed = new EmbedBuilder()
        .setTitle(session.title || "Titre")
        .setDescription(session.description || "Description")
        .setColor(session.color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'title') {
      const modal = new ModalBuilder()
        .setCustomId('modal_title')
        .setTitle('Titre')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('Titre')
              .setStyle(TextInputStyle.Short)
          )
        );

      return interaction.showModal(modal);
    }

    if (interaction.customId === 'desc') {
      const modal = new ModalBuilder()
        .setCustomId('modal_desc')
        .setTitle('Description')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('desc')
              .setLabel('Description')
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return interaction.showModal(modal);
    }

    if (interaction.customId === 'color') {
      const modal = new ModalBuilder()
        .setCustomId('modal_color')
        .setTitle('Couleur')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('color')
              .setLabel('Couleur HEX (#5865F2)')
              .setStyle(TextInputStyle.Short)
          )
        );

      return interaction.showModal(modal);
    }

    if (interaction.customId === 'send') {

      const embed = new EmbedBuilder()
        .setTitle(session.title)
        .setDescription(session.description)
        .setColor(session.color);

      delete sessions[interaction.user.id];

      await interaction.reply({
        content: "✅ Envoyé",
        ephemeral: true
      });

      return interaction.channel.send({ embeds: [embed] });
    }
  }

  if (interaction.isModalSubmit()) {

    if (!session) return;

    if (interaction.customId === 'modal_title') {
      session.title = interaction.fields.getTextInputValue('title');
    }

    if (interaction.customId === 'modal_desc') {
      session.description = interaction.fields.getTextInputValue('desc');
    }

    if (interaction.customId === 'modal_color') {
      session.color = interaction.fields.getTextInputValue('color');
    }

    return interaction.reply({
      content: "✅ Sauvegardé",
      ephemeral: true
    });
  }
});

// ===== SERVEUR WEB =====
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
process.on("unhandledRejection", err => console.error(err));
process.on("uncaughtException", err => console.error(err));
