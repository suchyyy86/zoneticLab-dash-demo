import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Globe, Percent, Clock, Zap } from 'lucide-react';

const monthlySales = [
  { month: 'Jan', new: 24, returning: 18 },
  { month: 'Feb', new: 28, returning: 22 },
  { month: 'Mar', new: 22, returning: 25 },
  { month: 'Apr', new: 35, returning: 30 },
  { month: 'May', new: 30, returning: 27 },
  { month: 'Jun', new: 42, returning: 35 },
  { month: 'Jul', new: 38, returning: 33 },
  { month: 'Aug', new: 45, returning: 38 },
  { month: 'Sep', new: 40, returning: 36 },
  { month: 'Oct', new: 52, returning: 42 },
  { month: 'Nov', new: 48, returning: 40 },
  { month: 'Dec', new: 61, returning: 49 },
];

const trafficData = [
  { week: 'W1', sessions: 8200, pageviews: 24500, bounce: 42 },
  { week: 'W2', sessions: 9100, pageviews: 27300, bounce: 39 },
  { week: 'W3', sessions: 8700, pageviews: 26000, bounce: 41 },
  { week: 'W4', sessions: 10200, pageviews: 30600, bounce: 37 },
  { week: 'W5', sessions: 11500, pageviews: 34500, bounce: 35 },
  { week: 'W6', sessions: 10800, pageviews: 32400, bounce: 38 },
  { week: 'W7', sessions: 12300, pageviews: 36900, bounce: 33 },
  { week: 'W8', sessions: 13100, pageviews: 39300, bounce: 31 },
];

// Generate heatmap data: 7 days × 24 hours
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapData = days.map(day => ({
  day,
  hours: Array.from({ length: 24 }, (_, h) => {
    const peak = day === 'Sat' || day === 'Sun' ? 0.4 : 1;
    const timeFactor = h >= 9 && h <= 18 ? 1 : h >= 19 && h <= 22 ? 0.6 : 0.2;
    return Math.floor(Math.random() * 80 * peak * timeFactor + 5);
  }),
}));

const getHeatColor = (value: number) => {
  if (value < 15) return 'bg-blue-50';
  if (value < 30) return 'bg-blue-100';
  if (value < 45) return 'bg-blue-200';
  if (value < 60) return 'bg-blue-400';
  return 'bg-primary';
};

const kpis = [
  { en: 'Total Sessions', cz: 'Celkem relací', value: '92,400', icon: Globe, trend: '+14.2%', up: true },
  { en: 'Conversion Rate', cz: 'Míra konverze', value: '3.84%', icon: Percent, trend: '+0.6%', up: true },
  { en: 'Avg Session', cz: 'Průměrná relace', value: '4m 12s', icon: Clock, trend: '-8s', up: false },
  { en: 'Top Source', cz: 'Hlavní zdroj', value: 'Google', icon: Zap, trend: '61%', up: true },
];

export default function AnalyticsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.en} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <span className={`text-xs font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>{kpi.trend}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(kpi.en, kpi.cz)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Sales Bar Chart */}
      <Card className="border-border">
        <CardHeader className="pb-2 px-5 pt-5">
          <CardTitle className="text-sm font-semibold">{t('Monthly Sales — New vs Returning Clients', 'Měsíční tržby — Noví vs Stávající klienti')}</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlySales} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="new" name={t('New Clients', 'Noví klienti')} fill="#004AAC" radius={[3, 3, 0, 0]} />
              <Bar dataKey="returning" name={t('Returning', 'Stávající')} fill="#93c5fd" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Website Traffic Line Chart */}
      <Card className="border-border">
        <CardHeader className="pb-2 px-5 pt-5">
          <CardTitle className="text-sm font-semibold">{t('Website Traffic', 'Návštěvnost webu')}</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="sessions" name={t('Sessions', 'Relace')} stroke="#004AAC" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="pageviews" name={t('Pageviews', 'Zobrazení')} stroke="#93c5fd" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="bounce" name={t('Bounce Rate', 'Míra odchodu')} stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card className="border-border">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t('Sales Activity by Hour', 'Aktivita tržeb dle hodiny')}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t('Low', 'Nízká')}</span>
              <div className="flex gap-0.5">
                {['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-primary'].map(c => (
                  <span key={c} className={`${c} h-3 w-3 rounded-sm`} />
                ))}
              </div>
              <span>{t('High', 'Vysoká')}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour headers */}
            <div className="flex mb-1 ml-10">
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex-1 text-center text-[9px] text-muted-foreground">{h % 4 === 0 ? `${h}h` : ''}</div>
              ))}
            </div>
            {heatmapData.map((row) => (
              <div key={row.day} className="flex items-center gap-1 mb-1">
                <span className="w-8 text-xs text-muted-foreground shrink-0">{row.day}</span>
                <div className="flex flex-1 gap-0.5">
                  {row.hours.map((val, h) => (
                    <div
                      key={h}
                      title={`${row.day} ${h}:00 — ${val} orders`}
                      className={`flex-1 h-5 rounded-sm ${getHeatColor(val)} cursor-pointer hover:opacity-80 transition-opacity`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
