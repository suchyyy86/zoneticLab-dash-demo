import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Download, Send, Copy, DollarSign, AlertTriangle, Clock, CheckCircle2, XCircle,
  ArrowUpDown, ChevronRight, Calendar, CreditCard, Building2, Mail,
  Hash, Printer, Trash2, ReceiptText, FileText
} from 'lucide-react';

type StatusKey = 'all' | 'paid' | 'pending' | 'overdue' | 'cancelled';
type SortKey = 'id' | 'client' | 'amount' | 'date' | 'due';

interface LineItem { desc: string; descCz: string; qty: number; unit: number }
interface Invoice {
  id: string; client: string; clientEmail: string; clientIco: string; amount: number;
  status: string; date: string; due: string; category: string; paidDate?: string;
  items: LineItem[]; notes: string; notesCz: string;
}

const initialInvoices: Invoice[] = [
  {
    id: 'INV-2024-112', client: 'Tatra s.r.o.', clientEmail: 'fakturace@tatra.cz', clientIco: '12345678',
    amount: 18400, status: 'overdue', date: '2024-01-15', due: '2024-02-14', category: 'Hardware',
    items: [
      { desc: 'Dell 27" Monitor P2722H', descCz: 'Dell 27" Monitor P2722H', qty: 2, unit: 6800 },
      { desc: 'HP LaserJet Toner (Black)', descCz: 'HP LaserJet Toner (černý)', qty: 4, unit: 1200 },
    ],
    notes: 'Payment reminder sent 3x', notesCz: 'Upomínka odeslána 3x'
  },
  {
    id: 'INV-2024-111', client: 'Škoda Auto a.s.', clientEmail: 'finance@skoda.cz', clientIco: '00177041',
    amount: 71600, status: 'pending', date: '2024-01-20', due: '2024-02-19', category: 'Hardware',
    items: [
      { desc: 'MacBook Pro 14" M3', descCz: 'MacBook Pro 14" M3', qty: 1, unit: 52000 },
      { desc: 'Logitech MX Keys', descCz: 'Logitech MX Keys', qty: 3, unit: 2500 },
      { desc: 'Samsung SSD 1TB (870 EVO)', descCz: 'Samsung SSD 1TB (870 EVO)', qty: 4, unit: 2400 },
    ],
    notes: 'Contract renewal pending', notesCz: 'Prodloužení smlouvy čeká'
  },
  {
    id: 'INV-2024-110', client: 'ČEZ Group', clientEmail: 'invoices@cez.cz', clientIco: '45274649',
    amount: 29800, status: 'paid', date: '2024-01-10', due: '2024-02-09', paidDate: '2024-01-28', category: 'Networking',
    items: [
      { desc: 'Cisco Switch 24-port', descCz: 'Cisco Switch 24-port', qty: 2, unit: 12500 },
      { desc: 'Cat6 Ethernet Cable 3m', descCz: 'Cat6 Ethernet kabel 3m', qty: 40, unit: 120 },
    ],
    notes: 'Paid on time', notesCz: 'Zaplaceno včas'
  },
  {
    id: 'INV-2024-109', client: 'Kofola a.s.', clientEmail: 'ucetni@kofola.cz', clientIco: '27767680',
    amount: 8500, status: 'paid', date: '2024-01-05', due: '2024-02-04', paidDate: '2024-01-20', category: 'Toner',
    items: [
      { desc: 'HP LaserJet Toner (Black)', descCz: 'HP LaserJet Toner (černý)', qty: 5, unit: 1200 },
      { desc: 'Canon Ink Cartridge (Color)', descCz: 'Canon Inkoustová náplň (barevná)', qty: 1, unit: 850 },
      { desc: 'Xerox Drum Unit', descCz: 'Xerox válec', qty: 1, unit: 1650 },
    ],
    notes: '', notesCz: ''
  },
  {
    id: 'INV-2024-108', client: 'Pilsner Urquell', clientEmail: 'fakturace@pilsner.cz', clientIco: '45357366',
    amount: 32400, status: 'paid', date: '2024-01-02', due: '2024-02-01', paidDate: '2024-01-15', category: 'Toner',
    items: [
      { desc: 'HP LaserJet Toner (Black)', descCz: 'HP LaserJet Toner (černý)', qty: 20, unit: 1200 },
      { desc: 'Canon Ink Cartridge (Color)', descCz: 'Canon Inkoustová náplň (barevná)', qty: 8, unit: 850 },
    ],
    notes: 'Bulk toner order', notesCz: 'Hromadná objednávka tonerů'
  },
  {
    id: 'INV-2024-107', client: 'IKEA CZ', clientEmail: 'ap@ikea.cz', clientIco: '27081052',
    amount: 24300, status: 'pending', date: '2023-12-28', due: '2024-01-27', category: 'Peripherals',
    items: [
      { desc: 'Logitech MX Keys', descCz: 'Logitech MX Keys', qty: 5, unit: 2500 },
      { desc: 'USB-C Dock Station', descCz: 'USB-C Dokovací stanice', qty: 3, unit: 3200 },
      { desc: 'Logitech C920 Webcam', descCz: 'Logitech C920 Webkamera', qty: 1, unit: 1700 },
    ],
    notes: 'Follow-up scheduled', notesCz: 'Naplánován follow-up'
  },
  {
    id: 'INV-2024-106', client: 'Kaufland CZ', clientEmail: 'finance@kaufland.cz', clientIco: '25110161',
    amount: 25600, status: 'cancelled', date: '2023-12-20', due: '2024-01-19', category: 'Networking',
    items: [
      { desc: 'Cisco Switch 24-port', descCz: 'Cisco Switch 24-port', qty: 2, unit: 12500 },
      { desc: 'Cat6 Ethernet Cable 3m', descCz: 'Cat6 Ethernet kabel 3m', qty: 5, unit: 120 },
    ],
    notes: 'Project cancelled by client', notesCz: 'Projekt zrušen klientem'
  },
  {
    id: 'INV-2024-105', client: 'T-Mobile CZ', clientEmail: 'billing@t-mobile.cz', clientIco: '64949681',
    amount: 86400, status: 'paid', date: '2023-12-15', due: '2024-01-14', paidDate: '2024-01-10', category: 'Hardware',
    items: [
      { desc: 'MacBook Pro 14" M3', descCz: 'MacBook Pro 14" M3', qty: 1, unit: 52000 },
      { desc: 'Dell 27" Monitor P2722H', descCz: 'Dell 27" Monitor P2722H', qty: 3, unit: 6800 },
      { desc: 'Samsung SSD 1TB (870 EVO)', descCz: 'Samsung SSD 1TB (870 EVO)', qty: 5, unit: 2800 },
    ],
    notes: '', notesCz: ''
  },
  {
    id: 'INV-2024-104', client: 'ČSOB', clientEmail: 'invoices@csob.cz', clientIco: '00001350',
    amount: 45000, status: 'paid', date: '2023-12-10', due: '2024-01-09', paidDate: '2023-12-28', category: 'Hardware',
    items: [
      { desc: 'APC UPS 1500VA', descCz: 'APC UPS 1500VA', qty: 10, unit: 4500 },
    ],
    notes: 'Bulk UPS order for server rooms', notesCz: 'Hromadná objednávka UPS pro serverovny'
  },
  {
    id: 'INV-2024-103', client: 'Rohlik.cz', clientEmail: 'ucetni@rohlik.cz', clientIco: '03847357',
    amount: 14400, status: 'overdue', date: '2023-12-05', due: '2024-01-04', category: 'Toner',
    items: [
      { desc: 'HP LaserJet Toner (Black)', descCz: 'HP LaserJet Toner (černý)', qty: 12, unit: 1200 },
    ],
    notes: '2nd reminder sent', notesCz: '2. upomínka odeslána'
  },
  {
    id: 'INV-2024-102', client: 'Alza.cz', clientEmail: 'fakturace@alza.cz', clientIco: '27082440',
    amount: 47600, status: 'paid', date: '2023-11-28', due: '2023-12-28', paidDate: '2023-12-20', category: 'Hardware',
    items: [
      { desc: 'Dell 27" Monitor P2722H', descCz: 'Dell 27" Monitor P2722H', qty: 5, unit: 6800 },
      { desc: 'Samsung SSD 1TB (870 EVO)', descCz: 'Samsung SSD 1TB (870 EVO)', qty: 4, unit: 2900 },
    ],
    notes: '', notesCz: ''
  },
  {
    id: 'INV-2024-101', client: 'Avast Software', clientEmail: 'ap@avast.com', clientIco: '25578839',
    amount: 56800, status: 'paid', date: '2023-11-20', due: '2023-12-20', paidDate: '2023-12-15', category: 'Peripherals',
    items: [
      { desc: 'Logitech MX Keys', descCz: 'Logitech MX Keys', qty: 15, unit: 2500 },
      { desc: 'Logitech C920 Webcam', descCz: 'Logitech C920 Webkamera', qty: 10, unit: 1930 },
    ],
    notes: 'Long-term partnership', notesCz: 'Dlouhodobé partnerství'
  },
  {
    id: 'INV-2024-100', client: 'NovaBuild s.r.o.', clientEmail: 'info@novabuild.cz', clientIco: '29456123',
    amount: 16900, status: 'pending', date: '2024-01-22', due: '2024-02-21', category: 'Hardware',
    items: [
      { desc: 'Samsung SSD 1TB (870 EVO)', descCz: 'Samsung SSD 1TB (870 EVO)', qty: 3, unit: 2800 },
      { desc: 'APC UPS 1500VA', descCz: 'APC UPS 1500VA', qty: 2, unit: 4250 },
    ],
    notes: 'New client', notesCz: 'Nový klient'
  },
];

