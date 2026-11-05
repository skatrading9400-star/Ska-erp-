import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  FileText,
  Truck,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building,
  Users,
  Package,
  Layers,
  Scale,
  Ship,
  ArrowRightLeft,
  Sliders,
  FolderKanban,
  CheckSquare,
  History,
  Hash,
  Menu,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activeHub, activeSubModule, setActiveHubAndModule, approvals } = useERP();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  const [expandedHubs, setExpandedHubs] = useState<Record<string, boolean>>({
    executive: true,
    commercial: true,
    supply_chain: true,
    financial: true,
    governance: true,
  });

  const toggleHub = (hubKey: string) => {
    setExpandedHubs((prev) => ({ ...prev, [hubKey]: !prev[hubKey] }));
  };

  const navHubs = [
    {
      key: 'executive',
      title: 'Executive & Intelligence',
      icon: Briefcase,
      modules: [
        { key: 'executive_workspace', label: 'Executive Workspace', icon: TrendingUp },
        { key: 'tender_intelligence', label: 'Tender Intelligence & e-GP', icon: ShieldCheck },
        { key: 'projects', label: 'Projects & Contracts', icon: FolderKanban },
      ],
    },
    {
      key: 'commercial',
      title: 'Commercial Operations',
      icon: TrendingUp,
      modules: [
        { key: 'customers', label: 'Customer Directory', icon: Building },
        { key: 'crm_leads', label: 'CRM Leads & Pipeline', icon: Users },
        { key: 'sales_quotations', label: 'Sales Quotations', icon: FileText },
        { key: 'sales_orders', label: 'Sales Orders', icon: FileText },
        { key: 'delivery_challans', label: 'Delivery Challans (Gate Pass)', icon: Truck },
        { key: 'sales_invoices', label: 'Sales Invoices & Billing', icon: DollarSign },
      ],
    },
    {
      key: 'supply_chain',
      title: 'Supply Chain & Customs',
      icon: Truck,
      modules: [
        { key: 'suppliers', label: 'Supplier Quarry Master', icon: Building },
        { key: 'items', label: 'Item & Material Catalog', icon: Package },
        { key: 'warehouse_stock', label: 'Depot Stock & Valuation', icon: Layers },
        { key: 'stock_transfers', label: 'Inter-Depot Transfers', icon: ArrowRightLeft },
        { key: 'stock_adjustments', label: 'Stock Audit & Variance', icon: Sliders },
        { key: 'purchase_orders', label: 'Purchase Orders', icon: FileText },
        { key: 'grn', label: 'Goods Received Note (GRN)', icon: FileText },
        { key: 'purchase_invoices', label: 'Purchase Invoices (Vendor Bills)', icon: DollarSign },
        { key: 'import_operations', label: 'Imports & Landed Cost', icon: Ship },
        { key: 'weighbridge', label: 'Weighbridge Scale Logs', icon: Scale },
      ],
    },
    {
      key: 'financial',
      title: 'Financial Management',
      icon: DollarSign,
      modules: [
        { key: 'chart_of_accounts', label: 'Chart of Accounts', icon: Layers },
        { key: 'journal_vouchers', label: 'Journal Vouchers (Double Entry)', icon: FileText },
        { key: 'general_ledger', label: 'General Ledger Drill-down', icon: History },
        { key: 'cash_bank', label: 'Cash & Bank Treasury', icon: DollarSign },
        { key: 'budgets', label: 'Budgets & Variances', icon: TrendingUp },
      ],
    },
    {
      key: 'governance',
      title: 'System & Governance',
      icon: Settings,
      modules: [
        {
          key: 'approval_center',
          label: 'Approval Workflow Center',
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
        },
        { key: 'company_branches', label: 'Company & Depots', icon: Building },
        { key: 'user_management', label: 'Users & Role Permissions', icon: Users },
        { key: 'audit_trail', label: 'Audit Trail Logs', icon: History },
        { key: 'document_sequences', label: 'Document Numbering & Sequences', icon: Hash },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#0F172A] text-[#94A3B8] border-r border-slate-800 flex flex-col transition-all duration-200 select-none ${
        isCollapsed ? 'w-14' : 'w-64'
      } shrink-0 shadow-xl`}
    >
      {/* Sidebar Top Toggle Header */}
      <div className="h-14 px-3 border-b border-slate-800 flex items-center justify-between text-xs text-[#94A3B8]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#1E40AF] text-[#FFFFFF] font-mono font-bold text-xs flex items-center justify-center shadow-inner">
              SKA
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-xs tracking-tight">SKA NEXUS ERP</span>
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#94A3B8]">Enterprise v4.2</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors ml-auto text-[#94A3B8]"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Hubs & Modules Tree */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-3 text-xs scrollbar-thin">
        {navHubs.map((hub) => {
          const HubIcon = hub.icon;
          const isExpanded = expandedHubs[hub.key] !== false;
          const isCurrentHub = activeHub === hub.key;

          return (
            <div key={hub.key} className="space-y-0.5">
              {/* Hub Accordion Header */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleHub(hub.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isCurrentHub ? 'text-white bg-slate-800/70' : 'text-[#94A3B8] hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HubIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>{hub.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              ) : (
                <div
                  onClick={() => toggleHub(hub.key)}
                  className="w-10 h-8 flex items-center justify-center mx-auto text-blue-400 hover:bg-slate-800 rounded cursor-pointer"
                  title={hub.title}
                >
                  <HubIcon className="w-4 h-4" />
                </div>
              )}

              {/* Module Links */}
              {(!isCollapsed ? isExpanded : true) && (
                <div className="space-y-0.5 pl-1">
                  {hub.modules.map((mod) => {
                    const ModIcon = mod.icon;
                    const isActive = activeHub === hub.key && activeSubModule === mod.key;

                    return (
                      <button
                        key={mod.key}
                        onClick={() => setActiveHubAndModule(hub.key, mod.key)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all text-left text-xs ${
                          isActive
                            ? 'bg-[#1E40AF] text-[#FFFFFF] font-semibold shadow-xs'
                            : 'text-[#94A3B8] hover:bg-slate-800/80 hover:text-white font-medium'
                        }`}
                        title={mod.label}
                      >
                        <ModIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-[#FFFFFF]' : 'text-[#94A3B8] group-hover:text-white'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{mod.label}</span>}
                        {!isCollapsed && mod.badge !== undefined && (
                          <span className="ml-auto px-1.5 py-0.2 bg-[#FEF3C7] text-[#D97706] font-bold rounded text-[10px] border border-[#FDE68A]">
                            {mod.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 text-[11px] text-[#94A3B8] flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#059669]" />
            <span className="font-medium text-slate-300">Clearing Engine</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">PORT 3000</span>
        </div>
      )}
    </aside>
  );
};
