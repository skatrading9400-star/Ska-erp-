import React, { useState, useMemo } from 'react';
import {
  Plus,
  Printer,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Package,
  Truck,
  CreditCard,
  Lock,
  Eye,
  X,
  Building2,
  Check,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { SalesInvoice } from '../../../types/erp';

interface SalesInvoicesViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const SalesInvoicesView: React.FC<SalesInvoicesViewProps> = ({ onOpenPrintModal }) => {
  const {
    salesInvoices,
    parties,
    items,
    warehouses,
    warehouseStock,
    deliveryChallans,
    salesOrders,
    addSalesInvoice,
    postSalesInvoice,
    formatBDT,
  } = useERP();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<SalesInvoice | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Billing Source Mode
  const [billingSource, setBillingSource] = useState<'challan' | 'order' | 'manual'>('challan');
  const [selectedChallanId, setSelectedChallanId] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // Form State
  const customers = useMemo(() => parties.filter((p) => p.party_type === 'customer'), [parties]);
  const [partyId, setPartyId] = useState(customers[0]?.party_id || '');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.warehouse_id || '');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.item_id || '');
  const [quantity, setQuantity] = useState<number>(500);
  const [unitPrice, setUnitPrice] = useState<number>(items[0]?.sales_price || 3850);
  const [vatPct, setVatPct] = useState<number>(0);
  const [overrideStockGuard, setOverrideStockGuard] = useState(false);
  const [overrideCreditGuard, setOverrideCreditGuard] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Selected entities and stock/credit metrics
  const selectedCustomer = useMemo(
    () => parties.find((p) => p.party_id === partyId),
    [parties, partyId]
  );
  const selectedWarehouse = useMemo(
    () => warehouses.find((w) => w.warehouse_id === warehouseId),
    [warehouses, warehouseId]
  );
  const selectedItem = useMemo(
    () => items.find((i) => i.item_id === selectedItemId),
    [items, selectedItemId]
  );

  // Depot Available Stock Lookup
  const availableDepotStock = useMemo(() => {
    if (!warehouseId || !selectedItemId) return 0;
    const stockRecord = warehouseStock.find(
      (ws) => ws.warehouse_id === warehouseId && ws.item_id === selectedItemId
    );
    return stockRecord ? stockRecord.quantity : 0;
  }, [warehouseStock, warehouseId, selectedItemId]);

  const hasStockDeficit = quantity > availableDepotStock;
  const stockDeficit = Math.max(0, quantity - availableDepotStock);

  // Customer Credit Exposure Computation
  const subtotal = quantity * unitPrice;
  const vatAmount = (subtotal * vatPct) / 100;
  const lineTotal = subtotal + vatAmount;

  const currentOutstanding = selectedCustomer?.outstanding_balance || 0;
  const creditLimit = selectedCustomer?.credit_limit || 0;
  const projectedOutstanding = currentOutstanding + lineTotal;
  const hasCreditLimit = !!selectedCustomer?.credit_allowed && creditLimit > 0;
  const isCreditExceeded = hasCreditLimit && projectedOutstanding > creditLimit;
  const creditExcessAmount = Math.max(0, projectedOutstanding - creditLimit);
  const creditUtilizationPct = creditLimit > 0 ? Math.min(100, Math.round((projectedOutstanding / creditLimit) * 100)) : 0;

  // Handle Billing Source Selection
  const handleChallanSelect = (challanId: string) => {
    setSelectedChallanId(challanId);
    const challan = deliveryChallans.find((c) => c.delivery_challan_id === challanId);
    if (!challan) return;

    if (challan.party_id) setPartyId(challan.party_id);
    if (challan.warehouse_id) setWarehouseId(challan.warehouse_id);

    const firstItem = challan.items[0];
    if (firstItem) {
      setSelectedItemId(firstItem.item_id);
      setQuantity(firstItem.dispatched_quantity);
      const matchedItem = items.find((i) => i.item_id === firstItem.item_id);
      if (matchedItem) {
        setUnitPrice(matchedItem.sales_price);
      }
    }
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = salesOrders.find((so) => so.sales_order_id === orderId);
    if (!order) return;

    if (order.party_id) setPartyId(order.party_id);
    if (order.warehouse_id) setWarehouseId(order.warehouse_id);

    const firstItem = order.items[0];
    if (firstItem) {
      setSelectedItemId(firstItem.item_id);
      setQuantity(firstItem.quantity);
      setUnitPrice(firstItem.unit_price);
    }
  };

  const handlePost = (invoiceId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const res = postSalesInvoice(invoiceId);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to post sales invoice.');
    } else {
      setSuccessMessage('Sales Invoice posted successfully. Accounts Receivable and Sales Revenue GL accounts updated.');
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedCustomer || !selectedWarehouse || !selectedItem) {
      setErrorMessage('Please select a valid customer, warehouse depot, and aggregate item.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('Invoice quantity must be greater than zero.');
      return;
    }

    if (unitPrice <= 0) {
      setErrorMessage('Unit sales price must be greater than zero.');
      return;
    }

    // Enforce Depot Stock Guard
    if (hasStockDeficit && !overrideStockGuard) {
      setErrorMessage(
        `Depot Stock Deficit Block: Available stock at ${selectedWarehouse.warehouse_name} is only ${availableDepotStock.toLocaleString()} MT. Invoicing ${quantity.toLocaleString()} MT creates a negative variance of ${stockDeficit.toLocaleString()} MT. Supervisory override approval required.`
      );
      return;
    }

    // Enforce Customer Credit Limit Guard
    if (isCreditExceeded && !overrideCreditGuard) {
      setErrorMessage(
        `Credit Limit Violation Block: Customer ${selectedCustomer.trade_name} has a credit limit of ${formatBDT(creditLimit)}. Current outstanding is ${formatBDT(currentOutstanding)}. This invoice pushes balance to ${formatBDT(projectedOutstanding)} (exceeds limit by ${formatBDT(creditExcessAmount)}). Credit committee override approval required.`
      );
      return;
    }

    if ((hasStockDeficit || isCreditExceeded) && (!overrideReason || overrideReason.trim().length < 5)) {
      setErrorMessage('A supervisory justification reason (min 5 characters) is required when overriding inventory or credit guards.');
      return;
    }

    const invNo = `INV-2026-${String(salesInvoices.length + 91).padStart(4, '0')}`;

    addSalesInvoice({
      invoice_no: invNo,
      sales_order_id: billingSource === 'order' ? selectedOrderId : billingSource === 'challan' ? (deliveryChallans.find(c => c.delivery_challan_id === selectedChallanId)?.sales_order_id) : undefined,
      party_id: selectedCustomer.party_id,
      party_name: selectedCustomer.trade_name,
      warehouse_id: selectedWarehouse.warehouse_id,
      warehouse_name: selectedWarehouse.warehouse_name,
      invoice_date: invoiceDate,
      due_date: dueDate,
      subtotal: subtotal,
      vat_amount: vatAmount,
      grand_total: lineTotal,
      paid_amount: 0,
      due_amount: lineTotal,
      status: 'approved',
      is_posted: false,
      items: [
        {
          item_id: selectedItem.item_id,
          item_name: selectedItem.item_name,
          quantity: quantity,
          unit_code: selectedItem.unit_code,
          unit_price: unitPrice,
          vat_pct: vatPct,
          line_total: lineTotal,
        },
      ],
    });

    setSuccessMessage(`Commercial Invoice ${invNo} created successfully with strict depot stock & credit validations.`);
    setIsNewModalOpen(false);
    // Reset transient overrides
    setOverrideStockGuard(false);
    setOverrideCreditGuard(false);
    setOverrideReason('');
  };

  const columns: Column<SalesInvoice>[] = [
    {
      key: 'invoice_no',
      header: 'Invoice #',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'party_name',
      header: 'Customer (PartyMaster)',
      className: 'font-semibold',
    },
    {
      key: 'invoice_date',
      header: 'Invoice Date',
    },
    {
      key: 'due_date',
      header: 'Due Date',
    },
    {
      key: 'warehouse_name',
      header: 'Dispatch Depot / Yard',
    },
    {
      key: 'grand_total',
      header: 'Total (৳ BDT)',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatBDT(row.grand_total)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status & Posting',
      render: (row) => (
        <div className="flex flex-col gap-1 items-start">
          <StatusBadge status={row.status} />
          {row.is_posted ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> GL Posted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Lock className="w-2.5 h-2.5 text-amber-600" /> Unposted (Draft)
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewInvoice(row)}
            className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            title="Inspect Invoice & Financial Ledger Impact"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!row.is_posted ? (
            <button
              onClick={() => handlePost(row.sales_invoice_id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-600 transition-colors shadow-2xs flex items-center gap-1"
              title="Post invoice and recognize Accounts Receivable & Sales Revenue"
            >
              <Check className="w-3 h-3" /> Post GL
            </button>
          ) : (
            <span className="px-2 py-1 text-[10px] text-slate-400 font-mono italic cursor-not-allowed">
              Locked
            </span>
          )}
          <button
            onClick={() => onOpenPrintModal('Sales Invoice', row)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Print Official Tax Invoice (NBR Format)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Real-time In-frame Notification Banners */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center justify-between text-xs animate-fadeIn shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-xs animate-fadeIn shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Commercial Policy Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-[11px]">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Commercial Operations — Sales Invoicing & Revenue Recognition Engine</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed max-w-3xl">
            Strict Double-Entry Enforcement: Every posted sales invoice automatically generates a balanced debit to{' '}
            <strong className="text-white">A/C 1200 (Accounts Receivable)</strong> and credit to{' '}
            <strong className="text-white">A/C 4100 (Sales Revenue)</strong>. Invoices are protected by real-time depot stock checks and customer credit-limit exposure bounds.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Invoiced</div>
            <div className="font-mono font-bold text-white text-xs">
              {formatBDT(salesInvoices.reduce((acc, i) => acc + i.grand_total, 0))}
            </div>
          </div>
          <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Posted Count</div>
            <div className="font-mono font-bold text-emerald-400 text-xs">
              {salesInvoices.filter((i) => i.is_posted).length} / {salesInvoices.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Invoices DataGrid */}
      <DataGrid
        title="Commercial Sales Invoices"
        subtitle="Manage customer tax invoices, delivery challan billing, and real-time general ledger postings."
        columns={columns}
        data={salesInvoices}
        searchKeys={['invoice_no', 'party_name', 'warehouse_name']}
        statusKey="status"
        statusOptions={['draft', 'approved', 'posted']}
        exportFileName="SalesInvoices"
        actionButton={
          <button
            onClick={() => {
              setErrorMessage(null);
              setIsNewModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Invoice</span>
          </button>
        }
      />

      {/* Inspect Invoice Modal / Drawer */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Tax Invoice Record: {viewInvoice.invoice_no}</h3>
              </div>
              <button
                onClick={() => setViewInvoice(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Header Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Customer</span>
                  <span className="font-bold text-slate-900">{viewInvoice.party_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Depot Warehouse</span>
                  <span className="font-semibold text-slate-800">{viewInvoice.warehouse_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Invoice Date</span>
                  <span className="font-mono text-slate-800">{viewInvoice.invoice_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Due Date</span>
                  <span className="font-mono text-slate-800">{viewInvoice.due_date}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider block mb-2">
                  Invoiced Line Items & Aggregate Specifications
                </span>
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[11px]">
                    <tr>
                      <th className="p-2 border border-slate-200">Item Description</th>
                      <th className="p-2 border border-slate-200 text-right">Quantity</th>
                      <th className="p-2 border border-slate-200 text-center">Unit</th>
                      <th className="p-2 border border-slate-200 text-right">Rate (৳ BDT)</th>
                      <th className="p-2 border border-slate-200 text-right">Line Total (৳ BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-200 font-medium">{item.item_name}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono font-semibold">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="p-2 border border-slate-200 text-center">{item.unit_code}</td>
                        <td className="p-2 border border-slate-200 text-right font-mono">
                          {formatBDT(item.unit_price)}
                        </td>
                        <td className="p-2 border border-slate-200 text-right font-mono font-bold text-blue-900">
                          {formatBDT(item.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={4} className="p-2 border border-slate-200 text-right text-slate-700">
                        Grand Total Receivable:
                      </td>
                      <td className="p-2 border border-slate-200 text-right font-mono text-blue-900 text-sm">
                        {formatBDT(viewInvoice.grand_total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Double-Entry Journal Audit Preview */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-700" /> General Ledger Accounting Invariant
                  </span>
                  <span className="font-mono text-[10px] text-blue-700 font-semibold">
                    JV-SALES-{viewInvoice.invoice_no}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <div className="flex justify-between border-b border-blue-100 pb-1">
                    <span>
                      <strong>Debit:</strong> A/C 1200 - Accounts Receivable ({viewInvoice.party_name})
                    </span>
                    <span className="font-mono font-semibold text-blue-900">{formatBDT(viewInvoice.grand_total)}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span>
                      <strong>Credit:</strong> A/C 4100 - Stone Aggregate Sales Revenue
                    </span>
                    <span className="font-mono font-semibold text-emerald-900">{formatBDT(viewInvoice.grand_total)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {viewInvoice.is_posted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Ledger Posted & Immutable
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        handlePost(viewInvoice.sales_invoice_id);
                        setViewInvoice(null);
                      }}
                      className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Post Now to GL
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenPrintModal('Sales Invoice', viewInvoice);
                      setViewInvoice(null);
                    }}
                    className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                  </button>
                  <button
                    onClick={() => setViewInvoice(null)}
                    className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Sales Invoice Modal with Real-Time Stock & Credit Guards */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Issue New Commercial Sales Invoice</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 text-xs overflow-y-auto">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Billing Source Selector */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  Billing Workflow Source
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingSource('challan')}
                    className={`p-2 rounded text-left border transition-all ${
                      billingSource === 'challan'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Delivery Challan</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Bill dispatched gate pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingSource('order')}
                    className={`p-2 rounded text-left border transition-all ${
                      billingSource === 'order'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sales Order</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Bill verified sales contract</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingSource('manual')}
                    className={`p-2 rounded text-left border transition-all ${
                      billingSource === 'manual'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Direct / Spot</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Manual invoice entry</span>
                  </button>
                </div>

                {/* Conditional Linked Selector */}
                {billingSource === 'challan' && (
                  <div className="pt-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Select Dispatched Delivery Challan (Gate Pass) *
                    </label>
                    <select
                      value={selectedChallanId}
                      onChange={(e) => handleChallanSelect(e.target.value)}
                      required
                      className="w-full p-2 rounded border border-blue-300 bg-white text-slate-900 font-medium"
                    >
                      <option value="">-- Choose Dispatched Delivery Challan --</option>
                      {deliveryChallans.map((c) => (
                        <option key={c.delivery_challan_id} value={c.delivery_challan_id}>
                          {c.challan_no} — {c.party_name} ({c.items[0]?.dispatched_quantity} MT {c.items[0]?.item_name} via {c.truck_no})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {billingSource === 'order' && (
                  <div className="pt-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Select Approved Sales Order *
                    </label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => handleOrderSelect(e.target.value)}
                      required
                      className="w-full p-2 rounded border border-blue-300 bg-white text-slate-900 font-medium"
                    >
                      <option value="">-- Choose Sales Order --</option>
                      {salesOrders.map((so) => (
                        <option key={so.sales_order_id} value={so.sales_order_id}>
                          {so.order_no} — {so.party_name} ({formatBDT(so.grand_total)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Customer & Depot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Customer (PartyMaster) *
                  </label>
                  <select
                    value={partyId}
                    onChange={(e) => setPartyId(e.target.value)}
                    required
                    disabled={billingSource === 'challan' && !!selectedChallanId}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white disabled:bg-slate-100"
                  >
                    {customers.map((c) => (
                      <option key={c.party_id} value={c.party_id}>
                        {c.trade_name} ({c.party_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Dispatch Depot / Yard *
                  </label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    required
                    disabled={billingSource === 'challan' && !!selectedChallanId}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white disabled:bg-slate-100"
                  >
                    {warehouses.map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.warehouse_name} ({w.warehouse_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* Real-time Depot Stock Guard Card */}
              <div
                className={`p-3 rounded-lg border transition-all ${
                  hasStockDeficit
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Package className="w-4 h-4 shrink-0" />
                    <span>Depot Stock Verification: {selectedWarehouse?.warehouse_name || 'Selected Yard'}</span>
                  </div>
                  <span className="font-mono font-bold text-xs">
                    Available: {availableDepotStock.toLocaleString()} MT
                  </span>
                </div>

                {hasStockDeficit ? (
                  <div className="mt-2 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-rose-700 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        INSUFFICIENT DEPOT STOCK: Invoicing {quantity.toLocaleString()} MT exceeds depot stock by{' '}
                        {stockDeficit.toLocaleString()} MT.
                      </span>
                    </div>
                    <p className="text-rose-600">
                      Issuing an invoice without physically stocked aggregate creates an unauthorized negative stock ledger balance.
                    </p>
                    <label className="flex items-center gap-2 pt-1 font-medium text-rose-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrideStockGuard}
                        onChange={(e) => setOverrideStockGuard(e.target.checked)}
                        className="rounded border-rose-400 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Supervisory Authorization: Override inventory stock deficit guard</span>
                    </label>
                  </div>
                ) : (
                  <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>
                      Stock verified: Sufficient depot inventory available ({availableDepotStock.toLocaleString()} MT &ge;{' '}
                      {quantity.toLocaleString()} MT).
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Credit Limit Exposure Card */}
              <div
                className={`p-3 rounded-lg border transition-all ${
                  isCreditExceeded
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <CreditCard className="w-4 h-4 shrink-0 text-slate-600" />
                    <span>Customer Credit Risk & Exposure Analysis</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-600">
                    Policy Terms: {selectedCustomer?.payment_terms_days || 30} Days
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 text-[11px] font-mono border-t border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Credit Limit</span>
                    <span className="font-bold text-slate-900">
                      {creditLimit > 0 ? formatBDT(creditLimit) : 'No Limit / Advance'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Current Outstanding</span>
                    <span className="font-bold text-slate-800">{formatBDT(currentOutstanding)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Projected Balance</span>
                    <span
                      className={`font-bold ${
                        isCreditExceeded ? 'text-rose-700' : 'text-blue-900'
                      }`}
                    >
                      {formatBDT(projectedOutstanding)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {creditLimit > 0 && (
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isCreditExceeded
                          ? 'bg-rose-600'
                          : creditUtilizationPct > 80
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, creditUtilizationPct)}%` }}
                    />
                  </div>
                )}

                {isCreditExceeded && (
                  <div className="mt-2 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-rose-700 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        CREDIT EXPOSURE CEILING EXCEEDED by {formatBDT(creditExcessAmount)}!
                      </span>
                    </div>
                    <label className="flex items-center gap-2 pt-1 font-medium text-amber-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrideCreditGuard}
                        onChange={(e) => setOverrideCreditGuard(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Credit Committee Authorization: Override customer credit ceiling</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Line Item Inputs */}
              <div className="border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider block mb-2">
                  Line Item & Tonnage
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-slate-600 font-medium mb-1">Item Aggregate *</label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedItemId(id);
                        const sel = items.find((i) => i.item_id === id);
                        if (sel) setUnitPrice(sel.sales_price);
                      }}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                    >
                      {items.map((i) => (
                        <option key={i.item_id} value={i.item_id}>
                          {i.item_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Quantity (MT) *</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.01"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Rate (৳ BDT) *</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      required
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">VAT (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={vatPct}
                      onChange={(e) => setVatPct(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Justification when overrides are engaged */}
              {(hasStockDeficit || isCreditExceeded) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                  <label className="block text-amber-900 font-bold mb-1">
                    Supervisory Override Justification Note *
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Enter approval note, board resolution, or director sign-off..."
                    className="w-full p-2 rounded border border-amber-300 bg-white text-slate-900 text-xs"
                    required={hasStockDeficit || isCreditExceeded}
                  />
                </div>
              )}

              {/* Financial Calculation Summary */}
              <div className="p-3 bg-slate-900 text-white rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Receivable Amount</span>
                  <span className="text-slate-300 text-[11px]">
                    Subtotal: {formatBDT(subtotal)} {vatPct > 0 && `+ VAT (${vatPct}%): ${formatBDT(vatAmount)}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Computed Grand Total</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatBDT(lineTotal)}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    (hasStockDeficit && !overrideStockGuard) ||
                    (isCreditExceeded && !overrideCreditGuard)
                  }
                  className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Commercial Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
