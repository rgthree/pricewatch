import fetch from 'node-fetch';

/**
 * Super simple telegram wrapper that sends messages to a bot specific chat.
 */
export class TelegramBot {

  constructor(private botApiKey: string, private chatId: string) {}

  async sendMessage(text: string) {
    return await fetch(`https://api.telegram.org/bot${this.botApiKey}/sendMessage?chat_id=${this.chatId}&text=${encodeURIComponent(text)}`);
  }
}