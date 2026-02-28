import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, Clock, MousePointerClick, Globe, Users, Monitor,
  DollarSign, ShoppingCart, Target, Smartphone, Laptop, Tablet, ArrowUpRight,
  MapPin, Zap, Activity, BarChart3, Download
} from 'lucide-react';

// ── KPI data by period ──
const kpiByPeriod: Record<string, { pageViews: number; visitors: number; session: number; bounce: number; revenue: number; convRate: number; pvChange: number; vChange: number; sChange: number; bChange: number; rChange: number; cChange: number }> = {
  '7d': { pageViews: 5570, visitors: 2650, session: 298, bounce: 36, revenue: 185000, convRate: 3.0, pvChange: 6.4, vChange: 3.2, sChange: -1.5, bChange: -2.1, rChange: 8.2, cChange: 0.3 },
  '30d': { pageViews: 22050, visitors: 10500, session: 312, bounce: 34, revenue: 742000, convRate: 3.0, pvChange: 9.8, vChange: 5.7, sChange: -0.8, bChange: -3.4, rChange: 12.4, cChange: 0.5 },
  '90d': { pageViews: 60500, visitors: 28800, session: 318, bounce: 33, revenue: 2180000, convRate: 3.0, pvChange: 11.5, vChange: 7.1, sChange: -1.2, bChange: -4.8, rChange: 15.1, cChange: 0.7 },
  'YTD': { pageViews: 214800, visitors: 102300, session: 324, bounce: 32, revenue: 8450000, convRate: 3.0, pvChange: 14.2, vChange: 8.5, sChange: -2.1, bChange: -5.3, rChange: 18.6, cChange: 1.1 },
};

// ── Traffic trend data ──
const trafficByPeriod: Record<string, { label: string; visitors: number; conversions: number; revenue: number }[]> = {
  '7d': [
    { label: 'Po', visitors: 480, conversions: 14, revenue: 28000 }, { label: 'Út', visitors: 440, conversions: 13, revenue: 25000 },
    { label: 'St', visitors: 460, conversions: 14, revenue: 27000 }, { label: 'Čt', visitors: 510, conversions: 15, revenue: 32000 },
    { label: 'Pá', visitors: 420, conversions: 13, revenue: 30000 }, { label: 'So', visitors: 200, conversions: 6, revenue: 22000 },
    { label: 'Ne', visitors: 140, conversions: 5, revenue: 21000 },
  ],
  '30d': [
    { label: 'T1', visitors: 2350, conversions: 71, revenue: 165000 }, { label: 'T2', visitors: 2580, conversions: 77, revenue: 182000 },
    { label: 'T3', visitors: 2720, conversions: 82, revenue: 192000 }, { label: 'T4', visitors: 2850, conversions: 85, revenue: 203000 },
  ],
  '90d': [
    { label: 'Říj', visitors: 9200, conversions: 276, revenue: 690000 }, { label: 'Lis', visitors: 9600, conversions: 288, revenue: 720000 },
    { label: 'Pro', visitors: 10000, conversions: 300, revenue: 770000 },
  ],
  'YTD': [
    { label: 'Led', visitors: 6800, conversions: 204, revenue: 520000 }, { label: 'Úno', visitors: 7200, conversions: 216, revenue: 560000 },
    { label: 'Bře', visitors: 7600, conversions: 228, revenue: 610000 }, { label: 'Dub', visitors: 8000, conversions: 240, revenue: 650000 },
    { label: 'Kvě', visitors: 8200, conversions: 246, revenue: 680000 }, { label: 'Čvn', visitors: 8500, conversions: 255, revenue: 710000 },
    { label: 'Čvc', visitors: 8800, conversions: 264, revenue: 740000 }, { label: 'Srp', visitors: 9000, conversions: 270, revenue: 760000 },
    { label: 'Zář', visitors: 9100, conversions: 273, revenue: 775000 }, { label: 'Říj', visitors: 9200, conversions: 276, revenue: 790000 },
    { label: 'Lis', visitors: 9600, conversions: 288, revenue: 820000 }, { label: 'Pro', visitors: 10300, conversions: 309, revenue: 835000 },
  ],
};

