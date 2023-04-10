require('dotenv').config()
const cheerio = require("cheerio");
const unirest = require("unirest");
const got = require('got');
const axios = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,

  ]
})

client.once('ready', () => {
  console.log('JourneyMate is ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  //-- Search Command --\\

  if (interaction.commandName === 'search') {
    const location = interaction.options.getString('location');
    await interaction.reply({
      content: `Searching for tourist attractions related to "${location}"...`,
      ephemeral: false,
    });

    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `What are the top 5 tourist attractions in ${location}? Add a description of each.`,
        max_tokens: 2000,
        n: 1,
        stop: '###',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      
      });

    // console.log(response.data.choices);
    const result = response.data.choices[0].text.trim();
    const channel = "1093941117898199146"

    if (result === '') {
      await interaction.editReply({ content: `No results found for "${location}".`, ephemeral: false });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png')        
        .setFooter({ text: 'Made By Alex', iconURL: 'https://cdn.discordapp.com/avatars/1063325041145675776/f8d92a67c6b90d41c9c850f88f26de61.webp?size=512&width=0&height=0'})
        .setTitle(`__Tourist Attractions In ${location}__`)
        .setDescription(result)
        .setTimestamp()
        .setAuthor({ name: 'JourneyMate V1.0.0', iconURL: 'https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png', url: 'https://journeymate.rf.gd'})
      await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
    }}

  //-- Search Command --\\

  if (interaction.commandName === 'random') {
    const location = interaction.options.getString('location');
    await interaction.reply({
      content: `Searching for a random tourist attraction...`,
      ephemeral: false,
    });

    const response3 = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `Give me a completly random tourist destination. Give me a lot of details.`,
        max_tokens: 2000,
        n: 1,
        stop: '###',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      
      });

    // console.log(response.data.choices);
    const result3 = response3.data.choices[0].text.trim();
    const channel = "1093941117898199146"

    if (result3 === '') {
      await interaction.editReply({ content: `No results found for "${location}".`, ephemeral: false });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png')        
        .setFooter({ text: 'Made By Alex', iconURL: 'https://cdn.discordapp.com/avatars/1063325041145675776/f8d92a67c6b90d41c9c850f88f26de61.webp?size=512&width=0&height=0'})
        .setTitle(`__Random Tourist Destination__`)
        .setDescription(result3)
        .setTimestamp()
        .setAuthor({ name: 'JourneyMate V1.0.0', iconURL: 'https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png', url: 'https://journeymate.rf.gd'})
      await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
    }}

  //-- Detail Command --\\

  if (interaction.commandName === 'details') {
    const location = interaction.options.getString('location');
    await interaction.reply({
      content: `Getting more details about "${location}"...`,
      ephemeral: false,
    });

    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `Give me more details about ${location}. Add 1 new line after your answer.`,
        max_tokens: 2000,
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

    const response2 = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `Give me more details about ${location}. Talk about: the type of transportation (and how you can get there), information about the hotels (with examples), and the type of food, as well as some restaurants. These all need to be near the tourist attraction. Super important to give examples for each. Format them like Transportation: Hotels: Foods:.`,
        max_tokens: 2000,
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

    // console.log(response.data.choices);
    // console.log(response2.data.choices);
    const result = response.data.choices[0].text.trim()
    const result2 = response2.data.choices[0].text.trim();

    if (result === '') {
      await interaction.editReply({ content: `No results found for "${location}".`, ephemeral: false });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png')
        .setFooter({ text: 'Made By Alex', iconURL: 'https://cdn.discordapp.com/avatars/1063325041145675776/f8d92a67c6b90d41c9c850f88f26de61.webp?size=512&width=0&height=0'})
        .setTitle(`__More Details About ${location}__`)
        .setDescription(`${result} \n\n ${result2}`)
        .setTimestamp()
        .setAuthor({ name: 'JourneyMate V1.0.0', iconURL: 'https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png', url: 'https://journeymate.rf.gd' });
      
      await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
    }

    axios.get(`https://api.serpdog.io/images?api_key=64335ff81969f97a0acb9bbb&q=${location}-flag&gl=us`)
    .then(response => {
      // console.log(response.data.image_results[0].thumbnail);
      let embed1 = new EmbedBuilder()
        .setURL('https://journeymate.rf.gd')
        .setImage(response.data.image_results[0].thumbnail)
        .setColor('#0099ff')
        .setTitle(`**__Some Pictures Of ${location}__**`)

      let embed2 = new EmbedBuilder()
        .setURL('https://journeymate.rf.gd')
        .setImage(response.data.image_results[1].thumbnail)
        .setColor('#0099ff')
        .setTitle(`**__Some Pictures Of ${location}__**`)
    
      let embed3 = new EmbedBuilder()
        .setURL('https://journeymate.rf.gd')
        .setImage(response.data.image_results[2].thumbnail)
        .setColor('#0099ff')
        .setTitle(`**__Some Pictures Of ${location}__**`)
    
      let embed4 = new EmbedBuilder()
        .setURL('https://journeymate.rf.gd')
        .setImage(response.data.image_results[3].thumbnail)
        .setColor('#0099ff')
        .setTitle(`**__Some Pictures Of ${location}__**`)
      
      interaction.channel.send({embeds: [embed1, embed2, embed3, embed4]});
    })

  }

  //-- Image Command --\\
  if (interaction.commandName === 'image') {
    // console.log(interaction);
    // console.log(interaction.options._hoistedOptions[0])
    // console.log(interaction.options._hoistedOptions[0].attachment.url)
    const attachment = interaction.options._hoistedOptions[0].attachment.url;
    const imageUrl = attachment;
    await interaction.reply({
      content: `Retrieving more information...`,
      ephemeral: false,
    });
    

    const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

    const response = await got(url, {username: 'acc_3b529c3ec3e9240', password: 'ed77f11a7cd9929db6d4d378952ef856'});
    // console.log(JSON.parse(response.body).result.tags)

    confidenceOne = JSON.parse(response.body).result.tags[0].confidence
    confidenceTwo = JSON.parse(response.body).result.tags[1].confidence
    confidenceThree = JSON.parse(response.body).result.tags[2].confidence
    confidenceFour = JSON.parse(response.body).result.tags[3].confidence
    confidenceFive = JSON.parse(response.body).result.tags[4].confidence

    responseOne = JSON.parse(response.body).result.tags[0].tag.en
    responseTwo = JSON.parse(response.body).result.tags[1].tag.en
    responseThree = JSON.parse(response.body).result.tags[2].tag.en
    responseFour = JSON.parse(response.body).result.tags[3].tag.en
    responseFive = JSON.parse(response.body).result.tags[4].tag.en


    const response2 = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `Find me a place that satisfies 4 of 5 of these conditions: ${responseOne}, ${responseTwo}, ${responseThree}, ${responseFour}, ${responseFive}. Start with the name, then go into the details about the place.`,
        max_tokens: 2000,
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

    // console.log(response2.data.choices);
    // console.log(JSON.parse(response.body).result.tags)
    const result2 = response2.data.choices[0].text.trim();
    const result = response;
    
    if (result2 === '') {
      await interaction.editReply({ content: `No results found.`, ephemeral: false });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png')
        .setFooter({ text: 'Made By Alex', iconURL: 'https://cdn.discordapp.com/avatars/1063325041145675776/f8d92a67c6b90d41c9c850f88f26de61.webp?size=512&width=0&height=0'})
        .setTitle(`__Here Is What I Found About Your Image__`)
        .setDescription(`\n**I think that the image contains:** \n1. __${responseOne}__, with a certainty of ${Math.round(confidenceOne)}%\n2. __${responseTwo}__, with a certainty of ${Math.round(confidenceTwo)}%\n3. __${responseThree}__, with a certainty of ${Math.round(confidenceThree)}%\n4. __${responseFour}__, with a certainty of ${Math.round(confidenceFour)}%\n5. __${responseFive}__, with a certainty of ${Math.round(confidenceFour)}%\n\nAnother tourist attraction I suggest would be ${result2}`)
        .setTimestamp()
        .setAuthor({ name: 'JourneyMate V1.0.0', iconURL: 'https://cdn.discordapp.com/attachments/1093941117898199146/1094716894948376687/JourneyMate.png', url: 'https://journeymate.rf.gd'  });
      
      await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
    }
  }
});

client.on('ready', async () => {
  const apiKey = process.env.IMAGGA_KEY;
  const apiSecret = process.env.IMAGGA_SECRET;
  const guildId = process.env.GUILD_ID;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const botToken = process.env.BOT_TOKEN;
  const apiToken = process.env.API_TOKEN;

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
          name: 'location',
          type: 3,
          description: 'e.g. Canada | Moscow | New York',
          required: true,
        },
      ],
    },
    {
      name: 'random',
      description: 'Searches for a completly random tourist destination',
      options: [],
    },
    {
      name: 'details',
      description: 'Get the details about a specific attraction',
      options: [
        {
          name: 'location',
          type: 3,
          description: 'e.g. CN Tower | Empire State Building | Eiffel Tower',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      description: 'Finds related tourist attractions similar to the attachment',
      options: [
        {
          name: 'attachment',
          type: 11,
          description: 'The image that is being uploaded',
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
