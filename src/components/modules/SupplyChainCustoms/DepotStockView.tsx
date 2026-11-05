import React, { useState } from 'react';
import { Layers, Building2, Package, ArrowUpRight, Filter } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { WarehouseStock } from '../../../types/erp';

export const DepotStockView: React.FC = () => {
  const { warehouseStock, warehouses, formatBDT } = useERP();
  const [selectedDepot, setSelectedDepot] = useState<string>('all');

  const filteredStock = selectedDepot === 'all'
    ? warehouseStock
    : warehouseStock.filter((ws) => ws.warehouse_id === selectedDepot);

  const totalStockValuation = filteredStock.reduce((acc, ws) => acc + ws.total_valuation, 0);

  const columns: Column<WarehouseStock>[] = [
    {
      key: 'warehouse_name',
      header: 'Depot / Yard Location',
      className: 'font-semibold',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.warehouse_name}</span>
          <span className="block text-[10px] text-slate-400 font-mono">{row.warehouse_code}</span>
        </div>
      ),
    },
    {
      key: 'item_code',
      header: 'Item Code',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'item_name',
      header: 'Material Aggregate',
      className: 'font-semibold',
    },
    {
      key: 'quantity',
      header: 'Stock On Hand',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {row.quantity.toLocaleString()} MT/CFT
        </span>
      ),
    },
    {
      key: 'average_cost',
      header: 'WAC Rate (৳)',
      render: (row) => <span className="font-mono text-slate-600">{formatBDT(row.average_cost)}</span>,
    },
    {
      key: 'total_valuation',
      header: 'Stock Valuation (৳ BDT)',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800">{formatBDT(row.total_valuation)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Depot Selector & Valuation */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Multi-Depot Inventory Valuation (WAC)
            </h2>
            <p className="text-xs text-slate-500">
              Live stock balances across Bhomra Port, Noapara River Ghat, Mongla, and Sylhet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedDepot}
              onChange={(e) => setSelectedDepot(e.target.value)}
              className="p-1.5 rounded border border-slate-300 text-slate-900 bg-white font-medium text-xs"
            >
              <option value="all">All Depots Consolidated</option>
              {warehouses.map((w) => (
                <option key={w.warehouse_id} value={w.warehouse_id}>
                  {w.warehouse_name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2 px-3 bg-indigo-50 border border-indigo-200 rounded text-right">
            <span className="text-[10px] uppercase font-bold text-indigo-700 block">Total Valuation</span>
            <span className="font-mono font-bold text-indigo-950 text-sm">
              {formatBDT(totalStockValuation, true)}
            </span>
          </div>
        </div>
      </div>

      <DataGrid
        title="Depot Stock Ledger & Inventory Valuation"
        subtitle="Weighted Average Cost (WAC) per depot enclosure."
        columns={columns}
        data={filteredStock}
        searchKeys={['warehouse_name', 'item_code', 'item_name']}
        exportFileName="Depot_Stock_Valuation"
      />
    </div>
  );
};
