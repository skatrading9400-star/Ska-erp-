import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Package,
  ArrowUpRight,
  ShieldAlert,
  Truck,
  CheckSquare,
  Scale,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../common/StatusBadge';

interface ExecutiveDashboardProps {
  onOpenApprovalModal: (request: any) => void;
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenApprovalModal,
  onOpenPrintModal,
}) => {
  const {
    company,
    activeRole,
    selectedBranchId,
    branches,
    selectedFiscalPeriod,
    approvals,
    weighbridgeLogs,
    tenders,
    formatBDT,
    setActiveHubAndModule,
  } = useERP();

  const branchName =
    selectedBranchId === 'all'
      ? 'All Branches & Depots'
      : branches.find((b) => b.branch_id === selectedBranchId)?.branch_name || 'All Branches';

  const pendingApprovals = approvals.filter((a) => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Workspace Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Executive Financial Workspace</h1>
            <span className="text-[11px] bg-slate-100 text-[#475569] border border-[#E2E8F0] font-semibold px-2 py-0.5 rounded capitalize">
              Role: {activeRole.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Operating Entity: <span className="font-semibold text-slate-800">{company.company_name}</span> · Depot Branch:{' '}
            <span className="font-semibold text-slate-800">{branchName}</span> · Period:{' '}
            <span className="font-semibold font-mono text-slate-800">{selectedFiscalPeriod}</span>
          </p>
        </div>

        {/* Banking Status Indicator (Success: #059669 text on #D1FAE5 bg) */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Core Ledger: Reconciled &amp; Online
          </span>
        </div>
      </div>

      {/* 4 Core Financial & Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Cash & Bank */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                Cash &amp; Bank
              </span>
              <div className="w-7 h-7 rounded-md bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            {/* Main Numeric Balance/Values: Deep Charcoal #0F172A, font-bold */}
            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#0F172A]">
              {formatBDT(48265400)}
            </div>
          </div>
          {/* Sub-text/Labels: Muted Slate Gray #64748B */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Available liquid balance</span>
            <button
              onClick={() => setActiveHubAndModule('financial', 'cash_bank')}
              className="text-[#1E40AF] hover:text-blue-900 font-semibold inline-flex items-center gap-0.5"
            >
              Treasury <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: Sales Invoiced (MTD) */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                Sales This Month
              </span>
              <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-[#1E40AF]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#0F172A]">
              {formatBDT(39250000)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Certified tax invoices</span>
            <button
              onClick={() => setActiveHubAndModule('commercial', 'sales_invoices')}
              className="text-[#1E40AF] hover:text-blue-900 font-semibold inline-flex items-center gap-0.5"
            >
              Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: Receivables Exposure */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                Accounts Receivable
              </span>
              <div className="w-7 h-7 rounded-md bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#0F172A]">
              {formatBDT(84518920)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Customer credit exposure</span>
            <button
              onClick={() => setActiveHubAndModule('commercial', 'customers')}
              className="text-[#1E40AF] hover:text-blue-900 font-semibold inline-flex items-center gap-0.5"
            >
              Parties <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 4: Inventory Yard Valuation */}
        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
                Inventory Valuation
              </span>
              <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center text-purple-700">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#0F172A]">
              {formatBDT(118465000)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Weighted average cost (WAC)</span>
            <button
              onClick={() => setActiveHubAndModule('supply_chain', 'warehouse_stock')}
              className="text-[#1E40AF] hover:text-blue-900 font-semibold inline-flex items-center gap-0.5"
            >
              Depots <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Action Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveHubAndModule('commercial', 'sales_invoices')}
          className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:border-blue-700 hover:shadow-xs transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-md bg-blue-50 text-[#1E40AF] flex items-center justify-center shrink-0 group-hover:bg-[#1E40AF] group-hover:text-white transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">Commercial Tax Invoices</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Issue &amp; post sales revenue</p>
          </div>
        </button>

        <button
          onClick={() => setActiveHubAndModule('supply_chain', 'purchase_orders')}
          className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:border-blue-700 hover:shadow-xs transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-md bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 group-hover:bg-[#059669] group-hover:text-white transition-colors">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">Quarry Procurement &amp; GRN</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">PO contracts &amp; vendor bills</p>
          </div>
        </button>

        <button
          onClick={() => setActiveHubAndModule('financial', 'cash_bank')}
          className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:border-blue-700 hover:shadow-xs transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 group-hover:bg-[#D97706] group-hover:text-white transition-colors">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">Cash &amp; Bank Treasury</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">RTGS collections &amp; payments</p>
          </div>
        </button>

        <button
          onClick={() => setActiveHubAndModule('governance', 'approval_center')}
          className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] hover:border-amber-500 hover:shadow-xs transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 group-hover:bg-[#D97706] group-hover:text-white transition-colors">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#0F172A]">Dual Approvals</h4>
              <span className="px-1.5 py-0.2 rounded bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] font-bold text-[10px]">
                {pendingApprovals.length} Pending
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">Purchase Orders &amp; Journals</p>
          </div>
        </button>
      </div>

      {/* Main Grid: Pending Approvals Queue & Live Weighbridge Scales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Pending Approvals Queue (2 cols) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Dual Maker-Checker Approval Inbox
              </h3>
            </div>
            <button
              onClick={() => setActiveHubAndModule('governance', 'approval_center')}
              className="text-xs font-semibold text-[#1E40AF] hover:text-blue-900 flex items-center gap-0.5"
            >
              Open Inbox <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-[#E2E8F0] flex-1">
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B]">
                All maker-checker dual approvals are current and reconciled.
              </div>
            ) : (
              pendingApprovals.map((req) => (
                <div key={req.approval_request_id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#0F172A]">{req.document_type}</span>
                      <span className="font-mono text-xs font-bold text-[#1E40AF]">{req.document_no}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Originator: <span className="font-medium text-slate-800">{req.requested_by}</span> ·{' '}
                      {req.details}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold font-mono text-[#0F172A]">{formatBDT(req.amount)}</p>
                    <button
                      onClick={() => onOpenApprovalModal(req)}
                      className="mt-1 px-3 py-1 bg-[#1E40AF] hover:bg-blue-900 text-white font-medium text-xs rounded-md transition-colors shadow-2xs"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Bhomra & Noapara Weighbridge Scale Log */}
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#1E40AF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Live Depot Scales
              </h3>
            </div>
            <button
              onClick={() => setActiveHubAndModule('supply_chain', 'weighbridge')}
              className="text-xs font-semibold text-[#1E40AF] hover:text-blue-900 flex items-center gap-0.5"
            >
              All Tickets <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-[#E2E8F0] flex-1">
            {weighbridgeLogs.slice(0, 3).map((wb) => (
              <div key={wb.weighbridge_log_id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#0F172A] bg-slate-100 px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                      {wb.truck_no}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">{wb.scale_ticket_no}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    {wb.item_name} · Driver: {wb.driver_name}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{wb.weight_date}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-[#0F172A]">{wb.net_weight} MT</span>
                  <p className="text-[10px] text-[#64748B]">Net Scale Cargo</p>
                  <button
                    onClick={() => onOpenPrintModal('Weighbridge Ticket', wb)}
                    className="text-[10px] text-[#1E40AF] hover:underline mt-0.5 block font-medium"
                  >
                    Print Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tender Intelligence & BOQ Alert Section */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Government Tender &amp; Mega-Project Intelligence (e-GP)
            </h3>
          </div>
          <button
            onClick={() => setActiveHubAndModule('executive', 'tender_intelligence')}
            className="text-xs font-semibold text-[#1E40AF] hover:text-blue-900"
          >
            Open Tender Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {tenders.map((t) => (
            <div key={t.tender_id} className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#1E40AF]">{t.egp_tender_id}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="font-bold text-[#0F172A] leading-snug">{t.project_name}</p>
              <p className="text-xs text-[#64748B]">{t.procuring_entity}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
                <span className="text-[#64748B]">
                  Estimated Value:{' '}
                  <strong className="text-[#0F172A] font-mono">{formatBDT(t.estimated_value, true)}</strong>
                </span>
                <span className="text-rose-700 font-semibold">Closes: {t.closing_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