// ── Traffic sources ──
const sourceByPeriod: Record<string, { name: string; nameCz: string; value: number; color: string }[]> = {
  '7d': [{ name: 'Organic', nameCz: 'Organické', value: 38, color: '#004AAC' }, { name: 'Direct', nameCz: 'Přímé', value: 24, color: '#3b82f6' }, { name: 'Referral', nameCz: 'Odkazové', value: 20, color: '#93c5fd' }, { name: 'Social', nameCz: 'Sociální', value: 18, color: '#f59e0b' }],
  '30d': [{ name: 'Organic', nameCz: 'Organické', value: 40, color: '#004AAC' }, { name: 'Direct', nameCz: 'Přímé', value: 26, color: '#3b82f6' }, { name: 'Referral', nameCz: 'Odkazové', value: 19, color: '#93c5fd' }, { name: 'Social', nameCz: 'Sociální', value: 15, color: '#f59e0b' }],
  '90d': [{ name: 'Organic', nameCz: 'Organické', value: 42, color: '#004AAC' }, { name: 'Direct', nameCz: 'Přímé', value: 27, color: '#3b82f6' }, { name: 'Referral', nameCz: 'Odkazové', value: 18, color: '#93c5fd' }, { name: 'Social', nameCz: 'Sociální', value: 13, color: '#f59e0b' }],
  'YTD': [{ name: 'Organic', nameCz: 'Organické', value: 43, color: '#004AAC' }, { name: 'Direct', nameCz: 'Přímé', value: 27, color: '#3b82f6' }, { name: 'Referral', nameCz: 'Odkazové', value: 18, color: '#93c5fd' }, { name: 'Social', nameCz: 'Sociální', value: 12, color: '#f59e0b' }],
};

// ── Top pages ──
const topPagesByPeriod: Record<string, { page: string; pageViews: number; bounceRate: number; avgDuration: string; convRate: number }[]> = {
  '7d': [{ page: '/products/hardware', pageViews: 1340, bounceRate: 28, avgDuration: '3:12', convRate: 5.2 }, { page: '/products/toner', pageViews: 1060, bounceRate: 24, avgDuration: '2:48', convRate: 6.8 }, { page: '/cart', pageViews: 780, bounceRate: 18, avgDuration: '1:35', convRate: 42.5 }, { page: '/products/peripherals', pageViews: 560, bounceRate: 30, avgDuration: '2:55', convRate: 4.1 }, { page: '/products/networking', pageViews: 440, bounceRate: 26, avgDuration: '3:18', convRate: 3.8 }],
  '30d': [{ page: '/products/hardware', pageViews: 5290, bounceRate: 29, avgDuration: '3:08', convRate: 5.0 }, { page: '/products/toner', pageViews: 4190, bounceRate: 25, avgDuration: '2:45', convRate: 6.5 }, { page: '/cart', pageViews: 3090, bounceRate: 19, avgDuration: '1:32', convRate: 41.8 }, { page: '/products/peripherals', pageViews: 2200, bounceRate: 31, avgDuration: '2:50', convRate: 3.9 }, { page: '/products/networking', pageViews: 1770, bounceRate: 27, avgDuration: '3:15', convRate: 3.6 }],
  '90d': [{ page: '/products/hardware', pageViews: 14510, bounceRate: 30, avgDuration: '3:05', convRate: 4.8 }, { page: '/products/toner', pageViews: 11480, bounceRate: 26, avgDuration: '2:42', convRate: 6.2 }, { page: '/cart', pageViews: 8470, bounceRate: 20, avgDuration: '1:30', convRate: 40.5 }, { page: '/products/peripherals', pageViews: 6050, bounceRate: 32, avgDuration: '2:48', convRate: 3.7 }, { page: '/products/networking', pageViews: 4870, bounceRate: 28, avgDuration: '3:12', convRate: 3.4 }],
  'YTD': [{ page: '/products/hardware', pageViews: 51530, bounceRate: 30, avgDuration: '3:04', convRate: 4.7 }, { page: '/products/toner', pageViews: 40780, bounceRate: 26, avgDuration: '2:40', convRate: 6.0 }, { page: '/cart', pageViews: 30080, bounceRate: 20, avgDuration: '1:28', convRate: 39.8 }, { page: '/products/peripherals', pageViews: 21510, bounceRate: 33, avgDuration: '2:46', convRate: 3.5 }, { page: '/products/networking', pageViews: 17200, bounceRate: 29, avgDuration: '3:10', convRate: 3.2 }],
};

