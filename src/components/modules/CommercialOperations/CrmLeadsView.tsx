import React, { useState } from 'react';
import { Plus, Users, TrendingUp, Phone, Mail, Building } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { Lead } from '../../../types/erp';

export const CrmLeadsView: React.FC = () => {
  const { leads, opportunities, addLead, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(15000000);
  const [notes, setNotes] = useState('');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `LD-2026-${String(leads.length + 95).padStart(3, '0')}`;

    addLead({
      lead_code: newCode,
      company_name: companyName,
      contact_person: contactPerson,
      phone,
      email,
      assigned_to: 'Tanvir Hossain (Sales Lead)',
      estimated_value: estimatedValue,
      source: 'Government Project Directory / e-GP',
      status: 'Qualified',
      notes,
    });

    setIsModalOpen(false);
    setCompanyName('');
    setContactPerson('');
    setPhone('');
    setNotes('');
  };

  const columns: Column<Lead>[] = [
    {
      key: 'lead_code',
      header: 'Lead Code',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'company_name',
      header: 'Prospective Client',
      className: 'font-semibold',
    },
    {
      key: 'contact_person',
      header: 'Contact Person',
    },
    {
      key: 'phone',
      header: 'Phone / Email',
      render: (row) => (
        <div>
          <span className="font-mono text-slate-800">{row.phone}</span>
          <span className="block text-[10px] text-slate-400">{row.email}</span>
        </div>
      ),
    },
    {
      key: 'estimated_value',
      header: 'Est. Deal Value (৳)',
      render: (row) => <span className="font-mono font-bold">{formatBDT(row.estimated_value, true)}</span>,
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Active Leads
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{leads.length}</span>
          <span className="text-[11px] text-slate-400">Total verified inquiries</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Commercial Pipeline Value
          </span>
          <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">
            {formatBDT(
              opportunities.reduce((acc, o) => acc + o.estimated_amount, 0),
              true
            )}
          </span>
          <span className="text-[11px] text-slate-400">Negotiations in progress</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Weighted Win Rate
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">68.4%</span>
          <span className="text-[11px] text-slate-400">Government & EPC projects</span>
        </div>
      </div>

      <DataGrid
        title="CRM Commercial Leads & Opportunities"
        subtitle="Track prospective infrastructure builders, expressway tenders, and volume negotiations."
        columns={columns}
        data={leads}
        searchKeys={['lead_code', 'company_name', 'contact_person', 'phone']}
        statusKey="status"
        statusOptions={['Qualified', 'Proposal Sent', 'Converted']}
        exportFileName="CRM_Leads"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Add CRM Lead Inquiry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Contractor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRBC China Road & Bridge"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Engr. Project Director"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1711..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Demand (৳ BDT)</label>
                  <input
                    type="number"
                    step="500000"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Requirement Notes & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Material specs, tonnage required, delivery camp location..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
