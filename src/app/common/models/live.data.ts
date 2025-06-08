
export interface LiveData {
  timestamp: string;
  price: number;
  volume: number;
}

export interface LiveDataRes {
  type: "l1-update";
  instrumentId: string;
  provider: string;

  ask: LiveData | undefined;
  last: LiveData | undefined;
  bid: LiveData | undefined;
}