require('dotenv').config();
const axios = require('axios');
const { Client, MessageEmbed, Intents, MessageActionRow, MessageButton, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
        .setColor('#00ffbb')
        .setTitle(`Tourist attractions in ${query}`)
        .setDescription(result)
        .setTimestamp();
      
      const msg = await interaction.editReply({content: "", embeds: [embed], ephemeral: false });
      await msg.react('⬅️');
      await msg.react('➡️');
      await msg.react('🔄');
      
      const reactions = ['⬅️', '➡️', '🔄'];

      const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id !== client.user.id;
      };

      const collector = msg.createReactionCollector({ filter, time: 5000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '➡️') {
          await reaction.users.remove(user.id);
          await msg.reactions.cache.find(r => r.emoji.name === '➡️').users.remove(user.id);
          await msg.reactions.cache.find(r => r.emoji.name === '⬅️').users.remove(user.id);
          await msg.reactions.cache.find(r => r.emoji.name === '🔄').users.remove(user.id);

          const attractionNumber = parseInt(result.split('\n').find(line => line.startsWith('1.'))?.charAt(0));
          if (!attractionNumber) {
            await interaction.followUp({ content: "Sorry, I couldn't find any attractions to show more information about.", ephemeral: false });
            return;
          }

          const attractions = result.split(`${attractionNumber}. `);
          if (attractions.length < 2) {
            await interaction.followUp({ content: "Sorry, I couldn't find any attractions to show more information about.", ephemeral: false });
            return;
          }

          const attractionDescription = attractions[1].split(/^[0-9]+\./)[0].trim();
          const attractionEmbed = new EmbedBuilder()

          .setColor('#00ffbb')
          .setTitle(`${attractionNumber}. ${attractions[0]}`)
          .setDescription(attractionDescription)
          .setTimestamp();

          await interaction.followUp({ content: "Here's more information about the attraction:", embeds: [attractionEmbed], ephemeral: false });
        }
      });
    
      collector.on('end', async (collected) => {
        await interaction.followUp({ content: 'No more reactions will be collected.', ephemeral: false });
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);