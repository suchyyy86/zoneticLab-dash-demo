import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCountUp } from '@/hooks/use-count-up';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  Search, Users, UserCheck, UserMinus, TrendingUp, Mail, Phone, MapPin,
  Calendar, DollarSign, ArrowUpRight, Star, Clock
} from 'lucide-react';

const customers = [
  { id: 1, name: 'Tatra s.r.o.', email: 'info@tatra.cz', phone: '+420 601 123 456', city: 'Brno', status: 'active', ltv: 42000, orders: 8, lastOrder: '2024-01-15', joinDate: '2023-03-12', avatar: 'TS', satisfaction: 92 },
  { id: 2, name: 'Škoda Auto a.s.', email: 'obchod@skoda.cz', phone: '+420 602 234 567', city: 'Mladá Boleslav', status: 'active', ltv: 89000, orders: 15, lastOrder: '2024-01-20', joinDate: '2022-08-05', avatar: 'ŠA', satisfaction: 95 },
  { id: 3, name: 'ČEZ Group', email: 'kontakt@cez.cz', phone: '+420 603 345 678', city: 'Praha', status: 'active', ltv: 31000, orders: 5, lastOrder: '2024-01-10', joinDate: '2023-06-18', avatar: 'ČG', satisfaction: 88 },
  { id: 4, name: 'Kofola a.s.', email: 'info@kofola.cz', phone: '+420 604 456 789', city: 'Krnov', status: 'churned', ltv: 18000, orders: 3, lastOrder: '2023-09-22', joinDate: '2023-01-15', avatar: 'KA', satisfaction: 65 },
  { id: 5, name: 'Pilsner Urquell', email: 'sales@pilsner.cz', phone: '+420 605 567 890', city: 'Plzeň', status: 'active', ltv: 67000, orders: 12, lastOrder: '2024-01-02', joinDate: '2022-11-30', avatar: 'PU', satisfaction: 91 },
  { id: 6, name: 'IKEA CZ', email: 'b2b@ikea.cz', phone: '+420 606 678 901', city: 'Praha', status: 'active', ltv: 28000, orders: 4, lastOrder: '2023-12-28', joinDate: '2023-09-01', avatar: 'IC', satisfaction: 85 },
  { id: 7, name: 'Kaufland CZ', email: 'partner@kaufland.cz', phone: '+420 607 789 012', city: 'Praha', status: 'active', ltv: 45000, orders: 7, lastOrder: '2024-01-18', joinDate: '2023-02-20', avatar: 'KC', satisfaction: 90 },
  { id: 8, name: 'T-Mobile CZ', email: 'b2b@t-mobile.cz', phone: '+420 608 890 123', city: 'Praha', status: 'churned', ltv: 22000, orders: 2, lastOrder: '2023-07-14', joinDate: '2023-04-10', avatar: 'TM', satisfaction: 58 },
];

const retentionData = [
  { month: 'Jul', newClients: 3, churned: 0 },
  { month: 'Aug', newClients: 2, churned: 0 },
  { month: 'Sep', newClients: 4, churned: 1 },
  { month: 'Oct', newClients: 1, churned: 0 },
  { month: 'Nov', newClients: 3, churned: 0 },
  { month: 'Dec', newClients: 2, churned: 1 },
  { month: 'Jan', newClients: 5, churned: 0 },
];

function AnimatedValue({ value, prefix }: { value: number; prefix?: string }) {
  const { formatCurrency } = useLanguage();
  const animated = useCountUp(value, 1200);
  if (prefix === '$') return <>{formatCurrency(animated)}</>;
  return <>{animated.toLocaleString()}</>;
}

export default function CustomersPage() {
  const { t, formatCurrency } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const active = customers.filter(c => c.status === 'active');
  const churned = customers.filter(c => c.status === 'churned');
  const avgLtv = Math.round(customers.reduce((s, c) => s + c.ltv, 0) / customers.length);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const kpis = [
    { label: t('Total Clients', 'Celkem klientů'), value: customers.length, icon: Users, color: 'text-primary bg-primary/10', prefix: '' },
    { label: t('Active', 'Aktivní'), value: active.length, icon: UserCheck, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', prefix: '' },
    { label: t('Churned', 'Ztracení'), value: churned.length, icon: UserMinus, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', prefix: '' },
    { label: t('Avg LTV', 'Prům. LTV'), value: avgLtv, icon: DollarSign, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', prefix: '$' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={kpi.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold"><AnimatedValue value={kpi.value} prefix={kpi.prefix} /></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Retention chart */}
      <Card className="border-border animate-fade-in-up stagger-5">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t('Client Retention', 'Retence klientů')}</CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />{t('New', 'Noví')}</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />{t('Churned', 'Ztracení')}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={retentionData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="newClients" fill="#16a34a" radius={[4, 4, 0, 0]} name={t('New Clients', 'Noví klienti')} />
              <Bar dataKey="churned" fill="#f87171" radius={[4, 4, 0, 0]} name={t('Churned', 'Ztracení')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-3 animate-fade-in-up stagger-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search clients...', 'Hledat klienty...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {t('Add Client', 'Přidat klienta')}
        </Button>
      </div>

      {/* Customers table */}
      <Card className="border-border animate-fade-in-up stagger-7">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{t('Client', 'Klient')}</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('City', 'Město')}</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('LTV', 'LTV')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Orders', 'Objednávky')}</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">{t('Satisfaction', 'Spokojenost')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.status === 'active' ? 'bg-gradient-to-br from-primary to-blue-400' : 'bg-gray-400'}`}>
                        {c.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{c.city}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${c.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}>
                      {c.status === 'active' ? t('Active', 'Aktivní') : t('Churned', 'Ztracený')}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">{formatCurrency(c.ltv)}</td>
                  <td className="px-3 py-3 text-right text-muted-foreground">{c.orders}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={c.satisfaction} className="h-1.5 w-16" />
                      <span className={`text-xs font-medium ${c.satisfaction >= 80 ? 'text-green-600 dark:text-green-400' : c.satisfaction >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'}`}>
                        {c.satisfaction}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Customer detail sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          {selectedCustomer && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white ${selectedCustomer.status === 'active' ? 'bg-gradient-to-br from-primary to-blue-400' : 'bg-gray-400'}`}>
                    {selectedCustomer.avatar}
                  </div>
                  <div>
                    <SheetTitle className="text-base">{selectedCustomer.name}</SheetTitle>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border mt-1 ${selectedCustomer.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}>
                      {selectedCustomer.status === 'active' ? t('Active', 'Aktivní') : t('Churned', 'Ztracený')}
                    </span>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Contact */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Contact', 'Kontakt')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-primary">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.city}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t('Lifetime Value', 'Celoživotní hodnota')}</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.ltv)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t('Total Orders', 'Celkem objednávek')}</p>
                    <p className="text-lg font-bold text-foreground">{selectedCustomer.orders}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t('Satisfaction', 'Spokojenost')}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="text-lg font-bold text-foreground">{selectedCustomer.satisfaction}%</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{t('Member Since', 'Členem od')}</p>
                    <p className="text-sm font-bold text-foreground">{selectedCustomer.joinDate}</p>
                  </div>
                </div>

                {/* Last order */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {t('Last order', 'Poslední objednávka')}: <span className="font-medium text-foreground">{selectedCustomer.lastOrder}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {t('Send Email', 'Poslat e-mail')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {t('Call', 'Zavolat')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
