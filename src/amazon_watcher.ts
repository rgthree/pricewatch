import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';

/**
 * Given a product id, will try to find the current price of the item on the
 * Amazon page.
 */
export class AmazonPriceChecker {

  private readonly url: string;

  constructor(id: string) {
    this.url = `https://www.amazon.com/gp/product/${id}`;
  }

  /**
   * Returns a payload of the url for the product and it's current price, if
   * found. If the price cannot be determined, it will be `NaN`.
   */
  async check() {
    try {
      const response = await this.fetchProductPage();
      const body = await response.text();
      const doc = new JSDOM(body).window.document;
      let price = Number(doc.querySelector('#priceblock_ourprice')?.textContent?.trim().replace('$',''));
      return {url: this.url, price};
    } catch(e) {
      throw new Error(e);
    }
  }

  private async fetchProductPage() {
    return await fetch(this.url, {
      method: 'get',
      headers: {
        'accept-language': 'en-US',
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.11 Safari/537.36',
      }
    });
  }
}

