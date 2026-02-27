import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCountUp } from '@/hooks/use-count-up';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, Clock, MousePointerClick, ArrowUpRight, Globe, Users, Monitor
} from 'lucide-react';


/* ─────────────────────────────────────────────────────────────────────────────
 * COHERENT DATA MODEL
 *
 * All values are mathematically consistent:
 *  • pageViews ≈ visitors × 2.1  (PV/visitor ratio)
 *  • conversions ≈ visitors × 0.03  (3% conversion rate)
 *  • Traffic Trend chart ∑visitors = KPI visitors for that period
 *  • Top Pages ∑PV ≈ 75% of total PV  (remaining 25% = other unlisted pages)
 *  • Breakdown chart ∑visitors ≈ KPI visitors
 *  • Source % adds to 100
 *  • Periods scale proportionally: 7d → 30d (~4×) → 90d (~3×) → YTD (~3.5×)
 *  • Session duration in seconds; bounce rate in %
 * ────────────────────────────────────────────────────────────────────────── */

/* ── KPIs ─────────────────────────────────────────────────────────────────
 * 7d :  visitors=2,650   PV=5,570    conv=80     session=4:58  bounce=36%
 * 30d:  visitors=10,500  PV=22,050   conv=315    session=5:12  bounce=34%
 * 90d:  visitors=28,800  PV=60,500   conv=864    session=5:18  bounce=33%
 * YTD:  visitors=102,300 PV=214,800  conv=3,069  session=5:24  bounce=32%
 * ──────────────────────────────────────────────────────────────────────── */

const kpiByPeriod: Record<string, { pageViews: number; visitors: number; session: number; bounce: number; pvChange: number; vChange: number; sChange: number; bChange: number }> = {
  '7d': { pageViews: 5570, visitors: 2650, session: 298, bounce: 36, pvChange: 6.4, vChange: 3.2, sChange: -1.5, bChange: -2.1 },
  '30d': { pageViews: 22050, visitors: 10500, session: 312, bounce: 34, pvChange: 9.8, vChange: 5.7, sChange: -0.8, bChange: -3.4 },
  '90d': { pageViews: 60500, visitors: 28800, session: 318, bounce: 33, pvChange: 11.5, vChange: 7.1, sChange: -1.2, bChange: -4.8 },
  'YTD': { pageViews: 214800, visitors: 102300, session: 324, bounce: 32, pvChange: 14.2, vChange: 8.5, sChange: -2.1, bChange: -5.3 },
};

/* ── Traffic Trend (line chart) ───────────────────────────────────────────
 * ∑visitors must equal KPI visitors; conversions ≈ 3% of visitors
 * 7d daily  ∑ = 2,650 ✓   conv ∑ = 80 ✓
 * 30d weekly ∑ = 10,500 ✓  conv ∑ = 315 ✓
 * 90d monthly ∑ = 28,800 ✓ conv ∑ = 864 ✓
 * YTD monthly ∑ = 102,300 ✓ conv ∑ = 3,069 ✓
 * ──────────────────────────────────────────────────────────────────────── */

const dailyTraffic7d = [
  { label: 'Mon', visitors: 480, conversions: 14 },
  { label: 'Tue', visitors: 440, conversions: 13 },
  { label: 'Wed', visitors: 460, conversions: 14 },
  { label: 'Thu', visitors: 510, conversions: 15 },
  { label: 'Fri', visitors: 420, conversions: 13 },
  { label: 'Sat', visitors: 200, conversions: 6 },
  { label: 'Sun', visitors: 140, conversions: 5 },
]; // ∑visitors=2,650  ∑conv=80

const weeklyTraffic = [
  { label: 'W1', visitors: 2350, conversions: 71 },
  { label: 'W2', visitors: 2580, conversions: 77 },
  { label: 'W3', visitors: 2720, conversions: 82 },
  { label: 'W4', visitors: 2850, conversions: 85 },
]; // ∑visitors=10,500  ∑conv=315

const quarterlyTraffic = [
  { label: 'Oct', visitors: 9200, conversions: 276 },
  { label: 'Nov', visitors: 9600, conversions: 288 },
  { label: 'Dec', visitors: 10000, conversions: 300 },
]; // ∑visitors=28,800  ∑conv=864