const statusConfig: Record<string, { label: string; labelCz: string; color: string; icon: any }> = {
  paid: { label: 'Paid', labelCz: 'Uhrazeno', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800', icon: CheckCircle2 },
  pending: { label: 'Pending', labelCz: 'Čekající', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800', icon: Clock },
  overdue: { label: 'Overdue', labelCz: 'Po splatnosti', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', labelCz: 'Zrušeno', color: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700', icon: XCircle },
};

function AnimCurrency({ value }: { value: number }) {
  const { formatCurrency } = useLanguage();
  const a = useCountUp(value, 1000);
  return <>{formatCurrency(a)}</>;
}

export default function InvoicesPage() {
  const { t, formatCurrency } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusKey>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [newInv, setNewInv] = useState({ client: '', email: '', category: 'Hardware', desc: '', amount: '' });

  const totals = {
    total: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  };

  const filtered = invoices
    .filter(inv => {
      if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
      if (categoryFilter !== 'all' && inv.category !== categoryFilter) return false;
      if (search) { const q = search.toLowerCase(); return inv.client.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q) || inv.clientEmail.toLowerCase().includes(q); }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id': cmp = a.id.localeCompare(b.id); break;
        case 'client': cmp = a.client.localeCompare(b.client); break;
        case 'amount': cmp = a.amount - b.amount; break;
        case 'date': cmp = a.date.localeCompare(b.date); break;
        case 'due': cmp = a.due.localeCompare(b.due); break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };
  const toggleSelect = (id: string) => setSelectedIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => selectedIds.size === filtered.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(filtered.map(i => i.id)));

  const markAsPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : inv));
    if (selectedInvoice?.id === id) setSelectedInvoice(prev => prev ? { ...prev, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : null);
    toast({ title: t('Invoice marked as paid', 'Faktura označena jako uhrazená'), description: id });
  };
  const sendReminder = (id: string) => toast({ title: t('Reminder sent', 'Upomínka odeslána'), description: `${t('Email sent for', 'E-mail odeslán pro')} ${id}` });
  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    if (selectedInvoice?.id === id) setSelectedInvoice(null);
    toast({ title: t('Invoice deleted', 'Faktura smazána'), description: id });
  };
  const handleCreate = () => {
    if (!newInv.client || !newInv.amount) return;
    const inv: Invoice = {
      id: `INV-2024-${113 + invoices.length}`, client: newInv.client, clientEmail: newInv.email || '-', clientIco: '-',
      amount: parseInt(newInv.amount), status: 'pending', date: new Date().toISOString().split('T')[0],
      due: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], category: newInv.category,
      items: [{ desc: newInv.desc || 'Product', descCz: newInv.desc || 'Produkt', qty: 1, unit: parseInt(newInv.amount) }],
      notes: '', notesCz: '',
    };
    setInvoices(prev => [inv, ...prev]);
    setNewInv({ client: '', email: '', category: 'Hardware', desc: '', amount: '' });
    setCreateOpen(false);
    toast({ title: t('Invoice created', 'Faktura vytvořena'), description: inv.id });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: t('Total Revenue', 'Celkový obrat'), value: totals.total, icon: DollarSign, color: 'text-primary bg-primary/10', sub: `${invoices.length} ${t('invoices', 'faktur')}` },
          { label: t('Paid', 'Uhrazeno'), value: totals.paid, icon: CheckCircle2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', sub: `${invoices.filter(i => i.status === 'paid').length} ${t('invoices', 'faktur')}` },
          { label: t('Pending', 'Čekající'), value: totals.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', sub: `${invoices.filter(i => i.status === 'pending').length} ${t('invoices', 'faktur')}` },
          { label: t('Overdue', 'Po splatnosti'), value: totals.overdue, icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', sub: `${invoices.filter(i => i.status === 'overdue').length} ${t('invoices', 'faktur')}` },
        ].map((card, idx) => (
          <Card key={card.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}><card.icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold"><AnimCurrency value={card.value} /></p>
                    <span className="text-[10px] text-muted-foreground">{card.sub}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 animate-fade-in-up stagger-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('Search invoices, clients...', 'Hledat faktury, klienty...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {(['all', 'paid', 'pending', 'overdue', 'cancelled'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', filterStatus === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                {s === 'all' ? t('All', 'Vše') : t(statusConfig[s]?.label, statusConfig[s]?.labelCz)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {[{ k: 'all', l: t('All', 'Vše') }, { k: 'Hardware', l: 'Hardware' }, { k: 'Toner', l: 'Toner' }, { k: 'Peripherals', l: t('Peripherals', 'Periferie') }, { k: 'Networking', l: t('Networking', 'Síťové') }].map(f => (
              <button key={f.k} onClick={() => setCategoryFilter(f.k)} className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-colors', categoryFilter === f.k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>{f.l}</button>
            ))}
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" />{t('Export', 'Exportovat')}</Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" />{t('New Invoice', 'Nová faktura')}</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>{t('Create Invoice', 'Vytvořit fakturu')}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>{t('Client', 'Klient')} *</Label><Input value={newInv.client} onChange={e => setNewInv(p => ({ ...p, client: e.target.value }))} placeholder="e.g. Firma s.r.o." /></div>
                  <div className="space-y-1.5"><Label>E-mail</Label><Input value={newInv.email} onChange={e => setNewInv(p => ({ ...p, email: e.target.value }))} placeholder="firma@email.cz" /></div>
                </div>
                <div className="space-y-1.5"><Label>{t('Category', 'Kategorie')}</Label>
                  <div className="flex gap-1">{['Hardware', 'Toner', 'Peripherals', 'Networking'].map(c => (
                    <button key={c} onClick={() => setNewInv(p => ({ ...p, category: c }))} className={cn('flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium border transition-colors', newInv.category === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted')}>
                      {c === 'Peripherals' ? t('Peripherals', 'Periferie') : c === 'Networking' ? t('Networking', 'Síťové') : c}
                    </button>
                  ))}</div>
                </div>
                <div className="space-y-1.5"><Label>{t('Description', 'Popis')}</Label><Input value={newInv.desc} onChange={e => setNewInv(p => ({ ...p, desc: e.target.value }))} placeholder={t('Product description...', 'Popis produktu...')} /></div>
                <div className="space-y-1.5"><Label>{t('Amount (Kč)', 'Částka (Kč)')} *</Label><Input type="number" value={newInv.amount} onChange={e => setNewInv(p => ({ ...p, amount: e.target.value }))} placeholder="0" /></div>
                <div className="flex gap-2 justify-end pt-1">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>{t('Cancel', 'Zrušit')}</Button>
                  <Button onClick={handleCreate}>{t('Create Invoice', 'Vytvořit fakturu')}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground">{t(`Showing ${filtered.length} of ${invoices.length} invoices`, `Zobrazeno ${filtered.length} z ${invoices.length} faktur`)}</p>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 animate-fade-in-up">
          <span className="text-sm font-medium">{selectedIds.size} {t('selected', 'vybráno')}</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { selectedIds.forEach(id => markAsPaid(id)); setSelectedIds(new Set()); }}><CheckCircle2 className="h-3 w-3" />{t('Mark Paid', 'Označit uhrazené')}</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => selectedIds.forEach(id => sendReminder(id))}><Send className="h-3 w-3" />{t('Send Reminder', 'Poslat upomínku')}</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Download className="h-3 w-3" />{t('Export', 'Exportovat')}</Button>
          </div>
        </div>
      )}

      {/* Invoice table */}
      <Card className="border-border animate-fade-in-up stagger-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-10 px-4 py-3"><Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('id')}>
                  <span className="inline-flex items-center gap-1">{t('Invoice', 'Faktura')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'id' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('client')}>
                  <span className="inline-flex items-center gap-1">{t('Client', 'Klient')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'client' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Category', 'Kategorie')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('amount')}>
                  <span className="inline-flex items-center gap-1 justify-end">{t('Amount', 'Částka')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'amount' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                </th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('due')}>
                  <span className="inline-flex items-center gap-1 justify-end">{t('Due', 'Splatnost')}<ArrowUpDown className={cn('h-3 w-3', sortKey === 'due' ? 'text-primary' : 'text-muted-foreground/40')} /></span>
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const sc = statusConfig[inv.status]; const SI = sc.icon;
                return (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}><Checkbox checked={selectedIds.has(inv.id)} onCheckedChange={() => toggleSelect(inv.id)} /></td>
                    <td className="px-3 py-3"><span className="font-mono text-xs text-primary">{inv.id}</span></td>
                    <td className="px-3 py-3"><p className="font-medium">{inv.client}</p><p className="text-[10px] text-muted-foreground">{inv.clientEmail}</p></td>
                    <td className="px-3 py-3"><Badge variant="secondary" className="text-[10px]">{inv.category === 'Peripherals' ? t('Peripherals', 'Periferie') : inv.category === 'Networking' ? t('Networking', 'Síťové') : inv.category}</Badge></td>
                    <td className="px-3 py-3 text-right font-semibold">{formatCurrency(inv.amount)}</td>
                    <td className="px-3 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${sc.color}`}><SI className="h-3 w-3" />{t(sc.label, sc.labelCz)}</span></td>
                    <td className="px-3 py-3 text-right text-xs text-muted-foreground">{inv.due}</td>
                    <td className="px-2"><ChevronRight className="h-4 w-4 text-muted-foreground/40" /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">{t('No invoices found.', 'Žádné faktury nenalezeny.')}</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invoice detail sheet */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
          {selectedInvoice && (() => {
            const sc = statusConfig[selectedInvoice.status]; const SI = sc.icon;
            return (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><ReceiptText className="h-5 w-5 text-primary" /></div>
                      <div><SheetTitle className="font-mono text-base">{selectedInvoice.id}</SheetTitle><p className="text-xs text-muted-foreground">{selectedInvoice.date}</p></div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.color}`}><SI className="h-3 w-3" />{t(sc.label, sc.labelCz)}</span>
                  </div>
                </SheetHeader>
                <div className="space-y-6">
                  {/* Amount */}
                  <div className="bg-muted/50 rounded-lg p-4"><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t('Total Amount', 'Celková částka')}</p><p className="text-3xl font-bold">{formatCurrency(selectedInvoice.amount)}</p></div>
                  {/* Client info */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Client', 'Klient')}</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-3"><Building2 className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{selectedInvoice.client}</span></div>
                      <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{selectedInvoice.clientEmail}</span></div>
                      <div className="flex items-center gap-3"><Hash className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{t('ICO', 'IČO')}: {selectedInvoice.clientIco}</span></div>
                    </div>
                  </div>
                  {/* Dates */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Issued', 'Vystaveno')}</p><p className="text-sm font-semibold mt-1">{selectedInvoice.date}</p></div>
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Due', 'Splatnost')}</p><p className="text-sm font-semibold mt-1">{selectedInvoice.due}</p></div>
                    <div className="bg-muted/50 rounded-lg p-3"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('Paid', 'Uhrazeno')}</p><p className="text-sm font-semibold mt-1">{selectedInvoice.paidDate || '—'}</p></div>
                  </div>
                  {/* Line items */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Line Items', 'Položky')}</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead><tr className="bg-muted/30 border-b border-border">
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t('Product', 'Produkt')}</th>
                          <th className="text-center px-3 py-2 font-medium text-muted-foreground">{t('Qty', 'Ks')}</th>
                          <th className="text-right px-3 py-2 font-medium text-muted-foreground">{t('Unit', 'Jednotka')}</th>
                          <th className="text-right px-3 py-2 font-medium text-muted-foreground">{t('Total', 'Celkem')}</th>
                        </tr></thead>
                        <tbody>
                          {selectedInvoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0">
                              <td className="px-3 py-2">{t(item.desc, item.descCz)}</td>
                              <td className="px-3 py-2 text-center">{item.qty}</td>
                              <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(item.unit)}</td>
                              <td className="px-3 py-2 text-right font-semibold">{formatCurrency(item.qty * item.unit)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot><tr className="bg-muted/30">
                          <td colSpan={3} className="px-3 py-2 text-right font-semibold">{t('Total', 'Celkem')}</td>
                          <td className="px-3 py-2 text-right font-bold">{formatCurrency(selectedInvoice.amount)}</td>
                        </tr></tfoot>
                      </table>
                    </div>
                  </div>
                  {/* Notes */}
                  {(selectedInvoice.notes || selectedInvoice.notesCz) && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('Notes', 'Poznámky')}</h3>
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{t(selectedInvoice.notes, selectedInvoice.notesCz)}</p>
                    </div>
                  )}
                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex gap-2">
                      {selectedInvoice.status !== 'paid' && selectedInvoice.status !== 'cancelled' && (
                        <Button size="sm" className="flex-1 gap-1.5" onClick={() => markAsPaid(selectedInvoice.id)}><CheckCircle2 className="h-3.5 w-3.5" />{t('Mark Paid', 'Označit uhrazeno')}</Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => sendReminder(selectedInvoice.id)}><Send className="h-3.5 w-3.5" />{t('Send', 'Odeslat')}</Button>
                      <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" />PDF</Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Printer className="h-3.5 w-3.5" />{t('Print', 'Tisk')}</Button>
                      <Button size="sm" variant="outline" className="gap-1.5"><Copy className="h-3.5 w-3.5" />{t('Duplicate', 'Duplikovat')}</Button>
                      <Button size="sm" variant="outline" className="gap-1.5 text-red-500 hover:text-red-600" onClick={() => deleteInvoice(selectedInvoice.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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
