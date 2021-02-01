import BinanceAPI, {Binance as CommonBinance} from "binance-api-node";
import CModule                                from "../../lib/abstract/CModule";
import Params                                 from "./../../lib/utils/config/Params";
import {ModuleInt}                            from "../../lib/decorators/CModule";

@ModuleInt
export default class Binance extends CModule {
    private static _instance: Binance;

    constructor() {
        super();
        if (!Binance._instance) {
            Binance._instance = this;
        }
    }

    private _binance_api: CommonBinance;

    get binance_api(): CommonBinance {
        return this._binance_api;
    }

    set binance_api(value: CommonBinance) {
        // this._binance_api = value;
    }

    private _apiKey: string;

    get apiKey(): string {
        return this._apiKey;
    }

    set apiKey(value: string) {
        // this._apiKey = value;
    }

    private _apiSecret: string;

    get apiSecret(): string {
        return this._apiSecret;
    }

    set apiSecret(value: string) {
        // this._apiSecret = value;
    }

    static instance(): Binance {
        return this._instance;
    }

    protected async context(): Promise<void> {
        this._apiKey = Params["binance_api_key"];
        this._apiSecret = Params["binance_api_secret"];
        this._binance_api = BinanceAPI({
            apiKey: this.apiKey,
            apiSecret: this.apiSecret,
        });
        return Promise.resolve(undefined);
    }

    protected destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
