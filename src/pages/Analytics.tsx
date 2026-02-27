import { useState } from 'react';
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

const trafficData = [
  { day: 'Mon', visitors: 2400, pageViews: 4200, sessions: 3100 },
  { day: 'Tue', visitors: 2200, pageViews: 3800, sessions: 2900 },
  { day: 'Wed', visitors: 2800, pageViews: 4900, sessions: 3600 },
  { day: 'Thu', visitors: 3200, pageViews: 5200, sessions: 4100 },
  { day: 'Fri', visitors: 2900, pageViews: 4600, sessions: 3400 },
  { day: 'Sat', visitors: 1800, pageViews: 2800, sessions: 2000 },
  { day: 'Sun', visitors: 1500, pageViews: 2200, sessions: 1700 },
];

const monthlyTraffic = [
  { month: 'Jan', visitors: 18000, conversions: 540 },
  { month: 'Feb', visitors: 21000, conversions: 630 },
  { month: 'Mar', visitors: 19500, conversions: 585 },
  { month: 'Apr', visitors: 24000, conversions: 720 },
  { month: 'May', visitors: 22500, conversions: 675 },
  { month: 'Jun', visitors: 27000, conversions: 810 },
  { month: 'Jul', visitors: 25000, conversions: 750 },
  { month: 'Aug', visitors: 29000, conversions: 870 },
  { month: 'Sep', visitors: 26500, conversions: 795 },
  { month: 'Oct', visitors: 31000, conversions: 930 },
  { month: 'Nov', visitors: 28500, conversions: 855 },
  { month: 'Dec', visitors: 34000, conversions: 1020 },
];

const sourceData = [
  { name: 'Organic', value: 42, color: '#004AAC' },
  { name: 'Direct', value: 28, color: '#3b82f6' },
  { name: 'Referral', value: 18, color: '#93c5fd' },
  { name: 'Social', value: 12, color: '#dbeafe' },
];

const topPages = [
  { page: '/services', pageViews: 12400, bounceRate: 34, avgDuration: '2:45' },
  { page: '/pricing', pageViews: 8900, bounceRate: 28, avgDuration: '3:12' },
  { page: '/about', pageViews: 6700, bounceRate: 42, avgDuration: '1:55' },
  { page: '/contact', pageViews: 5200, bounceRate: 38, avgDuration: '2:18' },
  { page: '/blog/seo-tips', pageViews: 4100, bounceRate: 22, avgDuration: '4:30' },
];

const heatmapData = [
  [3, 1, 0, 0, 0, 1, 2, 5, 8, 7, 6, 5, 4, 5, 6, 7, 8, 9, 7, 5, 4, 3, 2, 1],
  [2, 1, 0, 0, 1, 2, 3, 6, 9, 8, 7, 6, 5, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 1],
  [4, 2, 1, 0, 0, 1, 4, 7, 10, 9, 8, 7, 5, 7, 8, 9, 10, 9, 7, 5, 4, 3, 2, 1],
  [3, 1, 1, 0, 0, 2, 3, 6, 9, 8, 7, 6, 4, 6, 7, 8, 9, 8, 6, 4, 3, 2, 1, 1],
  [5, 3, 2, 1, 0, 1, 3, 5, 8, 7, 6, 5, 4, 5, 6, 7, 8, 7, 5, 3, 2, 2, 1, 1],
  [2, 1, 0, 0, 0, 1, 2, 4, 6, 5, 4, 3, 3, 4, 5, 6, 7, 6, 4, 3, 2, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 0, 0],
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function AnimatedValue({ value }: { value: number }) {
  const animated = useCountUp(value, 1200);
  return <>{animated.toLocaleString()}</>;
}

export default function AnalyticsPage() {
  const { t, formatCurrency } = useLanguage();
  const [period, setPeriod] = useState('30d');

  const kpis = [
    { icon: Eye, label: t('Page Views', 'Zobrazení stránek'), value: 34200, change: 14.2, up: true, color: 'text-primary bg-primary/10' },
    { icon: Users, label: t('Unique Visitors', 'Unikátní návštěvníci'), value: 12800, change: 8.5, up: true, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    { icon: Clock, label: t('Avg. Session', 'Prům. relace'), value: 324, change: -2.1, up: false, suffix: 's', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { icon: MousePointerClick, label: t('Bounce Rate', 'Míra opuštění'), value: 34, change: -5.3, up: true, suffix: '%', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
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
              <AreaChart data={monthlyTraffic}>
                <defs>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area yAxisId="left" type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="url(#visitorsGrad)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#16a34a" strokeWidth={2} dot={{ r: 3, fill: '#16a34a' }} />
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
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {sourceData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 w-full mt-2">
              {sourceData.map((src) => (
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
        {/* Weekly bar chart */}
        <Card className="border-border animate-fade-in-up stagger-8">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('Weekly Breakdown', 'Týdenní přehled')}</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trafficData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
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
                {topPages.map((page) => (
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
            {heatmapData.map((row, rowIdx) => (
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
                      title={`${days[rowIdx]} ${colIdx}:00 — ${val * 12} ${t('visits', 'návštěv')}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1 ml-8">
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
