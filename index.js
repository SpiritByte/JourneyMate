require('dotenv').config();
const axios = require('axios');
const { Client, MessageEmbed, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      // ...
  ]
})

client.once('ready', () => {
  console.log('JourneyMate Jr. is ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'search') {
    const query = interaction.options.getString('query');
    await interaction.reply({
      content: `Searching for tourist attractions related to "${query}"...`,
      ephemeral: false,
    });

    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `What are the top 5 tourist attractions in ${query}? Add a description of each.`,
        max_tokens: 200,
        n: 1,
        stop: '###',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data.choices);
    const result = response.data.choices[0].text.trim();

    if (result === '') {
      await interaction.editReply({ content: `No results found for "${query}".`, ephemeral: false });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Tourist attractions in ${query}`)
        .setDescription(result)
        .setTimestamp();
      
      await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
    }
  }
});

client.on('ready', async () => {
  const guildId = process.env.GUILD_ID;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const botToken = process.env.BOT_TOKEN;
  const apiToken = process.env.API_TOKEN;;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.log(`Unable to fetch guild with ID ${guildId}`);
    return;
  }

  const commands = [
    {
      name: 'search',
      description: 'Search for tourist attractions in a specific location',
      options: [
        {
          name: 'query',
          type: 'STRING',
          description: 'The location to search for',
          required: true,
        },
      ],
    },
  ];

  const rest = new REST({ version: '9' }).setToken(botToken);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.BOT_TOKEN);
