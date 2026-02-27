import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCountUp } from '@/hooks/use-count-up';
import {
  Search, Plus, LayoutGrid, List, Package, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Box
} from 'lucide-react';

const products = [
  { id: 1, name: 'HP LaserJet Toner (Black)', sku: 'HP-TN-BK-001', category: 'Toner', price: 1200, stock: 8, maxStock: 50, status: 'low' },
  { id: 2, name: 'Dell 27" Monitor (P2722H)', sku: 'DL-MN-27-002', category: 'Hardware', price: 6800, stock: 15, maxStock: 30, status: 'ok' },
  { id: 3, name: 'Logitech MX Keys', sku: 'LG-KB-MX-003', category: 'Peripherals', price: 2500, stock: 22, maxStock: 40, status: 'ok' },
  { id: 4, name: 'USB-C Dock Station', sku: 'UC-DS-01-004', category: 'Peripherals', price: 3200, stock: 0, maxStock: 20, status: 'out' },
  { id: 5, name: 'Canon Ink Cartridge (Color)', sku: 'CN-IC-CL-005', category: 'Toner', price: 850, stock: 3, maxStock: 25, status: 'low' },
  { id: 6, name: 'MacBook Pro 14" M3', sku: 'AP-MB-14-006', category: 'Hardware', price: 52000, stock: 5, maxStock: 10, status: 'ok' },
  { id: 7, name: 'Samsung SSD 1TB (870 EVO)', sku: 'SM-SS-1T-007', category: 'Hardware', price: 2800, stock: 30, maxStock: 50, status: 'ok' },
  { id: 8, name: 'APC UPS 1500VA', sku: 'AP-UP-15-008', category: 'Hardware', price: 4500, stock: 12, maxStock: 20, status: 'ok' },
  { id: 9, name: 'Logitech C920 Webcam', sku: 'LG-WC-92-009', category: 'Peripherals', price: 1800, stock: 0, maxStock: 15, status: 'out' },
  { id: 10, name: 'Xerox Drum Unit', sku: 'XR-DM-01-010', category: 'Toner', price: 3500, stock: 6, maxStock: 15, status: 'low' },
];

const statusMap: Record<string, { label: string; labelCz: string; color: string; icon: any; bg: string }> = {
  ok: { label: 'In Stock', labelCz: 'Skladem', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800', icon: CheckCircle2 },
  low: { label: 'Low Stock', labelCz: 'Málo skladem', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800', icon: AlertTriangle },
  out: { label: 'Out of Stock', labelCz: 'Vyprodáno', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800', icon: XCircle },
};

function AnimatedValue({ value }: { value: number }) {
  const animated = useCountUp(value, 1000);
  return <>{animated}</>;
}

export default function InventoryPage() {
  const { t, formatCurrency } = useLanguage();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const inStock = products.filter(p => p.status === 'ok').length;
  const lowStock = products.filter(p => p.status === 'low').length;
  const outOfStock = products.filter(p => p.status === 'out').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: t('Total Products', 'Celkem produktů'), value: totalProducts, icon: Package, color: 'text-primary bg-primary/10' },
          { label: t('In Stock', 'Skladem'), value: inStock, icon: CheckCircle2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
          { label: t('Low Stock', 'Málo skladem'), value: lowStock, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
          { label: t('Out of Stock', 'Vyprodáno'), value: outOfStock, icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
        ].map((card, idx) => (
          <Card key={card.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-xl font-bold"><AnimatedValue value={card.value} /></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fade-in-up stagger-5">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search products...', 'Hledat produkty...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 rounded-none ${view === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setView('list')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 rounded-none ${view === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {t('Add Product', 'Přidat produkt')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Add New Product', 'Přidat nový produkt')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{t('Product Name', 'Název produktu')}</Label>
                  <Input placeholder={t('Enter product name...', 'Zadejte název produktu...')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>SKU</Label>
                    <Input placeholder="XX-XX-00-000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('Category', 'Kategorie')}</Label>
                    <Input placeholder={t('e.g. Hardware', 'např. Hardware')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{t('Price', 'Cena')}</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('Initial Stock', 'Počáteční stav')}</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <Button className="w-full">{t('Add Product', 'Přidat produkt')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in-up stagger-6">
          {filtered.map((product) => {
            const st = statusMap[product.status];
            const stockPercent = Math.round((product.stock / product.maxStock) * 100);
            return (
              <Card key={product.id} className="border-border card-hover cursor-pointer">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${st.bg} ${st.color}`}>
                      <st.icon className="h-2.5 w-2.5" />
                      {t(st.label, st.labelCz)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{product.sku}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t('Stock', 'Sklad')}</span>
                    <span className="font-semibold">{product.stock}/{product.maxStock}</span>
                  </div>
                  <Progress value={stockPercent} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List view */
        <Card className="border-border animate-fade-in-up stagger-6">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{t('Product', 'Produkt')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">SKU</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Category', 'Kategorie')}</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Price', 'Cena')}</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Stock', 'Sklad')}</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const st = statusMap[product.status];
                  const stockPercent = Math.round((product.stock / product.maxStock) * 100);
                  return (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Box className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                      <td className="px-3 py-3">
                        <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold">{formatCurrency(product.price)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <Progress value={stockPercent} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground w-10 text-right">{product.stock}/{product.maxStock}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${st.bg} ${st.color}`}>
                          <st.icon className="h-3 w-3" />
                          {t(st.label, st.labelCz)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
