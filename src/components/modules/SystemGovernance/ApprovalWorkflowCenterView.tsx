import React from 'react';
import { CheckSquare, AlertTriangle, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { ApprovalRequest } from '../../../types/erp';

interface ApprovalWorkflowCenterViewProps {
  onOpenApprovalModal: (request: ApprovalRequest) => void;
}

export const ApprovalWorkflowCenterView: React.FC<ApprovalWorkflowCenterViewProps> = ({
  onOpenApprovalModal,
}) => {
  const { approvals, formatBDT } = useERP();

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'Approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'Rejected').length;

  const columns: Column<ApprovalRequest>[] = [
    {
      key: 'document_no',
      header: 'Doc Number',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'document_type',
      header: 'Document Class',
      className: 'font-semibold',
    },
    {
      key: 'department',
      header: 'Department',
    },
    {
      key: 'requested_by',
      header: 'Requester',
      render: (row) => <span className="text-slate-800 font-medium">{row.requested_by}</span>,
    },
    {
      key: 'amount',
      header: 'Amount (৳ BDT)',
      render: (row) => <span className="font-mono font-bold">{formatBDT(row.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Decision Action',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => onOpenApprovalModal(row)}
          className={`px-3 py-1 text-xs font-semibold rounded shadow-2xs transition-colors ${
            row.status === 'Pending'
              ? 'bg-blue-700 hover:bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {row.status === 'Pending' ? 'Review & Approve' : 'View Decision'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Pending Inbox
            </span>
            <span className="text-2xl font-bold font-mono text-amber-600 block mt-0.5">
              {pendingCount} Requests
            </span>
            <span className="text-[11px] text-slate-400">Requires executive signature</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Approved
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-700 block mt-0.5">
              {approvedCount} Documents
            </span>
            <span className="text-[11px] text-slate-400">Cleared for posting/dispatch</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Rejected / Returned
            </span>
            <span className="text-2xl font-bold font-mono text-slate-700 block mt-0.5">
              {rejectedCount} Documents
            </span>
            <span className="text-[11px] text-slate-400">Returned to maker for amendment</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      <DataGrid
        title="Centralized Approval Workflow Center"
        subtitle="Maker-checker segregation, financial authorization thresholds, and audit review queue."
        columns={columns}
        data={approvals}
        searchKeys={['document_no', 'document_type', 'requested_by', 'department']}
        statusKey="status"
        statusOptions={['Pending', 'Approved', 'Rejected', 'Returned']}
        exportFileName="Approval_Queue"
      />
    </div>
  );
};
