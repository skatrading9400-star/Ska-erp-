import React, { useState } from 'react';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { Item } from '../../../types/erp';

export const ItemsCatalogView: React.FC = () => {
  const { items, addItem, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [categoryName, setCategoryName] = useState('Crushed Stone Aggregates');
  const [unitCode, setUnitCode] = useState('MT');
  const [specification, setSpecification] = useState('');
  const [standardCost, setStandardCost] = useState(3200);
  const [salesPrice, setSalesPrice] = useState(3800);
  const [reorderLevel, setReorderLevel] = useState(1500);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      item_code: itemCode.toUpperCase(),
      item_name: itemName,
      category_id: 'cat-custom',
      category_name: categoryName,
      unit_id: 'u-custom',
      unit_code: unitCode,
      specification,
      standard_cost: standardCost,
      sales_price: salesPrice,
      reorder_level: reorderLevel,
      total_stock: 0,
      is_active: true,
    });
    setIsModalOpen(false);
    setItemCode('');
    setItemName('');
    setSpecification('');
  };

  const columns: Column<Item>[] = [
    {
      key: 'item_code',
      header: 'Item Code',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'item_name',
      header: 'Material Description',
      className: 'font-semibold',
    },
    {
      key: 'category_name',
      header: 'Category',
      render: (row) => <span className="text-slate-600">{row.category_name}</span>,
    },
    {
      key: 'unit_code',
      header: 'Unit',
      render: (row) => <span className="font-mono text-slate-700">{row.unit_code}</span>,
    },
    {
      key: 'standard_cost',
      header: 'WAC Cost (৳)',
      render: (row) => <span className="font-mono">{formatBDT(row.standard_cost)}</span>,
    },
    {
      key: 'sales_price',
      header: 'Benchmark Price (৳)',
      render: (row) => <span className="font-mono font-semibold text-blue-900">{formatBDT(row.sales_price)}</span>,
    },
    {
      key: 'total_stock',
      header: 'Total Stock',
      render: (row) => (
        <span
          className={`font-mono font-bold ${
            row.total_stock <= row.reorder_level ? 'text-amber-700' : 'text-slate-900'
          }`}
        >
          {row.total_stock.toLocaleString()} {row.unit_code}
        </span>
      ),
    },
    {
      key: 'reorder_level',
      header: 'Reorder Level',
      render: (row) => <span className="font-mono text-slate-500">{row.reorder_level.toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Item Master & Material Catalog"
        subtitle="Canonical master definitions for Pakur basalt stones, river boulders, coarse sand, and deformed rebars."
        columns={columns}
        data={items}
        searchKeys={['item_code', 'item_name', 'category_name']}
        exportFileName="Item_Master_Catalog"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Item Master</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Register Item Master</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Item Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKR-10MM"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit of Measure *</label>
                  <select
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="MT">Metric Ton (MT)</option>
                    <option value="CFT">Cubic Feet (CFT)</option>
                    <option value="KG">Kilogram (KG)</option>
                    <option value="BAG">50 KG Cement Bag</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pakur Black Stone 10mm"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Crushed Stone Aggregates">Crushed Stone Aggregates</option>
                  <option value="Raw River Boulders & Quarry Rocks">Raw River Boulders & Quarry Rocks</option>
                  <option value="River & Sylhet Coarse Sand">River & Sylhet Coarse Sand</option>
                  <option value="Reinforcing Deformed Bars (TMT/Rebar)">Reinforcing Deformed Bars (TMT/Rebar)</option>
                  <option value="OPC & PCC Bulk Cement">OPC & PCC Bulk Cement</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Technical Specification</label>
                <input
                  type="text"
                  placeholder="Gradation, specific gravity, quarry source..."
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Standard Cost (৳)</label>
                  <input
                    type="number"
                    value={standardCost}
                    onChange={(e) => setStandardCost(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sales Rate (৳)</label>
                  <input
                    type="number"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
