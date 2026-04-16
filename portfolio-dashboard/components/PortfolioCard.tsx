import React from 'react';

type Position = {
  symbol: string;
  shares: number;
  annualReturn: number;
  annualVolatility: number;
};

type PositionWithMarketData = Position & {
  price: number | null;
  sevenDayVolatility: number | null;
  isHighVolatility: boolean;
  dataError: string | null;
};

type AlphaVantageDailyResponse = {
  Information?: string;
  Note?: string;
  'Error Message'?: string;
  'Time Series (Daily)'?: Record<
    string,
    {
      '4. close': string;
    }
  >;
};

const RISK_FREE_RATE = 0.02;
const VOLATILITY_THRESHOLD = 0.02;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_FREE_TIER_DELAY_MS = 1100;

const positions: Position[] = [
  { symbol: 'AAPL', shares: 10, annualReturn: 0.14, annualVolatility: 0.18 },
  { symbol: 'TSLA', shares: 5, annualReturn: 0.22, annualVolatility: 0.32 },
];

const FALLBACK_MARKET_DATA: Record<
  string,
  {
    price: number;
    sevenDayVolatility: number;
    asOf: string;
  }
> = {
  AAPL: {
    price: 260.48,
    sevenDayVolatility: 0.01294342069136456,
    asOf: '2026-04-10',
  },
  TSLA: {
    price: 348.95,
    sevenDayVolatility: 0.026044964123828018,
    asOf: '2026-04-10',
  },
};

const calculateSharpeRatio = (
  annualReturn: number,
  annualVolatility: number,
  riskFreeRate = RISK_FREE_RATE,
) => {
  if (annualVolatility === 0) {
    return 0;
  }

  return (annualReturn - riskFreeRate) / annualVolatility;
};

const calculateSevenDayVolatility = (closesDescending: number[]) => {
  if (closesDescending.length < 8) {
    return null;
  }

  const closesAscending = [...closesDescending].reverse();
  const dailyReturns = closesAscending.slice(1).map((close, index) => {
    const priorClose = closesAscending[index];
    return (close - priorClose) / priorClose;
  });

  const meanReturn =
    dailyReturns.reduce((sum, dailyReturn) => sum + dailyReturn, 0) / dailyReturns.length;

  const variance =
    dailyReturns.reduce((sum, dailyReturn) => {
      return sum + (dailyReturn - meanReturn) ** 2;
    }, 0) /
    (dailyReturns.length - 1);

  return Math.sqrt(variance);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getFallbackPositionMarketData = (
  position: Position,
  reason: string,
): PositionWithMarketData => {
  const fallback = FALLBACK_MARKET_DATA[position.symbol];

  if (!fallback) {
    return {
      ...position,
      price: null,
      sevenDayVolatility: null,
      isHighVolatility: false,
      dataError: reason,
    };
  }

  return {
    ...position,
    price: fallback.price,
    sevenDayVolatility: fallback.sevenDayVolatility,
    isHighVolatility: fallback.sevenDayVolatility > VOLATILITY_THRESHOLD,
    dataError: `${reason} Showing cached snapshot from ${fallback.asOf}.`,
  };
};

const fetchPositionMarketData = async (position: Position): Promise<PositionWithMarketData> => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return {
      ...position,
      price: null,
      sevenDayVolatility: null,
      isHighVolatility: false,
      dataError: 'Add ALPHA_VANTAGE_API_KEY to .env.local and restart Next.js to load live price history.',
    };
  }

  const searchParams = new URLSearchParams({
    function: 'TIME_SERIES_DAILY',
    symbol: position.symbol,
    outputsize: 'compact',
    datatype: 'json',
    apikey: apiKey,
  });

  const response = await fetch(`${ALPHA_VANTAGE_URL}?${searchParams.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return {
      ...position,
      price: null,
      sevenDayVolatility: null,
      isHighVolatility: false,
      dataError: `Alpha Vantage request failed with ${response.status}.`,
    };
  }

  const data = (await response.json()) as AlphaVantageDailyResponse;

  if (data.Note?.includes('Please consider spreading out your free API requests more sparingly')) {
    return getFallbackPositionMarketData(
      position,
      'Alpha Vantage free-tier rate limit reached.',
    );
  }

  if (data.Information || data.Note || data['Error Message']) {
    return getFallbackPositionMarketData(
      position,
      data['Error Message'] ??
        data.Note ??
        data.Information ??
        'Alpha Vantage did not return price history.',
    );
  }

  const dailySeries = data['Time Series (Daily)'];

  if (!dailySeries) {
    return {
      ...position,
      price: null,
      sevenDayVolatility: null,
      isHighVolatility: false,
      dataError: 'Alpha Vantage did not return daily price history.',
    };
  }

  const recentClosesDescending = Object.entries(dailySeries)
    .sort(([leftDate], [rightDate]) => rightDate.localeCompare(leftDate))
    .slice(0, 8)
    .map(([, values]) => Number(values['4. close']))
    .filter((close) => Number.isFinite(close));

  const price = recentClosesDescending[0] ?? null;
  const sevenDayVolatility = calculateSevenDayVolatility(recentClosesDescending);

  return {
    ...position,
    price,
    sevenDayVolatility,
    isHighVolatility:
      sevenDayVolatility !== null && sevenDayVolatility > VOLATILITY_THRESHOLD,
    dataError: null,
  };
};

const fetchPositionsMarketData = async () => {
  const positionsWithMarketData: PositionWithMarketData[] = [];

  for (const [index, position] of positions.entries()) {
    if (index > 0) {
      await sleep(ALPHA_VANTAGE_FREE_TIER_DELAY_MS);
    }

    positionsWithMarketData.push(await fetchPositionMarketData(position));
  }

  return positionsWithMarketData;
};

export const PortfolioCard = async () => {
  const positionsWithMarketData = await fetchPositionsMarketData();

  return (
    <div className="p-6 border border-slate-200 rounded-xl shadow-sm bg-white text-slate-900">
      <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
      <ul className="divide-y divide-slate-100">
        {positionsWithMarketData.map((position) => {
          const sharpeRatio = calculateSharpeRatio(
            position.annualReturn,
            position.annualVolatility,
          );

          return (
            <li key={position.symbol} className="flex justify-between py-3 gap-4">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{position.symbol}</span>
                <span className="text-sm text-slate-500">{position.shares} shares</span>
                <span className="text-sm text-slate-500">
                  Sharpe {sharpeRatio.toFixed(2)}
                </span>
                {position.sevenDayVolatility !== null ? (
                  <span
                    className={
                      position.isHighVolatility ? 'text-sm text-rose-600' : 'text-sm text-slate-500'
                    }
                  >
                    7d vol {(position.sevenDayVolatility * 100).toFixed(2)}%
                    {position.isHighVolatility ? ' High volatility' : ''}
                  </span>
                ) : (
                  <span className="text-sm text-amber-600">{position.dataError}</span>
                )}
                {position.dataError && position.sevenDayVolatility !== null ? (
                  <span className="text-xs text-amber-600">{position.dataError}</span>
                ) : null}
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono font-semibold text-emerald-600">
                  {position.price !== null ? `$${position.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
