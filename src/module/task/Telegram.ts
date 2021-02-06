import TelegramBot                                         from "node-telegram-bot-api";
import BinanceAPI, {Binance, ReconnectingWebSocketHandler} from "binance-api-node";

import CModule     from "../../lib/abstract/CModule";
import Params      from "./../../lib/utils/config/Params";
import {ModuleInt} from "../../lib/decorators/CModule";
import {tsv}       from "../../lib/utils/tsv/Parser";

@ModuleInt
export default class Telegram extends CModule {
    private static _instance: Telegram;
    private _api_token: string;
    private _telegram_bot: TelegramBot;
    private _binance_api: Binance;
    private _aggTrades_ws: ReconnectingWebSocketHandler;

    constructor() {
        super();
        if (!Telegram._instance) {
            Telegram._instance = this;
        }
    }

    static instance(): Telegram {
        return this._instance;
    }

    public help = async (msg) => {
        await this._telegram_bot.sendMessage(msg.chat.id, `
                Commands
                    /start "key" "secret"
                    /getAllTradingPair
                    /alert "pair" "example: ETHBTC" "price" "example 0.04169700"
                    /getUserBalance pair "example: ETHBTC"
            `);
    }

    public stopBot = async (msg?: TelegramBot.Message) => {
        this._binance_api = undefined;
        if (this._aggTrades_ws) {
            this._aggTrades_ws({delay: 0, keepClosed: false, fastClose: true});
        }
        await this._telegram_bot.sendMessage(msg.chat.id, "Bye");
    }

    public startBot = async (key: string, secret: string, msg?: TelegramBot.Message) => {
        if (!this._binance_api) {
            this._binance_api = BinanceAPI({
                apiKey: key,
                apiSecret: secret,
            });
            try {
                const info = await this._binance_api.accountInfo();
                if (msg) {
                    return await this._telegram_bot.sendMessage(msg.chat.id, `Hello\n ${tsv.stringify([info])}`);
                }
                return info;
            } catch (e) {
                setImmediate(() => this._telegram_bot = undefined)
                if (msg) {
                    return await this._telegram_bot.sendMessage(msg.chat.id, e.message);
                }
                this._telegram_bot = undefined;
                throw e
            }
        } else {
            const resp = `
                You are started bot, if you want to start another you should stop current with command /stop
                `;
            if (msg) {
                return await this._telegram_bot.sendMessage(msg.chat.id, resp);
            }
            throw resp;
        }
    }

    public getAllTradingPairs = async (pair: string, msg?: TelegramBot.Message) => {
        if (!this._binance_api) {
            return;
        }
        const res = await this._binance_api.aggTrades({symbol: pair, limit: 100});
        let list = [];
        do {
            const swap = res.splice(0, 1)[0];
            list.push({
                symbol: swap.symbol,
                price: swap.price,
            });
            if (list.length === 50) {
                const swap = tsv.stringify(list);
                if (msg) {
                    await this._telegram_bot.sendMessage(msg.chat.id, swap);
                    list = [];
                }
            }
        } while (res.length);
        return list;
    }

    public createAlert = async (pair: string, price: string, msg?: TelegramBot.Message,
                                write?: (data: string, close: boolean) => void
    ) => {
        if (!this._binance_api) {
            return;
        }

        let timer;
        if (this._aggTrades_ws) {
            this._aggTrades_ws({delay: 0, keepClosed: false, fastClose: true});
            this._aggTrades_ws = undefined;
        }
        this._aggTrades_ws = this._binance_api.ws.aggTrades([pair], async trade => {
            if (!this._binance_api) {
                this._aggTrades_ws({delay: 0, keepClosed: false, fastClose: true});
                this._aggTrades_ws = undefined;
                return;
            }
            const [price1, price2] = [parseFloat(trade.price), parseFloat(price)];
            if (!timer && price1 != price2) {
                timer = setTimeout(async () => {
                    const swap = tsv.stringify([{
                        symbol: trade.symbol,
                        price: trade.price,
                    }]);
                    if (msg) {
                        await this._telegram_bot.sendMessage(msg.chat.id, swap);
                    }
                    if (write) {
                        write(swap, !this._binance_api);
                    }
                    clearTimeout(timer);
                    timer = undefined;
                }, 5000);
            }
        });

    }

    public getUserBalance = async (msg?: TelegramBot.Message) => {
        if (!this._binance_api) {
            return;
        }

        const res = await this._binance_api.accountInfo();
        const swap = tsv.stringify([{
            balances: res.balances,
        }]);
        await this._telegram_bot.sendMessage(msg.chat.id, swap);

    }

    protected async context(): Promise<void> {
        this._api_token = Params["telegram_api_token"];
        this._telegram_bot = new TelegramBot(this._api_token, {polling: true});
        this._telegram_bot.onText(/\/help/, (msg) => {
            this.help(msg);
        });
        this._telegram_bot.onText(/\/stop/, (msg) => {
            this.stopBot(msg);
        });
        this._telegram_bot.onText(/\/start/, async (msg, match) => {
            const args: string[] = msg.text.split(" ").splice(1);
            const [key, secret] = [args[0], args[1]];
            await this.startBot(key, secret, msg)
        });
        this._telegram_bot.onText(/\/getAllTradingPairs/, async (msg, match) => {
            const args: string[] = msg.text.split(" ").splice(1);
            await this.getAllTradingPairs(args[0], msg);
        });
        this._telegram_bot.onText(/\/alert/, (msg, match) => {
            const args: string[] = msg.text.split(" ").splice(1);
            const [pair, price] = [args[0], args[1]];
            this.createAlert(pair, price, msg);
        });
        this._telegram_bot.onText(/\/getUserBalance/, (msg) => {
            this.getUserBalance(msg);
        });

        return Promise.resolve(undefined);
    }

    protected destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
