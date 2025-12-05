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

export const HISTORICAL_DATA = {
  '1D': [
    { name: '10 AM', value: 7210 },
    { name: '11 AM', value: 7225 },
    { name: '12 PM', value: 7215 },
    { name: '1 PM', value: 7240 },
    { name: '2 PM', value: 7235 },
    { name: '3 PM', value: 7250 },
    { name: '4 PM', value: 7245 },
  ],
  '1W': [
    { name: 'Mon', value: 7150 },
    { name: 'Tue', value: 7180 },
    { name: 'Wed', value: 7200 },
    { name: 'Thu', value: 7190 },
    { name: 'Fri', value: 7220 },
    { name: 'Sat', value: 7240 },
    { name: 'Sun', value: 7250 },
  ],
  '1M': [
    { name: 'Week 1', value: 7000 },
    { name: 'Week 2', value: 7100 },
    { name: 'Week 3', value: 7050 },
    { name: 'Week 4', value: 7250 },
  ],
  '1Y': [
    { name: 'Jan', value: 6500 },
    { name: 'Mar', value: 6700 },
    { name: 'May', value: 6600 },
    { name: 'Jul', value: 6900 },
    { name: 'Sep', value: 7100 },
    { name: 'Nov', value: 7250 },
  ]
};