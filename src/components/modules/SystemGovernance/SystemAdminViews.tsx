import React from 'react';
import { Building, Users, Hash, TrendingUp, ShieldCheck, FolderKanban } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { Branch, AppUser, Budget, Project } from '../../../types/erp';

export const CompanyBranchesView: React.FC = () => {
  const { company, branches } = useERP();

  const columns: Column<Branch>[] = [
    { key: 'branch_code', header: 'Branch / Depot Code', className: 'font-mono font-bold text-blue-900' },
    { key: 'branch_name', header: 'Facility Name', className: 'font-semibold' },
    { key: 'address', header: 'Location & Enclosure' },
    { key: 'phone', header: 'Contact Telephone', className: 'font-mono' },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          OPERATIONAL
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Enterprise Headquarters
        </span>
        <h2 className="text-lg font-bold text-slate-900 mt-1">{company.company_name}</h2>
        <p className="text-xs text-slate-600 mt-0.5">{company.address}</p>
        <div className="flex gap-4 mt-2 text-xs font-mono text-slate-600">
          <span>BIN: <strong>{company.bin_no}</strong></span>
          <span>TIN: <strong>{company.tin_no}</strong></span>
          <span>Base Currency: <strong>{company.base_currency_id}</strong></span>
        </div>
      </div>

      <DataGrid
        title="Branches & River Depot Enclosures"
        subtitle="Operational depot yards, weighbridge border stations, and shipping terminals."
        columns={columns}
        data={branches}
        searchKeys={['branch_code', 'branch_name', 'address']}
        exportFileName="Branches_Depots"
      />
    </div>
  );
};

export const UserManagementView: React.FC = () => {
  const { branches } = useERP();

  const usersList: AppUser[] = [
    {
      user_id: 'usr-01',
      username: 'director.ska',
      full_name: 'S. K. Ahmed',
      email: 'sk.ahmed@skatrading.com.bd',
      phone: '+880 1711 000001',
      role: 'managing_director',
      branch_id: 'br-hq',
      is_active: true,
      last_login_at: '2026-11-05 08:30',
    },
    {
      user_id: 'usr-02',
      username: 'finance.lead',
      full_name: 'M. M. Rahman, FCA',
      email: 'finance@skatrading.com.bd',
      phone: '+880 1711 000002',
      role: 'finance_accountant',
      branch_id: 'br-hq',
      is_active: true,
      last_login_at: '2026-11-05 08:45',
    },
    {
      user_id: 'usr-03',
      username: 'sales.lead',
      full_name: 'Tanvir Hossain',
      email: 'sales@skatrading.com.bd',
      phone: '+880 1711 000003',
      role: 'sales_manager',
      branch_id: 'br-hq',
      is_active: true,
      last_login_at: '2026-11-05 09:10',
    },
    {
      user_id: 'usr-04',
      username: 'purchase.lead',
      full_name: 'Kamrul Hasan',
      email: 'procurement@skatrading.com.bd',
      phone: '+880 1711 000004',
      role: 'purchase_manager',
      branch_id: 'br-bhm',
      is_active: true,
    },
    {
      user_id: 'usr-05',
      username: 'yard.supervisor',
      full_name: 'Abdul Malek',
      email: 'yard.bhomra@skatrading.com.bd',
      phone: '+880 1711 000005',
      role: 'inventory_manager',
      branch_id: 'br-bhm',
      is_active: true,
    },
    {
      user_id: 'usr-06',
      username: 'tender.specialist',
      full_name: 'Nazmul Haque, PMP',
      email: 'tenders@skatrading.com.bd',
      phone: '+880 1711 000006',
      role: 'tender_officer',
      branch_id: 'br-hq',
      is_active: true,
    },
  ];

  const columns: Column<AppUser>[] = [
    { key: 'username', header: 'Username', className: 'font-mono font-bold text-blue-900' },
    { key: 'full_name', header: 'Full Name', className: 'font-semibold' },
    { key: 'email', header: 'Corporate Email', className: 'text-slate-600' },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (row) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold uppercase">
          {row.role.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'branch_id',
      header: 'Base Branch',
      render: (row) => branches.find((b) => b.branch_id === row.branch_id)?.branch_name || 'Dhaka Corporate HQ',
    },
    { key: 'last_login_at', header: 'Last Session' },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="User Accounts & Role Based Access Control (RBAC)"
        subtitle="Manage user credentials, division privileges, and security permissions."
        columns={columns}
        data={usersList}
        searchKeys={['username', 'full_name', 'email', 'role']}
        exportFileName="User_Directory"
      />
    </div>
  );
};

