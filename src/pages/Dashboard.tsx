import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target } from 'lucide-react';

const sparklineData = [
  [12, 18, 15, 22, 19, 28, 25, 32, 29, 35, 31, 42],
  [8, 12, 10, 15, 13, 11, 16, 14, 18, 15, 20, 17],
  [3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 9, 13],
  [45, 52, 48, 56, 50, 60, 55, 62, 58, 67, 63, 71],
];

const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000 },
  { month: 'Feb', revenue: 48000, expenses: 31000 },
  { month: 'Mar', revenue: 45000, expenses: 29000 },
  { month: 'Apr', revenue: 55000, expenses: 33000 },
  { month: 'May', revenue: 52000, expenses: 30000 },
  { month: 'Jun', revenue: 61000, expenses: 36000 },
  { month: 'Jul', revenue: 58000, expenses: 34000 },
  { month: 'Aug', revenue: 67000, expenses: 38000 },
  { month: 'Sep', revenue: 63000, expenses: 37000 },
  { month: 'Oct', revenue: 72000, expenses: 41000 },
  { month: 'Nov', revenue: 69000, expenses: 40000 },
  { month: 'Dec', revenue: 84000, expenses: 45000 },
];

const categoryData = [
  { name: 'Web Design', value: 38, color: '#004AAC' },
  { name: 'SEO', value: 22, color: '#3b82f6' },
  { name: 'Ads', value: 27, color: '#93c5fd' },
  { name: 'Consulting', value: 13, color: '#dbeafe' },
];

const recentOrders = [
  { id: '#INV-2024-112', client: 'Tatra s.r.o.', amount: 8400, status: 'Paid' },
  { id: '#INV-2024-111', client: 'Škoda Auto a.s.', amount: 12500, status: 'Pending' },
  { id: '#INV-2024-110', client: 'ČEZ Group', amount: 5200, status: 'Processing' },
  { id: '#INV-2024-109', client: 'Kofola a.s.', amount: 3800, status: 'Paid' },
  { id: '#INV-2024-108', client: 'Pilsner Urquell', amount: 9100, status: 'Paid' },
];

const tasks = [
  { id: 1, label: 'Review Invoice #112', labelCz: 'Zkontrolovat fakturu #112', done: false },
  { id: 2, label: 'Restock HP Toner', labelCz: 'Doplnit HP toner', done: false },
  { id: 3, label: 'Call Novák at Tatra', labelCz: 'Zavolat Novákovi z Tatry', done: true },
  { id: 4, label: 'Send proposal to CEZ', labelCz: 'Poslat návrh ČEZ', done: false },
];

const kpiCards = [
  { titleEn: 'Total Revenue', titleCz: 'Celkové příjmy', value: 716000, trend: 12.4, up: true, icon: DollarSign, sparkIdx: 0, prefix: '$' },
  { titleEn: 'Active Orders', titleCz: 'Aktivní objednávky', value: 47, trend: -3.1, up: false, icon: ShoppingCart, sparkIdx: 1, prefix: '' },
  { titleEn: 'New Clients', titleCz: 'Noví klienti', value: 13, trend: 8.7, up: true, icon: Users, sparkIdx: 2, prefix: '' },
  { titleEn: 'Avg Order Value', titleCz: 'Průměrná hodnota', value: 15234, trend: 4.2, up: true, icon: Target, sparkIdx: 3, prefix: '$' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

export default function DashboardPage() {
  const { t, formatCurrency } = useLanguage();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const sparkData = sparklineData[card.sparkIdx].map((v, i) => ({ v, i }));
          return (
            <Card key={card.titleEn} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t(card.titleEn, card.titleCz)}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.prefix === '$'
                        ? formatCurrency(card.value)
                        : card.value}
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <card.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 text-xs font-semibold ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                    {card.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {card.up ? '+' : ''}{card.trend}%
                  </span>
                  <div className="h-10 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="v" stroke={card.up ? '#16a34a' : '#ef4444'} dot={false} strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue vs Expenses */}
        <Card className="xl:col-span-2 border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('Revenue vs Expenses', 'Příjmy vs Náklady')}</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004AAC" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#004AAC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(1)}k`]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name={t('Revenue', 'Příjmy')} stroke="#004AAC" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name={t('Expenses', 'Náklady')} stroke="#94a3b8" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut chart */}
        <Card className="border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('Sales by Category', 'Tržby dle kategorie')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 w-full mt-1">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card className="xl:col-span-2 border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('Recent Orders', 'Poslední objednávky')}</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2 text-xs font-medium text-muted-foreground">{t('Order ID', 'ID objednávky')}</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">{t('Client', 'Klient')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Amount', 'Částka')}</th>
                  <th className="text-center px-5 py-2 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{order.id}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{order.client}</td>
                    <td className="px-3 py-3 text-right font-semibold">{formatCurrency(order.amount)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('Quick Actions', 'Rychlé akce')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Checkbox defaultChecked={task.done} className="border-border" />
                  <span className={`text-sm ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {t(task.label, task.labelCz)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs shrink-0"
                  onClick={() => toast({ title: t('Note added', 'Poznámka přidána'), description: `${t('Task', 'Úkol')}: ${t(task.label, task.labelCz)}` })}
                >
                  {t('Note', 'Poznámka')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
