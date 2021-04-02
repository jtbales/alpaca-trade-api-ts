"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpacaClient = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const qs_1 = __importDefault(require("qs"));
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const urls_js_1 = __importDefault(require("./urls.js"));
const parse_js_1 = __importDefault(require("./parse.js"));
const unifetch = typeof fetch !== 'undefined' ? fetch : isomorphic_unfetch_1.default;
class AlpacaClient {
    constructor(params) {
        this.params = params;
        this.limiter = new bottleneck_1.default({
            reservoir: 200,
            reservoirRefreshAmount: 200,
            reservoirRefreshInterval: 60 * 1000,
            // also use maxConcurrent and/or minTime for safety
            maxConcurrent: 1,
            minTime: 200,
        });
        if (
        // if not specified
        !('paper' in params.credentials) &&
            // and live key isn't already provided
            !('key' in params.credentials && params.credentials.key.startsWith('A'))) {
            params.credentials['paper'] = true;
        }
        if ('access_token' in params.credentials &&
            ('key' in params.credentials || 'secret' in params.credentials)) {
            throw new Error("can't create client with both default and oauth credentials");
        }
    }
    async isAuthenticated() {
        try {
            await this.getAccount();
            return true;
        }
        catch {
            return false;
        }
    }
    async getAccount() {
        return parse_js_1.default.account(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/account`,
        }));
    }
    async getOrder(params) {
        return parse_js_1.default.order(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/orders/${params.order_id || params.client_order_id}`,
            data: { nested: params.nested },
        }));
    }
    async getOrders(params = {}) {
        return parse_js_1.default.orders(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/orders`,
            data: {
                ...params,
                symbols: params.symbols ? params.symbols.join(',') : undefined,
            },
        }));
    }
    async placeOrder(params) {
        return parse_js_1.default.order(await this.request({
            method: 'POST',
            url: `${urls_js_1.default.rest.account}/orders`,
            data: params,
        }));
    }
    async replaceOrder(params) {
        return parse_js_1.default.order(await this.request({
            method: 'PATCH',
            url: `${urls_js_1.default.rest.account}/orders/${params.order_id}`,
            data: params,
        }));
    }
    cancelOrder(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/orders/${params.order_id}`,
            isJSON: false,
        });
    }
    async cancelOrders() {
        return parse_js_1.default.canceled_orders(await this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/orders`,
        }));
    }
    async getPosition(params) {
        return parse_js_1.default.position(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/positions/${params.symbol}`,
        }));
    }
    async getPositions() {
        return parse_js_1.default.positions(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/positions`,
        }));
    }
    async closePosition(params) {
        return parse_js_1.default.order(await this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/positions/${params.symbol}`,
        }));
    }
    async closePositions() {
        return parse_js_1.default.orders(await this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/positions`,
        }));
    }
    getAsset(params) {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/assets/${params.asset_id_or_symbol}`,
        });
    }
    getAssets(params) {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/assets`,
            data: params,
        });
    }
    getWatchlist(params) {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/watchlists/${params.uuid}`,
        });
    }
    getWatchlists() {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/watchlists`,
        });
    }
    createWatchlist(params) {
        return this.request({
            method: 'POST',
            url: `${urls_js_1.default.rest.account}/watchlists`,
            data: params,
        });
    }
    updateWatchlist(params) {
        return this.request({
            method: 'PUT',
            url: `${urls_js_1.default.rest.account}/watchlists/${params.uuid}`,
            data: params,
        });
    }
    addToWatchlist(params) {
        return this.request({
            method: 'POST',
            url: `${urls_js_1.default.rest.account}/watchlists/${params.uuid}`,
            data: params,
        });
    }
    removeFromWatchlist(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/watchlists/${params.uuid}/${params.symbol}`,
        });
    }
    deleteWatchlist(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls_js_1.default.rest.account}/watchlists/${params.uuid}`,
        });
    }
    getCalendar(params) {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/calendar`,
            data: params,
        });
    }
    async getClock() {
        return parse_js_1.default.clock(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/clock`,
        }));
    }
    getAccountConfigurations() {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/account/configurations`,
        });
    }
    updateAccountConfigurations(params) {
        return this.request({
            method: 'PATCH',
            url: `${urls_js_1.default.rest.account}/account/configurations`,
            data: params,
        });
    }
    async getAccountActivities(params) {
        if (params.activity_types && Array.isArray(params.activity_types)) {
            params.activity_types = params.activity_types.join(',');
        }
        return parse_js_1.default.activities(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/account/activities${params.activity_type ? '/'.concat(params.activity_type) : ''}`,
            data: { ...params, activity_type: undefined },
        }));
    }
    getPortfolioHistory(params) {
        return this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.account}/account/portfolio/history`,
            data: params,
        });
    }
    async getTrades(params) {
        return parse_js_1.default.pageOfTrades(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.market_data}/stocks/${params.symbol}/trades`,
            data: { ...params, symbol: undefined },
        }));
    }
    async getQuotes(params) {
        return parse_js_1.default.pageOfQuotes(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.market_data}/stocks/${params.symbol}/quotes`,
            data: { ...params, symbol: undefined },
        }));
    }
    async getBars(params) {
        return parse_js_1.default.pageOfBars(await this.request({
            method: 'GET',
            url: `${urls_js_1.default.rest.market_data}/stocks/${params.symbol}/bars`,
            data: { ...params, symbol: undefined },
        }));
    }
    async request(params) {
        let headers = {};
        if ('access_token' in this.params.credentials) {
            headers['Authorization'] = `Bearer ${this.params.credentials.access_token}`;
        }
        else {
            headers['APCA-API-KEY-ID'] = this.params.credentials.key;
            headers['APCA-API-SECRET-KEY'] = this.params.credentials.secret;
        }
        if (this.params.credentials.paper) {
            params.url = params.url.replace('api.', 'paper-api.');
        }
        let query = '';
        if (params.data) {
            // translate dates to ISO strings
            for (let [key, value] of Object.entries(params.data)) {
                if (value instanceof Date) {
                    params.data[key] = value.toISOString();
                }
            }
            // build query
            if (params.method != 'POST' && params.method != 'PATCH') {
                query = '?'.concat(qs_1.default.stringify(params.data));
                params.data = undefined;
            }
        }
        const makeCall = () => unifetch(params.url.concat(query), {
            method: params.method,
            headers,
            body: JSON.stringify(params.data),
        }), func = this.params.rate_limit
            ? () => this.limiter.schedule(makeCall)
            : makeCall;
        let resp, result = {};
        try {
            resp = await func();
            if (!(params.isJSON == undefined ? true : params.isJSON)) {
                return resp.ok;
            }
            result = await resp.json();
        }
        catch (e) {
            console.error(e);
            throw result;
        }
        if ('code' in result || 'message' in result) {
            throw result;
        }
        return result;
    }
}
exports.AlpacaClient = AlpacaClient;
