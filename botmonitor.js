require("dotenv").config();

//telegram api
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, {polling: true});
const { Op } = require('sequelize')

//notion api
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const https = require('https');

//подключение к БД PostreSQL
const sequelize = require('./botmonitor/connections/db')

const PORT = process.env.PORT || 8003;

const app = express();

app.use(express.json());
app.use(cors());


// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/privkey.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/cert.pem', 'utf8');
const ca = fs.readFileSync('chain.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const firstname = msg.from.first_name
    const lastname = msg.from.last_name
    const text = msg.text ? msg.text : '';
    const messageId = msg.message_id;
    const fromId = msg.from.id;
    const isBot = msg.from.is_bot;
    //console.log("msg: ", msg)
    //console.log("text: ", text)

    try {
        // обработка команд
        // команда Старт
        if (text === '/start') {

        }

    } catch (error) {
        console.log('Произошла непредвиденная ошибка! ', error.message)
    }

});

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        
        httpsServer.listen(PORT, async () => {
            console.log('HTTPS Server Bot Monitor running on port ' + PORT);


            // начало цикла ----------------------------------------------------------------------
            // 86400 секунд в дне
            var minutCount = 0;
            // повторить с интервалом каждые 1 минуту
            let timerId = setInterval(async() => {
                minutCount++  // a day has passed
                await bot.sendMessage(chatId, 'Тревога! Бот заказчика не отвечает!')
            }, 60000); //каждую 1 минут

            // остановить вывод через 30 дней
            if (minutCount == 43200) {
                clearInterval(timerId);
            }
 
        });

    } catch (error) {
        console.log('Подключение к БД сломалось!', error.message)
    }
}

start()