import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Search, Download, Users, TrendingUp, UserX, DollarSign } from 'lucide-react';

const clients = [
  { id: 1, company: 'Tatra s.r.o.', contact: 'Petr Novák', initials: 'PN', ltv: 84000, lastOrder: '2024-01-15', status: 'Active' },
  { id: 2, company: 'Škoda Auto a.s.', contact: 'Jana Svobodová', initials: 'JS', ltv: 125000, lastOrder: '2024-01-20', status: 'Active' },
  { id: 3, company: 'ČEZ Group', contact: 'Martin Dvořák', initials: 'MD', ltv: 52000, lastOrder: '2024-01-10', status: 'Active' },
  { id: 4, company: 'Kofola a.s.', contact: 'Eva Procházková', initials: 'EP', ltv: 38000, lastOrder: '2024-01-05', status: 'Active' },
  { id: 5, company: 'Pilsner Urquell', contact: 'Tomáš Krejčí', initials: 'TK', ltv: 91000, lastOrder: '2023-12-20', status: 'Active' },
  { id: 6, company: 'O2 Czech Republic', contact: 'Lucie Marková', initials: 'LM', ltv: 22000, lastOrder: '2023-08-10', status: 'Churned' },
  { id: 7, company: 'T-Mobile CZ', contact: 'Ondřej Blažek', initials: 'OB', ltv: 72000, lastOrder: '2023-11-28', status: 'Active' },
  { id: 8, company: 'Alza.cz', contact: 'Radka Horáková', initials: 'RH', ltv: 158000, lastOrder: '2023-11-15', status: 'Active' },
  { id: 9, company: 'Lidl ČR', contact: 'Václav Beneš', initials: 'VB', ltv: 11000, lastOrder: '2023-05-01', status: 'Churned' },
  { id: 10, company: 'Kaufland CZ', contact: 'Simona Pokorná', initials: 'SP', ltv: 44000, lastOrder: '2024-01-18', status: 'Active' },
];

const totalLTV = clients.reduce((s, c) => s + c.ltv, 0);
const activeCount = clients.filter(c => c.status === 'Active').length;
const churnedCount = clients.filter(c => c.status === 'Churned').length;
const avgLTV = Math.round(totalLTV / clients.length);

export default function CustomersPage() {
  const { t, formatCurrency } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = clients.filter(c =>
    search === '' ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (company: string) => {
    toast({
      title: t(`Opening client profile for ${company}...`, `Otevírám profil klienta ${company}...`),
    });
  };

  const stats = [
    { labelEn: 'Total Clients', labelCz: 'Celkem klientů', value: clients.length, icon: Users, color: 'text-primary bg-primary/10' },
    { labelEn: 'Active', labelCz: 'Aktivní', value: activeCount, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
    { labelEn: 'Churned', labelCz: 'Ztracení', value: churnedCount, icon: UserX, color: 'text-red-500 bg-red-100' },
    { labelEn: 'Avg LTV', labelCz: 'Průměrné LTV', value: formatCurrency(avgLTV), icon: DollarSign, color: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.labelEn} className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t(s.labelEn, s.labelCz)}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card className="border-border">
        <CardContent className="p-4 flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('Search clients...', 'Hledat klienty...')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
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
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{t('Company', 'Společnost')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Contact', 'Kontakt')}</th>
                  <th className="text-right px-3 py-3 text-xs font-medium text-muted-foreground">{t('Total Spent (LTV)', 'Celkem utraceno (LTV)')}</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-muted-foreground">{t('Last Order', 'Poslední objednávka')}</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground">{t('Status', 'Stav')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(client.company)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {client.initials}
                        </div>
                        <span className="font-medium text-foreground">{client.company}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{client.contact}</td>
                    <td className="px-3 py-3 text-right font-semibold text-foreground">{formatCurrency(client.ltv)}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{client.lastOrder}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        client.status === 'Active'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-600 border-red-200'
                      }`}>
                        {t(client.status, client.status === 'Active' ? 'Aktivní' : 'Ztracený')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