const monthlyTraffic = [
  { label: 'Jan', visitors: 6800, conversions: 204 },
  { label: 'Feb', visitors: 7200, conversions: 216 },
  { label: 'Mar', visitors: 7600, conversions: 228 },
  { label: 'Apr', visitors: 8000, conversions: 240 },
  { label: 'May', visitors: 8200, conversions: 246 },
  { label: 'Jun', visitors: 8500, conversions: 255 },
  { label: 'Jul', visitors: 8800, conversions: 264 },
  { label: 'Aug', visitors: 9000, conversions: 270 },
  { label: 'Sep', visitors: 9100, conversions: 273 },
  { label: 'Oct', visitors: 9200, conversions: 276 },
  { label: 'Nov', visitors: 9600, conversions: 288 },
  { label: 'Dec', visitors: 10300, conversions: 309 },
]; // ∑visitors=102,300  ∑conv=3,069

/* ── Traffic Sources  (pie chart, %) ──────────────────────────────────── */

const sourceByPeriod: Record<string, { name: string; value: number; color: string }[]> = {
  '7d': [
    { name: 'Organic', value: 38, color: '#004AAC' },
    { name: 'Direct', value: 24, color: '#3b82f6' },
    { name: 'Referral', value: 20, color: '#93c5fd' },
    { name: 'Social', value: 18, color: '#dbeafe' },
  ], // ∑=100
  '30d': [
    { name: 'Organic', value: 40, color: '#004AAC' },
    { name: 'Direct', value: 26, color: '#3b82f6' },
    { name: 'Referral', value: 19, color: '#93c5fd' },
    { name: 'Social', value: 15, color: '#dbeafe' },
  ], // ∑=100
  '90d': [
    { name: 'Organic', value: 42, color: '#004AAC' },
    { name: 'Direct', value: 27, color: '#3b82f6' },
    { name: 'Referral', value: 18, color: '#93c5fd' },
    { name: 'Social', value: 13, color: '#dbeafe' },
  ], // ∑=100
  'YTD': [
    { name: 'Organic', value: 43, color: '#004AAC' },
    { name: 'Direct', value: 27, color: '#3b82f6' },
    { name: 'Referral', value: 18, color: '#93c5fd' },
    { name: 'Social', value: 12, color: '#dbeafe' },
  ], // ∑=100
};

/* ── Breakdown chart  (bar chart) ─────────────────────────────────────────
 * ∑visitors ≈ KPI visitors for period; sessions ≈ visitors × 1.3
 * ──────────────────────────────────────────────────────────────────────── */

const breakdownByPeriod: Record<string, { label: string; visitors: number; sessions: number }[]> = {
  '7d': [
    { label: '0-4h', visitors: 160, sessions: 210 },
    { label: '4-8h', visitors: 380, sessions: 490 },
    { label: '8-12h', visitors: 720, sessions: 940 },
    { label: '12-16h', visitors: 610, sessions: 790 },
    { label: '16-20h', visitors: 540, sessions: 700 },
    { label: '20-24h', visitors: 240, sessions: 310 },
  ], // ∑visitors=2,650  ∑sessions=3,440
  '30d': [
    { label: 'Mon', visitors: 1850, sessions: 2410 },
    { label: 'Tue', visitors: 1720, sessions: 2240 },
    { label: 'Wed', visitors: 1800, sessions: 2340 },
    { label: 'Thu', visitors: 1900, sessions: 2470 },
    { label: 'Fri', visitors: 1680, sessions: 2180 },
    { label: 'Sat', visitors: 880, sessions: 1140 },
    { label: 'Sun', visitors: 670, sessions: 870 },
  ], // ∑visitors=10,500  ∑sessions=13,650
  '90d': [
    { label: 'W1-2', visitors: 4200, sessions: 5460 },
    { label: 'W3-4', visitors: 4500, sessions: 5850 },
    { label: 'W5-6', visitors: 4700, sessions: 6110 },
    { label: 'W7-8', visitors: 4900, sessions: 6370 },
    { label: 'W9-10', visitors: 5200, sessions: 6760 },
    { label: 'W11-12', visitors: 5300, sessions: 6890 },
  ], // ∑visitors=28,800  ∑sessions=37,440
  'YTD': [
    { label: 'Jan', visitors: 6800, sessions: 8840 },
    { label: 'Mar', visitors: 7600, sessions: 9880 },
    { label: 'May', visitors: 8200, sessions: 10660 },
    { label: 'Jul', visitors: 8800, sessions: 11440 },
    { label: 'Sep', visitors: 9100, sessions: 11830 },
    { label: 'Nov', visitors: 9600, sessions: 12480 },
  ], // ∑ of sampled months ≈ 50,100 (bi-monthly chart, covers ~half the months)
};

