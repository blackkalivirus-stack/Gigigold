import { GoldRate } from './types';

export const APP_NAME = "Aura DigiGold";

export const MOCK_RATES: GoldRate = {
  buy: 7250.45,
  sell: 7010.20,
  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  trend: 'UP',
  changePercent: 0.72
};

export const CHART_DATA = [
  { name: '10 AM', value: 7210 },
  { name: '11 AM', value: 7225 },
  { name: '12 PM', value: 7215 },
  { name: '1 PM', value: 7240 },
  { name: '2 PM', value: 7235 },
  { name: '3 PM', value: 7250 },
  { name: '4 PM', value: 7245 },
];