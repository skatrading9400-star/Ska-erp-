import React, { useState } from 'react';
import { Plus, Building, Phone, Mail, MapPin, DollarSign, CreditCard } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { PartyMaster } from '../../../types/erp';

export const CustomerDirectoryView: React.FC = () => {
  const { parties, addParty, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [tradeName, setTradeName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [creditLimit, setCreditLimit] = useState(10000000);
  const [paymentTermsDays, setPaymentTermsDays] = useState(30);

  const customers = parties.filter((p) => p.party_type === 'customer');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `CUST-${String(customers.length + 1).padStart(3, '0')}`;

    addParty({
      party_type: 'customer',
      party_code: newCode,
      trade_name: tradeName,
      legal_name: legalName || tradeName,
      contact_person: contactPerson,
      phone,
      email,
      address,
      division,
      district,
      credit_allowed: true,
      credit_limit: creditLimit,
      payment_terms_days: paymentTermsDays,
      outstanding_balance: 0,
      is_active: true,
    });

    setIsModalOpen(false);
    setTradeName('');
    setPhone('');
    setAddress('');
  };

  const columns: Column<PartyMaster>[] = [
    {
      key: 'party_code',
      header: 'Party Code',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'trade_name',
      header: 'Customer Trade Name',
      className: 'font-semibold',
    },
    {
      key: 'contact_person',
      header: 'Primary Contact',
    },
    {
      key: 'phone',
      header: 'Phone / Mobile',
      render: (row) => <span className="font-mono text-slate-600">{row.phone}</span>,
    },
    {
      key: 'district',
      header: 'District / Div',
      render: (row) => `${row.district}, ${row.division}`,
    },
    {
      key: 'credit_limit',
      header: 'Credit Limit (৳)',
      render: (row) => <span className="font-mono text-slate-700">{formatBDT(row.credit_limit, true)}</span>,
    },
    {
      key: 'outstanding_balance',
      header: 'Outstanding (৳ BDT)',
      render: (row) => (
        <span
          className={`font-mono font-bold ${
            row.outstanding_balance > row.credit_limit * 0.8
              ? 'text-rose-700'
              : 'text-slate-900'
          }`}
        >
          {formatBDT(row.outstanding_balance)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Customer Directory (PartyMaster)"
        subtitle="Manage government contractors, bridge consortiums, credit limits, and outstanding balances."
        columns={columns}
        data={customers}
        searchKeys={['party_code', 'trade_name', 'contact_person', 'phone', 'district']}
        exportFileName="Customers_Directory"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Customer Party</span>
          </button>
        }
      />

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">Register Customer (PartyMaster)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Trade Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mir Akhter Fortress JV"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
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
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Phone *</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Division</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Narsingdi"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Site / Billing Address</label>
                <input
                  type="text"
                  placeholder="Camp site or corporate head office"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Credit Limit (৳ BDT)</label>
                  <input
                    type="number"
                    step="500000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Terms (Days)</label>
                  <input
                    type="number"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