/* ── Top Pages ────────────────────────────────────────────────────────────
 * ∑PV ≈ 75% of total PV  (remaining 25% = other unlisted pages like /, /blog, /careers, etc.)
 * 7d : ∑=4,180  ÷ 5,570  = 75% ✓
 * 30d: ∑=16,540 ÷ 22,050 = 75% ✓
 * 90d: ∑=45,380 ÷ 60,500 = 75% ✓
 * YTD: ∑=161,100 ÷ 214,800 = 75% ✓
 * ──────────────────────────────────────────────────────────────────────── */

const topPagesByPeriod: Record<string, { page: string; pageViews: number; bounceRate: number; avgDuration: string }[]> = {
  '7d': [
    { page: '/services', pageViews: 1340, bounceRate: 32, avgDuration: '2:52' },
    { page: '/pricing', pageViews: 1060, bounceRate: 26, avgDuration: '3:18' },
    { page: '/about', pageViews: 780, bounceRate: 40, avgDuration: '2:01' },
    { page: '/contact', pageViews: 560, bounceRate: 36, avgDuration: '2:25' },
    { page: '/blog/seo-tips', pageViews: 440, bounceRate: 20, avgDuration: '4:42' },
  ], // ∑=4,180
  '30d': [
    { page: '/services', pageViews: 5290, bounceRate: 33, avgDuration: '2:48' },
    { page: '/pricing', pageViews: 4190, bounceRate: 27, avgDuration: '3:15' },
    { page: '/about', pageViews: 3090, bounceRate: 41, avgDuration: '1:58' },
    { page: '/contact', pageViews: 2200, bounceRate: 37, avgDuration: '2:20' },
    { page: '/blog/seo-tips', pageViews: 1770, bounceRate: 21, avgDuration: '4:35' },
  ], // ∑=16,540
  '90d': [
    { page: '/services', pageViews: 14510, bounceRate: 34, avgDuration: '2:46' },
    { page: '/pricing', pageViews: 11480, bounceRate: 28, avgDuration: '3:14' },
    { page: '/about', pageViews: 8470, bounceRate: 42, avgDuration: '1:56' },
    { page: '/contact', pageViews: 6050, bounceRate: 38, avgDuration: '2:19' },
    { page: '/blog/seo-tips', pageViews: 4870, bounceRate: 22, avgDuration: '4:32' },
  ], // ∑=45,380
  'YTD': [
    { page: '/services', pageViews: 51530, bounceRate: 34, avgDuration: '2:45' },
    { page: '/pricing', pageViews: 40780, bounceRate: 28, avgDuration: '3:12' },
    { page: '/about', pageViews: 30080, bounceRate: 42, avgDuration: '1:55' },
    { page: '/contact', pageViews: 21510, bounceRate: 38, avgDuration: '2:18' },
    { page: '/blog/seo-tips', pageViews: 17200, bounceRate: 22, avgDuration: '4:30' },
  ], // ∑=161,100
};

/* ── Activity Heatmap  (per-period intensity patterns) ────────────────── */