// ── Conversion funnel ──
const funnelByPeriod: Record<string, { step: string; stepCz: string; value: number; pct: number }[]> = {
  '7d': [{ step: 'Page Views', stepCz: 'Zobrazení', value: 5570, pct: 100 }, { step: 'Product Views', stepCz: 'Produkty', value: 2230, pct: 40 }, { step: 'Add to Cart', stepCz: 'Do košíku', value: 445, pct: 8 }, { step: 'Checkout', stepCz: 'Pokladna', value: 178, pct: 3.2 }, { step: 'Purchase', stepCz: 'Nákup', value: 80, pct: 1.4 }],
  '30d': [{ step: 'Page Views', stepCz: 'Zobrazení', value: 22050, pct: 100 }, { step: 'Product Views', stepCz: 'Produkty', value: 8820, pct: 40 }, { step: 'Add to Cart', stepCz: 'Do košíku', value: 1764, pct: 8 }, { step: 'Checkout', stepCz: 'Pokladna', value: 706, pct: 3.2 }, { step: 'Purchase', stepCz: 'Nákup', value: 315, pct: 1.4 }],
  '90d': [{ step: 'Page Views', stepCz: 'Zobrazení', value: 60500, pct: 100 }, { step: 'Product Views', stepCz: 'Produkty', value: 24200, pct: 40 }, { step: 'Add to Cart', stepCz: 'Do košíku', value: 4840, pct: 8 }, { step: 'Checkout', stepCz: 'Pokladna', value: 1936, pct: 3.2 }, { step: 'Purchase', stepCz: 'Nákup', value: 864, pct: 1.4 }],
  'YTD': [{ step: 'Page Views', stepCz: 'Zobrazení', value: 214800, pct: 100 }, { step: 'Product Views', stepCz: 'Produkty', value: 85920, pct: 40 }, { step: 'Add to Cart', stepCz: 'Do košíku', value: 17184, pct: 8 }, { step: 'Checkout', stepCz: 'Pokladna', value: 6874, pct: 3.2 }, { step: 'Purchase', stepCz: 'Nákup', value: 3069, pct: 1.4 }],
};

// ── Device data ──
const deviceData = [
  { name: 'Desktop', nameCz: 'Počítač', value: 58, icon: Laptop, color: '#6366f1' },
  { name: 'Mobile', nameCz: 'Mobil', value: 34, icon: Smartphone, color: '#10b981' },
  { name: 'Tablet', nameCz: 'Tablet', value: 8, icon: Tablet, color: '#f59e0b' },
];

// ── Geographic data ──
const geoData = [
  { country: 'Česko', flag: '🇨🇿', visitors: 62, sessions: 4850 },
  { country: 'Slovensko', flag: '🇸🇰', visitors: 18, sessions: 1410 },
  { country: 'Německo', flag: '🇩🇪', visitors: 8, sessions: 628 },
  { country: 'Polsko', flag: '🇵🇱', visitors: 5, sessions: 392 },
  { country: 'Rakousko', flag: '🇦🇹', visitors: 4, sessions: 314 },
  { country: 'Ostatní', flag: '🌍', visitors: 3, sessions: 235 },
];

// ── Performance metrics ──
const perfMetrics = [
  { label: 'LCP', labelFull: 'Largest Contentful Paint', value: 1.8, unit: 's', good: 2.5, color: 'text-green-600' },
  { label: 'FID', labelFull: 'First Input Delay', value: 45, unit: 'ms', good: 100, color: 'text-green-600' },
  { label: 'CLS', labelFull: 'Cumulative Layout Shift', value: 0.05, unit: '', good: 0.1, color: 'text-green-600' },
  { label: 'TTFB', labelFull: 'Time to First Byte', value: 320, unit: 'ms', good: 800, color: 'text-green-600' },
];

// ── Real-time mock ──
const realtimePages = [
  { page: '/products/hardware', active: 12 }, { page: '/products/toner', active: 8 }, { page: '/', active: 6 },
  { page: '/cart', active: 4 }, { page: '/products/networking', active: 3 },
];

