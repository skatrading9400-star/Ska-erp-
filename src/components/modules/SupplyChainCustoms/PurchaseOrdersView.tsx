import React, { useState } from 'react';
import { Plus, Printer, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { PurchaseOrder } from '../../../types/erp';

interface PurchaseOrdersViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({ onOpenPrintModal }) => {
  const { purchaseOrders, parties, items, warehouses, addPurchaseOrder, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState(parties.find((p) => p.party_type === 'supplier')?.party_id || '');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.warehouse_id || '');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.item_id || '');
  const [quantity, setQuantity] = useState(500);
  const [unitPrice, setUnitPrice] = useState(2850);
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  const suppliers = parties.filter((p) => p.party_type === 'supplier');

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = parties.find((p) => p.party_id === supplierId);
    const wh = warehouses.find((w) => w.warehouse_id === warehouseId);
    const itm = items.find((i) => i.item_id === selectedItemId);

    if (!sup || !wh || !itm) return;

    const lineTotal = quantity * unitPrice;
    const poNo = `PO-2026-${String(purchaseOrders.length + 90).padStart(3, '0')}`;
    const needsApproval = lineTotal > 500000;

    addPurchaseOrder({
      po_no: poNo,
      party_id: sup.party_id,
      party_name: sup.trade_name,
      warehouse_id: wh.warehouse_id,
      warehouse_name: wh.warehouse_name,
      po_date: new Date().toISOString().split('T')[0],
      expected_delivery: expectedDate,
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
      grand_total: lineTotal,
      status: needsApproval ? 'pending_approval' : 'approved',
    });

    setIsModalOpen(false);
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'po_no',
      header: 'PO Number',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'party_name',
      header: 'Quarry / Supplier',
      className: 'font-semibold',
    },
    {
      key: 'po_date',
      header: 'PO Date',
    },
    {
      key: 'expected_delivery',
      header: 'Expected Delivery',
    },
    {
      key: 'warehouse_name',
      header: 'Receiving Depot',
    },
    {
      key: 'grand_total',
      header: 'Total Order (৳)',
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
        <button
          onClick={() => onOpenPrintModal('Purchase Order', row)}
          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          title="Print Official Purchase Order"
        >
          <Printer className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Procurement Policy:</strong> Purchase Orders exceeding ৳ 5,00,000 automatically route to
          the Managing Director's Approval Inbox. Purchase Orders do not increase physical inventory until
          Goods Receipt Note (GRN) is executed.
        </span>
      </div>

      <DataGrid
        title="Procurement Purchase Orders"
        subtitle="Manage bulk Indian quarry agreements, rebar procurement, and supplier contracts."
        columns={columns}
        data={purchaseOrders}
        searchKeys={['po_no', 'party_name', 'warehouse_name']}
        statusKey="status"
        statusOptions={['draft', 'pending_approval', 'approved', 'closed']}
        exportFileName="PurchaseOrders"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Purchase Order</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Issue Procurement Purchase Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quarry / Supplier *</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Target Receiving Depot *</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.warehouse_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item to Procure *</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Order Quantity (Tons) *</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Rate (৳ BDT) *</label>
                  <input
                    type="number"
                    min="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    required
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expected Delivery Date *</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  required
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-600 block">Total Commitment:</span>
                  {quantity * unitPrice > 500000 && (
                    <span className="text-[10px] text-amber-700 font-medium">
                      ⚠️ Exceeds ৳ 5L: Requires MD Approval
                    </span>
                  )}
                </div>
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
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
