export interface TradingHours {
  regularStart: string;
  regularEnd: string;
  electronicStart: string;
  electronicEnd: string;
}

export interface InstrumentMapping {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  maxOrderSize?: number;
  tradingHours: TradingHours;
}


export interface Instrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: InstrumentMappings;
  profile: InstrumentProfile;

}

export interface InstrumentMappings {
  [providerName: string]: InstrumentMapping;
}


export interface InstrumentProfile {
  name: string;
  gics: Record<string, never>;
}


export interface InstrumentReponce {
  paging: {
    page: number,
    pages: number,
    items: number
  },
  data: Instrument[]
}