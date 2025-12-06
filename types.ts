
export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycStatus: KycStatus;
  goldBalanceGrams: number;
  walletBalanceInr: number;
  email?: string;
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  GIFT = 'GIFT',
  REDEEM = 'REDEEM',
  SIP = 'SIP'
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amountInr: number;
  grams: number;
  ratePerGram: number;
  date: string;
  status: TransactionStatus;
}

export interface GoldRate {
  buy: number;
  sell: number;
  lastUpdated: string;
  trend: 'UP' | 'DOWN';
  changePercent: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon: any;
}
