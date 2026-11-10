require('dotenv').config();

const token = process.env.BOT_TOKEN;
const { Telegraf } = require('telegraf');

console.log('Токен существует:', Boolean(token));
console.log('Длина токена:', token ? token.length : 0);
console.log('Есть пробелы:', /\s/.test(token || ''));

const bot = new Telegraf(token);

bot.telegram.getMe()
    .then((user) => {
        console.log('Telegram OK:', user.username);
        console.log('Bot ID:', user.id);
    })
    .catch((error) => {
        console.log('Telegram ERROR:', error.response?.error_code);
        console.log('Описание:', error.response?.description);
    });