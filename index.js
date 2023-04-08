require('dotenv').config();
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js')
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

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'search') {
    const query = interaction.options.getString('query');
    await interaction.reply({ content: `Searching for tourist attractions related to "${query}"...`, ephemeral: true });
    
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: `What are the top 5 tourist attractions in ${query}? Add a description of each.`,
      max_tokens: 2000,
      n: 1,
      stop: '###'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    
    
    console.log(response.data.choices)
    const result = response.data.choices[0].text;
    //const result = response.data.choices[0].text.trim();
    
    if (result === '') {
      //await interaction.editReply({ content: `No results found for "${query}".`, ephemeral: true });
      console.log("no result")
    } else {
      await interaction.editReply({ content: result, ephemeral: true });
    }
  }
});

client.on('ready', async () => {
  const guildId = '1093941116816072796';
  const guild = await client.guilds.cache.get(guildId);
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
          type: 3,
          description: 'The location to search for',
          required: true,
        }
      ]
    }
  ];

  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.BOT_TOKEN);