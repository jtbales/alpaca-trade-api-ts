import { OrderSide, OrderTimeInForce, OrderType } from './entities.js';

export interface AddToWatchList {
  uuid: string;
  symbol: string;
}

export interface CancelOrder {
  order_id: string;
}

export interface ClosePosition {
  symbol: string;
}

export interface CreateWatchList {
  name: string;
  symbols?: string[];
}

export interface DeleteWatchList {
  uuid: string;
}

export interface GetAccountActivities {
  activity_type?: string;
  activity_types?: string | string[];
  date?: string;
  until?: string;
  after?: string;
  direction?: 'asc' | 'desc';
  page_size?: number;
  page_token?: string;
}

export interface GetAsset {
  asset_id_or_symbol: string;
}

export interface GetAssets {
  status?: 'active' | 'inactive';
  asset_class?: string; // i don't know where to find all asset classes
}

export interface GetCalendar {
  start?: Date;
  end?: Date;
}

export interface GetTrades {
  symbol: string;
  start: Date;
  end: Date;
  limit?: number;
  page_token?: string;
}

export interface GetQuotes {
  symbol: string;
  start: Date;
  end: Date;
  limit?: number;
  page_token?: string;
}

export interface GetBars {
  symbol: string;
  start: Date;
  end: Date;
  limit?: number;
  page_token?: string;
  timeframe: '1Sec' | '1Min' | '1Hour' | '1Day';
}

export interface GetOrder {
  order_id?: string;
  client_order_id?: string;
  nested?: boolean;
}

export interface GetOrders {
  status?: 'open' | 'closed' | 'all';
  limit?: number;
  after?: Date;
  until?: Date;
  direction?: 'asc' | 'desc';
  nested?: boolean;
  symbols?: string[];
}

export interface GetPortfolioHistory {
  period?: string;
  timeframe?: string;
  date_end?: Date;
  extended_hours?: boolean;
}

export interface GetPosition {
  symbol: string;
}

export interface GetWatchList {
  uuid: string;
}

type PlaceOrderBase = {
  symbol: string;
  side: OrderSide;
  time_in_force: OrderTimeInForce;
  qty?: number;
  notional?: number;
  client_order_id?: string;
};

type PlaceOrderClassBase = {
  order_class?: 'simple' | 'bracket' | 'oco' | 'oto';
  take_profit?: {
    limit_price: number;
  };
  stop_loss?: {
    stop_price: number;
    limit_price?: number;
  };
};

export type PlaceOrder = {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  time_in_force: OrderTimeInForce;
  qty?: number;
  notional?: number;
  limit_price?: number;
  stop_price?: number;
  extended_hours?: boolean;
  client_order_id?: string;
  trail_price?: number;
  trail_percent?: number;
  order_class?: 'simple' | 'bracket' | 'oco' | 'oto';
  take_profit?: {
    limit_price: number;
  };
  stop_loss?: {
    stop_price: number;
    limit_price?: number;
  };
};

export type PlaceOrderUnion =
  | PlaceMarketOrder
  | PlaceLimitOrder
  | PlaceStopOrder
  | PlaceStopLimitOrder
  | PlaceTrailingStopOrder;

export type PlaceMarketOrder = PlaceOrderBase &
  PlaceOrderClassBase & {
    type: 'market';
  };

export type PlaceLimitOrder = PlaceOrderBase &
  PlaceOrderClassBase & {
    type: 'limit';
    limit_price: number;
    extended_hours?: boolean;
  };

export type PlaceStopOrder = PlaceOrderBase &
  PlaceOrderClassBase & {
    type: 'stop';
    stop_price: number;
  };

export type PlaceStopLimitOrder = PlaceOrderBase &
  PlaceOrderClassBase & {
    type: 'stop_limit';
    limit_price: number;
    stop_price: number;
  };

export type PlaceTrailingStopOrder = PlaceOrderBase & {
  type: 'trailing_stop';
  trail_price: number;
  trail_percent: number;
};

export interface RemoveFromWatchList {
  uuid: string;
  symbol: string;
}

export interface ReplaceOrder {
  order_id: string;
  qty?: number;
  time_in_force?: OrderTimeInForce;
  limit_price?: number;
  stop_price?: number;
  client_order_id?: string;
}

export interface UpdateAccountConfigurations {
  dtbp_check?: string;
  no_shorting?: boolean;
  suspend_trade?: boolean;
  trade_confirm_email?: string;
}

export interface UpdateWatchList {
  uuid: string;
  name?: string;
  symbols?: string[];
}
