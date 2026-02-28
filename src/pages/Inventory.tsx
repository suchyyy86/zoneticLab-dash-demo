import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useCountUp } from '@/hooks/use-count-up';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import {
  Search, Plus, LayoutGrid, List, Package, AlertTriangle, CheckCircle2, XCircle,
  TrendingUp, Box, Download, ArrowUpDown, ChevronRight, Truck, History,
  MapPin, Phone, Mail, DollarSign, BarChart3, Minus, ArrowUp, ArrowDown,
  Tag, Warehouse, RefreshCw, Send
} from 'lucide-react';

type Category = 'all' | 'Toner' | 'Hardware' | 'Peripherals' | 'Networking';
type StockFilter = 'all' | 'ok' | 'low' | 'out';

interface Product {
  id: number; name: string; sku: string; category: string; price: number;
  stock: number; maxStock: number; status: string; supplier: string;
  location: string; lastRestock: string; minOrder: number; leadDays: number;
  movements: { type: string; qty: number; date: string; note: string; noteCz: string }[];
}

const initialProducts: Product[] = [
  {
    id: 1, name: 'HP LaserJet Toner (Black)', sku: 'HP-TN-BK-001', category: 'Toner', price: 1200, stock: 8, maxStock: 50, status: 'low', supplier: 'HP Czech s.r.o.', location: 'A-1-03', lastRestock: '2024-01-05', minOrder: 10, leadDays: 3, movements: [
      { type: 'out', qty: 5, date: '2024-01-18', note: 'Sold to Tatra s.r.o.', noteCz: 'Prodáno Tatra s.r.o.' },
      { type: 'in', qty: 20, date: '2024-01-05', note: 'Restock from HP CZ', noteCz: 'Doplnění od HP CZ' },
      { type: 'out', qty: 12, date: '2023-12-20', note: 'Bulk order Škoda Auto', noteCz: 'Hromadná obj. Škoda Auto' },
    ]
  },
  {
    id: 2, name: 'Dell 27" Monitor (P2722H)', sku: 'DL-MN-27-002', category: 'Hardware', price: 6800, stock: 15, maxStock: 30, status: 'ok', supplier: 'Dell Technologies CZ', location: 'B-2-01', lastRestock: '2024-01-12', minOrder: 5, leadDays: 7, movements: [
      { type: 'in', qty: 10, date: '2024-01-12', note: 'New batch received', noteCz: 'Nová dodávka přijata' },
      { type: 'out', qty: 3, date: '2024-01-08', note: 'Sold to IKEA CZ', noteCz: 'Prodáno IKEA CZ' },
    ]
  },
  {
    id: 3, name: 'Logitech MX Keys', sku: 'LG-KB-MX-003', category: 'Peripherals', price: 2500, stock: 22, maxStock: 40, status: 'ok', supplier: 'Logitech CZ', location: 'C-1-05', lastRestock: '2024-01-10', minOrder: 10, leadDays: 5, movements: [
      { type: 'in', qty: 15, date: '2024-01-10', note: 'Regular restock', noteCz: 'Pravidelné doplnění' },
      { type: 'out', qty: 8, date: '2024-01-03', note: 'Customer orders', noteCz: 'Zákaznické objednávky' },
    ]
  },
  {
    id: 4, name: 'USB-C Dock Station', sku: 'UC-DS-01-004', category: 'Peripherals', price: 3200, stock: 0, maxStock: 20, status: 'out', supplier: 'Anker CZ s.r.o.', location: 'C-2-02', lastRestock: '2023-11-15', minOrder: 5, leadDays: 10, movements: [
      { type: 'out', qty: 4, date: '2023-12-28', note: 'Last units sold', noteCz: 'Poslední kusy prodány' },
    ]
  },
  {
    id: 5, name: 'Canon Ink Cartridge (Color)', sku: 'CN-IC-CL-005', category: 'Toner', price: 850, stock: 3, maxStock: 25, status: 'low', supplier: 'Canon CZ s.r.o.', location: 'A-1-07', lastRestock: '2023-12-18', minOrder: 15, leadDays: 4, movements: [
      { type: 'out', qty: 10, date: '2024-01-15', note: 'Bulk sale Kaufland', noteCz: 'Velký prodej Kaufland' },
      { type: 'in', qty: 25, date: '2023-12-18', note: 'Full restock', noteCz: 'Plné doplnění' },
    ]
  },
  {
    id: 6, name: 'MacBook Pro 14" M3', sku: 'AP-MB-14-006', category: 'Hardware', price: 52000, stock: 5, maxStock: 10, status: 'ok', supplier: 'Apple CZ', location: 'D-1-01', lastRestock: '2024-01-08', minOrder: 2, leadDays: 14, movements: [
      { type: 'in', qty: 3, date: '2024-01-08', note: 'New shipment', noteCz: 'Nová zásilka' },
      { type: 'out', qty: 2, date: '2024-01-02', note: 'Sold to ČEZ Group', noteCz: 'Prodáno ČEZ Group' },
    ]
  },
  {
    id: 7, name: 'Samsung SSD 1TB (870 EVO)', sku: 'SM-SS-1T-007', category: 'Hardware', price: 2800, stock: 30, maxStock: 50, status: 'ok', supplier: 'Samsung CZ', location: 'B-3-04', lastRestock: '2024-01-15', minOrder: 10, leadDays: 5, movements: [
      { type: 'in', qty: 20, date: '2024-01-15', note: 'Bulk order received', noteCz: 'Hromadná dodávka přijata' },
      { type: 'out', qty: 5, date: '2024-01-10', note: 'Various customers', noteCz: 'Různí zákazníci' },
    ]
  },
  {
    id: 8, name: 'APC UPS 1500VA', sku: 'AP-UP-15-008', category: 'Hardware', price: 4500, stock: 12, maxStock: 20, status: 'ok', supplier: 'APC / Schneider', location: 'B-1-02', lastRestock: '2024-01-03', minOrder: 3, leadDays: 7, movements: [
      { type: 'in', qty: 8, date: '2024-01-03', note: 'Restock', noteCz: 'Doplnění' },
    ]
  },
  {
    id: 9, name: 'Logitech C920 Webcam', sku: 'LG-WC-92-009', category: 'Peripherals', price: 1800, stock: 0, maxStock: 15, status: 'out', supplier: 'Logitech CZ', location: 'C-1-08', lastRestock: '2023-10-20', minOrder: 5, leadDays: 5, movements: [
      { type: 'out', qty: 3, date: '2023-12-15', note: 'Sold out', noteCz: 'Vyprodáno' },
    ]
  },
  {
    id: 10, name: 'Xerox Drum Unit', sku: 'XR-DM-01-010', category: 'Toner', price: 3500, stock: 6, maxStock: 15, status: 'low', supplier: 'Xerox CZ', location: 'A-2-01', lastRestock: '2023-12-28', minOrder: 5, leadDays: 6, movements: [
      { type: 'out', qty: 4, date: '2024-01-14', note: 'Regular sales', noteCz: 'Běžný prodej' },
      { type: 'in', qty: 10, date: '2023-12-28', note: 'Restock', noteCz: 'Doplnění' },
    ]
  },
  {
    id: 11, name: 'Cisco Switch 24-port', sku: 'CS-SW-24-011', category: 'Networking', price: 12500, stock: 4, maxStock: 8, status: 'ok', supplier: 'Cisco Systems CZ', location: 'D-2-03', lastRestock: '2024-01-06', minOrder: 2, leadDays: 10, movements: [
      { type: 'in', qty: 4, date: '2024-01-06', note: 'New delivery', noteCz: 'Nová dodávka' },
      { type: 'out', qty: 2, date: '2023-12-22', note: 'Kaufland CZ order', noteCz: 'Objednávka Kaufland CZ' },
    ]
  },
  {
    id: 12, name: 'Cat6 Ethernet Cable 3m', sku: 'NT-CB-06-012', category: 'Networking', price: 120, stock: 85, maxStock: 200, status: 'ok', supplier: 'Datový kabel s.r.o.', location: 'E-1-01', lastRestock: '2024-01-18', minOrder: 50, leadDays: 2, movements: [
      { type: 'in', qty: 100, date: '2024-01-18', note: 'Bulk restock', noteCz: 'Hromadné doplnění' },
      { type: 'out', qty: 30, date: '2024-01-12', note: 'NovaBuild order', noteCz: 'Objednávka NovaBuild' },
    ]
  },
  {
    id: 13, name: 'TP-Link Access Point', sku: 'TP-AP-01-013', category: 'Networking', price: 2200, stock: 2, maxStock: 12, status: 'low', supplier: 'TP-Link CZ', location: 'D-2-05', lastRestock: '2023-12-10', minOrder: 5, leadDays: 4, movements: [
      { type: 'out', qty: 6, date: '2024-01-09', note: 'Pilsner Urquell order', noteCz: 'Objednávka Pilsner Urquell' },
    ]
  },
  {
    id: 14, name: 'Epson EcoTank Ink Set', sku: 'EP-IT-EC-014', category: 'Toner', price: 1600, stock: 18, maxStock: 30, status: 'ok', supplier: 'Epson CZ', location: 'A-1-10', lastRestock: '2024-01-16', minOrder: 10, leadDays: 3, movements: [
      { type: 'in', qty: 20, date: '2024-01-16', note: 'Regular order', noteCz: 'Pravidelná objednávka' },
    ]
  },
];

