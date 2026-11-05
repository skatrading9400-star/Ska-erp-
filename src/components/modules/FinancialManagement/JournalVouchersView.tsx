import React, { useState } from 'react';
import { Plus, Printer, CheckCircle, AlertCircle, FileText, Trash2 } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { JournalVoucher, JournalLine } from '../../../types/erp';

interface JournalVouchersViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const JournalVouchersView: React.FC<JournalVouchersViewProps> = ({ onOpenPrintModal }) => {
  const { journalVouchers, chartOfAccounts, addJournalVoucher, postJournalVoucher, formatBDT } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [voucherType, setVoucherType] = useState<'Journal' | 'Payment' | 'Receipt'>('Journal');
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState<Omit<JournalLine, 'journal_line_id'>[]>([
    {
      account_id: chartOfAccounts[0]?.account_id || '',
      account_code: chartOfAccounts[0]?.account_code || '1110',
      account_name: chartOfAccounts[0]?.account_name || 'Cash on Hand',
      debit_amount: 0,
      credit_amount: 0,
      narration: '',
    },
    {
      account_id: chartOfAccounts[1]?.account_id || '',
      account_code: chartOfAccounts[1]?.account_code || '1120',
      account_name: chartOfAccounts[1]?.account_name || 'Prime Bank Ltd',
      debit_amount: 0,
      credit_amount: 0,
      narration: '',
    },
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + (Number(l.debit_amount) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (Number(l.credit_amount) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001 && totalDebit > 0;

  const handlePost = (voucherId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const res = postJournalVoucher(voucherId);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to post voucher to General Ledger.');
    } else {
      setSuccessMessage('Journal voucher successfully validated and posted to General Ledger.');
    }
  };

  const handleAddLine = () => {
    const defaultAcc = chartOfAccounts[0];
    setLines([
      ...lines,
      {
        account_id: defaultAcc?.account_id || '',
        account_code: defaultAcc?.account_code || '1110',
        account_name: defaultAcc?.account_name || 'Cash on Hand',
        debit_amount: 0,
        credit_amount: 0,
        narration: '',
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) {
      setErrorMessage('A valid double-entry voucher requires at least two balanced entry lines.');
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isBalanced) {
      setErrorMessage(
        `Double Entry Imbalance Violation: Total Debits (৳ ${totalDebit.toLocaleString()}) must match Total Credits (৳ ${totalCredit.toLocaleString()}).`
      );
      return;
    }

    const vNo = `JV-2026-${String(journalVouchers.length + 146).padStart(5, '0')}`;
    addJournalVoucher({
      voucher_no: vNo,
      voucher_type: voucherType,
      voucher_date: voucherDate,
      narration,
      total_debit: totalDebit,
      total_credit: totalCredit,
      is_posted: false,
      status: 'approved',
      created_by: 'Finance Division Desk',
      lines: lines.map((l, idx) => ({
        ...l,
        journal_line_id: `jvl-${Date.now()}-${idx}`,
      })),
    });

    setIsModalOpen(false);
    setNarration('');
    setLines([
      {
        account_id: chartOfAccounts[0]?.account_id || '',
        account_code: chartOfAccounts[0]?.account_code || '1110',
        account_name: chartOfAccounts[0]?.account_name || 'Cash on Hand',
        debit_amount: 0,
        credit_amount: 0,
        narration: '',
      },
      {
        account_id: chartOfAccounts[1]?.account_id || '',
        account_code: chartOfAccounts[1]?.account_code || '1120',
        account_name: chartOfAccounts[1]?.account_name || 'Prime Bank Ltd',
        debit_amount: 0,
        credit_amount: 0,
        narration: '',
      },
    ]);
  };

  const columns: Column<JournalVoucher>[] = [
    {
      key: 'voucher_no',
      header: 'Voucher #',
      className: 'font-mono font-bold text-slate-900',
    },
    {
      key: 'voucher_type',
      header: 'Type',
      render: (row) => <span className="font-semibold text-slate-700">{row.voucher_type}</span>,
    },
    {
      key: 'voucher_date',
      header: 'Voucher Date',
    },
    {
      key: 'narration',
      header: 'Narration & Description',
      render: (row) => <span className="text-slate-600 line-clamp-1">{row.narration}</span>,
    },
    {
      key: 'total_debit',
      header: 'Balanced Total Amount',
      render: (row) => <span className="font-mono font-bold text-slate-900">{formatBDT(row.total_debit)}</span>,
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
        <div className="flex items-center gap-2">
          {!row.is_posted ? (
            <button
              onClick={() => handlePost(row.journal_id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-600 transition-colors shadow-2xs"
              title="Verify and commit balance directly to the General Ledger"
            >
              Post to GL
            </button>
          ) : (
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Immutable GL Record
            </span>
          )}
          <button
            onClick={() => onOpenPrintModal('Journal Voucher', row)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="Print Official balanced accounting voucher"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-slate-100 p-3.5 rounded border border-slate-800 text-xs flex items-center gap-2.5 shadow-sm">
        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>IFRS Balanced Ledger Rule:</strong> Direct element overrides or structural deletion of posted records is programmatically blocked. Corrections require explicit approval adjustments to satisfy financial accounting audit controls.
        </span>
      </div>

      {(errorMessage || successMessage) && (
        <div className="space-y-2">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      )}

      <DataGrid
        title="General Journal Ledger Vouchers"
        subtitle="Execute balanced adjustments, direct entries, accruals, and sub-ledger balancing segments."
        columns={columns}
        data={journalVouchers}
        searchKeys={['voucher_no', 'voucher_type', 'narration']}
        statusKey="status"
        statusOptions={['draft', 'approved', 'posted']}
        exportFileName="Journal_Vouchers_Register"
        actionButton={
          <button
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Journal Voucher</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                New Double-Entry Accounting Voucher
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Voucher Class Category *</label>
                  <select
                    value={voucherType}
                    onChange={(e: any) => setVoucherType(e.target.value)}
                    className="w-full p-2 bg-white rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  >
                    <option value="Journal">General Journal (JV)</option>
                    <option value="Payment">Bank / Cash Payment Voucher</option>
                    <option value="Receipt">Bank / Cash Receipt Voucher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Posting Entry Date *</label>
                  <input
                    type="date"
                    required
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transaction Narration Header *</label>
                  <input
                    type="text"
                    required
                    placeholder="Provide official transactional audit summary..."
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  />
                </div>
              </div>

              {/* Editable Lines Grid */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">
                    Ledger Allocation Rows (Balanced Matrix)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <Plus className="w-3 h-3" /> Append Account Row
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {lines.map((line, idx) => (
                    <div key={idx} className="p-2.5 flex items-center gap-2 bg-white hover:bg-slate-50">
                      <div className="flex-1">
                        <select
                          value={line.account_id}
                          onChange={(e) => {
                            const accId = e.target.value;
                            const acc = chartOfAccounts.find((a) => a.account_id === accId);
                            const updated = [...lines];
                            if (acc) {
                              updated[idx].account_id = acc.account_id;
                              updated[idx].account_code = acc.account_code;
                              updated[idx].account_name = acc.account_name;
                            }
                            setLines(updated);
                          }}
                          className="w-full p-1.5 bg-white rounded border border-slate-300 text-xs text-slate-900 focus:outline-none"
                        >
                          {chartOfAccounts.map((a) => (
                            <option key={a.account_id} value={a.account_id}>
                              {a.account_code} - {a.account_name} [{a.account_group.toUpperCase()}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Debit (৳)"
                          min="0"
                          step="0.01"
                          value={line.debit_amount || ''}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            const updated = [...lines];
                            updated[idx].debit_amount = val;
                            if (val > 0) updated[idx].credit_amount = 0;
                            setLines(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 text-xs font-mono text-right focus:outline-none text-slate-900"
                        />
                      </div>

                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Credit (৳)"
                          min="0"
                          step="0.01"
                          value={line.credit_amount || ''}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value));
                            const updated = [...lines];
                            updated[idx].credit_amount = val;
                            if (val > 0) updated[idx].debit_amount = 0;
                            setLines(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 text-xs font-mono text-right focus:outline-none text-slate-900"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                        title="Delete entry row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Balance Footer */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-semibold text-slate-700">Balance Integrity Check:</span>
                    {isBalanced ? (
                      <span className="font-sans text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> ✓ Balanced Matrix Match
                      </span>
                    ) : (
                      <span className="font-sans text-rose-700 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> ⚠️ Out of Balance Ledger Drift: ৳{' '}
                        {Math.abs(totalDebit - totalCredit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Total Debits</span>
                      <span className="font-bold text-slate-900">{formatBDT(totalDebit)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Total Credits</span>
                      <span className="font-bold text-slate-900">{formatBDT(totalCredit)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                >
                  Cancel View
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-4 py-1.5 rounded bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-xs"
                >
                  Save Balanced Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
