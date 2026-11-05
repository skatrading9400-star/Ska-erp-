import React, { useState } from 'react';
import { Plus, CheckSquare, PackageCheck, Truck } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { GoodsReceivedNote } from '../../../types/erp';

export const GrnView: React.FC = () => {
  const { grns, purchaseOrders, addGRN } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedPoId, setSelectedPoId] = useState(purchaseOrders[0]?.purchase_order_id || '');
  const [challanNo, setChallanNo] = useState('SUP-CH-99210');
  const [truckNo, setTruckNo] = useState('WB-57-C-1109');
  const [receivedQty, setReceivedQty] = useState(50);
  const [acceptedQty, setAcceptedQty] = useState(50);
  const [rejectedQty, setRejectedQty] = useState(0);

  const handleCreateGRN = (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find((p) => p.purchase_order_id === selectedPoId);
    if (!po) return;

    const grnNo = `GRN-2026-${String(grns.length + 215).padStart(5, '0')}`;
    const poItem = po.items[0];

    addGRN({
      grn_no: grnNo,
      purchase_order_id: po.purchase_order_id,
      purchase_order_no: po.po_no,
      party_id: po.party_id,
      party_name: po.party_name,
      warehouse_id: po.warehouse_id,
      warehouse_name: po.warehouse_name,
      receipt_date: new Date().toISOString().split('T')[0],
      supplier_challan_no: challanNo,
      truck_no: truckNo,
      status: 'approved',
      items: [
        {
          item_id: poItem ? poItem.item_id : 'itm-01',
          item_name: poItem ? poItem.item_name : 'Pakur Black Stone 20mm',
          received_quantity: receivedQty,
          accepted_quantity: acceptedQty,
          rejected_quantity: rejectedQty,
          unit_code: poItem ? poItem.unit_code : 'MT',
        },
      ],
    });

    setIsModalOpen(false);
  };

  const columns: Column<GoodsReceivedNote>[] = [
    {
      key: 'grn_no',
      header: 'GRN Number',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'purchase_order_no',
      header: 'PO Ref',
      render: (row) => <span className="font-mono text-slate-600">{row.purchase_order_no}</span>,
    },
    {
      key: 'party_name',
      header: 'Supplier / Quarry',
      className: 'font-semibold',
    },
    {
      key: 'warehouse_name',
      header: 'Receiving Depot',
    },
    {
      key: 'truck_no',
      header: 'Truck / Carrier',
      render: (row) => <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{row.truck_no}</span>,
    },
    {
      key: 'accepted',
      header: 'Accepted Cargo',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800">
          {row.items[0]?.accepted_quantity} {row.items[0]?.unit_code}
        </span>
      ),
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
        title="Goods Received Notes (GRN)"
        subtitle="Physical aggregate and material receiving slips that officially increase Depot Stock on Hand."
        columns={columns}
        data={grns}
        searchKeys={['grn_no', 'purchase_order_no', 'party_name', 'truck_no']}
        statusKey="status"
        statusOptions={['draft', 'approved', 'received']}
        exportFileName="GRN_Records"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Receive Goods (GRN)</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Record Physical Goods Receipt Note (GRN)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGRN} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purchase Order Reference *</label>
                <select
                  value={selectedPoId}
                  onChange={(e) => setSelectedPoId(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                >
                  {purchaseOrders.map((po) => (
                    <option key={po.purchase_order_id} value={po.purchase_order_id}>
                      {po.po_no} - {po.party_name} ({po.items[0]?.item_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Supplier Challan / B/L *</label>
                  <input
                    type="text"
                    required
                    value={challanNo}
                    onChange={(e) => setChallanNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Truck Number *</label>
                  <input
                    type="text"
                    required
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Quality Assurance & Quantity Check
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Received Qty *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={receivedQty}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setReceivedQty(val);
                        setAcceptedQty(val - rejectedQty);
                      }}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Accepted Qty *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={acceptedQty}
                      onChange={(e) => setAcceptedQty(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Rejected Qty</label>
                    <input
                      type="number"
                      step="0.01"
                      value={rejectedQty}
                      onChange={(e) => {
                        const rej = Number(e.target.value);
                        setRejectedQty(rej);
                        setAcceptedQty(receivedQty - rej);
                      }}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono text-rose-700"
                    />
                  </div>
                </div>
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
                  Accept & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
