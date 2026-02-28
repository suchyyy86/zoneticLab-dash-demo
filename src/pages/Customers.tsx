import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCountUp } from '@/hooks/use-count-up';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  Search, Users, UserCheck, UserMinus, TrendingUp, Mail, Phone, MapPin,
  DollarSign, Star, Clock, Plus, Download, Filter, ArrowUpDown,
  Building2, ShoppingCart, FileText, CreditCard, MessageSquare, Send,
  MoreHorizontal, Tag, Globe, Hash, ChevronRight
} from 'lucide-react';

type Segment = 'all' | 'enterprise' | 'smb' | 'startup';
type StatusFilter = 'all' | 'active' | 'churned';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'churned';
  ltv: number;
  orders: number;
  lastOrder: string;
  joinDate: string;
  avatar: string;
  satisfaction: number;
  segment: 'enterprise' | 'smb' | 'startup';
  contactPerson: string;
  website: string;
  ico: string;
  notes: string;
  tags: string[];
  activities: { type: string; desc: string; descCz: string; date: string }[];
}

const initialCustomers: Customer[] = [
  {
    id: 1, name: 'Tatra s.r.o.', email: 'info@tatra.cz', phone: '+420 601 123 456', city: 'Brno',
    status: 'active', ltv: 42000, orders: 8, lastOrder: '2024-01-15', joinDate: '2023-03-12',
    avatar: 'TS', satisfaction: 92, segment: 'enterprise', contactPerson: 'Martin Horák',
    website: 'tatra.cz', ico: '12345678', notes: '',
    tags: ['VIP', 'Hardware'],
    activities: [
      { type: 'order', desc: 'Order #INV-2024-112 placed', descCz: 'Objednávka #INV-2024-112 vytvořena', date: '2024-01-15' },
      { type: 'email', desc: 'Quarterly review email sent', descCz: 'Odeslán čtvrtletní přehled', date: '2024-01-10' },
      { type: 'call', desc: 'Follow-up call with Martin', descCz: 'Následný hovor s Martinem', date: '2024-01-05' },
    ]
  },
  {
    id: 2, name: 'Škoda Auto a.s.', email: 'obchod@skoda.cz', phone: '+420 602 234 567', city: 'Mladá Boleslav',
    status: 'active', ltv: 89000, orders: 15, lastOrder: '2024-01-20', joinDate: '2022-08-05',
    avatar: 'ŠA', satisfaction: 95, segment: 'enterprise', contactPerson: 'Jana Veselá',
    website: 'skoda-auto.cz', ico: '23456789', notes: 'Klíčový klient, vyjednávání o ročním kontraktu.',
    tags: ['VIP', 'Top 10', 'Hardware'],
    activities: [
      { type: 'payment', desc: 'Payment of 71 600 Kč received', descCz: 'Platba 71 600 Kč přijata', date: '2024-01-20' },
      { type: 'order', desc: 'Order #INV-2024-111 placed', descCz: 'Objednávka #INV-2024-111 vytvořena', date: '2024-01-20' },
      { type: 'meeting', desc: 'Annual contract negotiation', descCz: 'Vyjednávání roční smlouvy', date: '2024-01-12' },
    ]
  },
  {
    id: 3, name: 'ČEZ Group', email: 'kontakt@cez.cz', phone: '+420 603 345 678', city: 'Praha',
    status: 'active', ltv: 31000, orders: 5, lastOrder: '2024-01-10', joinDate: '2023-06-18',
    avatar: 'ČG', satisfaction: 88, segment: 'enterprise', contactPerson: 'Pavel Dvořák',
    website: 'cez.cz', ico: '34567890', notes: '',
    tags: ['Networking', 'Hardware'],
    activities: [
      { type: 'order', desc: 'Order #INV-2024-110 placed', descCz: 'Objednávka #INV-2024-110 vytvořena', date: '2024-01-10' },
      { type: 'email', desc: 'Product catalog sent', descCz: 'Odeslán katalog produktů', date: '2024-01-03' },
    ]
  },
  {
    id: 4, name: 'Kofola a.s.', email: 'info@kofola.cz', phone: '+420 604 456 789', city: 'Krnov',
    status: 'churned', ltv: 18000, orders: 3, lastOrder: '2023-09-22', joinDate: '2023-01-15',
    avatar: 'KA', satisfaction: 65, segment: 'smb', contactPerson: 'Lucie Tichá',
    website: 'kofola.cz', ico: '45678901', notes: 'Odešli kvůli ceně. Zvážit nabídku slevy.',
    tags: ['Peripherals'],
    activities: [
      { type: 'churn', desc: 'Client marked as churned', descCz: 'Klient označen jako ztracený', date: '2023-10-01' },
      { type: 'email', desc: 'Win-back email sent', descCz: 'Odeslán email pro návrat klienta', date: '2023-10-15' },
    ]
  },
  {
    id: 5, name: 'Pilsner Urquell', email: 'sales@pilsner.cz', phone: '+420 605 567 890', city: 'Plzeň',
    status: 'active', ltv: 67000, orders: 12, lastOrder: '2024-01-02', joinDate: '2022-11-30',
    avatar: 'PU', satisfaction: 91, segment: 'enterprise', contactPerson: 'Tomáš Král',
    website: 'pilsnerurquell.cz', ico: '56789012', notes: '',
    tags: ['VIP', 'Top 10', 'Toner'],
    activities: [
      { type: 'order', desc: 'Bulk toner order placed', descCz: 'Hromadná objednávka tonerů', date: '2024-01-02' },
      { type: 'call', desc: 'Support call resolved', descCz: 'Vyřešen servisní hovor', date: '2023-12-20' },
    ]
  },
  {
    id: 6, name: 'IKEA CZ', email: 'b2b@ikea.cz', phone: '+420 606 678 901', city: 'Praha',
    status: 'active', ltv: 28000, orders: 4, lastOrder: '2023-12-28', joinDate: '2023-09-01',
    avatar: 'IC', satisfaction: 85, segment: 'enterprise', contactPerson: 'Eva Novotná',
    website: 'ikea.cz', ico: '67890123', notes: '',
    tags: ['Hardware', 'Peripherals'],
    activities: [
      { type: 'order', desc: 'Peripheral bundle ordered', descCz: 'Objednán balíček periferiíí', date: '2023-12-28' },
    ]
  },
  {
    id: 7, name: 'Kaufland CZ', email: 'partner@kaufland.cz', phone: '+420 607 789 012', city: 'Praha',
    status: 'active', ltv: 45000, orders: 7, lastOrder: '2024-01-18', joinDate: '2023-02-20',
    avatar: 'KC', satisfaction: 90, segment: 'enterprise', contactPerson: 'Ondřej Marek',
    website: 'kaufland.cz', ico: '78901234', notes: '',
    tags: ['Top 10', 'Networking'],
    activities: [
      { type: 'order', desc: 'Network equipment ordered', descCz: 'Objednáno síťové vybavení', date: '2024-01-18' },
      { type: 'meeting', desc: 'Q1 planning meeting', descCz: 'Plánovací schůzka Q1', date: '2024-01-08' },
    ]
  },
  {
    id: 8, name: 'T-Mobile CZ', email: 'b2b@t-mobile.cz', phone: '+420 608 890 123', city: 'Praha',
    status: 'churned', ltv: 22000, orders: 2, lastOrder: '2023-07-14', joinDate: '2023-04-10',
    avatar: 'TM', satisfaction: 58, segment: 'enterprise', contactPerson: 'Petr Novák',
    website: 't-mobile.cz', ico: '89012345', notes: 'Přešli ke konkurenci. Kontakt zastaralý.',
    tags: ['Hardware'],
    activities: [
      { type: 'churn', desc: 'Contract not renewed', descCz: 'Smlouva neobnovena', date: '2023-08-01' },
    ]
  },
  {
    id: 9, name: 'DataSoft s.r.o.', email: 'info@datasoft.cz', phone: '+420 609 901 234', city: 'Ostrava',
    status: 'active', ltv: 15000, orders: 3, lastOrder: '2024-01-12', joinDate: '2023-10-05',
    avatar: 'DS', satisfaction: 87, segment: 'smb', contactPerson: 'Radek Bílek',
    website: 'datasoft.cz', ico: '90123456', notes: '',
    tags: ['Toner', 'Peripherals'],
    activities: [
      { type: 'order', desc: 'Monthly toner supply', descCz: 'Měsíční dodávka tonerů', date: '2024-01-12' },
    ]
  },
  {
    id: 10, name: 'GreenTech Labs', email: 'hello@greentech.cz', phone: '+420 610 012 345', city: 'Brno',
    status: 'active', ltv: 8500, orders: 2, lastOrder: '2024-01-08', joinDate: '2023-11-20',
    avatar: 'GL', satisfaction: 82, segment: 'startup', contactPerson: 'Kateřina Malá',
    website: 'greentech.cz', ico: '01234567', notes: 'Startup s potenciálem růstu.',
    tags: ['Hardware'],
    activities: [
      { type: 'order', desc: 'Initial hardware setup', descCz: 'Počáteční vytvoření HW', date: '2024-01-08' },
      { type: 'email', desc: 'Welcome onboarding email', descCz: 'Uvítací e-mail', date: '2023-11-20' },
    ]
  },
  {
    id: 11, name: 'NovaBuild a.s.', email: 'obchod@novabuild.cz', phone: '+420 611 123 456', city: 'Olomouc',
    status: 'active', ltv: 35000, orders: 6, lastOrder: '2024-01-14', joinDate: '2022-12-10',
    avatar: 'NB', satisfaction: 93, segment: 'smb', contactPerson: 'Jiří Procházka',
    website: 'novabuild.cz', ico: '11223344', notes: '',
    tags: ['Hardware', 'Networking', 'Top 10'],
    activities: [
      { type: 'order', desc: 'Quarterly hardware refresh', descCz: 'Čtvrtletní obnova HW', date: '2024-01-14' },
      { type: 'payment', desc: 'Payment of 35 000 Kč received', descCz: 'Platba 35 000 Kč přijata', date: '2024-01-16' },
    ]
  },
  {
    id: 12, name: 'CloudMinds s.r.o.', email: 'sales@cloudminds.cz', phone: '+420 612 234 567', city: 'Praha',
    status: 'active', ltv: 5200, orders: 1, lastOrder: '2024-01-19', joinDate: '2024-01-05',
    avatar: 'CM', satisfaction: 78, segment: 'startup', contactPerson: 'Adam Černý',
    website: 'cloudminds.cz', ico: '22334455', notes: 'Nový klient, první objednávka.',
    tags: ['Peripherals'],
    activities: [
      { type: 'order', desc: 'First order placed', descCz: 'Vytvořena první objednávka', date: '2024-01-19' },
      { type: 'email', desc: 'Welcome onboarding email', descCz: 'Uvítací e-mail', date: '2024-01-05' },
    ]
  },
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

const segmentColors: Record<string, string> = {
  enterprise: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  smb: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  startup: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
};

const activityIcons: Record<string, typeof Mail> = {
  order: ShoppingCart,
  email: Mail,
  call: Phone,
  payment: CreditCard,
  meeting: Users,
  churn: UserMinus,
};

const activityColors: Record<string, string> = {
  order: 'text-primary bg-primary/10',
  email: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  call: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  payment: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  meeting: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  churn: 'text-red-600 bg-red-100 dark:bg-red-900/30',
};

function AnimatedValue({ value, prefix }: { value: number; prefix?: string }) {
  const { formatCurrency } = useLanguage();
  const animated = useCountUp(value, 1200);
  if (prefix === 'currency') return <>{formatCurrency(animated)}</>;
  return <>{animated.toLocaleString()}</>;
}

type SortKey = 'name' | 'ltv' | 'orders' | 'satisfaction' | 'lastOrder';
type SortDir = 'asc' | 'desc';

export default function CustomersPage() {
  const { t, formatCurrency } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [segmentFilter, setSegmentFilter] = useState<Segment>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('ltv');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [newNote, setNewNote] = useState('');

  // New client form
  const [newClient, setNewClient] = useState({
    name: '', email: '', phone: '', city: '', contactPerson: '', website: '', ico: '', segment: 'smb' as Customer['segment']
  });

  const active = customers.filter(c => c.status === 'active');
  const churned = customers.filter(c => c.status === 'churned');
  const avgLtv = Math.round(customers.reduce((s, c) => s + c.ltv, 0) / customers.length);
  const totalRevenue = customers.reduce((s, c) => s + c.ltv, 0);

  // Filter
  const filtered = customers
    .filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (segmentFilter !== 'all' && c.segment !== segmentFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'ltv': cmp = a.ltv - b.ltv; break;
        case 'orders': cmp = a.orders - b.orders; break;
        case 'satisfaction': cmp = a.satisfaction - b.satisfaction; break;
        case 'lastOrder': cmp = a.lastOrder.localeCompare(b.lastOrder); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleAddClient = () => {
    if (!newClient.name.trim() || !newClient.email.trim()) return;
    const c: Customer = {
      id: Date.now(),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || '-',
      city: newClient.city || '-',
      status: 'active',
      ltv: 0,
      orders: 0,
      lastOrder: '-',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: newClient.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      satisfaction: 0,
      segment: newClient.segment,
      contactPerson: newClient.contactPerson || '-',
      website: newClient.website || '-',
      ico: newClient.ico || '-',
      notes: '',
      tags: [],
      activities: [
        { type: 'email', desc: 'Welcome onboarding email', descCz: 'Uvítací e-mail', date: new Date().toISOString().split('T')[0] }
      ],
    };
    setCustomers(prev => [c, ...prev]);
    setNewClient({ name: '', email: '', phone: '', city: '', contactPerson: '', website: '', ico: '', segment: 'smb' });
    setAddOpen(false);
    toast({ title: t('Client added', 'Klient přidán'), description: c.name });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;
    const updated = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          notes: c.notes ? `${c.notes}\n\n[${new Date().toLocaleDateString()}] ${newNote}` : `[${new Date().toLocaleDateString()}] ${newNote}`,
        };
      }
      return c;
    });
    setCustomers(updated);
    setSelectedCustomer(prev => prev ? { ...prev, notes: prev.notes ? `${prev.notes}\n\n[${new Date().toLocaleDateString()}] ${newNote}` : `[${new Date().toLocaleDateString()}] ${newNote}` } : null);
    setNewNote('');
    toast({ title: t('Note saved', 'Poznámka uložena') });
  };

  const kpis = [
    { label: t('Total Clients', 'Celkem klientů'), value: customers.length, icon: Users, color: 'text-primary bg-primary/10', prefix: '' },
    { label: t('Active', 'Aktivní'), value: active.length, icon: UserCheck, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', prefix: '' },
    { label: t('Total Revenue', 'Celkový obrat'), value: totalRevenue, icon: DollarSign, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', prefix: 'currency' },
    { label: t('Avg LTV', 'Prům. LTV'), value: avgLtv, icon: TrendingUp, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', prefix: 'currency' },
  ];

  const SortableHeader = ({ label, sortKeyProp, align = 'left' }: { label: string; sortKeyProp: SortKey; align?: string }) => (
    <th
      className={`text-${align} px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none`}
      onClick={() => handleSort(sortKeyProp)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn('h-3 w-3', sortKey === sortKeyProp ? 'text-primary' : 'text-muted-foreground/40')} />
      </span>
    </th>
  );

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

      {/* Toolbar: Search + Filters + Actions */}
      <div className="flex flex-col gap-3 animate-fade-in-up stagger-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search clients, contacts, cities...', 'Hledat klienty, kontakty, města...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {([
              { key: 'all' as const, en: 'All', cz: 'Vše' },
              { key: 'active' as const, en: 'Active', cz: 'Aktivní' },
              { key: 'churned' as const, en: 'Churned', cz: 'Ztracení' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  statusFilter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {t(f.en, f.cz)}
              </button>
            ))}
          </div>

          {/* Segment filter */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {([
              { key: 'all' as const, en: 'All Segments', cz: 'Všechny' },
              { key: 'enterprise' as const, en: 'Enterprise', cz: 'Enterprise' },
              { key: 'smb' as const, en: 'SMB', cz: 'SMB' },
              { key: 'startup' as const, en: 'Startup', cz: 'Startup' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setSegmentFilter(f.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  segmentFilter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {t(f.en, f.cz)}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Export */}
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            {t('Export', 'Exportovat')}
          </Button>

          {/* Add Client */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5" />
                {t('Add Client', 'Přidat klienta')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('Add New Client', 'Přidat nového klienta')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('Company Name', 'Název společnosti')} *</Label>
                    <Input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Acme s.r.o." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('Email', 'E-mail')} *</Label>
                    <Input value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} placeholder="info@acme.cz" type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('Contact Person', 'Kontaktní osoba')}</Label>
                    <Input value={newClient.contactPerson} onChange={e => setNewClient(p => ({ ...p, contactPerson: e.target.value }))} placeholder="Jan Novák" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('Phone', 'Telefon')}</Label>
                    <Input value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} placeholder="+420 ..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('City', 'Město')}</Label>
                    <Input value={newClient.city} onChange={e => setNewClient(p => ({ ...p, city: e.target.value }))} placeholder="Praha" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('ICO', 'IČO')}</Label>
                    <Input value={newClient.ico} onChange={e => setNewClient(p => ({ ...p, ico: e.target.value }))} placeholder="12345678" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('Website', 'Web')}</Label>
                    <Input value={newClient.website} onChange={e => setNewClient(p => ({ ...p, website: e.target.value }))} placeholder="acme.cz" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('Segment', 'Segment')}</Label>
                    <div className="flex gap-1.5">
                      {(['enterprise', 'smb', 'startup'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setNewClient(p => ({ ...p, segment: s }))}
                          className={cn(
                            'flex-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors',
                            newClient.segment === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                          )}
                        >
                          {s === 'enterprise' ? 'Enterprise' : s === 'smb' ? 'SMB' : 'Startup'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={() => setAddOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                  <Button className="bg-primary text-primary-foreground" onClick={handleAddClient}>{t('Add Client', 'Přidat klienta')}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground">
          {t(`Showing ${filtered.length} of ${customers.length} clients`, `Zobrazeno ${filtered.length} z ${customers.length} klientů`)}
        </p>
      </div>

      {/* Customers table */}
      <Card className="border-border animate-fade-in-up stagger-7">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('name')}>
                  <span className="inline-flex items-center gap-1">
                    {t('Client', 'Klient')}
                    <ArrowUpDown className={cn('h-3 w-3', sortKey === 'name' ? 'text-primary' : 'text-muted-foreground/40')} />
                  </span>
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Segment', 'Segment')}</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('City', 'Město')}</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                <SortableHeader label={t('LTV', 'LTV')} sortKeyProp="ltv" align="right" />
                <SortableHeader label={t('Orders', 'Objednávky')} sortKeyProp="orders" align="right" />
                <SortableHeader label={t('Satisfaction', 'Spokojenost')} sortKeyProp="satisfaction" align="right" />
                <SortableHeader label={t('Last Activity', 'Poslední aktivita')} sortKeyProp="lastOrder" align="right" />
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${c.status === 'active' ? 'bg-gradient-to-br from-primary to-blue-400' : 'bg-gray-400'}`}>
                        {c.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.contactPerson}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${segmentColors[c.segment]}`}>
                      {c.segment === 'enterprise' ? 'Enterprise' : c.segment === 'smb' ? 'SMB' : 'Startup'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{c.city}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${c.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                      : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}>
                      {c.status === 'active' ? t('Active', 'Aktivní') : t('Churned', 'Ztracený')}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">{formatCurrency(c.ltv)}</td>
                  <td className="px-3 py-3 text-right text-muted-foreground">{c.orders}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={c.satisfaction} className="h-1.5 w-14" />
                      <span className={`text-xs font-medium ${c.satisfaction >= 80 ? 'text-green-600 dark:text-green-400' : c.satisfaction >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'}`}>
                        {c.satisfaction}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-muted-foreground">{c.lastOrder}</td>
                  <td className="px-2 py-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                    {t('No clients found matching your criteria.', 'Nebyli nalezeni žádní klienti odpovídající vašim kritériím.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Customer detail sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-[400px] sm:w-[520px] overflow-y-auto">
          {selectedCustomer && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${selectedCustomer.status === 'active' ? 'bg-gradient-to-br from-primary to-blue-400' : 'bg-gray-400'}`}>
                    {selectedCustomer.avatar}
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="text-base">{selectedCustomer.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${selectedCustomer.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        }`}>
                        {selectedCustomer.status === 'active' ? t('Active', 'Aktivní') : t('Churned', 'Ztracený')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${segmentColors[selectedCustomer.segment]}`}>
                        {selectedCustomer.segment === 'enterprise' ? 'Enterprise' : selectedCustomer.segment === 'smb' ? 'SMB' : 'Startup'}
                      </span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Tags */}
                {selectedCustomer.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {selectedCustomer.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Contact */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Contact', 'Kontakt')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedCustomer.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-primary">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{selectedCustomer.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-primary">{selectedCustomer.website}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs">{t('ICO', 'IČO')}: {selectedCustomer.ico}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Lifetime Value', 'Celoživotní hodnota')}</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCustomer.ltv)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Total Orders', 'Celkem objednávek')}</p>
                    <p className="text-lg font-bold text-foreground">{selectedCustomer.orders}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Satisfaction', 'Spokojenost')}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="text-lg font-bold text-foreground">{selectedCustomer.satisfaction}%</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Member Since', 'Členem od')}</p>
                    <p className="text-sm font-bold text-foreground">{selectedCustomer.joinDate}</p>
                  </div>
                </div>

                {/* Activity timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Recent Activity', 'Nedávná aktivita')}</h3>
                  <div className="space-y-3">
                    {selectedCustomer.activities.map((act, idx) => {
                      const Icon = activityIcons[act.type] || FileText;
                      const color = activityColors[act.type] || 'text-gray-600 bg-gray-100';
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground">{t(act.desc, act.descCz)}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {act.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Notes', 'Poznámky')}</h3>
                  {selectedCustomer.notes && (
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedCustomer.notes}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('Add a note...', 'Přidat poznámku...')}
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                      className="h-8 text-xs"
                    />
                    <Button size="sm" variant="outline" className="h-8 px-2.5" onClick={handleAddNote}>
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" className="flex-1 gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {t('Send Email', 'Poslat e-mail')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {t('Call', 'Zavolat')}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    {t('Invoice', 'Faktura')}
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