const categoryData = [
  { name: 'Hardware', value: 5, fill: '#6366f1' },
  { name: 'Toner', value: 4, fill: '#f59e0b' },
  { name: 'Peripherals', value: 3, fill: '#10b981' },
  { name: 'Networking', value: 3, fill: '#ef4444' },
];

const monthlyMovement = [
  { month: 'Sep', in: 45, out: 32 },
  { month: 'Oct', in: 38, out: 41 },
  { month: 'Nov', in: 52, out: 28 },
  { month: 'Dec', in: 60, out: 55 },
  { month: 'Jan', in: 78, out: 42 },
];

const statusMap: Record<string, { label: string; labelCz: string; color: string; icon: any; bg: string }> = {
  ok: { label: 'In Stock', labelCz: 'Skladem', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800', icon: CheckCircle2 },
  low: { label: 'Low Stock', labelCz: 'Málo skladem', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800', icon: AlertTriangle },
  out: { label: 'Out of Stock', labelCz: 'Vyprodáno', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800', icon: XCircle },
};

function AnimatedValue({ value, prefix }: { value: number; prefix?: string }) {
  const { formatCurrency } = useLanguage();
  const animated = useCountUp(value, 1200);
  if (prefix === '$') return <>{formatCurrency(animated)}</>;
  return <>{animated.toLocaleString()}</>;
}

type SortKey = 'name' | 'price' | 'stock' | 'category';

export default function InventoryPage() {
  const { t, formatCurrency } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [adjustQty, setAdjustQty] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: 'Hardware', price: '', stock: '', maxStock: '', supplier: '', location: '' });

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const inStock = products.filter(p => p.status === 'ok').length;
  const lowStock = products.filter(p => p.status === 'low').length;
  const outOfStock = products.filter(p => p.status === 'out').length;

  const filtered = products
    .filter(p => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (stockFilter !== 'all' && p.status !== stockFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'price': cmp = a.price - b.price; break;
        case 'stock': cmp = a.stock - b.stock; break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) return;
    const stock = parseInt(newProduct.stock) || 0;
    const maxStock = parseInt(newProduct.maxStock) || 50;
    const p: Product = {
      id: Date.now(), name: newProduct.name, sku: newProduct.sku, category: newProduct.category,
      price: parseInt(newProduct.price) || 0, stock, maxStock,
      status: stock === 0 ? 'out' : stock < maxStock * 0.2 ? 'low' : 'ok',
      supplier: newProduct.supplier || '-', location: newProduct.location || '-',
      lastRestock: new Date().toISOString().split('T')[0], minOrder: 5, leadDays: 5,
      movements: [{ type: 'in', qty: stock, date: new Date().toISOString().split('T')[0], note: 'Initial stock', noteCz: 'Počáteční naskladnění' }],
    };
    setProducts(prev => [p, ...prev]);
    setNewProduct({ name: '', sku: '', category: 'Hardware', price: '', stock: '', maxStock: '', supplier: '', location: '' });
    setAddOpen(false);
    toast({ title: t('Product added', 'Produkt přidán'), description: p.name });
  };

  const handleStockAdjust = (type: 'in' | 'out') => {
    if (!selectedProduct || !adjustQty) return;
    const qty = parseInt(adjustQty);
    if (!qty || qty <= 0) return;
    const updated = products.map(p => {
      if (p.id !== selectedProduct.id) return p;
      const newStock = type === 'in' ? p.stock + qty : Math.max(0, p.stock - qty);
      return {
        ...p, stock: newStock, lastRestock: type === 'in' ? new Date().toISOString().split('T')[0] : p.lastRestock,
        status: newStock === 0 ? 'out' : newStock < p.maxStock * 0.2 ? 'low' : 'ok',
        movements: [{ type, qty, date: new Date().toISOString().split('T')[0], note: type === 'in' ? 'Manual restock' : 'Manual adjustment', noteCz: type === 'in' ? 'Ruční doplnění' : 'Ruční úprava' }, ...p.movements],
      };
    });
    setProducts(updated);
    const upd = updated.find(p => p.id === selectedProduct.id)!;
    setSelectedProduct(upd);
    setAdjustQty('');
    toast({ title: t(type === 'in' ? 'Stock added' : 'Stock removed', type === 'in' ? 'Sklad doplněn' : 'Sklad odebrán'), description: `${qty} ks — ${selectedProduct.name}` });
  };

  const kpis = [
    { label: t('Total Products', 'Celkem produktů'), value: products.length, icon: Package, color: 'text-primary bg-primary/10', prefix: '' },
    { label: t('In Stock', 'Skladem'), value: inStock, icon: CheckCircle2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', prefix: '' },
    { label: t('Low / Out', 'Málo / Vypr.'), value: lowStock + outOfStock, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', prefix: '' },
    { label: t('Inventory Value', 'Hodnota skladu'), value: totalValue, icon: DollarSign, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', prefix: '$' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={kpi.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${kpi.color}`}><kpi.icon className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold"><AnimatedValue value={kpi.value} prefix={kpi.prefix} /></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up stagger-5">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">{t('Stock Movement', 'Pohyby skladu')}</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />{t('In', 'Příjem')}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" />{t('Out', 'Výdej')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyMovement} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="in" fill="#16a34a" radius={[4, 4, 0, 0]} name={t('In', 'Příjem')} />
                <Bar dataKey="out" fill="#f97316" radius={[4, 4, 0, 0]} name={t('Out', 'Výdej')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold">{t('By Category', 'Dle kategorie')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-5 pb-4 grid grid-cols-2 gap-1.5">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.fill }} />{c.name} ({c.value})
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 animate-fade-in-up stagger-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('Search products, SKU, supplier...', 'Hledat produkty, SKU, dodavatele...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {([{ key: 'all' as const, en: 'All', cz: 'Vše' }, { key: 'ok' as const, en: 'In Stock', cz: 'Skladem' }, { key: 'low' as const, en: 'Low', cz: 'Málo' }, { key: 'out' as const, en: 'Out', cz: 'Vypr.' }]).map(f => (
              <button key={f.key} onClick={() => setStockFilter(f.key)} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', stockFilter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>{t(f.en, f.cz)}</button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {([{ key: 'all' as const, en: 'All', cz: 'Vše' }, { key: 'Hardware' as const, en: 'Hardware', cz: 'Hardware' }, { key: 'Toner' as const, en: 'Toner', cz: 'Toner' }, { key: 'Peripherals' as const, en: 'Periph.', cz: 'Perif.' }, { key: 'Networking' as const, en: 'Network', cz: 'Síť' }]).map(f => (
              <button key={f.key} onClick={() => setCategoryFilter(f.key)} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', categoryFilter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>{t(f.en, f.cz)}</button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" className={`h-8 w-8 rounded-none ${view === 'list' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setView('list')}><List className="h-3.5 w-3.5" /></Button>
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className={`h-8 w-8 rounded-none ${view === 'grid' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" />{t('Export', 'Exportovat')}</Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />{t('Add Product', 'Přidat produkt')}</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>{t('Add New Product', 'Přidat nový produkt')}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>{t('Product Name', 'Název produktu')} *</Label><Input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="e.g. HP Toner" /></div>
                  <div className="space-y-1.5"><Label>SKU *</Label><Input value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} placeholder="XX-XX-00-000" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>{t('Category', 'Kategorie')}</Label>
                    <div className="flex gap-1">{['Hardware', 'Toner', 'Peripherals', 'Networking'].map(c => (
                      <button key={c} onClick={() => setNewProduct(p => ({ ...p, category: c }))} className={cn('flex-1 px-1.5 py-1.5 rounded-md text-[10px] font-medium border transition-colors', newProduct.category === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted')}>{c}</button>
                    ))}</div>
                  </div>
                  <div className="space-y-1.5"><Label>{t('Supplier', 'Dodavatel')}</Label><Input value={newProduct.supplier} onChange={e => setNewProduct(p => ({ ...p, supplier: e.target.value }))} placeholder="e.g. HP CZ" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5"><Label>{t('Price', 'Cena')}</Label><Input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="0" /></div>
                  <div className="space-y-1.5"><Label>{t('Stock', 'Sklad')}</Label><Input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="0" /></div>
                  <div className="space-y-1.5"><Label>{t('Max', 'Max')}</Label><Input type="number" value={newProduct.maxStock} onChange={e => setNewProduct(p => ({ ...p, maxStock: e.target.value }))} placeholder="50" /></div>
                </div>
                <div className="space-y-1.5"><Label>{t('Location', 'Umístění')}</Label><Input value={newProduct.location} onChange={e => setNewProduct(p => ({ ...p, location: e.target.value }))} placeholder="A-1-01" /></div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button variant="outline" onClick={() => setAddOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                  <Button onClick={handleAddProduct}>{t('Add Product', 'Přidat produkt')}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground">{t(`Showing ${filtered.length} of ${products.length} products`, `Zobrazeno ${filtered.length} z ${products.length} produktů`)}</p>
      </div>

      {/* Products */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up stagger-7">
          {filtered.map((product) => {
            const st = statusMap[product.status];
            const stockPct = Math.round((product.stock / product.maxStock) * 100);
            return (
              <Card key={product.id} className="border-border card-hover cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Box className="h-5 w-5 text-primary" /></div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color}`}><st.icon className="h-2.5 w-2.5" />{t(st.label, st.labelCz)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{product.sku}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t('Stock', 'Sklad')}</span>
                    <span className="font-semibold">{product.stock}/{product.maxStock}</span>
                  </div>
                  <Progress value={stockPct} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-border">
                    <MapPin className="h-2.5 w-2.5" />{product.location}
                    <span className="mx-1">·</span>
                    <Truck className="h-2.5 w-2.5" />{product.supplier.split(' ')[0]}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground text-sm">{t('No products found.', 'Žádné produkty nenalezeny.')}</div>}
        </div>
      ) : (
        <Card className="border-border animate-fade-in-up stagger-7">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('name')}>
                    <span className="inline-flex items-center gap-1">{t('Product', 'Produkt')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'name' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">SKU</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('category')}>
                    <span className="inline-flex items-center gap-1">{t('Category', 'Kategorie')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'category' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Location', 'Umístění')}</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('price')}>
                    <span className="inline-flex items-center gap-1 justify-end">{t('Price', 'Cena')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'price' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('stock')}>
                    <span className="inline-flex items-center gap-1">{t('Stock', 'Sklad')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'stock' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const st = statusMap[product.status];
                  const stockPct = Math.round((product.stock / product.maxStock) * 100);
                  return (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Box className="h-4 w-4 text-primary" /></div>
                          <div className="min-w-0"><p className="font-medium truncate">{product.name}</p><p className="text-[10px] text-muted-foreground">{product.supplier}</p></div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                      <td className="px-3 py-3"><Badge variant="secondary" className="text-[10px]">{product.category}</Badge></td>
                      <td className="px-3 py-3 text-xs text-muted-foreground font-mono">{product.location}</td>
                      <td className="px-3 py-3 text-right font-semibold">{formatCurrency(product.price)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={stockPct} className="h-1.5 w-14" />
                          <span className="text-xs text-muted-foreground w-12 text-right">{product.stock}/{product.maxStock}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color}`}><st.icon className="h-3 w-3" />{t(st.label, st.labelCz)}</span>
                      </td>
                      <td className="px-2"><ChevronRight className="h-4 w-4 text-muted-foreground/40" /></td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">{t('No products found.', 'Žádné produkty nenalezeny.')}</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Product detail sheet */}
      <Sheet open={!!selectedProduct} onOpenChange={() => { setSelectedProduct(null); setAdjustQty(''); }}>
        <SheetContent className="w-[400px] sm:w-[520px] overflow-y-auto">
          {selectedProduct && (() => {
            const st = statusMap[selectedProduct.status];
            const stockPct = Math.round((selectedProduct.stock / selectedProduct.maxStock) * 100);
            const stockValue = selectedProduct.price * selectedProduct.stock;
            return (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Box className="h-6 w-6 text-primary" /></div>
                    <div className="min-w-0">
                      <SheetTitle className="text-base">{selectedProduct.name}</SheetTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-muted-foreground">{selectedProduct.sku}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color}`}><st.icon className="h-2.5 w-2.5" />{t(st.label, st.labelCz)}</span>
                      </div>
                    </div>
                  </div>
                </SheetHeader>
                <div className="space-y-6">
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Price', 'Cena')}</p><p className="text-lg font-bold">{formatCurrency(selectedProduct.price)}</p></div>
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Stock', 'Sklad')}</p><p className="text-lg font-bold">{selectedProduct.stock}<span className="text-xs text-muted-foreground font-normal">/{selectedProduct.maxStock}</span></p></div>
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Value', 'Hodnota')}</p><p className="text-lg font-bold">{formatCurrency(stockValue)}</p></div>
                  </div>
                  {/* Stock bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">{t('Stock Level', 'Úroveň skladu')}</span><span className="font-medium">{stockPct}%</span></div>
                    <Progress value={stockPct} className="h-2" />
                  </div>
                  {/* Stock adjust */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Stock Adjustment', 'Úprava skladu')}</h3>
                    <div className="flex gap-2">
                      <Input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder={t('Qty', 'Počet')} className="h-8 text-xs w-24" min="1" />
                      <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => handleStockAdjust('in')}><ArrowUp className="h-3 w-3 text-green-600" />{t('Add', 'Přidat')}</Button>
                      <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => handleStockAdjust('out')}><ArrowDown className="h-3 w-3 text-red-500" />{t('Remove', 'Odebrat')}</Button>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Details', 'Detaily')}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3"><Tag className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Category', 'Kategorie')}:</span><Badge variant="secondary" className="text-[10px]">{selectedProduct.category}</Badge></div>
                      <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Supplier', 'Dodavatel')}:</span><span className="font-medium">{selectedProduct.supplier}</span></div>
                      <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Location', 'Umístění')}:</span><span className="font-mono text-xs">{selectedProduct.location}</span></div>
                      <div className="flex items-center gap-3"><RefreshCw className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Last Restock', 'Poslední doplnění')}:</span><span>{selectedProduct.lastRestock}</span></div>
                      <div className="flex items-center gap-3"><Package className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Min Order', 'Min. obj.')}:</span><span>{selectedProduct.minOrder} ks</span></div>
                      <div className="flex items-center gap-3"><History className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-muted-foreground">{t('Lead Time', 'Dodací lhůta')}:</span><span>{selectedProduct.leadDays} {t('days', 'dní')}</span></div>
                    </div>
                  </div>
                  {/* Movement log */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Movement Log', 'Pohyby')}</h3>
                    <div className="space-y-2">
                      {selectedProduct.movements.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={cn('h-7 w-7 rounded-full flex items-center justify-center shrink-0', m.type === 'in' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-orange-600 bg-orange-100 dark:bg-orange-900/30')}>
                            {m.type === 'in' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-foreground">{t(m.note, m.noteCz)}</p>
                              <span className={cn('text-xs font-semibold', m.type === 'in' ? 'text-green-600' : 'text-orange-600')}>{m.type === 'in' ? '+' : '-'}{m.qty} ks</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{m.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button size="sm" className="flex-1 gap-1.5"><Send className="h-3.5 w-3.5" />{t('Order Restock', 'Objednat doplnění')}</Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Warehouse className="h-3.5 w-3.5" />{t('Transfer', 'Přesunout')}</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
