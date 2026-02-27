import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useCountUp } from '@/hooks/use-count-up';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target,
  Sparkles, ArrowUpRight, Clock, FileText, UserPlus, CreditCard,
  Plus, Trash2, CheckCircle2, CalendarDays
} from 'lucide-react';

const sparklineData = [
  [12, 18, 15, 22, 19, 28, 25, 32, 29, 35, 31, 42],
  [8, 12, 10, 15, 13, 11, 16, 14, 18, 15, 20, 17],
  [3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 9, 13],
  [45, 52, 48, 56, 50, 60, 55, 62, 58, 67, 63, 71],
];

const revenueDataMonthly = [
  { label: 'Jan', revenue: 42000, expenses: 28000 },
  { label: 'Feb', revenue: 48000, expenses: 31000 },
  { label: 'Mar', revenue: 45000, expenses: 29000 },
  { label: 'Apr', revenue: 55000, expenses: 33000 },
  { label: 'May', revenue: 52000, expenses: 30000 },
  { label: 'Jun', revenue: 61000, expenses: 36000 },
  { label: 'Jul', revenue: 58000, expenses: 34000 },
  { label: 'Aug', revenue: 67000, expenses: 38000 },
  { label: 'Sep', revenue: 63000, expenses: 37000 },
  { label: 'Oct', revenue: 72000, expenses: 41000 },
  { label: 'Nov', revenue: 69000, expenses: 40000 },
  { label: 'Dec', revenue: 84000, expenses: 45000 },
];

const revenueDataDaily = [
  { label: 'Mon', revenue: 3200, expenses: 1800 },
  { label: 'Tue', revenue: 2800, expenses: 1600 },
  { label: 'Wed', revenue: 3500, expenses: 2100 },
  { label: 'Thu', revenue: 4100, expenses: 2400 },
  { label: 'Fri', revenue: 3800, expenses: 2200 },
  { label: 'Sat', revenue: 2100, expenses: 1200 },
  { label: 'Sun', revenue: 1800, expenses: 900 },
];

const revenueData30d = [
  { label: 'W1', revenue: 18200, expenses: 10500 },
  { label: 'W2', revenue: 21400, expenses: 12800 },
  { label: 'W3', revenue: 19800, expenses: 11200 },
  { label: 'W4', revenue: 24600, expenses: 14500 },
];

const revenueData90d = [
  { label: 'Oct', revenue: 72000, expenses: 41000 },
  { label: 'Nov', revenue: 69000, expenses: 40000 },
  { label: 'Dec', revenue: 84000, expenses: 45000 },
];

const categoryData = [
  { name: 'Hardware', value: 42, color: '#004AAC' },
  { name: 'Toner & Ink', value: 25, color: '#3b82f6' },
  { name: 'Peripherals', value: 21, color: '#93c5fd' },
  { name: 'Networking', value: 12, color: '#dbeafe' },
];

const recentOrders = [
  { id: '#INV-2024-112', client: 'Tatra s.r.o.', amount: 8400, status: 'Paid' },
  { id: '#INV-2024-111', client: 'Škoda Auto a.s.', amount: 12500, status: 'Pending' },
  { id: '#INV-2024-110', client: 'ČEZ Group', amount: 5200, status: 'Processing' },
  { id: '#INV-2024-109', client: 'Kofola a.s.', amount: 3800, status: 'Paid' },
  { id: '#INV-2024-108', client: 'Pilsner Urquell', amount: 9100, status: 'Paid' },
];

const initialTasks = [
  { id: 1, label: 'Review Invoice #112', labelCz: 'Zkontrolovat fakturu #112', done: false, priority: 'high' as const, due: 'Today', dueCz: 'Dnes', link: '/invoices' },
  { id: 2, label: 'Restock HP Toner', labelCz: 'Doplnit HP toner', done: false, priority: 'medium' as const, due: 'Tomorrow', dueCz: 'Zítra', link: '/inventory' },
  { id: 3, label: 'Call Novák at Tatra', labelCz: 'Zavolat Novákovi z Tatry', done: true, priority: 'low' as const, due: 'Done', dueCz: 'Hotovo', link: '/customers' },
  { id: 4, label: 'Send proposal to CEZ', labelCz: 'Poslat návrh ČEZ', done: false, priority: 'high' as const, due: 'Feb 28', dueCz: '28. úno', link: '/customers' },
];