const heatmapByPeriod: Record<string, number[][]> = {
  '7d': [
    [1, 0, 0, 0, 0, 1, 3, 7, 10, 9, 8, 6, 5, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 0],
    [2, 1, 0, 0, 0, 1, 4, 8, 10, 9, 7, 6, 5, 7, 8, 9, 10, 9, 7, 5, 3, 2, 1, 0],
    [3, 1, 0, 0, 0, 2, 5, 9, 10, 9, 8, 7, 6, 7, 9, 10, 10, 9, 7, 5, 4, 3, 2, 1],
    [2, 1, 0, 0, 0, 1, 4, 8, 9, 8, 7, 6, 5, 6, 8, 9, 9, 8, 6, 4, 3, 2, 1, 0],
    [3, 2, 1, 0, 0, 1, 3, 6, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7, 5, 3, 2, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 3, 5, 4, 3, 2, 2, 3, 4, 5, 6, 5, 3, 2, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1, 0, 0, 0],
  ],
  '30d': [
    [3, 1, 0, 0, 0, 1, 2, 5, 8, 7, 6, 5, 4, 5, 6, 7, 8, 9, 7, 5, 4, 3, 2, 1],
    [2, 1, 0, 0, 1, 2, 3, 6, 9, 8, 7, 6, 5, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 1],
    [4, 2, 1, 0, 0, 1, 4, 7, 10, 9, 8, 7, 5, 7, 8, 9, 10, 9, 7, 5, 4, 3, 2, 1],
    [3, 1, 1, 0, 0, 2, 3, 6, 9, 8, 7, 6, 4, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 1],
    [5, 3, 2, 1, 0, 1, 3, 5, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7, 5, 3, 2, 2, 1, 1],
    [2, 1, 0, 0, 0, 1, 2, 4, 6, 5, 4, 3, 3, 4, 5, 6, 7, 6, 4, 3, 2, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 0, 0],
  ],
  '90d': [
    [4, 2, 1, 0, 0, 2, 3, 6, 9, 8, 7, 6, 5, 6, 7, 8, 9, 8, 7, 5, 4, 3, 2, 1],
    [3, 2, 1, 0, 1, 2, 4, 7, 9, 9, 8, 7, 6, 7, 8, 8, 9, 8, 7, 5, 4, 3, 2, 1],
    [5, 3, 1, 1, 0, 2, 5, 8, 10, 10, 9, 8, 7, 8, 9, 10, 10, 9, 8, 6, 5, 4, 3, 2],
    [4, 2, 1, 0, 1, 2, 4, 7, 9, 9, 8, 7, 5, 7, 8, 9, 9, 8, 7, 5, 4, 3, 2, 1],
    [4, 3, 2, 1, 0, 2, 4, 6, 8, 8, 7, 6, 5, 6, 7, 8, 8, 7, 6, 4, 3, 3, 2, 1],
    [3, 2, 1, 0, 0, 1, 3, 5, 7, 6, 5, 4, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 1],
    [2, 1, 0, 0, 0, 1, 2, 3, 5, 4, 3, 3, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 0],
  ],
  'YTD': [
    [5, 3, 2, 1, 1, 2, 4, 7, 9, 8, 7, 6, 5, 6, 7, 8, 9, 9, 8, 6, 5, 4, 3, 2],
    [4, 3, 1, 1, 1, 3, 5, 7, 10, 9, 8, 7, 6, 7, 8, 9, 10, 9, 8, 6, 5, 4, 3, 2],
    [6, 4, 2, 1, 1, 3, 6, 9, 10, 10, 9, 8, 7, 8, 9, 10, 10, 10, 9, 7, 6, 5, 4, 3],
    [5, 3, 2, 1, 1, 3, 5, 8, 10, 9, 8, 7, 6, 7, 8, 9, 10, 9, 8, 6, 5, 4, 3, 2],
    [5, 4, 3, 2, 1, 2, 4, 7, 9, 8, 7, 6, 5, 6, 7, 8, 9, 8, 7, 5, 4, 3, 2, 2],
    [4, 3, 2, 1, 0, 2, 3, 6, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7, 6, 4, 3, 2, 2, 1],
    [3, 2, 1, 1, 0, 1, 2, 4, 6, 5, 4, 4, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 1],
  ],
};
const heatmapMultiplier: Record<string, number> = { '7d': 3, '30d': 8, '90d': 20, 'YTD': 35 };
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function AnimatedValue({ value }: { value: number }) {
  const animated = useCountUp(value, 1200);
  return <>{animated.toLocaleString()}</>;
}

