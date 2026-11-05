import React, { useState } from 'react';
import { Ship, DollarSign, FileCheck, Layers, ArrowRight } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';

export const ImportOperationsView: React.FC = () => {
  const { importHeaders, formatBDT } = useERP();

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Cross-Border Import Dossier & Landed Cost Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking LC Margin, Bill of Entry, Indian Basalt Quarry Consignments via Bhomra Land Port, Customs Duty & Capitalized Landed Costs.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Base FX Rate</span>
            <span className="font-mono font-bold text-slate-900">1 USD = 122.50 BDT</span>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded">
            <span className="text-blue-700 block text-[10px] uppercase font-bold">Active Land Port</span>
            <span className="font-semibold text-blue-950">Bhomra (Satkhira)</span>
          </div>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-4">
        {importHeaders.map((imp) => (
          <div key={imp.import_header_id} className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-blue-900">{imp.import_ref_no}</span>
                <span className="text-xs font-semibold text-slate-800">{imp.supplier_name}</span>
                <StatusBadge status={imp.shipment_status} />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span>
                  LC: <strong className="text-slate-900">{imp.lc_no}</strong>
                </span>
                <span>
                  Inv: <strong className="text-slate-900">{imp.commercial_invoice_no}</strong>
                </span>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Items in Consignment */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">
                  1. Declared Cargo & HS Code
                </h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  {imp.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>{item.item_name}</span>
                        <span className="font-mono text-blue-900">{item.declared_tonnage} MT</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>HS Tariff: {item.hs_code}</span>
                        <span>FOB: ${item.unit_price_usd}/MT</span>
                      </div>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200">
                        <span className="text-slate-600">Discharged Received:</span>
                        <span className="font-bold font-mono text-emerald-700">{item.received_tonnage} MT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landed Cost Breakdown */}
              <div className="md:col-span-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">
                  2. Capitalized Landed Cost Allocation (BDT)
                </h4>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="p-2">Cost Head</th>
                        <th className="p-2">Beneficiary / Agency</th>
                        <th className="p-2 text-right">Amount (৳ BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {imp.landed_costs.map((cost, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-900">{cost.cost_head}</td>
                          <td className="p-2 text-slate-500">{cost.vendor_name}</td>
                          <td className="p-2 text-right font-mono font-semibold">{formatBDT(cost.amount_bdt)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                        <td colSpan={2} className="p-2 text-right uppercase text-[11px]">
                          Total Capitalized Landed Cost:
                        </td>
                        <td className="p-2 text-right font-mono text-blue-900 text-sm">
                          {formatBDT(imp.total_landed_cost_bdt)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
