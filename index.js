const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5603012054:AAG-Rsmzz8X-3lZP9d9N0kRFSJRR72e6pMc";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я загадаю одну цифру от 0 до 9, а вы дожны угадать ее"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Поехали!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Запустить бота" },
    { command: "/info", description: "Как меня зовут?" },
    { command: "/game", description: "Играть в угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот ADI    `);
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Вас зовут ${msg.from.first_name} `);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `Я вас не понимаю!`);
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  if (data === "/again") {
    return startGame(chatId);
  }
  if (data == chats[chatId]) {
    return await bot.sendMessage(
      chatId,
      `Поздравляю! Вы правильно отгадали цифру "${data}"`,
      againOptions
    );
  } else {
    return await bot.sendMessage(
      chatId,
      `К сожалению вы не угадали! \n Бот загадал цифру "${chats[chatId]}" `,
      againOptions
    );
  }
});

start();
