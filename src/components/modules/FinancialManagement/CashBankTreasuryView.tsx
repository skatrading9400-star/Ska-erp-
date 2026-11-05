import React, { useState } from 'react';
import { Plus, DollarSign, ArrowDownLeft, ArrowUpRight, Building2, CheckCircle } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { CashTransaction } from '../../../types/erp';

export const CashBankTreasuryView: React.FC = () => {
  const { cashTransactions, parties, chartOfAccounts, addCashTransaction, postCashTransaction, formatBDT } =
    useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [txType, setTxType] = useState<'Customer Collection' | 'Supplier Payment' | 'Depot Expense'>('Customer Collection');
  const [selectedBankAccId, setSelectedBankAccId] = useState('acc-1120'); // Prime Bank
  const [partyId, setPartyId] = useState(parties[0]?.party_id || '');
  const [method, setMethod] = useState<'Bank Transfer' | 'RTGS' | 'Cheque' | 'Cash' | 'LC'>('Bank Transfer');
  const [amount, setAmount] = useState(250000);
  const [chequeNo, setChequeNo] = useState('');
  const [narration, setNarration] = useState('');

  const bankAccounts = chartOfAccounts.filter(
    (a) => a.account_code === '1110' || a.account_code === '1120' || a.account_code === '1130'
  );

  const handlePost = (id: string) => {
    postCashTransaction(id);
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find((p) => p.party_id === partyId);
    const bankAcc = chartOfAccounts.find((a) => a.account_id === selectedBankAccId);
    const vNo = `${txType === 'Customer Collection' ? 'CR' : 'CP'}-2026-${String(cashTransactions.length + 315).padStart(5, '0')}`;

    addCashTransaction({
      voucher_no: vNo,
      transaction_type: txType,
      account_id: bankAcc ? bankAcc.account_id : 'acc-1120',
      account_name: bankAcc ? bankAcc.account_name : 'Prime Bank Ltd',
      party_id: party?.party_id,
      party_name: party?.trade_name,
      payment_method: method,
      amount,
      cheque_no: chequeNo,
      transaction_date: new Date().toISOString().split('T')[0],
      narration: narration || `${txType} via ${method}`,
      status: 'approved',
      is_posted: false,
    });

    setIsModalOpen(false);
  };

  const columns: Column<CashTransaction>[] = [
    {
      key: 'voucher_no',
      header: 'Voucher #',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'transaction_type',
      header: 'Transaction Type',
      render: (row) => (
        <span className="flex items-center gap-1 font-semibold text-slate-800">
          {row.transaction_type.includes('Collection') ? (
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
          )}
          {row.transaction_type}
        </span>
      ),
    },
    {
      key: 'account_name',
      header: 'Cash / Bank A/C',
      render: (row) => <span className="font-medium text-slate-900">{row.account_name}</span>,
    },
    {
      key: 'party_name',
      header: 'Counterparty',
      render: (row) => <span className="text-slate-700">{row.party_name || 'Internal/Operational'}</span>,
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (row) => <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono">{row.payment_method}</span>,
    },
    {
      key: 'amount',
      header: 'Amount (৳ BDT)',
      render: (row) => (
        <span
          className={`font-mono font-bold ${
            row.transaction_type.includes('Collection') ? 'text-emerald-700' : 'text-slate-900'
          }`}
        >
          {formatBDT(row.amount)}
        </span>
      ),
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
      render: (row) =>
        !row.is_posted ? (
          <button
            onClick={() => handlePost(row.cash_transaction_id)}
            className="px-2 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-600 shadow-2xs"
          >
            Post
          </button>
        ) : (
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Posted
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Liquid Account Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Prime Bank Ltd (A/C: 104-110-58291)
          </span>
          <span className="text-xl font-bold font-mono text-blue-900 mt-1 block">
            {formatBDT(1420000)}
          </span>
          <span className="text-[11px] text-slate-500">Corporate Current Account</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Islami Bank BD Ltd (A/C: 205-9921)
          </span>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
            {formatBDT(780000)}
          </span>
          <span className="text-[11px] text-slate-500">Import LC & Border Operations</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Cash on Hand (HQ & Yard Vaults)
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {formatBDT(280000)}
          </span>
          <span className="text-[11px] text-slate-500">Depot petty cash & weighbridge</span>
        </div>
      </div>

      <DataGrid
        title="Treasury & Cash / Bank Transactions"
        subtitle="Customer collections, supplier payments, cheque clearances, and RTGS settlements."
        columns={columns}
        data={cashTransactions}
        searchKeys={['voucher_no', 'transaction_type', 'account_name', 'party_name']}
        statusKey="status"
        statusOptions={['draft', 'pending_approval', 'approved', 'posted']}
        exportFileName="Cash_Transactions"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Cash / Bank Voucher</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">New Treasury Cash / Bank Voucher</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transaction Category *</label>
                  <select
                    value={txType}
                    onChange={(e: any) => setTxType(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="Customer Collection">Customer Collection</option>
                    <option value="Supplier Payment">Supplier Payment</option>
                    <option value="Depot Expense">Depot Operational Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bank / Cash Account *</label>
                  <select
                    value={selectedBankAccId}
                    onChange={(e) => setSelectedBankAccId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.account_id} value={b.account_id}>
                        {b.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Counterparty (PartyMaster)</label>
                <select
                  value={partyId}
                  onChange={(e) => setPartyId(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                >
                  {parties.map((p) => (
                    <option key={p.party_id} value={p.party_id}>
                      {p.trade_name} ({p.party_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Instrument *</label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer (EFT/NPSB)</option>
                    <option value="RTGS">RTGS Real-Time Settlement</option>
                    <option value="Cheque">Corporate Account Cheque</option>
                    <option value="Cash">Cash Receipt / Payment</option>
                    <option value="LC">Letter of Credit (LC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount (৳ BDT) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {method === 'Cheque' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cheque Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CHQ-928102"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Narration & Notes</label>
                <input
                  type="text"
                  placeholder="Reference invoice, challan, or purpose..."
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
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
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
