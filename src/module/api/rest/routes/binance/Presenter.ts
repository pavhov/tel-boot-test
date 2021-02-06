import {Context, Next} from "koa";

import {Get, Presenter} from "../../../../../lib/decorators/Koa";
import Telegram         from "../../../../task/Telegram";


/**
 * @name BinancePresenter
 */
@Presenter({path: "/binance"})
export default class BinancePresenter {
    /**
     * @name stories
     * @private
     */
    private stories: {};

    /**
     * @name BinancePresenter
     */
    constructor() {
    }

    /**
     * @name "/getAllTradingPairs"
     * @param context
     * @param next
     */
    @Get()
    async "/init"(context: Context, next: Next) {
        try {
            const {key, secret} = context.request.query;
            if (!key || !secret) {
                return await context.throw(new Error(`Query properties "key" "secret" are required`), 400);
            }
            await Telegram.instance().startBot(key, secret);
        } catch (e) {
            await context.throw(e, 400);
        }
    }

    /**
     * @name "/getAllTradingPairs"
     * @param context
     * @param next
     */
    @Get()
    async "/destroy"(context: Context, next: Next) {
        try {
            await Telegram.instance().stopBot();
        } catch (e) {
            context.throw(e, 400);
        }
    }

    /**
     * @name "/getAllTradingPairs"
     * @param context
     * @param next
     */
    @Get()
    async "/getAllTradingPairs"(context: Context, next: Next) {
        try {
            const {pair} = context.request.query;
            if (!pair) {
                return await context.throw(new Error(`Query property "pair" is required`), 400);
            }
            await Telegram.instance().getAllTradingPairs(pair);
        } catch (e) {
            context.throw(e, 400);
        }
    }

    /**
     * @name "/createAlert"
     * @param context
     * @param next
     */
    @Get()
    async "/createAlert"(context: Context, next: Next) {
        context.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        try {
            const {pair, price} = context.request.query;
            if (!pair || !price) {
                return await context.throw(new Error(`Query properties "pair" and "price" are required`), 400);
            }
            let close = false;
            while (!close) {
                await new Promise((resolve, reject) => {
                    Telegram.instance().createAlert(pair, price, null, (data: string, changeClose: boolean) => {
                        context.res.write(`\n${data}\n`);
                        close = changeClose;
                        if (changeClose) {
                            resolve(null);
                        }
                    });
                });
            }
            context.res.end();
        } catch (e) {
            context.throw(e, 400);
        }
    }

    /**
     * @name "/getUserBalance"
     * @param context
     * @param next
     */
    @Get()
    async "/getUserBalance"(context: Context, next: Next) {
        try {
            await Telegram.instance().getUserBalance();
        } catch (e) {
            context.throw(e, 400);
        }
    }
}
