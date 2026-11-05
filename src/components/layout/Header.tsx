import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Search,
  Bell,
  CheckSquare,
  User,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types/erp';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const {
    company,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedFiscalPeriod,
    setSelectedFiscalPeriod,
    activeRole,
    setActiveRole,
    currentUser,
    approvals,
    notifications,
    markNotificationRead,
    setActiveHubAndModule,
  } = useERP();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: UserRole; label: string }[] = [
    { role: 'managing_director', label: 'Managing Director' },
    { role: 'finance_accountant', label: 'Finance / Accountant' },
    { role: 'sales_manager', label: 'Sales Manager' },
    { role: 'purchase_manager', label: 'Purchase Manager' },
    { role: 'inventory_manager', label: 'Inventory / Yard Supervisor' },
    { role: 'tender_officer', label: 'Tender Officer' },
    { role: 'auditor', label: 'Auditor' },
    { role: 'super_admin', label: 'Super Admin' },
  ];

  return (
    <header className="h-14 bg-[#FFFFFF] text-slate-800 border-b border-[#E2E8F0] flex items-center justify-between px-5 z-40 select-none shadow-xs">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#1E40AF] flex items-center justify-center font-bold text-xs tracking-wider shadow-inner text-white">
            SKA
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#0F172A]">SKA NEXUS ERP</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-[#1E40AF] border border-blue-200 rounded font-semibold">
                v4.2
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium">{company.company_name}</p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-[#64748B] font-medium">Branch:</span>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-transparent text-[#0F172A] font-semibold focus:outline-none cursor-pointer text-xs pr-1"
          >
            <option value="all">All Branches & Depots</option>
            {branches.map((b) => (
              <option key={b.branch_id} value={b.branch_id}>
                {b.branch_name}
              </option>
            ))}
          </select>
        </div>

        {/* Fiscal Period Selector */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-2.5 py-1">
          <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedFiscalPeriod}
            onChange={(e) => setSelectedFiscalPeriod(e.target.value)}
            className="bg-transparent text-[#0F172A] font-semibold focus:outline-none cursor-pointer text-xs pr-1"
          >
            <option value="FY 2026-27 (Nov 2026)">FY 2026-27 · November 2026</option>
            <option value="FY 2026-27 (Oct 2026)">FY 2026-27 · October 2026</option>
            <option value="FY 2025-26 (Audited)">FY 2025-26 (Closed & Audited)</option>
          </select>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] rounded-md text-xs text-[#64748B] focus:outline-none focus:border-blue-700 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Search vouchers, customers, items, PO, challans...</span>
          </div>
          <kbd className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-[#E2E8F0] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Approvals, Notifications, Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Approvals Warning Badge Indicator (#D97706 on #FEF3C7) */}
        <button
          onClick={() => setActiveHubAndModule('governance', 'approval_center')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border ${
            pendingApprovalsCount > 0
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706] hover:bg-amber-100'
              : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-700'
          }`}
          title="Centralized Approvals Inbox"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Approvals:</span>
          <span className="bg-[#D97706] text-white font-bold px-1.5 py-0.2 rounded text-[10px]">
            {pendingApprovalsCount}
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#E2E8F0] text-slate-900 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#0F172A]">Notification Center</span>
                <span className="text-[10px] text-[#64748B]">{notifications.length} alerts</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.linkModule) {
                        if (notif.linkModule === 'approvals') setActiveHubAndModule('governance', 'approval_center');
                        if (notif.linkModule === 'tender_intelligence') setActiveHubAndModule('executive', 'tender_intelligence');
                        if (notif.linkModule === 'import_operations') setActiveHubAndModule('supply_chain', 'import_operations');
                      }
                      setShowNotifications(false);
                    }}
                    className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                      !notif.read ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[#0F172A]">{notif.title}</p>
                      <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[#64748B] mt-1 leading-snug">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] rounded-md text-xs transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-[#1E40AF] flex items-center justify-center text-white text-[10px] font-bold">
              <User className="w-3 h-3" />
            </div>
            <div className="text-left leading-tight hidden xl:block">
              <p className="font-bold text-[#0F172A] text-[11px] truncate max-w-[120px]">
                {currentUser.full_name}
              </p>
              <p className="text-[10px] text-[#64748B] capitalize font-medium">
                {activeRole.replace(/_/g, ' ')}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#E2E8F0] text-slate-900 z-50 overflow-hidden text-xs">
              <div className="p-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider block">
                  Switch Active Role
                </span>
                <p className="text-[#64748B] text-[11px] mt-0.5">
                  Verify user permissions & module security.
                </p>
              </div>
              <div className="py-1">
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setActiveRole(item.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      activeRole === item.role ? 'bg-blue-50/70 font-bold text-[#1E40AF]' : 'text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeRole === item.role && (
                      <span className="w-2 h-2 rounded-full bg-[#1E40AF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
