export interface OhlcvData {
  data: OhlcvOutputItem[];
}

export interface OhlcvOutputItem {
  data: any;
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface OhlcvInputItem {
  x: string;
  y: number[];
}

export function transformOhlcvDataReverse(inputData: OhlcvOutputItem[]): OhlcvInputItem[] {
  if (!Array.isArray(inputData)) {
    console.error("Input data must be an array.");
    return [];
  }

  const transformed = inputData.map(item => {
    if (!item || typeof item.t !== 'string' || typeof item.o !== 'number' ||
      typeof item.h !== 'number' || typeof item.l !== 'number' || typeof item.c !== 'number') {
      console.warn("Invalid item format detected, skipping:", item);
      return null;
    }

    const xTimestamp = item.t.replace(/\+00:00$/, '');

    const yValues = [item.o, item.h, item.l, item.c];

    return {
      x: xTimestamp,
      y: yValues
    };
  }).filter((item): item is OhlcvInputItem => item !== null);

  return transformed;
}