export default function AnalyticsPage() {
  const { t, formatCurrency } = useLanguage();
  const [period, setPeriod] = useState('30d');

  const filteredTraffic = useMemo(() => {
    switch (period) {
      case '7d': return dailyTraffic7d;
      case '30d': return weeklyTraffic;
      case '90d': return quarterlyTraffic;
      default: return monthlyTraffic;
    }
  }, [period]);

  const kpiData = kpiByPeriod[period] || kpiByPeriod['YTD'];
  const filteredSources = sourceByPeriod[period] || sourceByPeriod['YTD'];
  const filteredBreakdown = breakdownByPeriod[period] || breakdownByPeriod['YTD'];
  const filteredTopPages = topPagesByPeriod[period] || topPagesByPeriod['YTD'];
  const heatmapMult = heatmapMultiplier[period] || 35;

  const breakdownTitle = useMemo(() => {
    switch (period) {
      case '7d': return t('Hourly Breakdown', 'Hodinový přehled');
      case '30d': return t('Weekly Breakdown', 'Týdenní přehled');
      case '90d': return t('Bi-weekly Breakdown', 'Dvoutýdenní přehled');
      default: return t('Monthly Breakdown', 'Měsíční přehled');
    }
  }, [period, t]);

  const kpis = [
    { icon: Eye, label: t('Page Views', 'Zobrazení stránek'), value: kpiData.pageViews, change: kpiData.pvChange, up: true, color: 'text-primary bg-primary/10' },
    { icon: Users, label: t('Unique Visitors', 'Unikátní návštěvníci'), value: kpiData.visitors, change: kpiData.vChange, up: true, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    { icon: Clock, label: t('Avg. Session', 'Prům. relace'), value: kpiData.session, change: kpiData.sChange, up: false, suffix: 's', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { icon: MousePointerClick, label: t('Bounce Rate', 'Míra opuštění'), value: kpiData.bounce, change: kpiData.bChange, up: true, suffix: '%', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="flex items-center justify-between animate-fade-in-up stagger-1">
        <div>
          <p className="text-sm text-muted-foreground">{t('Analytics overview for the selected period', 'Přehled analytiky za vybrané období')}</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {['7d', '30d', '90d', 'YTD'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-3 text-xs ${period === p ? 'bg-primary text-primary-foreground shadow-sm' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={kpi.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 2}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.up ? '+' : ''}{kpi.change}%
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {kpi.suffix === 's' ? (
                  <><AnimatedValue value={Math.floor(kpi.value / 60)} />:{(kpi.value % 60).toString().padStart(2, '0')} <span className="text-sm text-muted-foreground font-normal">min</span></>
                ) : kpi.suffix === '%' ? (
                  <><AnimatedValue value={kpi.value} />{kpi.suffix}</>
                ) : (
                  <AnimatedValue value={kpi.value} />
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly traffic trend */}
        <Card className="xl:col-span-2 border-border animate-fade-in-up stagger-6">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('Traffic Trend', 'Trend návštěvnosti')}</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />{t('Visitors', 'Návštěvníci')}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />{t('Conversions', 'Konverze')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={filteredTraffic}>
                <defs>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conversionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 100']} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area yAxisId="left" type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="url(#visitorsGrad)" strokeWidth={2} name={t('Visitors', 'Návštěvníci')} />
                <Area yAxisId="right" type="monotone" dataKey="conversions" stroke="#16a34a" fill="url(#conversionsGrad)" strokeWidth={2} name={t('Conversions', 'Konverze')} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-border card-hover animate-fade-in-up stagger-7">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t('Traffic Sources', 'Zdroje návštěvnosti')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={filteredSources} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {filteredSources.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 w-full mt-2">
              {filteredSources.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: src.color }} />
                    <span className="text-muted-foreground">{src.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{src.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly bar chart + Top pages */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Breakdown bar chart */}
        <Card className="border-border animate-fade-in-up stagger-8">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{breakdownTitle}</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={filteredBreakdown} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={t('Visitors', 'Návštěvníci')} />
                <Bar dataKey="sessions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name={t('Sessions', 'Relace')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top pages */}
        <Card className="border-border animate-fade-in-up stagger-8">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('Top Pages', 'Nejnavštěvovanější stránky')}</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1">
                {t('View All', 'Zobrazit vše')}
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2 text-xs font-medium text-muted-foreground">{t('Page', 'Stránka')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Views', 'Zobrazení')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Bounce', 'Opuštění')}</th>
                  <th className="text-right px-5 py-2 text-xs font-medium text-muted-foreground">{t('Duration', 'Doba')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopPages.map((page) => (
                  <tr key={page.page} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-xs text-primary">{page.page}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-xs">{page.pageViews.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{page.bounceRate}%</td>
                    <td className="px-5 py-2.5 text-right text-xs text-muted-foreground">{page.avgDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="border-border animate-fade-in-up stagger-8">
        <CardHeader className="pb-2 px-5 pt-5">
          <CardTitle className="text-sm font-semibold">{t('Activity Heatmap', 'Heatmapa aktivity')}</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="space-y-1">
            {(heatmapByPeriod[period] || heatmapByPeriod['30d']).map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground w-8 shrink-0">{days[rowIdx]}</span>
                <div className="flex gap-0.5 flex-1">
                  {row.map((val, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex-1 h-5 rounded-sm transition-colors cursor-pointer"
                      style={{
                        backgroundColor: `hsl(216, 100%, ${val === 0 ? '95' : Math.max(30, 80 - val * 5)}%)`,
                        opacity: val === 0 ? (document.documentElement.classList.contains('dark') ? 0.15 : 0.5) : 1,
                      }}
                      title={`${days[rowIdx]} ${colIdx}:00 — ${val * heatmapMult} ${t('visits', 'návštěv')}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Hour labels */}
            <div className="flex items-center gap-1 ml-8">
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="flex-1 text-center">
                    {i % 3 === 0 ? (
                      <span className="text-[9px] text-muted-foreground">{i}h</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1 ml-8 mt-1">
              <span className="text-[10px] text-muted-foreground">{t('Less', 'Méně')}</span>
              {[0, 2, 4, 6, 8, 10].map(v => (
                <div key={v} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `hsl(216, 100%, ${v === 0 ? '95' : Math.max(30, 80 - v * 5)}%)` }} />
              ))}
              <span className="text-[10px] text-muted-foreground">{t('More', 'Více')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