// ── Heatmap ──
const heatmapData: number[][] = [
  [1, 0, 0, 0, 0, 1, 3, 7, 10, 9, 8, 6, 5, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 0],
  [2, 1, 0, 0, 0, 1, 4, 8, 10, 9, 7, 6, 5, 7, 8, 9, 10, 9, 7, 5, 3, 2, 1, 0],
  [3, 1, 0, 0, 0, 2, 5, 9, 10, 9, 8, 7, 6, 7, 9, 10, 10, 9, 7, 5, 4, 3, 2, 1],
  [2, 1, 0, 0, 0, 1, 4, 8, 9, 8, 7, 6, 5, 6, 8, 9, 9, 8, 6, 4, 3, 2, 1, 0],
  [3, 2, 1, 0, 0, 1, 3, 6, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7, 5, 3, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 3, 5, 4, 3, 2, 2, 3, 4, 5, 6, 5, 3, 2, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1, 0, 0, 0],
];
const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

// ── Active tab type ──
type AnalyticsTab = 'overview' | 'revenue' | 'audience';

function AnimatedValue({ value }: { value: number }) {
  const animated = useCountUp(value, 1200);
  return <>{animated.toLocaleString()}</>;
}

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

export default function AnalyticsPage() {
  const { t, formatCurrency } = useLanguage();
  const [period, setPeriod] = useState('30d');
  const [tab, setTab] = useState<AnalyticsTab>('overview');

  const kpi = kpiByPeriod[period];
  const traffic = trafficByPeriod[period];
  const sources = sourceByPeriod[period];
  const topPages = topPagesByPeriod[period];
  const funnel = funnelByPeriod[period];

  const kpis = [
    { icon: Eye, label: t('Page Views', 'Zobrazení'), value: kpi.pageViews, change: kpi.pvChange, up: true, color: 'text-primary bg-primary/10' },
    { icon: Users, label: t('Visitors', 'Návštěvníci'), value: kpi.visitors, change: kpi.vChange, up: true, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    { icon: DollarSign, label: t('Revenue', 'Tržby'), value: kpi.revenue, change: kpi.rChange, up: true, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', isCurrency: true },
    { icon: Target, label: t('Conv. Rate', 'Míra konv.'), value: kpi.convRate, change: kpi.cChange, up: true, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400', suffix: '%', decimal: true },
    { icon: Clock, label: t('Avg. Session', 'Prům. relace'), value: kpi.session, change: kpi.sChange, up: false, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', isTime: true },
    { icon: MousePointerClick, label: t('Bounce Rate', 'Míra opuštění'), value: kpi.bounce, change: kpi.bChange, up: true, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', suffix: '%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2">
          {(['overview', 'revenue', 'audience'] as const).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors', tab === t2 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
              {t2 === 'overview' ? t('Overview', 'Přehled') : t2 === 'revenue' ? t('Revenue', 'Tržby') : t('Audience', 'Publikum')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" />{t('Export', 'Exportovat')}</Button>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            {['7d', '30d', '90d', 'YTD'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', period === p ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
        {kpis.map((k, idx) => (
          <Card key={k.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 2}`}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-1.5">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${k.color}`}><k.icon className="h-3.5 w-3.5" /></div>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${k.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {k.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}{k.up ? '+' : ''}{k.change}%
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {k.isCurrency ? formatCurrency(k.value) : k.isTime ? <><AnimatedValue value={Math.floor(k.value / 60)} />:{(k.value % 60).toString().padStart(2, '0')}<span className="text-xs text-muted-foreground font-normal"> min</span></> : k.decimal ? `${k.value}${k.suffix}` : <><AnimatedValue value={k.value} />{k.suffix || ''}</>}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {tab === 'overview' && <>
        {/* Traffic trend + Sources */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-in-up stagger-8">
          <Card className="xl:col-span-2 border-border">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t('Traffic & Revenue Trend', 'Trend návštěvnosti a tržeb')}</CardTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />{t('Visitors', 'Návštěvníci')}</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />{t('Revenue', 'Tržby')}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(216,100%,50%)" stopOpacity={0.15} /><stop offset="95%" stopColor="hsl(216,100%,50%)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} /><stop offset="95%" stopColor="#16a34a" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area yAxisId="l" type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="url(#vGrad)" strokeWidth={2} name={t('Visitors', 'Návštěvníci')} />
                  <Area yAxisId="r" type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#rGrad)" strokeWidth={2} name={t('Revenue', 'Tržby')} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" />{t('Traffic Sources', 'Zdroje')}</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center pb-4">
              <ResponsiveContainer width="100%" height={130}>
                <PieChart><Pie data={sources} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>{sources.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`]} /></PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 w-full mt-2">
                {sources.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} /><span className="text-muted-foreground">{t(s.name, s.nameCz)}</span></div>
                    <span className="font-semibold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top pages + Conversion funnel */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-fade-in-up stagger-9">
          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t('Top Pages', 'Nejnavštěvovanější stránky')}</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{topPages.length} {t('pages', 'stránek')}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-5 py-2 text-xs font-medium text-muted-foreground">{t('Page', 'Stránka')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Views', 'Zobr.')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Bounce', 'Opuštění')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Conv.', 'Konv.')}</th>
                  <th className="text-right px-5 py-2 text-xs font-medium text-muted-foreground">{t('Duration', 'Doba')}</th>
                </tr></thead>
                <tbody>
                  {topPages.map(p => (
                    <tr key={p.page} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-2.5"><div className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-mono text-xs text-primary">{p.page}</span></div></td>
                      <td className="px-3 py-2.5 text-right font-semibold text-xs">{p.pageViews.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">{p.bounceRate}%</td>
                      <td className="px-3 py-2.5 text-right text-xs"><span className={p.convRate >= 5 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>{p.convRate}%</span></td>
                      <td className="px-5 py-2.5 text-right text-xs text-muted-foreground">{p.avgDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-muted-foreground" />{t('Conversion Funnel', 'Konverzní tunel')}</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-3">
                {funnel.map((step, idx) => (
                  <div key={step.step}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{t(step.step, step.stepCz)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{step.value.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-[10px]">{step.pct}%</Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={step.pct} className="h-6" />
                      {idx < funnel.length - 1 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
                          → {Math.round((funnel[idx + 1].value / step.value) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="border-border animate-fade-in-up stagger-10">
          <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold">{t('Activity Heatmap', 'Heatmapa aktivity')}</CardTitle></CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-1">
              {heatmapData.map((row, ri) => (
                <div key={ri} className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground w-6 shrink-0">{days[ri]}</span>
                  <div className="flex gap-0.5 flex-1">
                    {row.map((val, ci) => (
                      <div key={ci} className="flex-1 h-5 rounded-sm transition-colors cursor-pointer" style={{ backgroundColor: `hsl(216, 100%, ${val === 0 ? '95' : Math.max(30, 80 - val * 5)}%)`, opacity: val === 0 ? 0.3 : 1 }} title={`${days[ri]} ${ci}:00 — ${val * 8} ${t('visits', 'návštěv')}`} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 ml-6">
                <div className="flex gap-0.5 flex-1">{Array.from({ length: 24 }, (_, i) => <div key={i} className="flex-1 text-center">{i % 3 === 0 ? <span className="text-[9px] text-muted-foreground">{i}h</span> : null}</div>)}</div>
              </div>
              <div className="flex items-center gap-1 ml-6 mt-1">
                <span className="text-[10px] text-muted-foreground">{t('Less', 'Méně')}</span>
                {[0, 2, 4, 6, 8, 10].map(v => <div key={v} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `hsl(216, 100%, ${v === 0 ? '95' : Math.max(30, 80 - v * 5)}%)` }} />)}
                <span className="text-[10px] text-muted-foreground">{t('More', 'Více')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </>}

      {/* ═══ REVENUE TAB ═══ */}
      {tab === 'revenue' && <>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-in-up stagger-8">
          <Card className="xl:col-span-2 border-border">
            <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold">{t('Revenue Over Time', 'Tržby v čase')}</CardTitle></CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={traffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name={t('Revenue', 'Tržby')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('Avg. Order Value', 'Prům. hodnota obj.')}</p>
                <p className="text-2xl font-bold">{formatCurrency(Math.round(kpi.revenue / (kpi.visitors * kpi.convRate / 100)))}</p>
                <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="h-2.5 w-2.5" />+4.2% {t('vs prev.', 'vs předch.')}</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('Revenue per Visitor', 'Tržba na návštěvníka')}</p>
                <p className="text-2xl font-bold">{formatCurrency(Math.round(kpi.revenue / kpi.visitors))}</p>
                <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="h-2.5 w-2.5" />+2.8%</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('Total Conversions', 'Celkem konverzí')}</p>
                <p className="text-2xl font-bold"><AnimatedValue value={Math.round(kpi.visitors * kpi.convRate / 100)} /></p>
                <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="h-2.5 w-2.5" />+{kpi.cChange}%</p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Revenue by source */}
        <Card className="border-border animate-fade-in-up stagger-9">
          <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold">{t('Revenue by Source', 'Tržby dle zdroje')}</CardTitle></CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {sources.map(s => {
                const rev = Math.round(kpi.revenue * s.value / 100);
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} /><span>{t(s.name, s.nameCz)}</span></div>
                      <div className="flex items-center gap-3"><span className="text-muted-foreground">{s.value}%</span><span className="font-semibold">{formatCurrency(rev)}</span></div>
                    </div>
                    <Progress value={s.value} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </>}

      {/* ═══ AUDIENCE TAB ═══ */}
      {tab === 'audience' && <>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-in-up stagger-8">
          {/* Devices */}
          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Smartphone className="h-4 w-4 text-muted-foreground" />{t('Devices', 'Zařízení')}</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart><Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>{deviceData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`]} /></PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-3">
                {deviceData.map(d => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${d.color}15` }}><d.icon className="h-4 w-4" style={{ color: d.color }} /></div>
                    <div className="flex-1"><div className="flex justify-between text-xs mb-1"><span>{t(d.name, d.nameCz)}</span><span className="font-semibold">{d.value}%</span></div><Progress value={d.value} className="h-1.5" /></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geography */}
          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{t('Geography', 'Geografie')}</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-3">
                {geoData.map(g => (
                  <div key={g.country} className="flex items-center gap-3">
                    <span className="text-lg">{g.flag}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="font-medium">{g.country}</span><span className="text-muted-foreground">{g.sessions.toLocaleString()} {t('sessions', 'relací')}</span></div>
                      <Progress value={g.visitors} className="h-1.5" />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right">{g.visitors}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time */}
          <Card className="border-border">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-green-500 animate-pulse" />{t('Real-time', 'V reálném čase')}</CardTitle>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 text-[10px]">LIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-foreground">33</p>
                <p className="text-xs text-muted-foreground">{t('active visitors now', 'aktivních návštěvníků')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{t('Active Pages', 'Aktivní stránky')}</p>
                {realtimePages.map(p => (
                  <div key={p.page} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-primary">{p.page}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-semibold">{p.active}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance */}
        <Card className="border-border animate-fade-in-up stagger-9">
          <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500" />{t('Core Web Vitals', 'Základní webové metriky')}</CardTitle></CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {perfMetrics.map(m => {
                const pct = Math.min(100, (m.value / m.good) * 100);
                const isGood = m.value <= m.good;
                return (
                  <div key={m.label} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">{m.label}</span>
                      <Badge variant="secondary" className={cn('text-[9px]', isGood ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700')}>{isGood ? t('Good', 'Dobrý') : t('Poor', 'Špatný')}</Badge>
                    </div>
                    <p className="text-2xl font-bold mb-1">{m.value}{m.unit}</p>
                    <p className="text-[10px] text-muted-foreground mb-2">{m.labelFull}</p>
                    <Progress value={pct} className="h-1.5" />
                    <p className="text-[9px] text-muted-foreground mt-1">{t('Threshold', 'Limit')}: {m.good}{m.unit}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Visitors trend chart */}
        <Card className="border-border animate-fade-in-up stagger-10">
          <CardHeader className="pb-2 px-5 pt-5"><CardTitle className="text-sm font-semibold">{t('Visitors & Conversions', 'Návštěvníci a konverze')}</CardTitle></CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line yAxisId="l" type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name={t('Visitors', 'Návštěvníci')} />
                <Line yAxisId="r" type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name={t('Conversions', 'Konverze')} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </>}
    </div>
  );
}
