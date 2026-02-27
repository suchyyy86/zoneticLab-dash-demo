import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { useCountUp } from '@/hooks/use-count-up';
import {
  Search, Filter, Calendar, Download, MoreHorizontal, Eye, Send, Copy,
  DollarSign, AlertTriangle, Clock, CheckCircle2, XCircle, ArrowUpRight, ChevronDown
} from 'lucide-react';

const invoices = [
  { id: 'INV-2024-112', client: 'Tatra s.r.o.', amount: 8400, status: 'overdue', date: '2024-01-15', due: '2024-02-14', category: 'Web Design' },
  { id: 'INV-2024-111', client: 'Škoda Auto a.s.', amount: 12500, status: 'pending', date: '2024-01-20', due: '2024-02-19', category: 'SEO' },
  { id: 'INV-2024-110', client: 'ČEZ Group', amount: 5200, status: 'paid', date: '2024-01-10', due: '2024-02-09', category: 'Ads' },
  { id: 'INV-2024-109', client: 'Kofola a.s.', amount: 3800, status: 'paid', date: '2024-01-05', due: '2024-02-04', category: 'Consulting' },
  { id: 'INV-2024-108', client: 'Pilsner Urquell', amount: 9100, status: 'paid', date: '2024-01-02', due: '2024-02-01', category: 'Web Design' },
  { id: 'INV-2024-107', client: 'IKEA CZ', amount: 6700, status: 'pending', date: '2023-12-28', due: '2024-01-27', category: 'SEO' },
  { id: 'INV-2024-106', client: 'Kaufland CZ', amount: 4300, status: 'cancelled', date: '2023-12-20', due: '2024-01-19', category: 'Ads' },
  { id: 'INV-2024-105', client: 'T-Mobile CZ', amount: 11200, status: 'paid', date: '2023-12-15', due: '2024-01-14', category: 'Web Design' },
  { id: 'INV-2024-104', client: 'ČSOB', amount: 7800, status: 'paid', date: '2023-12-10', due: '2024-01-09', category: 'Consulting' },
  { id: 'INV-2024-103', client: 'Rohlik.cz', amount: 3200, status: 'overdue', date: '2023-12-05', due: '2024-01-04', category: 'SEO' },
];

const statusConfig: Record<string, { label: string; labelCz: string; color: string; icon: any }> = {
  paid: { label: 'Paid', labelCz: 'Uhrazeno', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800', icon: CheckCircle2 },
  pending: { label: 'Pending', labelCz: 'Čekající', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800', icon: Clock },
  overdue: { label: 'Overdue', labelCz: 'Po splatnosti', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: AlertTriangle },
  cancelled: { label: 'Cancelled', labelCz: 'Zrušeno', color: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700', icon: XCircle },
};

function SummaryValue({ value }: { value: number }) {
  const { formatCurrency } = useLanguage();
  const animated = useCountUp(value, 1000);
  return <>{formatCurrency(animated)}</>;
}

export default function InvoicesPage() {
  const { t, formatCurrency } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = invoices.filter(inv =>
    (filterStatus === 'all' || inv.status === filterStatus) &&
    (inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totals = {
    total: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(i => i.id)));
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: t('Total Revenue', 'Celkový obrat'), value: totals.total, icon: DollarSign, color: 'text-primary bg-primary/10' },
          { label: t('Paid', 'Uhrazeno'), value: totals.paid, icon: CheckCircle2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
          { label: t('Pending', 'Čekající'), value: totals.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
          { label: t('Overdue', 'Po splatnosti'), value: totals.overdue, icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
        ].map((card, idx) => (
          <Card key={card.label} className={`border-border card-hover animate-fade-in-up stagger-${idx + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-lg font-bold"><SummaryValue value={card.value} /></p>
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
            placeholder={t('Search invoices...', 'Hledat faktury...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'paid', 'pending', 'overdue', 'cancelled'].map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              size="sm"
              className={`h-8 text-xs ${filterStatus === s ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? t('All', 'Vše') : t(statusConfig[s]?.label || s, statusConfig[s]?.labelCz || s)}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs ml-auto">
          <Download className="h-3.5 w-3.5" />
          {t('Export', 'Export')}
        </Button>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 animate-fade-in-up">
          <span className="text-sm font-medium">{selectedIds.size} {t('selected', 'vybráno')}</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Send className="h-3 w-3" /> {t('Send Reminder', 'Poslat upomínku')}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" /> {t('Export Selected', 'Exportovat vybrané')}
            </Button>
          </div>
        </div>
      )}

      {/* Invoice table */}
      <Card className="border-border animate-fade-in-up stagger-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-10 px-4 py-3">
                  <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Invoice', 'Faktura')}</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Client', 'Klient')}</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Category', 'Kategorie')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Amount', 'Částka')}</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Due Date', 'Splatnost')}</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const sc = statusConfig[inv.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.has(inv.id)} onCheckedChange={() => toggleSelect(inv.id)} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs text-primary">{inv.id}</span>
                    </td>
                    <td className="px-3 py-3 font-medium text-foreground">{inv.client}</td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className="text-[10px] font-medium">{inv.category}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">{formatCurrency(inv.amount)}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${sc.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {t(sc.label, sc.labelCz)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-muted-foreground">{inv.due}</td>
                    <td className="px-3 py-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invoice detail sheet */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          {selectedInvoice && (() => {
            const sc = statusConfig[selectedInvoice.status];
            const StatusIcon = sc.icon;
            return (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-mono text-base">{selectedInvoice.id}</SheetTitle>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {t(sc.label, sc.labelCz)}
                    </span>
                  </div>
                </SheetHeader>
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t('Total Amount', 'Celková částka')}</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('Client', 'Klient')}</p>
                      <p className="text-sm font-medium">{selectedInvoice.client}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('Category', 'Kategorie')}</p>
                      <p className="text-sm font-medium">{selectedInvoice.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('Issue Date', 'Datum vystavení')}</p>
                      <p className="text-sm font-medium">{selectedInvoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('Due Date', 'Splatnost')}</p>
                      <p className="text-sm font-medium">{selectedInvoice.due}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      {t('Send', 'Odeslat')}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      {t('Download PDF', 'Stáhnout PDF')}
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
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
