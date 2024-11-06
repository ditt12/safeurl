require('dotenv').config();
const { Telegraf } = require('telegraf');
const xss = require('xss');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    '👋 Hai! Saya adalah SafeURLBot.\n\n' +
    'Berikut adalah cara penggunaannya:\n' +
    '1. Kirimkan URL yang ingin Anda cek.\n' +
    '2. Saya akan memberitahu Anda apakah URL tersebut aman atau rentan terhadap XSS.\n\n' +
    'Contoh:\n' +
    'https://example.com\n\n' +
    'Jika Anda ingin memulai, kirimkan URL pertama Anda!'
  );
});

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;

  const urlRegex = /https?:\/\/[^\s]+/;
  const match = userMessage.match(urlRegex);

  if (match) {
    const url = match[0];

    try {
      const isVulnerable = xss(url) !== url;

      if (isVulnerable) {
        ctx.reply(`🚨 URL ${url} berpotensi rentan terhadap XSS!`);
      } else {
        ctx.reply(`✅ URL ${url} aman dari XSS.`);
      }
    } catch (error) {
      ctx.reply('❌ Terjadi kesalahan saat memeriksa URL.');
    }
  } else {
    ctx.reply('🔍 Kirimkan URL yang ingin dicek!');
  }
});

bot.launch();
