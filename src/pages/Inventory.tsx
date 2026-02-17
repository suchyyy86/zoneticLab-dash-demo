import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Package } from 'lucide-react';

const products = [
  { id: 1, name: 'MacBook Pro 14"', sku: 'MBP-14-M3', category: 'Electronics', price: 1999, stock: 8, max: 20, badges: ['Bestseller'] },
  { id: 2, name: 'HP LaserJet Pro', sku: 'HP-LJP-4001', category: 'Printers', price: 349, stock: 3, max: 15, badges: ['Low Stock'] },
  { id: 3, name: 'Logitech MX Keys', sku: 'LOG-MX-KBD', category: 'Peripherals', price: 119, stock: 24, badges: ['New'] },
  { id: 4, name: 'Dell 27" Monitor', sku: 'DEL-P2723', category: 'Displays', price: 459, stock: 12, max: 20, badges: [] },
  { id: 5, name: 'Canon EOS R10', sku: 'CAN-EOSR10', category: 'Cameras', price: 879, stock: 5, max: 10, badges: ['Bestseller', 'Low Stock'] },
  { id: 6, name: 'Samsung 1TB SSD', sku: 'SAM-870-1TB', category: 'Storage', price: 89, stock: 41, max: 50, badges: [] },
  { id: 7, name: 'HP Toner Cartridge', sku: 'HP-CF258A', category: 'Consumables', price: 24, stock: 2, max: 30, badges: ['Low Stock', 'New'] },
  { id: 8, name: 'Webcam Logitech C920', sku: 'LOG-C920', category: 'Peripherals', price: 79, stock: 18, max: 25, badges: [] },
];

const badgeStyles: Record<string, string> = {
  Bestseller: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low Stock': 'bg-red-100 text-red-600 border-red-200',
  New: 'bg-blue-100 text-blue-700 border-blue-200',
};

const getStockPercent = (stock: number, max = 50) => Math.round((stock / max) * 100);

const getStockBarColor = (pct: number) => {
  if (pct < 20) return 'bg-destructive';
  if (pct > 50) return 'bg-primary';
  return 'bg-yellow-400';
};

export default function InventoryPage() {
  const { t, formatCurrency } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' });

  const handleSave = () => {
    toast({ title: t('Product added', 'Produkt přidán'), description: `${form.name || t('New Product', 'Nový produkt')} ${t('has been saved.', 'byl uložen.')}` });
    setOpen(false);
    setForm({ name: '', category: '', price: '', stock: '' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              {t('Add Product', 'Přidat produkt')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('Add New Product', 'Přidat nový produkt')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>{t('Product Name', 'Název produktu')}</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. MacBook Pro" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('Category', 'Kategorie')}</Label>
                <Select onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder={t('Select category', 'Vybrat kategorii')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Peripherals">Peripherals</SelectItem>
                    <SelectItem value="Displays">Displays</SelectItem>
                    <SelectItem value="Storage">Storage</SelectItem>
                    <SelectItem value="Consumables">Consumables</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('Price (USD)', 'Cena (USD)')}</Label>
                  <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('Stock Qty', 'Množství')}</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                <Button className="bg-primary text-primary-foreground" onClick={handleSave}>{t('Save Product', 'Uložit produkt')}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{t('Product', 'Produkt')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">SKU</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Category', 'Kategorie')}</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Price', 'Cena')}</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Stock', 'Sklad')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground w-36">{t('Stock Level', 'Stav skladu')}</th>
                  <th className="px-5 py-3 text-xs font-medium text-muted-foreground">{t('Tags', 'Štítky')}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const pct = getStockPercent(p.stock, p.max);
                  const barColor = getStockBarColor(pct);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                      <td className="px-3 py-3 text-sm text-muted-foreground">{p.category}</td>
                      <td className="px-3 py-3 text-right font-semibold">{formatCurrency(p.price)}</td>
                      <td className="px-3 py-3 text-center font-medium">{p.stock}</td>
                      <td className="px-3 py-3 w-36">
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.badges.map(b => (
                            <span key={b} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeStyles[b]}`}>{b}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast({ title: t('Editing...', 'Upravuji...') })}>{t('Edit', 'Upravit')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: t('Restocking...', 'Doplňuji sklad...') })}>{t('Restock', 'Doplnit')}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">{t('Delete', 'Smazat')}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
