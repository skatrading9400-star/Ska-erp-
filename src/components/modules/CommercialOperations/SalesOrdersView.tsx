import React, { useState } from 'react';
import { Plus, Printer, CheckCircle, Clock } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { SalesOrder } from '../../../types/erp';

export const SalesOrdersView: React.FC = () => {
  const { salesOrders, parties, items, warehouses, addSalesOrder, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [partyId, setPartyId] = useState(parties.find((p) => p.party_type === 'customer')?.party_id || '');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.warehouse_id || '');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.item_id || '');
  const [quantity, setQuantity] = useState(1000);
  const [unitPrice, setUnitPrice] = useState(items[0]?.sales_price || 3850);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  const customers = parties.filter((p) => p.party_type === 'customer');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = parties.find((p) => p.party_id === partyId);
    const wh = warehouses.find((w) => w.warehouse_id === warehouseId);
    const itm = items.find((i) => i.item_id === selectedItemId);

    if (!customer || !wh || !itm) return;

    const lineTotal = quantity * unitPrice;
    const orderNo = `SO-2026-${String(salesOrders.length + 125).padStart(4, '0')}`;

    addSalesOrder({
      order_no: orderNo,
      party_id: customer.party_id,
      party_name: customer.trade_name,
      warehouse_id: wh.warehouse_id,
      warehouse_name: wh.warehouse_name,
      order_date: new Date().toISOString().split('T')[0],
      delivery_deadline: deadline,
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
      delivered_quantity: 0,
      status: 'approved',
    });

    setIsModalOpen(false);
  };

  const columns: Column<SalesOrder>[] = [
    {
      key: 'order_no',
      header: 'Sales Order #',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'party_name',
      header: 'Customer',
      className: 'font-semibold',
    },
    {
      key: 'order_date',
      header: 'Order Date',
    },
    {
      key: 'delivery_deadline',
      header: 'Delivery Deadline',
    },
    {
      key: 'warehouse_name',
      header: 'Fulfillment Depot',
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
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Commercial Sales Orders"
        subtitle="Manage aggregate supply contracts, client delivery schedules, and fulfillment."
        columns={columns}
        data={salesOrders}
        searchKeys={['order_no', 'party_name', 'warehouse_name']}
        statusKey="status"
        statusOptions={['draft', 'approved', 'closed']}
        exportFileName="SalesOrders"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Order</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Create Commercial Sales Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Customer *</label>
                  <select
                    value={partyId}
                    onChange={(e) => setPartyId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.party_id} value={c.party_id}>
                        {c.trade_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fulfillment Depot *</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Item / Aggregate *</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedItemId(id);
                    const it = items.find((i) => i.item_id === id);
                    if (it) setUnitPrice(it.sales_price);
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
                  <label className="block text-slate-700 font-semibold mb-1">Quantity (Tons/CFT) *</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Agreed Rate (৳ BDT) *</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Delivery Deadline *</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center text-xs">
                <span className="text-slate-600">Calculated Value:</span>
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
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
