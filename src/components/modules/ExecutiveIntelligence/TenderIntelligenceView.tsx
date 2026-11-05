import React, { useState } from 'react';
import { Plus, ShieldAlert, FileText, Layers, CheckCircle2, Calendar, Download } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { TenderRecord } from '../../../types/erp';

export const TenderIntelligenceView: React.FC = () => {
  const { tenders, addTender, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [egpId, setEgpId] = useState('');
  const [procuringEntity, setProcuringEntity] = useState('');
  const [projectName, setProjectName] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(50000000);
  const [securityAmount, setSecurityAmount] = useState(1000000);

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    addTender({
      egp_tender_id: egpId,
      procuring_entity: procuringEntity,
      ministry_name: 'Ministry of Road Transport and Bridges',
      project_name: projectName,
      work_description: workDescription,
      closing_date: closingDate,
      estimated_value: estimatedValue,
      security_amount: securityAmount,
      status: 'BOQ Analyzed',
      materials_demanded: [
        { item_name: 'Pakur Black Stone 20mm', estimated_qty_tons: 15000, target_rate_bdt: 3850 },
        { item_name: 'Sylhet Coarse Sand FM 2.5', estimated_qty_tons: 8000, target_rate_bdt: 950 },
      ],
    });

    setIsModalOpen(false);
  };

  const columns: Column<TenderRecord>[] = [
    {
      key: 'egp_tender_id',
      header: 'e-GP Tender ID',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'project_name',
      header: 'Government Project & Work Scope',
      className: 'font-semibold',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 leading-tight block">{row.project_name}</span>
          <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{row.work_description}</span>
        </div>
      ),
    },
    {
      key: 'procuring_entity',
      header: 'Procuring Entity',
      render: (row) => <span className="text-slate-700">{row.procuring_entity}</span>,
    },
    {
      key: 'closing_date',
      header: 'Closing Deadline',
      render: (row) => (
        <span className="font-mono text-rose-700 font-semibold flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {row.closing_date}
        </span>
      ),
    },
    {
      key: 'estimated_value',
      header: 'Est. Value (৳)',
      render: (row) => <span className="font-mono font-bold text-slate-900">{formatBDT(row.estimated_value, true)}</span>,
    },
    {
      key: 'status',
      header: 'Tender Stage',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Workflow Explanation Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
          Government Tender → BOQ Material Demand Workflow
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200">1. e-GP Tracking</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800">
            2. BOQ Extraction & Material Mapping
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-800">
            3. Supplier Rate & Landed Cost Simulation
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
            4. Commercial Bid / Supply Contract
          </span>
        </div>
      </div>

      <DataGrid
        title="Government Tender & e-GP Intelligence"
        subtitle="RHD, LGED, Bangladesh Bridge Authority, and Railway mega project procurement tracking."
        columns={columns}
        data={tenders}
        searchKeys={['egp_tender_id', 'project_name', 'procuring_entity']}
        statusKey="status"
        statusOptions={['Published', 'BOQ Analyzed', 'Quotation Prepared', 'Bid Submitted', 'Awarded']}
        exportFileName="Tenders_Register"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register e-GP Tender</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Register Government e-GP Tender</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">e-GP Tender ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e-GP/RHD/..."
                    value={egpId}
                    onChange={(e) => setEgpId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Procuring Entity / Agency *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roads and Highways Department (RHD), Sylhet"
                  value={procuringEntity}
                  onChange={(e) => setProcuringEntity(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka-Sylhet 4-Lane Sub-Base Supply"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Description & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, tonnage required, BOQ details..."
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Value (৳ BDT)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tender Security (৳)</label>
                  <input
                    type="number"
                    step="100000"
                    value={securityAmount}
                    onChange={(e) => setSecurityAmount(Number(e.target.value))}
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
                  Save Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
