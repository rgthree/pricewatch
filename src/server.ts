import {AmazonPriceChecker} from './amazon_watcher';
import {TelegramBot} from './telegrambot';

const TELEGRAM_API_KEY = 'YOUR_API_KEY';
const TELEGRAM_CHAT_ID = 'YOUR_API_KEYCHAT_ID';

const MS_MINUTES = 1000 * 60;
const BASE_TIMEOUT = MS_MINUTES * 2;

const priceChecker = new AmazonPriceChecker('B08KB652Q2');
const telegram = new TelegramBot(TELEGRAM_API_KEY, TELEGRAM_CHAT_ID);

/**
 * Checks the price with `priceChecker`, issues a message with `telegram` if
 * it meets our threshold, and schedules another check.
 */
async function check() {
  let timeout = BASE_TIMEOUT;
  try {
    const {url, price} = await priceChecker.check();

    if (price) {
      if (price <= 320) {
        telegram.sendMessage(`Price is: ${price}. Checking again in ${timeout / MS_MINUTES} minutes. ${url}`);
      }
    } else {
      // If we can't parse the price, maybe something's wrong. We'll slow down
      // our interval a bit.
      timeout += MS_MINUTES * 5;
      telegram.sendMessage(`Could not parse price. Trying again in ${timeout / MS_MINUTES}. ${url}`);
    }

  } catch(e) {
    timeout += MS_MINUTES * 5;
    telegram.sendMessage(`There was an error fetching the price. Will check again in ${timeout / MS_MINUTES} minutes.`);
    console.error(e);
  }

  // Rince & repeat.
  setTimeout(() => { check(); }, timeout);
}

// Start it!
check();

console.log('Checker Started. Stop with Ctrl + C.');
