import { User, KycStatus, Transaction, TransactionType, TransactionStatus, GoldRate } from './types';

export const APP_NAME = "Aura DigiGold";

export const MOCK_USER: User = {
  id: 'u_123456',
  firstName: 'Arjun',
  lastName: 'Verma',
  phone: '+91 98765 43210',
  kycStatus: KycStatus.NOT_STARTED,
  goldBalanceGrams: 12.34,
  walletBalanceInr: 1500.00
};

export const MOCK_RATES: GoldRate = {
  buy: 7250.45,
  sell: 7010.20,
  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  trend: 'UP',
  changePercent: 0.72
};

export const MOCK_HISTORY: Transaction[] = [
  {
    id: 'TXN_998877',
    type: TransactionType.BUY,
    amountInr: 5000,
    grams: 0.689,
    ratePerGram: 7250.00,
    date: '2023-10-24T10:30:00',
    status: TransactionStatus.SUCCESS
  },
  {
    id: 'TXN_998878',
    type: TransactionType.SELL,
    amountInr: 2100,
    grams: 0.300,
    ratePerGram: 7000.00,
    date: '2023-10-22T14:15:00',
    status: TransactionStatus.SUCCESS
  },
  {
    id: 'TXN_998879',
    type: TransactionType.GIFT,
    amountInr: 1000,
    grams: 0.137,
    ratePerGram: 7280.00,
    date: '2023-10-20T09:00:00',
    status: TransactionStatus.SUCCESS
  },
  {
    id: 'TXN_998880',
    type: TransactionType.REDEEM,
    amountInr: 0,
    grams: 5.00,
    ratePerGram: 7200.00,
    date: '2023-09-15T11:20:00',
    status: TransactionStatus.PENDING
  }
];

export const CHART_DATA = [
  { name: '10 AM', value: 7210 },
  { name: '11 AM', value: 7225 },
  { name: '12 PM', value: 7215 },
  { name: '1 PM', value: 7240 },
  { name: '2 PM', value: 7235 },
  { name: '3 PM', value: 7250 },
  { name: '4 PM', value: 7245 },
];