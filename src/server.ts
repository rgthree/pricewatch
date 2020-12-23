import {AmazonPriceChecker} from './amazon_watcher';
import {TelegramBot} from './telegrambot';

const TELEGRAM_API_KEY = 'YOUR_API_KEY';
const TELEGRAM_CHAT_ID = 'YOUR_API_KEYCHAT_ID';

// The Amazon product id. The XXX in
// https://www.amazon.com/dp/XXX or https://www.amazon.com/gp/product/XXX
const AMAZON_PRODUCT_ID = 'B07YN45T61';
const TARGET_PRICE = 10;

const MS_MINUTES = 1000 * 60;
const BASE_TIMEOUT = MS_MINUTES * 2;

const telegram = new TelegramBot(TELEGRAM_API_KEY, TELEGRAM_CHAT_ID);
const priceChecker = new AmazonPriceChecker(AMAZON_PRODUCT_ID);

/**
 * Checks the price with `priceChecker`, issues a message with `telegram` if
 * it meets our threshold, and schedules another check.
 */
async function check() {
  let timeout = BASE_TIMEOUT;
  try {
    const {url, price} = await priceChecker.check();

    if (price) {
      if (price <= TARGET_PRICE) {
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
