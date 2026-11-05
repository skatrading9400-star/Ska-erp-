import React, { useState } from 'react';
import { X, CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ApprovalRequest } from '../../types/erp';

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ApprovalRequest | null;
}

export const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const { processApproval, formatBDT } = useERP();
  const [comment, setComment] = useState('');

  if (!isOpen || !request) return null;

  const handleAction = (action: 'Approve' | 'Reject' | 'Return') => {
    processApproval(request.approval_request_id, action, comment);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold tracking-tight">Review Approval Request</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Document Type
                </span>
                <p className="text-sm font-bold text-slate-900">{request.document_type}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Document No.
                </span>
                <p className="text-sm font-mono font-bold text-blue-900">{request.document_no}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-500">Requested By:</span>{' '}
                <span className="font-semibold text-slate-800">{request.requested_by}</span>
              </div>
              <div>
                <span className="text-slate-500">Amount:</span>{' '}
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatBDT(request.amount)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-slate-600 font-medium block mb-1">Details & Justification:</span>
            <p className="text-slate-700 bg-slate-50/80 p-2.5 rounded border border-slate-200 leading-relaxed">
              {request.details}
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Decision Note / Reviewer Comments:
            </label>
            <textarea
              rows={3}
              placeholder="Enter note or rationale (required for rejection/return)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={() => handleAction('Return')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return for Correction</span>
          </button>
          <button
            onClick={() => handleAction('Reject')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-100 hover:bg-rose-200 rounded transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
          <button
            onClick={() => handleAction('Approve')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded transition-colors shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approve Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
