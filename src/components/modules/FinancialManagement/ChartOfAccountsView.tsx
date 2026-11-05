import React, { useState } from 'react';
import { Layers, Plus, Folder, FileText, CheckCircle, Lock } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { ChartOfAccount } from '../../../types/erp';

export const ChartOfAccountsView: React.FC = () => {
  const { chartOfAccounts, formatBDT } = useERP();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const groups = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'COGS', 'Operating Expenses'];

  const filteredAccounts = selectedGroup === 'all'
    ? chartOfAccounts
    : chartOfAccounts.filter((a) => a.account_group === selectedGroup);

  const columns: Column<ChartOfAccount>[] = [
    {
      key: 'account_code',
      header: 'GL Code',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'account_name',
      header: 'Account Title',
      className: 'font-semibold',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.is_control_account ? (
            <Folder className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <span>{row.account_name}</span>
        </div>
      ),
    },
    {
      key: 'account_group',
      header: 'Classification',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
          {row.account_group}
        </span>
      ),
    },
    {
      key: 'allow_posting',
      header: 'Posting Status',
      render: (row) =>
        row.allow_posting ? (
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Direct Posting
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Lock className="w-3 h-3" /> Control Account
          </span>
        ),
    },
    {
      key: 'current_balance',
      header: 'Current Balance (৳ BDT)',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900">{formatBDT(row.current_balance)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Classification Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-lg border border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
          Account Class:
        </span>
        <button
          onClick={() => setSelectedGroup('all')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            selectedGroup === 'all'
              ? 'bg-blue-800 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All (1000–6000)
        </button>
        {groups.map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              selectedGroup === grp
                ? 'bg-blue-800 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      <DataGrid
        title="Chart of Accounts (COA)"
        subtitle="Canonical hierarchical general ledger classification system supporting standard GAAP double-entry posting."
        columns={columns}
        data={filteredAccounts}
        searchKeys={['account_code', 'account_name', 'account_group']}
        exportFileName="Chart_of_Accounts"
      />
    </div>
  );
};
