import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, ShoppingCart, Truck, Scale, DollarSign, Building, Package, ShieldCheck } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    parties,
    items,
    salesInvoices,
    purchaseOrders,
    journalVouchers,
    weighbridgeLogs,
    tenders,
    setActiveHubAndModule,
  } = useERP();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: any;
      action: () => void;
    }[] = [];

    // Parties
    parties.forEach((p) => {
      if (
        p.trade_name.toLowerCase().includes(q) ||
        p.party_code.toLowerCase().includes(q) ||
        p.contact_person.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.party_id,
          title: p.trade_name,
          subtitle: `${p.party_code} · ${p.party_type.toUpperCase()} · ${p.phone}`,
          category: 'Parties & Customers',
          icon: Building,
          action: () => {
            setActiveHubAndModule(
              p.party_type === 'customer' ? 'commercial' : 'supply_chain',
              p.party_type === 'customer' ? 'customers' : 'suppliers'
            );
            onClose();
          },
        });
      }
    });

    // Invoices
    salesInvoices.forEach((inv) => {
      if (inv.invoice_no.toLowerCase().includes(q) || inv.party_name.toLowerCase().includes(q)) {
        results.push({
          id: inv.sales_invoice_id,
          title: `Sales Invoice ${inv.invoice_no}`,
          subtitle: `${inv.party_name} · ৳ ${inv.grand_total.toLocaleString()} · ${inv.status.toUpperCase()}`,
          category: 'Commercial Invoices',
          icon: FileText,
          action: () => {
            setActiveHubAndModule('commercial', 'sales_invoices');
            onClose();
          },
        });
      }
    });

    // Purchase Orders
    purchaseOrders.forEach((po) => {
      if (po.po_no.toLowerCase().includes(q) || po.party_name.toLowerCase().includes(q)) {
        results.push({
          id: po.purchase_order_id,
          title: `Purchase Order ${po.po_no}`,
          subtitle: `${po.party_name} · ৳ ${po.grand_total.toLocaleString()} · ${po.status.toUpperCase()}`,
          category: 'Procurement Orders',
          icon: ShoppingCart,
          action: () => {
            setActiveHubAndModule('supply_chain', 'purchase_orders');
            onClose();
          },
        });
      }
    });

    // Items
    items.forEach((item) => {
      if (item.item_name.toLowerCase().includes(q) || item.item_code.toLowerCase().includes(q)) {
        results.push({
          id: item.item_id,
          title: `${item.item_code} - ${item.item_name}`,
          subtitle: `${item.category_name} · Stock: ${item.total_stock} ${item.unit_code} · WAC: ৳ ${item.standard_cost}`,
          category: 'Inventory Items',
          icon: Package,
          action: () => {
            setActiveHubAndModule('supply_chain', 'items');
            onClose();
          },
        });
      }
    });

    // Journal Vouchers
    journalVouchers.forEach((jv) => {
      if (jv.voucher_no.toLowerCase().includes(q) || jv.narration.toLowerCase().includes(q)) {
        results.push({
          id: jv.journal_id,
          title: `Journal Voucher ${jv.voucher_no}`,
          subtitle: `Amount: ৳ ${jv.total_debit.toLocaleString()} · ${jv.narration}`,
          category: 'Financial General Ledger',
          icon: DollarSign,
          action: () => {
            setActiveHubAndModule('financial', 'journal_vouchers');
            onClose();
          },
        });
      }
    });

    // Weighbridge Scale Tickets
    weighbridgeLogs.forEach((wb) => {
      if (
        wb.scale_ticket_no.toLowerCase().includes(q) ||
        wb.truck_no.toLowerCase().includes(q) ||
        wb.driver_name.toLowerCase().includes(q)
      ) {
        results.push({
          id: wb.weighbridge_log_id,
          title: `Weighbridge Ticket ${wb.scale_ticket_no}`,
          subtitle: `Truck ${wb.truck_no} · Net Cargo: ${wb.net_weight} MT · ${wb.port_or_depot}`,
          category: 'Weighbridge Stations',
          icon: Scale,
          action: () => {
            setActiveHubAndModule('supply_chain', 'weighbridge');
            onClose();
          },
        });
      }
    });

    // Tenders
    tenders.forEach((t) => {
      if (t.egp_tender_id.toLowerCase().includes(q) || t.project_name.toLowerCase().includes(q)) {
        results.push({
          id: t.tender_id,
          title: `Tender ${t.egp_tender_id}`,
          subtitle: `${t.project_name} · ৳ ${t.estimated_value.toLocaleString()} · ${t.status}`,
          category: 'Tenders & e-GP Intelligence',
          icon: ShieldCheck,
          action: () => {
            setActiveHubAndModule('executive', 'tender_intelligence');
            onClose();
          },
        });
      }
    });

    return results.slice(0, 15);
  }, [query, parties, items, salesInvoices, purchaseOrders, journalVouchers, weighbridgeLogs, tenders, setActiveHubAndModule, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a customer name, voucher #, truck #, item, tender ID or module..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Navigation suggestions when query empty */}
        {!query.trim() && (
          <div className="p-4 text-xs">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Frequent Modules
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveHubAndModule('commercial', 'sales_invoices');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">Sales Invoices</p>
                  <p className="text-[10px] text-slate-400">Post billing & receivables</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveHubAndModule('supply_chain', 'weighbridge');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <Scale className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">Weighbridge Scale</p>
                  <p className="text-[10px] text-slate-400">Record truck gross & tare</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveHubAndModule('financial', 'journal_vouchers');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <DollarSign className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">Journal Vouchers</p>
                  <p className="text-[10px] text-slate-400">Double entry balanced journals</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveHubAndModule('executive', 'tender_intelligence');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-blue-50/50 text-left text-slate-700 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">Tender & BOQ</p>
                  <p className="text-[10px] text-slate-400">e-GP government registers</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        {query.trim() && (
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching records found for "{query}".
              </div>
            ) : (
              searchResults.map((res) => {
                const IconComponent = res.icon;
                return (
                  <div
                    key={res.id}
                    onClick={res.action}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{res.title}</p>
                        <p className="text-[11px] text-slate-500">{res.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {res.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer Hint */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