export const DocumentSequencesView: React.FC = () => {
  const sequences = [
    { prefix: 'INV-2026-', doc: 'Sales Invoice', current_num: 89, padding: 4, reset: 'Annual' },
    { prefix: 'SO-2026-', doc: 'Sales Order', current_num: 124, padding: 4, reset: 'Annual' },
    { prefix: 'CH-2026-', doc: 'Delivery Challan Gate Pass', current_num: 450, padding: 5, reset: 'Annual' },
    { prefix: 'PO-2026-', doc: 'Purchase Order', current_num: 89, padding: 3, reset: 'Annual' },
    { prefix: 'GRN-2026-', doc: 'Goods Received Note', current_num: 214, padding: 5, reset: 'Annual' },
    { prefix: 'PINV-2026-', doc: 'Purchase Invoice (Vendor Bill)', current_num: 44, padding: 4, reset: 'Annual' },
    { prefix: 'JV-2026-', doc: 'General Journal Voucher', current_num: 145, padding: 5, reset: 'Annual' },
    { prefix: 'BHM-WB-2026-', doc: 'Bhomra Weighbridge Scale Ticket', current_num: 14904, padding: 5, reset: 'Continuous' },
  ];

  const columns: Column<any>[] = [
    { key: 'doc', header: 'Document Type', className: 'font-semibold text-slate-900' },
    { key: 'prefix', header: 'Configured Prefix', className: 'font-mono font-bold text-blue-900' },
    { key: 'current_num', header: 'Current Sequence #', render: (row) => <span className="font-mono">{row.current_num}</span> },
    { key: 'padding', header: 'Digit Padding', render: (row) => <span className="font-mono">{row.padding} digits</span> },
    { key: 'reset', header: 'Frequency', render: (row) => <span className="text-slate-600">{row.reset}</span> },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Document Sequence Numbering Configuration"
        subtitle="Automatic chronological prefix generators for commercial, supply chain, and financial vouchers."
        columns={columns}
        data={sequences}
        searchKeys={['doc', 'prefix']}
        exportFileName="Document_Sequences"
      />
    </div>
  );
};

export const ProjectsView: React.FC = () => {
  const { projects, formatBDT } = useERP();

  const columns: Column<Project>[] = [
    { key: 'project_code', header: 'Project Code', className: 'font-mono font-bold text-blue-900' },
    { key: 'project_name', header: 'Project Title', className: 'font-semibold text-slate-900' },
    { key: 'gov_department', header: 'Agency / Department', className: 'text-slate-700' },
    { key: 'district', header: 'District' },
    {
      key: 'estimated_value',
      header: 'Contract Value (৳)',
      render: (row) => <span className="font-mono font-bold">{formatBDT(row.estimated_value, true)}</span>,
    },
    {
      key: 'completion_pct',
      header: 'Progress',
      render: (row) => (
        <div className="w-28">
          <div className="flex justify-between text-[10px] mb-0.5 font-mono">
            <span>{row.completion_pct}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${row.completion_pct}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-800 border border-blue-200">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Infrastructure Projects & Supply Contracts"
        subtitle="Track major national road, expressway, and bridge construction aggregate demand packages."
        columns={columns}
        data={projects}
        searchKeys={['project_code', 'project_name', 'gov_department']}
        exportFileName="Projects_Register"
      />
    </div>
  );
};

export const BudgetsView: React.FC = () => {
  const { budgets, formatBDT } = useERP();

  const columns: Column<Budget>[] = [
    { key: 'budget_code', header: 'Budget Code', className: 'font-mono font-bold text-blue-900' },
    { key: 'budget_name', header: 'Budget Head / Title', className: 'font-semibold' },
    { key: 'fiscal_year', header: 'Fiscal Year', className: 'font-mono' },
    {
      key: 'allocated_amount',
      header: 'Allocated Budget (৳)',
      render: (row) => <span className="font-mono font-bold">{formatBDT(row.allocated_amount, true)}</span>,
    },
    {
      key: 'utilized_amount',
      header: 'Utilized (৳)',
      render: (row) => <span className="font-mono text-slate-700">{formatBDT(row.utilized_amount, true)}</span>,
    },
    {
      key: 'variance_pct',
      header: 'Utilization %',
      render: (row) => <span className="font-mono font-semibold text-blue-800">{row.variance_pct}%</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataGrid
        title="Fiscal Budgets & Variance Analysis"
        subtitle="Manage logistics freight, depot handling, and administrative expenditure caps."
        columns={columns}
        data={budgets}
        searchKeys={['budget_code', 'budget_name']}
        exportFileName="Budgets_Variance"
      />
    </div>
  );
};
