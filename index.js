require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Register slash command
client.once('ready', async () => {
    const commands = [{
        name: 'calendar',
        description: 'แสดงปฏิทินของเดือนนี้'
    }];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('ลงทะเบียนคำสั่งเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
    }
    console.log('บอทพร้อมใช้งาน');
});

// Function to generate a calendar for the current month
function generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let calendar = `**${monthName} ${year}**\n`;
    calendar += 'Su Mo Tu We Th Fr Sa\n';

    let day = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendar += '   ';
            } else if (day > daysInMonth) {
                calendar += '   ';
            } else {
                calendar += day < 10 ? ` ${day} ` : `${day} `;
                day++;
            }
        }
        calendar += '\n';
    }

    return calendar;
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'calendar') {
        const calendar = generateCalendar();
        await interaction.reply(`\`\`\`\n${calendar}\`\`\``);
    }
});

client.login(process.env.DISCORD_TOKEN);
