const express = require('express');
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');

const app = express();
const port = process.env.PORT || 3978;


const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});


const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);


adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${error}`);
    await context.sendActivity('Oops. Something went wrong!');
    await conversationState.delete(context);
};


const bot = {
    onTurn: async (context) => {
        if (context.activity.type === 'message') {
            const userText = context.activity.text;
            await context.sendActivity(`You said: ${userText}`);
        } else {
            await context.sendActivity(`[${context.activity.type} event detected]`);
        }
    }
};


app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.onTurn(context);
    });
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
