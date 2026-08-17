import React, { useState, useEffect } from 'react';
import {
  Coins,
  ArrowRightLeft,
  Zap,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Wallet,
  Clock,
  Sparkles,
  ChevronDown,
  Info,
  LayoutGrid,
  ListFilter,
  Calculator,
} from 'lucide-react';
import { ICryptoRate, ICryptoPaymentGateway } from '../../types.ts';
import { api } from '../../services/api.ts';
import { CryptoRateCards } from '../crypto/CryptoRateCards.tsx';

interface CryptoPaymentSectionProps {
  selectedPayment: string;
  onSelectPayment: (method: string) => void;
}

export const CryptoPaymentSection: React.FC<CryptoPaymentSectionProps> = ({
  selectedPayment,
  onSelectPayment,
}) => {
  const [gateways, setGateways] = useState<ICryptoPaymentGateway[]>([]);
  const [rates, setRates] = useState<ICryptoRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cards' | 'gateways' | 'calculator'>('cards');

  // Deposit Calculator State
  const [calcCoin, setCalcCoin] = useState<string>('USDT (TRC20)');
  const [calcUsdAmount, setCalcUsdAmount] = useState<number>(500);
  const [calcDailyRoiPercent, setCalcDailyRoiPercent] = useState<number>(3.0);
  const [calcDays, setCalcDays] = useState<number>(30);

  useEffect(() => {
    async function loadCryptoData() {
      try {
        const [gatewaysRes, ratesRes] = await Promise.all([
          api.getCryptoPayments().catch(() => ({ gateways: [] })),
          api.getCryptoRates().catch(() => ({ rates: [] })),
        ]);
        setGateways(gatewaysRes.gateways || []);
        setRates(ratesRes.rates || []);
      } catch (err) {
        console.error('Failed to load crypto payment info:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCryptoData();
  }, []);

  // Quick filter options
  const filterOptions = [
    { label: 'All Payments', value: 'all', icon: '🌐' },
    { label: 'USDT TRC20', value: 'USDT (TRC20)', icon: '₮', color: '#26a17b' },
    { label: 'Bitcoin (BTC)', value: 'Bitcoin', icon: '₿', color: '#f7931a' },
    { label: 'Ethereum (ETH)', value: 'Ethereum', icon: 'Ξ', color: '#627eea' },
    { label: 'Litecoin (LTC)', value: 'Litecoin', icon: 'Ł', color: '#345d9d' },
    { label: 'TRON (TRX)', value: 'TRON', icon: 'TRX', color: '#eb0029' },
    { label: 'BNB (BEP20)', value: 'BNB', icon: 'BNB', color: '#f3ba2f' },
    { label: 'Solana (SOL)', value: 'Solana', icon: '◎', color: '#14f195' },
    { label: 'Dogecoin (DOGE)', value: 'DOGE', icon: 'Ð', color: '#c2a633' },
    { label: 'Toncoin (TON)', value: 'TON', icon: 'TON', color: '#0088cc' },
    { label: 'Monero (XMR)', value: 'Monero', icon: 'ɱ', color: '#ff6600' },
    { label: 'ePayCore', value: 'ePayCore', icon: 'EP', color: '#10b981' },
  ];

  // Selected coin rate calculation
  const getSelectedCoinRate = (coinSymbolOrName: string): number => {
    const s = coinSymbolOrName.toUpperCase();
    if (s.includes('USDT') || s.includes('USDC') || s.includes('EPAY')) return 1.0;
    if (s.includes('BTC') || s.includes('BITCOIN')) {
      return rates.find((r) => r.symbol === 'BTC')?.priceUsd || 67800;
    }
    if (s.includes('ETH') || s.includes('ETHEREUM')) {
      return rates.find((r) => r.symbol === 'ETH')?.priceUsd || 3520;
    }
    if (s.includes('SOL') || s.includes('SOLANA')) {
      return rates.find((r) => r.symbol === 'SOL')?.priceUsd || 154;
    }
    if (s.includes('BNB')) {
      return rates.find((r) => r.symbol === 'BNB')?.priceUsd || 592;
    }
    if (s.includes('TRX') || s.includes('TRON')) {
      return rates.find((r) => r.symbol === 'TRX')?.priceUsd || 0.158;
    }
    if (s.includes('LTC') || s.includes('LITECOIN')) {
      return rates.find((r) => r.symbol === 'LTC')?.priceUsd || 74.8;
    }
    if (s.includes('DOGE')) {
      return rates.find((r) => r.symbol === 'DOGE')?.priceUsd || 0.118;
    }
    if (s.includes('TON')) {
      return rates.find((r) => r.symbol === 'TON')?.priceUsd || 5.62;
    }
    if (s.includes('XMR') || s.includes('MONERO')) {
      return rates.find((r) => r.symbol === 'XMR')?.priceUsd || 168.4;
    }
    return 1.0;
  };

  const coinRate = getSelectedCoinRate(calcCoin);
  const cryptoDepositAmount = coinRate > 0 ? (calcUsdAmount / coinRate) : calcUsdAmount;
  const dailyReturnUsd = (calcUsdAmount * calcDailyRoiPercent) / 100;
  const totalProfitUsd = dailyReturnUsd * calcDays;
  const totalPayoutUsd = calcUsdAmount + totalProfitUsd;
  const dailyReturnCrypto = coinRate > 0 ? (dailyReturnUsd / coinRate) : dailyReturnUsd;

  return (
    <div className="space-y-3">
      {/* 1. CRYPTO PAYMENT FILTER BAR */}
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#1e293b] uppercase tracking-wide">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Filter Programs By Accepted Crypto Payment: </span>
          </div>

          <span className="text-[10px] text-[#64748b] font-medium">
            12 Supported Multi-Chain & Stablecoin Gateways
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {filterOptions.map((opt) => {
            const isSelected =
              opt.value === 'all'
                ? !selectedPayment || selectedPayment === 'all'
                : selectedPayment.toLowerCase().includes(opt.value.toLowerCase());

            return (
              <button
                key={opt.value}
                onClick={() => onSelectPayment(opt.value)}
                className={`px-2.5 py-1 rounded-sm text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e293b] text-white shadow-xs scale-102 ring-1 ring-[#1e293b]'
                    : 'bg-[#f8fafc] text-[#334155] border border-[#cbd5e1] hover:bg-[#e2e8f0]'
                }`}
              >
                <span style={{ color: opt.color || 'inherit' }} className="font-bold text-[11px]">
                  {opt.icon}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TABS SELECTOR STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f8fafc] p-1.5 rounded-sm border border-[#cbd5e1]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wide flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'cards'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#1e293b] hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span>Crypto Rate Cards with Details</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono">
              {rates.length || 14}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gateways')}
            className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wide flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'gateways'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#1e293b] hover:bg-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payment Gateways Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wide flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'calculator'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#1e293b] hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Investment ROI Calculator</span>
          </button>
        </div>

        <div className="text-[11px] text-[#64748b] font-mono pr-2 hidden md:block">
          Auto-updated spot feeds
        </div>
      </div>

      {/* 2. TAB CONTENT: DETAILED CRYPTO RATE CARDS */}
      {activeTab === 'cards' && (
        <CryptoRateCards
          rates={rates}
          selectedPayment={selectedPayment}
          onSelectPayment={onSelectPayment}
        />
      )}

      {/* 3. TAB CONTENT: ACCEPTED CRYPTO GATEWAYS STRIP (Interactive icons) */}
      {activeTab === 'gateways' && (
        <div className="bg-[#1e293b] text-white rounded-sm p-3 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-700/80 pb-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
                  Industry Standard
                </span>
                <h3 className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span>Accepted Crypto Payments & Network Specs</span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Real-time settlement speeds, typical network gas fees, and compatibility matrix across verified programs.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
              <div className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Top Stablecoin</span>
                <span className="font-bold text-emerald-400">USDT (TRC-20)</span>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">Fastest L1</span>
                <span className="font-bold text-teal-400">Solana & TON</span>
              </div>
            </div>
          </div>

          {/* Gateways Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3 text-xs">
            {gateways.slice(0, 12).map((gw) => (
              <div
                key={gw.id}
                onClick={() => {
                  setCalcCoin(gw.symbol);
                  onSelectPayment(gw.symbol);
                }}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/60 p-2 rounded-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: gw.iconColor }}
                    >
                      {gw.iconSymbol}
                    </span>
                    <span className="font-bold text-white text-[11px] truncate">{gw.name}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                    {gw.acceptedPercentage}%
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="text-slate-200 font-semibold">{gw.avgSpeed.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span className="text-emerald-400 font-semibold">{gw.avgFeeUsd < 0.05 ? '<$0.05' : `$${gw.avgFeeUsd}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: MULTI-CRYPTO DEPOSIT & ROI CONVERSION CALCULATOR */}
      {activeTab === 'calculator' && (
      <div className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1e293b] text-white flex items-center justify-center text-xs font-black">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#1e293b] uppercase tracking-wide">
                HYIP Investment & Multi-Crypto Conversion Calculator
              </h4>
              <p className="text-[10px] text-[#64748b]">
                Calculate exact crypto equivalents and projected daily ROI returns at live market rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#0284c7]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Spot Valuation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
          {/* Controls: Amount, Currency, ROI rate, Duration */}
          <div className="md:col-span-6 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              {/* Crypto Selector */}
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                  Deposit Currency
                </label>
                <select
                  value={calcCoin}
                  onChange={(e) => setCalcCoin(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded p-1.5 text-xs font-bold text-[#1e293b] focus:outline-hidden focus:border-[#1e293b]"
                >
                  <option value="USDT (TRC20)">USDT (TRC20) - Zero Gas</option>
                  <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                  <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                  <option value="Litecoin (LTC)">Litecoin (LTC)</option>
                  <option value="TRON (TRX)">TRON (TRX)</option>
                  <option value="Binance Coin (BNB)">BNB (BEP20)</option>
                  <option value="Solana (SOL)">Solana (SOL)</option>
                  <option value="Dogecoin (DOGE)">Dogecoin (DOGE)</option>
                  <option value="Toncoin (TON)">Toncoin (TON)</option>
                  <option value="Monero (XMR)">Monero (XMR)</option>
                  <option value="ePayCore">ePayCore</option>
                </select>
              </div>

              {/* Deposit USD Amount */}
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={calcUsdAmount}
                  onChange={(e) => setCalcUsdAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded p-1.5 text-xs font-mono font-bold text-[#1e293b] focus:outline-hidden focus:border-[#1e293b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Daily ROI */}
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                  Daily ROI (%)
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.1"
                  value={calcDailyRoiPercent}
                  onChange={(e) => setCalcDailyRoiPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded p-1.5 text-xs font-mono font-bold text-[#1e293b] focus:outline-hidden focus:border-[#1e293b]"
                />
              </div>

              {/* Duration in days */}
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                  Plan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={calcDays}
                  onChange={(e) => setCalcDays(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded p-1.5 text-xs font-mono font-bold text-[#1e293b] focus:outline-hidden focus:border-[#1e293b]"
                />
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1 text-[10px] pt-1">
              <span className="text-[#64748b] font-semibold">Quick Amounts:</span>
              {[50, 100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCalcUsdAmount(amt)}
                  className={`px-1.5 py-0.5 rounded border cursor-pointer font-bold transition-colors ${
                    calcUsdAmount === amt
                      ? 'bg-[#1e293b] text-white border-[#1e293b]'
                      : 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1] hover:bg-[#e2e8f0]'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="md:col-span-6 bg-[#f8fafc] border border-[#cbd5e1] rounded p-3 flex flex-col justify-between space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#e2e8f0]">
                <span className="text-[#64748b] font-semibold">Deposit in {calcCoin}:</span>
                <span className="font-mono font-black text-[#1e293b] text-sm">
                  {cryptoDepositAmount < 1 ? cryptoDepositAmount.toFixed(6) : cryptoDepositAmount.toFixed(4)} {calcCoin.split(' ')[0]}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#64748b]">Daily Profit:</span>
                <span className="font-mono font-bold text-[#16a34a]">
                  +${dailyReturnUsd.toFixed(2)} ({dailyReturnCrypto < 1 ? dailyReturnCrypto.toFixed(6) : dailyReturnCrypto.toFixed(4)} {calcCoin.split(' ')[0]})
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#64748b]">Total Net Profit ({calcDays} Days):</span>
                <span className="font-mono font-bold text-[#15803d]">
                  +${totalProfitUsd.toFixed(2)} ({(calcDailyRoiPercent * calcDays).toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#e2e8f0]">
                <span className="text-[#1e293b] font-bold">Total Return (Principal + Profit):</span>
                <span className="font-mono font-black text-[#0284c7] text-sm">
                  ${totalPayoutUsd.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded p-1.5 text-[10px] text-amber-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Tip: Stablecoins (USDT TRC20 / BEP20) protect capital against crypto market volatility during investment duration.
              </span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
