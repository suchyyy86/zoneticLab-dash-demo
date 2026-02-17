import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { Search, CalendarIcon, MoreHorizontal, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const invoices = [
  { id: '#INV-2024-112', client: 'Petr Novák', company: 'Tatra s.r.o.', initials: 'PN', issued: '2024-01-15', due: '2024-02-15', amount: 8400, status: 'Overdue', items: ['Web Design – 40h', 'SEO Setup', 'Hosting Q1'] },
  { id: '#INV-2024-111', client: 'Jana Svobodová', company: 'Škoda Auto a.s.', initials: 'JS', issued: '2024-01-20', due: '2024-02-20', amount: 12500, status: 'Pending', items: ['UI Redesign', 'React Development – 50h'] },
  { id: '#INV-2024-110', client: 'Martin Dvořák', company: 'ČEZ Group', initials: 'MD', issued: '2024-01-10', due: '2024-01-31', amount: 5200, status: 'Paid', items: ['Google Ads Management', 'Monthly Report'] },
  { id: '#INV-2024-109', client: 'Eva Procházková', company: 'Kofola a.s.', initials: 'EP', issued: '2024-01-05', due: '2024-02-05', amount: 3800, status: 'Paid', items: ['Brand Strategy', 'Social Media Kit'] },
  { id: '#INV-2024-108', client: 'Tomáš Krejčí', company: 'Pilsner Urquell', initials: 'TK', issued: '2023-12-20', due: '2024-01-20', amount: 9100, status: 'Paid', items: ['Website Overhaul', 'CMS Integration'] },
  { id: '#INV-2024-107', client: 'Lucie Marková', company: 'O2 Czech Republic', initials: 'LM', issued: '2023-12-10', due: '2024-01-10', amount: 4600, status: 'Cancelled', items: ['Consulting – 18h'] },
  { id: '#INV-2024-106', client: 'Ondřej Blažek', company: 'T-Mobile CZ', initials: 'OB', issued: '2023-11-28', due: '2023-12-28', amount: 7200, status: 'Paid', items: ['E-commerce Development', 'SEO Audit'] },
  { id: '#INV-2024-105', client: 'Radka Horáková', company: 'Alza.cz', initials: 'RH', issued: '2023-11-15', due: '2023-12-15', amount: 15800, status: 'Pending', items: ['Full Rebranding', 'Landing Pages x5'] },
];

const statusConfig: Record<string, { label: string; labelCz: string; className: string }> = {
  Paid: { label: 'Paid', labelCz: 'Zaplaceno', className: 'bg-green-100 text-green-700 border-green-200' },
  Pending: { label: 'Pending', labelCz: 'Čeká na platbu', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  Overdue: { label: 'Overdue', labelCz: 'Po splatnosti', className: 'bg-red-100 text-red-700 border-red-200' },
  Cancelled: { label: 'Cancelled', labelCz: 'Zrušeno', className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export default function InvoicesPage() {
  const { t, formatCurrency } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = search === '' || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleMarkPaid = () => {
    toast({ title: t('Marked as Paid', 'Označeno jako zaplaceno'), description: `${selectedInvoice?.id} ${t('has been updated.', 'bylo aktualizováno.')}` });
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card className="border-border">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search invoices...', 'Hledat faktury...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn('h-9 text-sm gap-2', !dateFrom && 'text-muted-foreground')}>
                <CalendarIcon className="h-4 w-4" />
                {dateFrom ? format(dateFrom, 'dd MMM') : t('From', 'Od')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto" />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn('h-9 text-sm gap-2', !dateTo && 'text-muted-foreground')}>
                <CalendarIcon className="h-4 w-4" />
                {dateTo ? format(dateTo, 'dd MMM') : t('To', 'Do')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto" />
            </PopoverContent>
          </Popover>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue placeholder={t('Status', 'Stav')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Statuses', 'Všechny stavy')}</SelectItem>
              <SelectItem value="Paid">{t('Paid', 'Zaplaceno')}</SelectItem>
              <SelectItem value="Pending">{t('Pending', 'Čeká')}</SelectItem>
              <SelectItem value="Overdue">{t('Overdue', 'Po splatnosti')}</SelectItem>
              <SelectItem value="Cancelled">{t('Cancelled', 'Zrušeno')}</SelectItem>
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" className="h-9 gap-2 ml-auto" onClick={() => toast({ title: t('Exporting data...', 'Exportuji data...') })}>
            <Download className="h-4 w-4" />
            {t('Export', 'Exportovat')}
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{t('Invoice', 'Faktura')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Client', 'Klient')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Issued', 'Vystaveno')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Due', 'Splatnost')}</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Amount', 'Částka')}</th>
                  <th className="text-center px-3 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const sc = statusConfig[inv.status];
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{inv.id}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {inv.initials}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-xs">{inv.client}</p>
                            <p className="text-muted-foreground text-xs">{inv.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{inv.issued}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{inv.due}</td>
                      <td className="px-3 py-3 text-right font-semibold text-sm">{formatCurrency(inv.amount)}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${sc.className}`}>
                          {t(sc.label, sc.labelCz)}
                        </span>
                      </td>
                      <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedInvoice(inv)}>{t('View Details', 'Zobrazit detaily')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: t('Exporting data...', 'Exportuji data...') })}>{t('Download PDF', 'Stáhnout PDF')}</DropdownMenuItem>
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

      {/* Invoice Slide-over */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedInvoice && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-lg">{selectedInvoice.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('Client', 'Klient')}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {selectedInvoice.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedInvoice.client}</p>
                      <p className="text-sm text-muted-foreground">{selectedInvoice.company}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('Issue Date', 'Datum vystavení')}</p>
                    <p className="font-medium">{selectedInvoice.issued}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('Due Date', 'Datum splatnosti')}</p>
                    <p className="font-medium">{selectedInvoice.due}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">{t('Line Items', 'Položky')}</p>
                  <div className="border border-border rounded-lg divide-y divide-border">
                    {selectedInvoice.items.map((item, i) => (
                      <div key={i} className="px-4 py-2.5 text-sm text-foreground">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('Total', 'Celkem')}</span>
                  <span className="text-xl font-bold text-foreground">{formatCurrency(selectedInvoice.amount)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[selectedInvoice.status].className}`}>
                    {t(statusConfig[selectedInvoice.status].label, statusConfig[selectedInvoice.status].labelCz)}
                  </span>
                </div>

                {selectedInvoice.status !== 'Paid' && selectedInvoice.status !== 'Cancelled' && (
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleMarkPaid}>
                    {t('Mark as Paid', 'Označit jako zaplaceno')}
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
