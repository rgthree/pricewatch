# pricewatch

A super simple bot/script that scrapes an Amazon product page to get a products price and send a Telegram chat message to a known chat id with an existing Telegram chat bot API.

## How to use.

1. Clone this repo.
2. Install with `npm install`
3. Change the `TELEGRAM_API_KEY` and `TELEGRAM_CHAT_ID` in the `server.ts`
4. Build the TypeScript with `tsc`
5. Run with NodeJS: `node ./dist/server.js`

## Don't have a Telegram bot?

Follow the super-simple steps here at https://dev.to/rgthree/personal-telegram-bot-for-alerting-your-phone-w-o-code-1oih

### Use at your own discretion

I make no guarantees that this will work for you, any particular product, or that the external services will not rate limit or block your requests, etc.
