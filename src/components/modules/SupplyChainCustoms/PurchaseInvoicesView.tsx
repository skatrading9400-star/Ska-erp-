import React, { useState } from 'react';
import { Plus, Printer, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { PurchaseInvoice } from '../../../types/erp';

interface PurchaseInvoicesViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const PurchaseInvoicesView: React.FC<PurchaseInvoicesViewProps> = ({ onOpenPrintModal }) => {
  const { purchaseInvoices, parties, items, warehouses, addPurchaseInvoice, postPurchaseInvoice, formatBDT } =
    useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState(parties.find((p) => p.party_type === 'supplier')?.party_id || '');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.warehouse_id || '');
  const [supplierBillNo, setSupplierBillNo] = useState('BILL-PKR-2026-904');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.item_id || '');
  const [quantity, setQuantity] = useState(300);
  const [unitPrice, setUnitPrice] = useState(2850);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
  );

  const suppliers = parties.filter((p) => p.party_type === 'supplier');

  const handlePost = (invoiceId: string) => {
    const res = postPurchaseInvoice(invoiceId);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = parties.find((p) => p.party_id === supplierId);
    const wh = warehouses.find((w) => w.warehouse_id === warehouseId);
    const itm = items.find((i) => i.item_id === selectedItemId);

    if (!sup || !wh || !itm) return;

    const lineTotal = quantity * unitPrice;
    const invNo = `PINV-2026-${String(purchaseInvoices.length + 45).padStart(4, '0')}`;

    addPurchaseInvoice({
      invoice_no: invNo,
      party_id: sup.party_id,
      party_name: sup.trade_name,
      warehouse_id: wh.warehouse_id,
      warehouse_name: wh.warehouse_name,
      invoice_date: invoiceDate,
      due_date: dueDate,
      supplier_bill_no: supplierBillNo,
      subtotal: lineTotal,
      vat_amount: 0,
      grand_total: lineTotal,
      paid_amount: 0,
      due_amount: lineTotal,
      status: 'approved',
      is_posted: false,
      items: [
        {
          item_id: itm.item_id,
          item_name: itm.item_name,
          quantity,
          unit_code: itm.unit_code,
          unit_price: unitPrice,
          line_total: lineTotal,
        },
      ],
    });

    setIsModalOpen(false);
  };

  const columns: Column<PurchaseInvoice>[] = [
    {
      key: 'invoice_no',
      header: 'Purchase Inv #',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'supplier_bill_no',
      header: 'Supplier Bill #',
      render: (row) => <span className="font-mono text-slate-700">{row.supplier_bill_no}</span>,
    },
    {
      key: 'party_name',
      header: 'Supplier / Quarry',
      className: 'font-semibold',
    },
    {
      key: 'invoice_date',
      header: 'Invoice Date',
    },
    {
      key: 'due_date',
      header: 'Payment Due',
    },
    {
      key: 'grand_total',
      header: 'Total Payable (৳)',
      render: (row) => <span className="font-mono font-bold">{formatBDT(row.grand_total)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.is_posted ? (
            <button
              onClick={() => handlePost(row.purchase_invoice_id)}
              className="px-2 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-600 transition-colors shadow-2xs"
              title="Post vendor bill to Accounts Payable & GL"
            >
              Post to AP
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Posted
            </span>
          )}
          <button
            onClick={() => onOpenPrintModal('Purchase Order', row)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="View Bill Voucher"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 border border-slate-300 p-3 rounded text-xs text-slate-800 flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-600 shrink-0" />
        <span>
          <strong>Accounting Segregation Notice:</strong> Purchase Invoices are completely distinct from
          Sales Invoices. Posting a Purchase Invoice Debits Inventory Valuation (A/C 1300) and Credits
          Accounts Payable (A/C 2100).
        </span>
      </div>

      <DataGrid
        title="Purchase Invoices & Vendor Bills"
        subtitle="Manage supplier billing, trade creditor liabilities, and 3-way matching with GRN & Purchase Orders."
        columns={columns}
        data={purchaseInvoices}
        searchKeys={['invoice_no', 'supplier_bill_no', 'party_name', 'warehouse_name']}
        statusKey="status"
        statusOptions={['draft', 'approved', 'posted']}
        exportFileName="PurchaseInvoices"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Vendor Bill</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Record Vendor Purchase Invoice / Bill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.party_id} value={s.party_id}>
                        {s.trade_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier's Bill # *</label>
                  <input
                    type="text"
                    required
                    value={supplierBillNo}
                    onChange={(e) => setSupplierBillNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billed Material *</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedItemId(id);
                    const it = items.find((i) => i.item_id === id);
                    if (it) setUnitPrice(it.standard_cost);
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Invoiced Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Purchase Cost (৳) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <span className="text-slate-600">Total Billed Liability:</span>
                <span className="text-base font-bold font-mono text-blue-900">
                  {formatBDT(quantity * unitPrice)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white font-semibold"
                >
                  Save Vendor Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