const activityFeed = [
  { icon: CreditCard, label: 'Payment received from Škoda Auto', labelCz: 'Platba přijata od Škoda Auto', time: '3 min ago', timeCz: 'před 3 min', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  { icon: FileText, label: 'Invoice #112 created for Tatra s.r.o.', labelCz: 'Faktura #112 vytvořena pro Tatra s.r.o.', time: '18 min ago', timeCz: 'před 18 min', color: 'text-primary bg-primary/10' },
  { icon: UserPlus, label: 'New client registered: Kaufland CZ', labelCz: 'Nový klient zaregistrován: Kaufland CZ', time: '1h ago', timeCz: 'před 1h', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { icon: ShoppingCart, label: 'Order #108 completed', labelCz: 'Objednávka #108 dokončena', time: '2h ago', timeCz: 'před 2h', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
];

const kpiCards = [
  { titleEn: 'Total Revenue', titleCz: 'Celkové příjmy', value: 716000, trend: 12.4, up: true, icon: DollarSign, sparkIdx: 0, prefix: '$' },
  { titleEn: 'Active Orders', titleCz: 'Aktivní objednávky', value: 47, trend: -3.1, up: false, icon: ShoppingCart, sparkIdx: 1, prefix: '' },
  { titleEn: 'New Clients', titleCz: 'Noví klienti', value: 13, trend: 8.7, up: true, icon: Users, sparkIdx: 2, prefix: '' },
  { titleEn: 'Avg Order Value', titleCz: 'Průměrná hodnota', value: 15234, trend: 4.2, up: true, icon: Target, sparkIdx: 3, prefix: '$' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

function AnimatedKPIValue({ value, prefix }: { value: number; prefix: string }) {
  const { formatCurrency } = useLanguage();
  const animatedValue = useCountUp(value, 1500);

  if (prefix === '$') {
    return <>{formatCurrency(animatedValue)}</>;
  }
  return <>{animatedValue}</>;
}

export default function DashboardPage() {
  const { t, formatCurrency } = useLanguage();
  const monthlyGoal = 85000;
  const currentProgress = 72000;
  const goalPercentage = Math.round((currentProgress / monthlyGoal) * 100);
  const [tasks, setTasks] = useState(initialTasks);
  const [addOpen, setAddOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newDue, setNewDue] = useState('');
  const [revPeriod, setRevPeriod] = useState('YTD');

  const filteredRevData = useMemo(() => {
    switch (revPeriod) {
      case '7d': return revenueDataDaily;
      case '30d': return revenueData30d;
      case '90d': return revenueData90d;
      default: return revenueDataMonthly;
    }
  }, [revPeriod]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(tk => {
      if (tk.id !== id) return tk;
      const newDone = !tk.done;
      if (newDone) {
        toast({
          title: t('✓ Task completed', '✓ Úkol dokončen'),
          description: t(tk.label, tk.labelCz),
        });
      }
      return { ...tk, done: newDone, due: newDone ? (t('Done', 'Hotovo')) : tk.due, dueCz: newDone ? 'Hotovo' : tk.dueCz };
    }));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const dueLabel = newDue.trim() || t('This week', 'Tento týden');
    setTasks(prev => [...prev, {
      id: Date.now(),
      label: newTask,
      labelCz: newTask,
      done: false,
      priority: newPriority,
      due: dueLabel,
      dueCz: dueLabel,
      link: '/',
    }]);
    setNewTask('');
    setNewPriority('medium');
    setNewDue('');
    setAddOpen(false);
    toast({ title: t('Task added', 'Úkol přidán'), description: newTask });
  };

  const clearCompleted = () => {
    const count = tasks.filter(tk => tk.done).length;
    setTasks(prev => prev.filter(tk => !tk.done));
    toast({ title: t(`${count} task(s) cleared`, `${count} úkol(ů) odstraněn(o)`) });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="animate-fade-in-up stagger-1 rounded-xl bg-gradient-to-r from-primary to-blue-500 p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <Sparkles className="absolute top-4 right-4 h-8 w-8" />
          <Sparkles className="absolute bottom-4 right-16 h-6 w-6" />
          <Sparkles className="absolute top-8 right-32 h-5 w-5" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold">{t('Good morning, Jan! 👋', 'Dobré ráno, Jane! 👋')}</h2>
          <p className="text-white/80 text-sm mt-1">
            {t(
              "Here's what's happening with your business today.",
              'Tady je přehled vašeho podnikání za dnešek.'
            )}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 pulse-dot" />
              {t('3 tasks pending', '3 úkoly čekají')}
            </div>
            <div className="text-sm text-white/70">|</div>
            <div className="text-sm">{t('2 invoices overdue', '2 faktury po splatnosti')}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const sparkData = sparklineData[card.sparkIdx].map((v, i) => ({ v, i }));
          return (
            <Card key={card.titleEn} className={`bg-card border-border card-hover animate-fade-in-up stagger-${idx + 2}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t(card.titleEn, card.titleCz)}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      <AnimatedKPIValue value={card.value} prefix={card.prefix} />
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-lg icon-gradient flex items-center justify-center shadow-sm">
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 text-xs font-semibold ${card.up ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
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
        <Card className="xl:col-span-2 border-border animate-fade-in-up stagger-6">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('Revenue vs Expenses', 'Příjmy vs Náklady')}</CardTitle>
              <div className="flex items-center gap-1">
                {['7d', '30d', '90d', 'YTD'].map((p) => (
                  <Button
                    key={p}
                    variant={revPeriod === p ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 px-2.5 text-xs ${revPeriod === p ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setRevPeriod(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={filteredRevData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(216, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${(v / 1000).toFixed(1)}k`]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name={t('Revenue', 'Příjmy')} stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name={t('Expenses', 'Náklady')} stroke="#94a3b8" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Goal + Donut */}
        <div className="space-y-4 animate-fade-in-up stagger-7">
          {/* Monthly Goal */}
          <Card className="border-border card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">{t('Monthly Goal', 'Měsíční cíl')}</p>
                <span className="text-xs font-bold text-primary">{goalPercentage}%</span>
              </div>
              <Progress value={goalPercentage} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(currentProgress)}</span>
                <span>{t('of', 'z')} {formatCurrency(monthlyGoal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Donut chart */}
          <Card className="border-border card-hover">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold">{t('Sales by Category', 'Tržby dle kategorie')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-4">
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v: number) => [`${v}%`]}
                  />
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
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <Card className="xl:col-span-2 border-border animate-fade-in-up stagger-8">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('Recent Orders', 'Poslední objednávky')}</CardTitle>
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
                  <th className="text-left px-5 py-2 text-xs font-medium text-muted-foreground">{t('Order ID', 'ID objednávky')}</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">{t('Client', 'Klient')}</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">{t('Amount', 'Částka')}</th>
                  <th className="text-center px-5 py-2 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
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

        {/* Right Column: Activity Feed + Quick Actions */}
        <div className="space-y-4">
          {/* Activity Feed */}
          <Card className="border-border card-hover animate-fade-in-up stagger-8">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t('Activity Feed', 'Aktivita')}</CardTitle>
                <span className="h-2 w-2 rounded-full bg-green-500 pulse-dot" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-3">
              {activityFeed.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{t(item.label, item.labelCz)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {t(item.time, item.timeCz)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border card-hover">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{t('Quick Actions', 'Rychlé akce')}</CardTitle>
                <div className="flex items-center gap-1">
                  {tasks.some(tk => tk.done) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
                      onClick={clearCompleted}
                    >
                      <Trash2 className="h-3 w-3" />
                      {t('Clear done', 'Smazat hotové')}
                    </Button>
                  )}
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{t('Add Task', 'Přidat úkol')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <Label>{t('Task description', 'Popis úkolu')}</Label>
                          <Input
                            placeholder={t('e.g. Follow up with client', 'např. Kontaktovat klienta')}
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            autoFocus
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('Priority', 'Priorita')}</Label>
                          <div className="flex gap-2">
                            {(['high', 'medium', 'low'] as const).map((p) => {
                              const styles = {
                                high: newPriority === 'high' ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
                                medium: newPriority === 'medium' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
                                low: newPriority === 'low' ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
                              };
                              return (
                                <button
                                  key={p}
                                  onClick={() => setNewPriority(p)}
                                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${styles[p]}`}
                                >
                                  {t(
                                    p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low',
                                    p === 'high' ? 'Vysoká' : p === 'medium' ? 'Střední' : 'Nízká'
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            {t('Due date', 'Termín')}
                          </Label>
                          <Input
                            type="date"
                            value={newDue}
                            onChange={(e) => setNewDue(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                          <Button size="sm" className="bg-primary text-primary-foreground" onClick={addTask}>{t('Add', 'Přidat')}</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tasks.filter(tk => !tk.done).length} {t('remaining', 'zbývá')} · {tasks.filter(tk => tk.done).length} {t('completed', 'dokončeno')}
              </p>
            </CardHeader>
            <CardContent className="space-y-1 px-5 pb-4">
              {tasks.map((task) => {
                const priorityStyles = {
                  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
                  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
                  low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
                };
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between gap-2 py-2 px-2 rounded-md transition-all duration-200 group ${task.done ? 'opacity-50' : 'hover:bg-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <Checkbox
                        checked={task.done}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm block truncate transition-all ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                          {t(task.label, task.labelCz)}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium border ${priorityStyles[task.priority]}`}>
                            {t(
                              task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low',
                              task.priority === 'high' ? 'Vysoká' : task.priority === 'medium' ? 'Střední' : 'Nízká'
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {t(task.due, task.dueCz)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {task.done && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
