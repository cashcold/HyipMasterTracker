import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Zap,
  Coins,
  BarChart3,
  ShieldCheck,
  Flame,
  Rocket,
} from 'lucide-react';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';

export interface IDailyDepositActivity {
  date: string;
  formattedDate: string;
  timestamp: number;
  volumeUsd: number;
  inflowCount: number;
  btcEquivalent: number;
  ethEquivalent: number;
  usdtVolume: number;
  activePrograms: number;
  avgDepositSize: number;
  movingAvg7d?: number;
}

interface IParsedDailyActivity extends IDailyDepositActivity {
  parsedDate: Date;
}

interface GlobalMarketActivityChartProps {
  data: IDailyDepositActivity[];
  summary?: {
    total30dVolume?: number;
    avgDailyVolume?: number;
    peakDayVolume?: number;
    peakDayDate?: string;
    dayOverDayGrowth?: number;
  };
}

export const GlobalMarketActivityChart: React.FC<GlobalMarketActivityChartProps> = ({
  data,
  summary,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d'>('30d');
  const [metric, setMetric] = useState<'volumeUsd' | 'inflowCount' | 'movingAvg7d'>('volumeUsd');
  const [currencyUnit, setCurrencyUnit] = useState<'usd' | 'btc' | 'eth'>('usd');
  const [showMovingAvg, setShowMovingAvg] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<IDailyDepositActivity | null>(null);

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeframe === '7d') return data.slice(-7);
    if (timeframe === '14d') return data.slice(-14);
    return data.slice(-30);
  }, [data, timeframe]);

  // Derived telemetry metrics for selected timeframe
  const currentTotal = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.volumeUsd, 0);
  }, [filteredData]);

  const currentAvg = useMemo(() => {
    if (filteredData.length === 0) return 0;
    return Math.round(currentTotal / filteredData.length);
  }, [filteredData, currentTotal]);

  const currentPeak = useMemo(() => {
    if (filteredData.length === 0) return { volumeUsd: 0, formattedDate: '' };
    return [...filteredData].sort((a, b) => b.volumeUsd - a.volumeUsd)[0];
  }, [filteredData]);

  const latestDay = filteredData[filteredData.length - 1];
  const previousDay = filteredData[filteredData.length - 2];
  const rawDoD = previousDay && latestDay && previousDay.volumeUsd > 0
    ? +(((latestDay.volumeUsd - previousDay.volumeUsd) / previousDay.volumeUsd) * 100).toFixed(1)
    : 0;
  const dayOverDay = Number.isFinite(rawDoD) ? rawDoD : 0;

  // D3 Chart Render Function
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredData.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean previous render

    const width = container.clientWidth || 800;
    const height = Math.min(380, Math.max(260, window.innerWidth < 640 ? 280 : 340));
    const margin = { top: 25, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData: IParsedDailyActivity[] = filteredData.map((d) => ({
      ...d,
      parsedDate: new Date(d.date),
    }));

    // Scales
    const dates = parsedData.map((d) => d.parsedDate);
    const minDate = d3.min(dates) || new Date();
    const maxDate = d3.max(dates) || new Date();

    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, innerWidth]);

    const yVal = (d: IDailyDepositActivity) => {
      if (metric === 'inflowCount') return d.inflowCount;
      if (metric === 'movingAvg7d') return d.movingAvg7d || d.volumeUsd;
      return d.volumeUsd;
    };

    const yMax = (d3.max(parsedData, yVal) || 100000) * 1.15;
    const yMin = 0;

    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice();

    // Secondary scale for moving average if toggled
    const yMovingAvg = (d: IDailyDepositActivity) => d.movingAvg7d || d.volumeUsd;

    // Defs & Gradients
    const defs = svg.append('defs');

    // Main Area Gradient (Emerald / Cyan Neon glow)
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'deposit-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.45);

    areaGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', 0.18);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0f172a')
      .attr('stop-opacity', 0.0);

    // Glow Filter
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Gridlines
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(5);

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-opacity', 0.8);

    g.select('.grid .domain').remove();

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width < 640 ? 4 : 8)
      .tickFormat((d) => d3.timeFormat('%b %d')(d as Date));

    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', '#334155');
    xAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px').attr('font-family', 'monospace');
    xAxisG.selectAll('line').attr('stroke', '#334155');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => {
        const num = d as number;
        if (metric === 'inflowCount') return `${num}`;
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
        return `$${num}`;
      });

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').attr('stroke', '#334155');
    yAxisG.selectAll('text').attr('fill', '#94a3b8').attr('font-size', '11px').attr('font-family', 'monospace');
    yAxisG.selectAll('line').attr('stroke', '#334155');

    // Area Generator
    const area = d3
      .area<any>()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.parsedDate))
      .y0(innerHeight)
      .y1((d) => yScale(yVal(d)));

    g.append('path')
      .datum(parsedData)
      .attr('fill', 'url(#deposit-area-gradient)')
      .attr('d', area);

    // Line Generator (Main metric)
    const line = d3
      .line<any>()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.parsedDate))
      .y((d) => yScale(yVal(d)));

    const mainPath = g
      .append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', metric === 'inflowCount' ? '#38bdf8' : '#10b981')
      .attr('stroke-width', 2.8)
      .attr('filter', 'url(#glow)')
      .attr('d', line);

    // Animated Path Transition
    const pathEl = mainPath.node();
    if (pathEl) {
      const totalLength = pathEl.getTotalLength();
      mainPath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(900)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    }

    // Moving Average Line (if toggled and showing Volume)
    if (showMovingAvg && metric === 'volumeUsd') {
      const movingAvgLine = d3
        .line<any>()
        .curve(d3.curveMonotoneX)
        .x((d) => xScale(d.parsedDate))
        .y((d) => yScale(yMovingAvg(d)));

      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,4')
        .attr('d', movingAvgLine);
    }

    // Data Point Dots
    g.selectAll('.data-dot')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('class', 'data-dot')
      .attr('cx', (d) => xScale(d.parsedDate))
      .attr('cy', (d) => yScale(yVal(d)))
      .attr('r', (d, i) => (i === parsedData.length - 1 ? 5 : 3))
      .attr('fill', (d, i) => (i === parsedData.length - 1 ? '#34d399' : '#0f172a'))
      .attr('stroke', (d, i) => (i === parsedData.length - 1 ? '#ffffff' : '#10b981'))
      .attr('stroke-width', 2);

    // Interactive Crosshair & Tooltip Overlay
    const focusGroup = g.append('g').style('display', 'none');

    // Vertical line
    const verticalLine = focusGroup
      .append('line')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .attr('y1', 0)
      .attr('y2', innerHeight);

    // Glowing Focus Circle
    const focusCircle = focusGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#10b981')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#glow)');

    // Overlay Rect for capture
    const bisectDate = d3.bisector<IParsedDailyActivity, Date>((d) => d.parsedDate).left;

    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseover', () => {
        focusGroup.style('display', null);
      })
      .on('mouseout', () => {
        focusGroup.style('display', 'none');
        setHoveredPoint(null);
      })
      .on('mousemove', (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = xScale.invert(xPos);
        const i = bisectDate(parsedData, x0, 1);
        const d0 = parsedData[i - 1];
        const d1 = parsedData[i];
        let selectedD: IParsedDailyActivity | null = d0 || null;
        if (d1 && d0) {
          selectedD =
            x0.getTime() - d0.parsedDate.getTime() > d1.parsedDate.getTime() - x0.getTime() ? d1 : d0;
        } else if (d1) {
          selectedD = d1;
        }

        if (selectedD) {
          const cx = xScale(selectedD.parsedDate);
          const cy = yScale(yVal(selectedD));

          verticalLine.attr('x1', cx).attr('x2', cx);
          focusCircle.attr('cx', cx).attr('cy', cy);
          setHoveredPoint(selectedD);
        }
      });
  }, [filteredData, metric, showMovingAvg]);

  // Format currencies
  const formatCurrency = (amountUsd: number) => {
    const val = typeof amountUsd === 'number' && Number.isFinite(amountUsd) ? amountUsd : 0;
    if (currencyUnit === 'btc') {
      const btc = +(val / 64200).toFixed(2);
      return `₿ ${btc.toLocaleString()} BTC`;
    }
    if (currencyUnit === 'eth') {
      const eth = +(val / 3450).toFixed(2);
      return `Ξ ${eth.toLocaleString()} ETH`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <div
      id="global-hyip-market-activity-d3-chart"
      className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-5"
    >
      {/* Top Header & Interactive Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Animated Goofy Mascot Duo Badge */}
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400 goofy-img-animated-1 shadow-md bg-slate-950">
                <img src={goofyCryptoMascot} alt="Goofy Mascot" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 goofy-img-animated-2 shadow-md bg-slate-950">
                <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Activity className="w-3.5 h-3.5" />
              <span>D3 Live Telemetry</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Global HYIP Market Activity</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="goofy-emoji-bounce inline-block text-xs">📊</span>
            <span>Real-time aggregate deposit volume, transaction inflow velocity, and moving average trends over the past 30 days.</span>
          </p>
        </div>

        {/* Action Controls: Metric / Timeframe / Currency */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex items-center text-xs font-semibold">
            {(['7d', '14d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer uppercase ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex items-center text-xs font-semibold">
            <button
              onClick={() => setMetric('volumeUsd')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metric === 'volumeUsd'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>Volume</span>
            </button>
            <button
              onClick={() => setMetric('inflowCount')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metric === 'inflowCount'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Inflows</span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex items-center text-xs font-semibold">
            {(['usd', 'btc', 'eth'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrencyUnit(curr)}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer uppercase ${
                  currencyUnit === curr
                    ? 'bg-slate-700 text-amber-300 font-black'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric KPI Summary Banner with Goofy Mascot Animations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Total Deposits with Vault Guardian */}
        <div className="bg-slate-950/70 border border-amber-500/40 hover:border-amber-400 rounded-xl p-3 space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -right-2 -bottom-2 w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <img src={goofyVaultGuardian} alt="Vault Guardian" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full overflow-hidden border border-amber-400/80 inline-block shrink-0 goofy-img-animated-1">
                <img src={goofyVaultGuardian} alt="Guardian" className="w-full h-full object-cover" />
              </span>
              <span>{timeframe.toUpperCase()} Deposits</span>
            </span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="text-base sm:text-lg font-black text-white font-mono">
            {formatCurrency(currentTotal)}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>30-Day Aggregated Flow</span>
          </div>
        </div>

        {/* 2. Daily Average Volume with Goofy Mascot */}
        <div className="bg-slate-950/70 border border-blue-500/40 hover:border-blue-400 rounded-xl p-3 space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -right-2 -bottom-2 w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <img src={goofyCryptoMascot} alt="Goofy Crypto Mascot" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full overflow-hidden border border-emerald-400/80 inline-block shrink-0 goofy-img-animated-2">
                <img src={goofyCryptoMascot} alt="Mascot" className="w-full h-full object-cover" />
              </span>
              <span>Daily Avg Volume</span>
            </span>
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
            {formatCurrency(currentAvg)}
          </div>
          <div className="text-[10px] text-slate-400">
            Across {filteredData.length} active sample days
          </div>
        </div>

        {/* 3. Peak 24H Inflow with Rocket Trader */}
        <div className="bg-slate-950/70 border border-cyan-500/40 hover:border-cyan-400 rounded-xl p-3 space-y-1 relative overflow-hidden group transition-all">
          <div className="absolute -right-2 -bottom-2 w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <img src={goofyRocketTrader} alt="Rocket Trader" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full overflow-hidden border border-cyan-400/80 inline-block shrink-0 goofy-img-animated-3">
                <img src={goofyRocketTrader} alt="Rocket Trader" className="w-full h-full object-cover" />
              </span>
              <span>Peak 24H Inflow</span>
            </span>
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
          </span>
          <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">
            {formatCurrency(currentPeak.volumeUsd)}
          </div>
          <div className="text-[10px] text-cyan-500/90 font-mono">
            Recorded on {currentPeak.formattedDate}
          </div>
        </div>

        {/* 4. Day-over-Day Velocity with Goofy Animation Stamp */}
        <div className="bg-slate-950/70 border border-emerald-500/40 hover:border-emerald-400 rounded-xl p-3 space-y-1 relative overflow-hidden group transition-all">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="goofy-emoji-bounce inline-block text-xs">⚡</span>
              <span>DoD Velocity</span>
            </span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <div
            className={`text-base sm:text-lg font-black font-mono flex items-center gap-1 ${
              dayOverDay >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {dayOverDay >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>
              {dayOverDay >= 0 ? '+' : ''}
              {dayOverDay}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Latest 24h delta</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas & Hover Card Container */}
      <div className="relative space-y-2">
        {/* Legend & Moving Avg Toggle */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block shadow-sm" />
              <span className="font-semibold text-slate-200">
                {metric === 'inflowCount' ? 'Daily Inflow Count' : 'Daily Volume (USD)'}
              </span>
            </div>
            {metric === 'volumeUsd' && (
              <button
                type="button"
                onClick={() => setShowMovingAvg(!showMovingAvg)}
                className={`flex items-center gap-1.5 cursor-pointer hover:text-amber-300 transition-colors ${
                  showMovingAvg ? 'text-amber-400 font-semibold' : 'text-slate-500'
                }`}
              >
                <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-400 inline-block" />
                <span>7-Day Moving Average ({showMovingAvg ? 'Active' : 'Hidden'})</span>
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
            Hover along timeline for exact day breakdowns
          </div>
        </div>

        {/* D3 SVG Container */}
        <div
          ref={containerRef}
          className="w-full h-[280px] sm:h-[340px] bg-slate-950/60 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center"
        >
          <svg ref={svgRef} className="w-full h-full block" />

          {/* Floating Hover Card (D3-Synced) */}
          {hoveredPoint && (
            <div className="absolute top-3 right-3 bg-slate-900/95 border border-slate-700/80 rounded-lg p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[210px] pointer-events-none animate-fadeIn z-20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>{hoveredPoint.formattedDate}</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800">
                  {hoveredPoint.activePrograms} Programs
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Daily Deposit:</span>
                  <strong className="text-emerald-400 font-mono text-xs">
                    {formatCurrency(hoveredPoint.volumeUsd)}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Inflow Transactions:</span>
                  <span className="text-sky-300 font-mono font-bold">
                    {hoveredPoint.inflowCount} deposits
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg Deposit Size:</span>
                  <span className="text-slate-200 font-mono">
                    ${hoveredPoint.avgDepositSize.toLocaleString()}
                  </span>
                </div>

                {hoveredPoint.movingAvg7d && (
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-1">
                    <span className="text-amber-400/90 font-medium">7D Moving Avg:</span>
                    <span className="text-amber-300 font-mono font-semibold">
                      ${hoveredPoint.movingAvg7d.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Crypto Equiv:</span>
                  <span className="font-mono text-amber-200">
                    ₿ {hoveredPoint.btcEquivalent} | Ξ {hoveredPoint.ethEquivalent}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Insights Footer */}
      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Telemetry synthesized from on-chain monitor wallets, verified user payment proofs, and API consensus nodes.
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 shrink-0">
          <span>Resolution: 24H intervals</span>
          <span className="text-slate-600">•</span>
          <span>D3.js v7</span>
        </div>
      </div>
    </div>
  );
};
