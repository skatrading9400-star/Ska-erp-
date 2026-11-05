import React from 'react';
import { History, Shield, Lock, Download } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { AuditLogEntry } from '../../../types/erp';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useERP();

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      className: 'font-mono text-slate-600',
    },
    {
      key: 'user_name',
      header: 'Operator / User',
      className: 'font-semibold text-slate-900',
    },
    {
      key: 'action_type',
      header: 'Action',
      render: (row) => {
        let color = 'bg-slate-100 text-slate-800';
        if (row.action_type === 'POST') color = 'bg-emerald-100 text-emerald-800 font-bold';
        if (row.action_type === 'APPROVE') color = 'bg-blue-100 text-blue-800 font-bold';
        if (row.action_type === 'REJECT') color = 'bg-rose-100 text-rose-800 font-bold';
        return <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${color}`}>{row.action_type}</span>;
      },
    },
    {
      key: 'table_name',
      header: 'Entity / Table',
      render: (row) => <span className="font-mono text-xs text-slate-700">{row.table_name}</span>,
    },
    {
      key: 'record_id',
      header: 'Record Identifier',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'summary',
      header: 'Audit Event Summary',
      render: (row) => <span className="text-slate-700">{row.summary}</span>,
    },
    {
      key: 'client_ip',
      header: 'Client IP',
      className: 'font-mono text-slate-400 text-[11px]',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Immutable Audit Log:</strong> Append-only event trail recording every creation, GL
            posting, weighing sensor receipt, and approval decision with timestamp & client IP.
          </span>
        </div>
      </div>

      <DataGrid
        title="System Governance Audit Trail"
        subtitle="Complete chronological transaction log for compliance and internal auditor inspection."
        columns={columns}
        data={auditLogs}
        searchKeys={['record_id', 'user_name', 'action_type', 'summary', 'table_name']}
        exportFileName="Audit_Trail_Log"
      />
    </div>
  );
};
