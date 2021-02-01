import TelegramBot from "node-telegram-bot-api";

import CModule     from "../../lib/abstract/CModule";
import Params      from "./../../lib/utils/config/Params";
import {ModuleInt} from "../../lib/decorators/CModule";
import Binance     from "./Binance";
import {csv}       from "../../lib/utils/tsv/Parser";

@ModuleInt
export default class Telegram extends CModule {
    private static _instance: Telegram;
    private _api_token: string;
    private _telegram_bot: TelegramBot;

    constructor() {
        super();
        if (!Telegram._instance) {
            Telegram._instance = this;
        }
    }

    static instance(): Telegram {
        return this._instance;
    }

    protected async context(): Promise<void> {
        const binance = Binance.instance().binance_api;
        this._api_token = Params["telegram_api_token"];
        this._telegram_bot = new TelegramBot(this._api_token, {polling: true});
        this._telegram_bot.onText(/\/start/, async (msg, match) => {
            console.log(msg, match);
            await this._telegram_bot.sendMessage(msg.chat.id, "Hello");
        });
        this._telegram_bot.onText(/\/getAllTradingPairs/, async (msg, match) => {
            const res = await binance.aggTrades({symbol: "BNBBTC", limit: 100});
            let list = [];
            do {
                const swap = res.splice(0, 1)[0];
                list.push({
                    symbol: swap.symbol,
                    price: swap.price,
                    quantity: swap.quantity,
                });
                if (list.length === 4) {
                    const swap = csv.stringify(list);
                    await this._telegram_bot.sendMessage(msg.chat.id, swap);
                    list = [];
                }
            } while (res.length);

        });
        this._telegram_bot.onText(/\/createAlert/, async (msg, match) => {
            console.log(msg, match);
            for (let rowI = 0; rowI <= 10; ++rowI) {
                await this._telegram_bot.sendMessage(msg.chat.id, `createAlert:${rowI}`);
            }
        });
        this._telegram_bot.onText(/\/getUserBalance/, async (msg, match) => {
            const res = await binance.futuresAccountBalance();
            console.log(res);
        });

        return Promise.resolve(undefined);
    }

    protected destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }

}
