import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Company,
  Branch,
  AppUser,
  PartyMaster,
  ChartOfAccount,
  JournalVoucher,
  CashTransaction,
  Item,
  Warehouse,
  WarehouseStock,
  SalesOrder,
  DeliveryChallan,
  SalesInvoice,
  PurchaseOrder,
  GoodsReceivedNote,
  PurchaseInvoice,
  WeighbridgeLog,
  ImportHeader,
  TenderRecord,
  Project,
  ApprovalRequest,
  AuditLogEntry,
  Lead,
  Opportunity,
  Budget,
  Employee,
  PayrollEntry,
} from '../types/erp';
import {
  initialCompany,
  initialBranches,
  initialUsers,
  initialParties,
  initialItems,
  initialWarehouses,
  initialWarehouseStock,
  initialChartOfAccounts,
  initialJournalVouchers,
  initialCashTransactions,
  initialSalesOrders,
  initialDeliveryChallans,
  initialSalesInvoices,
  initialPurchaseOrders,
  initialGRNs,
  initialPurchaseInvoices,
  initialWeighbridgeLogs,
  initialImportHeaders,
  initialTenders,
  initialProjects,
  initialApprovals,
  initialAuditLogs,
  initialLeads,
  initialOpportunities,
  initialBudgets,
  initialEmployees,
  initialPayrollEntries,
} from '../data/seedData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  linkModule?: string;
}

interface ERPContextType {
  company: Company;
  branches: Branch[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedFiscalPeriod: string;
  setSelectedFiscalPeriod: (period: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: AppUser;
  activeHub: string;
  activeSubModule: string;
  setActiveHubAndModule: (hub: string, module: string) => void;

  parties: PartyMaster[];
  items: Item[];
  warehouses: Warehouse[];
  warehouseStock: WarehouseStock[];
  chartOfAccounts: ChartOfAccount[];
  journalVouchers: JournalVoucher[];
  cashTransactions: CashTransaction[];
  salesOrders: SalesOrder[];
  deliveryChallans: DeliveryChallan[];
  salesInvoices: SalesInvoice[];
  purchaseOrders: PurchaseOrder[];
  grns: GoodsReceivedNote[];
  purchaseInvoices: PurchaseInvoice[];
  weighbridgeLogs: WeighbridgeLog[];
  importHeaders: ImportHeader[];
  tenders: TenderRecord[];
  projects: Project[];
  approvals: ApprovalRequest[];
  auditLogs: AuditLogEntry[];
  leads: Lead[];
  opportunities: Opportunity[];
  budgets: Budget[];
  employees: Employee[];
  payrollEntries: PayrollEntry[];
  notifications: AppNotification[];

  addParty: (party: Omit<PartyMaster, 'party_id' | 'created_at'>) => void;
  addItem: (item: Omit<Item, 'item_id'>) => void;
  addJournalVoucher: (voucher: Omit<JournalVoucher, 'journal_id' | 'created_at'>) => void;
  postJournalVoucher: (journalId: string) => { success: boolean; error?: string };
  addCashTransaction: (tx: Omit<CashTransaction, 'cash_transaction_id'>) => void;
  postCashTransaction: (txId: string) => void;
  addSalesOrder: (so: Omit<SalesOrder, 'sales_order_id'>) => void;
  addDeliveryChallan: (challan: Omit<DeliveryChallan, 'delivery_challan_id'>) => void;
  addSalesInvoice: (invoice: Omit<SalesInvoice, 'sales_invoice_id'>) => void;
  postSalesInvoice: (invoiceId: string) => { success: boolean; error?: string };
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'purchase_order_id'>) => void;
  addGRN: (grn: Omit<GoodsReceivedNote, 'grn_id'>) => void;
  addPurchaseInvoice: (invoice: Omit<PurchaseInvoice, 'purchase_invoice_id'>) => void;
  postPurchaseInvoice: (invoiceId: string) => { success: boolean; error?: string };
  addWeighbridgeLog: (log: Omit<WeighbridgeLog, 'weighbridge_log_id'>) => void;
  processApproval: (requestId: string, action: 'Approve' | 'Reject' | 'Return', comments?: string) => void;
  addTender: (tender: Omit<TenderRecord, 'tender_id'>) => void;
  addLead: (lead: Omit<Lead, 'lead_id' | 'created_at'>) => void;
  markNotificationRead: (id: string) => void;

  formatBDT: (amount: number, compact?: boolean) => string;
  exportToCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company] = useState<Company>(initialCompany);
  const [branches] = useState<Branch[]>(initialBranches);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedFiscalPeriod, setSelectedFiscalPeriod] = useState<string>('FY 2026-27 (Nov 2026)');
  const [activeRole, setActiveRole] = useState<UserRole>('managing_director');

  const [activeHub, setActiveHub] = useState<string>('executive');
  const [activeSubModule, setActiveSubModule] = useState<string>('executive_workspace');

  const [parties, setParties] = useState<PartyMaster[]>(() => {
    const saved = localStorage.getItem('ska_parties');
    return saved ? JSON.parse(saved) : initialParties;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('ska_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [warehouses] = useState<Warehouse[]>(initialWarehouses);
  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock[]>(() => {
    const saved = localStorage.getItem('ska_wh_stock');
    return saved ? JSON.parse(saved) : initialWarehouseStock;
  });

  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(() => {
    const saved = localStorage.getItem('ska_coa');
    return saved ? JSON.parse(saved) : initialChartOfAccounts;
  });

  const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>(() => {
    const saved = localStorage.getItem('ska_journals');
    return saved ? JSON.parse(saved) : initialJournalVouchers;
  });

  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(() => {
    const saved = localStorage.getItem('ska_cash_tx');
    return saved ? JSON.parse(saved) : initialCashTransactions;
  });

  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem('ska_so');
    return saved ? JSON.parse(saved) : initialSalesOrders;
  });

  const [deliveryChallans, setDeliveryChallans] = useState<DeliveryChallan[]>(() => {
    const saved = localStorage.getItem('ska_challans');
    return saved ? JSON.parse(saved) : initialDeliveryChallans;
  });

  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(() => {
    const saved = localStorage.getItem('ska_inv');
    return saved ? JSON.parse(saved) : initialSalesInvoices;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('ska_po');
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [grns, setGrns] = useState<GoodsReceivedNote[]>(() => {
    const saved = localStorage.getItem('ska_grn');
    return saved ? JSON.parse(saved) : initialGRNs;
  });

  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem('ska_pinv');
    return saved ? JSON.parse(saved) : initialPurchaseInvoices;
  });

  const [weighbridgeLogs, setWeighbridgeLogs] = useState<WeighbridgeLog[]>(() => {
    const saved = localStorage.getItem('ska_wb');
    return saved ? JSON.parse(saved) : initialWeighbridgeLogs;
  });

  const [importHeaders, setImportHeaders] = useState<ImportHeader[]>(() => {
    const saved = localStorage.getItem('ska_imports');
    return saved ? JSON.parse(saved) : initialImportHeaders;
  });

  const [tenders, setTenders] = useState<TenderRecord[]>(() => {
    const saved = localStorage.getItem('ska_tenders');
    return saved ? JSON.parse(saved) : initialTenders;
  });

  const [projects] = useState<Project[]>(initialProjects);

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const saved = localStorage.getItem('ska_approvals');
    return saved ? JSON.parse(saved) : initialApprovals;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('ska_audits');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [opportunities] = useState<Opportunity[]>(initialOpportunities);
  const [budgets] = useState<Budget[]>(initialBudgets);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [payrollEntries] = useState<PayrollEntry[]>(initialPayrollEntries);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Approval Required',
      message: 'Purchase Order PO-2026-089 (৳ 8.5L) from Pakur Basalt requires Managing Director approval.',
      type: 'approval',
      timestamp: '10 mins ago',
      read: false,
      linkModule: 'approvals',
    },
    {
      id: 'notif-2',
      title: 'Tender Closing Soon',
      message: 'e-GP/LGED/JSH/2026/19 for Noapara Corridor closes on 18 Nov 2026.',
      type: 'warning',
      timestamp: '1 hour ago',
      read: false,
      linkModule: 'tender_intelligence',
    },
    {
      id: 'notif-3',
      title: 'Import Clearance',
      message: 'IMP-2026-0042 at Bhomra Land Port cleared customs. 2,840 MT received.',
      type: 'success',
      timestamp: '2 hours ago',
      read: true,
      linkModule: 'import_operations',
    },
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ska_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('ska_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ska_journals', JSON.stringify(journalVouchers));
  }, [journalVouchers]);

  useEffect(() => {
    localStorage.setItem('ska_sales_invoices', JSON.stringify(salesInvoices));
  }, [salesInvoices]);

  useEffect(() => {
    localStorage.setItem('ska_approvals', JSON.stringify(approvals));
  }, [approvals]);

  const currentUser = initialUsers.find((u) => u.role === activeRole) || initialUsers[0];

  const setActiveHubAndModule = (hub: string, module: string) => {
    setActiveHub(hub);
    setActiveSubModule(module);
  };

  const addParty = (partyData: Omit<PartyMaster, 'party_id' | 'created_at'>) => {
    const newId = `pty-${Date.now()}`;
    const newParty: PartyMaster = {
      ...partyData,
      party_id: newId,
      created_at: new Date().toISOString().split('T')[0],
    };
    setParties((prev) => [newParty, ...prev]);

    // Audit Log
    const newAudit: AuditLogEntry = {
      audit_id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentUser.full_name,
      action_type: 'CREATE',
      table_name: 'tbl_party_master',
      record_id: newParty.party_code,
      summary: `Created party ${newParty.trade_name} (${newParty.party_type})`,
      client_ip: '103.114.98.1',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const addItem = (itemData: Omit<Item, 'item_id'>) => {
    const newId = `itm-${Date.now()}`;
    const newItem: Item = {
      ...itemData,
      item_id: newId,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const addJournalVoucher = (voucherData: Omit<JournalVoucher, 'journal_id' | 'created_at'>) => {
    const newId = `jv-${Date.now()}`;
    const newVoucher: JournalVoucher = {
      ...voucherData,
      journal_id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setJournalVouchers((prev) => [newVoucher, ...prev]);
  };

  const postJournalVoucher = (journalId: string): { success: boolean; error?: string } => {
    const target = journalVouchers.find((jv) => jv.journal_id === journalId);
    if (!target) return { success: false, error: 'Voucher not found' };
    if (target.is_posted) return { success: false, error: 'Voucher is already posted' };

    // Enforce Balanced Double Entry
    if (Math.abs(target.total_debit - target.total_credit) > 0.01) {
      return {
        success: false,
        error: `Double Entry Violation: Total Debits (৳ ${target.total_debit.toLocaleString()}) must equal Total Credits (৳ ${target.total_credit.toLocaleString()})`,
      };
    }

    setJournalVouchers((prev) =>
      prev.map((jv) =>
        jv.journal_id === journalId
          ? {
              ...jv,
              is_posted: true,
              status: 'posted',
              posted_by: currentUser.full_name,
              posted_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : jv
      )
    );

    // Audit Log
    setAuditLogs((prev) => [
      {
        audit_id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user_name: currentUser.full_name,
        action_type: 'POST',
        table_name: 'tbl_journal',
        record_id: target.voucher_no,
        summary: `Posted Journal Voucher ${target.voucher_no} - Amount ৳ ${target.total_debit.toLocaleString()}`,
        client_ip: '103.114.98.1',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const addCashTransaction = (txData: Omit<CashTransaction, 'cash_transaction_id'>) => {
    const newId = `ctx-${Date.now()}`;
    const newTx: CashTransaction = {
      ...txData,
      cash_transaction_id: newId,
    };
    setCashTransactions((prev) => [newTx, ...prev]);
  };

  const postCashTransaction = (txId: string) => {
    setCashTransactions((prev) =>
      prev.map((tx) => (tx.cash_transaction_id === txId ? { ...tx, is_posted: true, status: 'posted' } : tx))
    );
  };

  const addSalesOrder = (soData: Omit<SalesOrder, 'sales_order_id'>) => {
    const newId = `so-${Date.now()}`;
    const newOrder: SalesOrder = {
      ...soData,
      sales_order_id: newId,
    };
    setSalesOrders((prev) => [newOrder, ...prev]);
  };

  const addDeliveryChallan = (challanData: Omit<DeliveryChallan, 'delivery_challan_id'>) => {
    const newId = `ch-${Date.now()}`;
    const newChallan: DeliveryChallan = {
      ...challanData,
      delivery_challan_id: newId,
    };
    setDeliveryChallans((prev) => [newChallan, ...prev]);
  };

  const addSalesInvoice = (invData: Omit<SalesInvoice, 'sales_invoice_id'>) => {
    const newId = `inv-${Date.now()}`;
    const newInvoice: SalesInvoice = {
      ...invData,
      sales_invoice_id: newId,
    };
    setSalesInvoices((prev) => [newInvoice, ...prev]);
  };

  const postSalesInvoice = (invoiceId: string): { success: boolean; error?: string } => {
    const inv = salesInvoices.find((i) => i.sales_invoice_id === invoiceId);
    if (!inv) return { success: false, error: 'Invoice not found' };
    if (inv.is_posted) return { success: false, error: 'Invoice already posted' };

    setSalesInvoices((prev) =>
      prev.map((i) => (i.sales_invoice_id === invoiceId ? { ...i, is_posted: true, status: 'posted' } : i))
    );

    // Auto generate balanced GL entry for posted sales invoice
    const newJV: JournalVoucher = {
      journal_id: `jv-${Date.now()}`,
      voucher_no: `JV-SALES-${inv.invoice_no}`,
      voucher_type: 'Sales',
      voucher_date: inv.invoice_date,
      narration: `Automatic posting for Sales Invoice ${inv.invoice_no} to ${inv.party_name}`,
      total_debit: inv.grand_total,
      total_credit: inv.grand_total,
      is_posted: true,
      status: 'posted',
      created_by: currentUser.full_name,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      posted_by: currentUser.full_name,
      posted_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lines: [
        {
          journal_line_id: `jvl-d-${Date.now()}`,
          account_id: 'acc-1200',
          account_code: '1200',
          account_name: 'Accounts Receivable (Trade Debtors)',
          party_id: inv.party_id,
          party_name: inv.party_name,
          debit_amount: inv.grand_total,
          credit_amount: 0,
          narration: `AR balance on Invoice ${inv.invoice_no}`,
        },
        {
          journal_line_id: `jvl-c-${Date.now()}`,
          account_id: 'acc-4100',
          account_code: '4100',
          account_name: 'Stone Aggregate Sales Revenue',
          debit_amount: 0,
          credit_amount: inv.grand_total,
          narration: `Recognized revenue on Invoice ${inv.invoice_no}`,
        },
      ],
    };
    setJournalVouchers((prev) => [newJV, ...prev]);

    // Update customer receivable
    setParties((prev) =>
      prev.map((p) =>
        p.party_id === inv.party_id ? { ...p, outstanding_balance: p.outstanding_balance + inv.grand_total } : p
      )
    );

    return { success: true };
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'purchase_order_id'>) => {
    const newId = `po-${Date.now()}`;
    const newPO: PurchaseOrder = {
      ...poData,
      purchase_order_id: newId,
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    // If threshold > 500,000, trigger Approval Request
    if (newPO.grand_total > 500000) {
      const newApproval: ApprovalRequest = {
        approval_request_id: `apr-${Date.now()}`,
        document_type: 'Purchase Order',
        document_no: newPO.po_no,
        amount: newPO.grand_total,
        requested_by: currentUser.full_name,
        department: 'Procurement',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Pending',
        details: `High-value Purchase Order to ${newPO.party_name} for depot delivery.`,
      };
      setApprovals((prev) => [newApproval, ...prev]);
    }
  };

  const addGRN = (grnData: Omit<GoodsReceivedNote, 'grn_id'>) => {
    const newId = `grn-${Date.now()}`;
    const newGRN: GoodsReceivedNote = {
      ...grnData,
      grn_id: newId,
    };
    setGrns((prev) => [newGRN, ...prev]);

    // Update warehouse stock for accepted quantity
    newGRN.items.forEach((item) => {
      setWarehouseStock((prev) =>
        prev.map((ws) =>
          ws.warehouse_id === newGRN.warehouse_id && ws.item_id === item.item_id
            ? {
                ...ws,
                quantity: ws.quantity + item.accepted_quantity,
                total_valuation: (ws.quantity + item.accepted_quantity) * ws.average_cost,
              }
            : ws
        )
      );
    });
  };

  const addPurchaseInvoice = (invData: Omit<PurchaseInvoice, 'purchase_invoice_id'>) => {
    const newId = `pinv-${Date.now()}`;
    const newInv: PurchaseInvoice = {
      ...invData,
      purchase_invoice_id: newId,
    };
    setPurchaseInvoices((prev) => [newInv, ...prev]);
  };

  const postPurchaseInvoice = (invoiceId: string): { success: boolean; error?: string } => {
    const pinv = purchaseInvoices.find((p) => p.purchase_invoice_id === invoiceId);
    if (!pinv) return { success: false, error: 'Purchase Invoice not found' };
    if (pinv.is_posted) return { success: false, error: 'Invoice already posted' };

    setPurchaseInvoices((prev) =>
      prev.map((p) => (p.purchase_invoice_id === invoiceId ? { ...p, is_posted: true, status: 'posted' } : p))
    );

    // Auto generate balanced GL entry for vendor bill
    const newJV: JournalVoucher = {
      journal_id: `jv-${Date.now()}`,
      voucher_no: `JV-PURCHASE-${pinv.invoice_no}`,
      voucher_type: 'Purchase',
      voucher_date: pinv.invoice_date,
      narration: `Vendor Bill ${pinv.invoice_no} from ${pinv.party_name} posted to Accounts Payable`,
      total_debit: pinv.grand_total,
      total_credit: pinv.grand_total,
      is_posted: true,
      status: 'posted',
      created_by: currentUser.full_name,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      posted_by: currentUser.full_name,
      posted_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lines: [
        {
          journal_line_id: `jvl-d-${Date.now()}`,
          account_id: 'acc-1300',
          account_code: '1300',
          account_name: 'Inventory Valuation (Aggregates & Materials)',
          debit_amount: pinv.grand_total,
          credit_amount: 0,
          narration: `Material inventory receipt on bill ${pinv.invoice_no}`,
        },
        {
          journal_line_id: `jvl-c-${Date.now()}`,
          account_id: 'acc-2100',
          account_code: '2100',
          account_name: 'Accounts Payable (Quarry Suppliers & Trade Creditors)',
          party_id: pinv.party_id,
          party_name: pinv.party_name,
          debit_amount: 0,
          credit_amount: pinv.grand_total,
          narration: `Accounts Payable liability on bill ${pinv.invoice_no}`,
        },
      ],
    };
    setJournalVouchers((prev) => [newJV, ...prev]);

    return { success: true };
  };

  const addWeighbridgeLog = (logData: Omit<WeighbridgeLog, 'weighbridge_log_id'>) => {
    const newId = `wbl-${Date.now()}`;
    const newLog: WeighbridgeLog = {
      ...logData,
      weighbridge_log_id: newId,
    };
    setWeighbridgeLogs((prev) => [newLog, ...prev]);
  };

  const processApproval = (requestId: string, action: 'Approve' | 'Reject' | 'Return', comments?: string) => {
    setApprovals((prev) =>
      prev.map((app) =>
        app.approval_request_id === requestId
          ? {
              ...app,
              status: action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Returned',
              comments: comments || `${action} by ${currentUser.full_name}`,
            }
          : app
      )
    );

    // Audit log
    setAuditLogs((prev) => [
      {
        audit_id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user_name: currentUser.full_name,
        action_type: action === 'Approve' ? 'APPROVE' : 'REJECT',
        table_name: 'tbl_approval_request',
        record_id: requestId,
        summary: `${action} workflow request: ${requestId}`,
        client_ip: '103.114.98.1',
      },
      ...prev,
    ]);
  };

  const addTender = (tenderData: Omit<TenderRecord, 'tender_id'>) => {
    const newId = `tnd-${Date.now()}`;
    const newTender: TenderRecord = {
      ...tenderData,
      tender_id: newId,
    };
    setTenders((prev) => [newTender, ...prev]);
  };

  const addLead = (leadData: Omit<Lead, 'lead_id' | 'created_at'>) => {
    const newId = `ld-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      lead_id: newId,
      created_at: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Format currency strictly in BDT with Lakhs/Crores standard or full numeric representation
  const formatBDT = (amount: number, compact: boolean = false): string => {
    if (isNaN(amount)) return '৳ 0';
    if (compact) {
      const abs = Math.abs(amount);
      if (abs >= 10000000) {
        return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
      }
      if (abs >= 100000) {
        return `৳ ${(amount / 100000).toFixed(1)}L`;
      }
    }
    return `৳ ${amount.toLocaleString('en-IN')}`;
  };

  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ERPContext.Provider
      value={{
        company,
        branches,
        selectedBranchId,
        setSelectedBranchId,
        selectedFiscalPeriod,
        setSelectedFiscalPeriod,
        activeRole,
        setActiveRole,
        currentUser,
        activeHub,
        activeSubModule,
        setActiveHubAndModule,

        parties,
        items,
        warehouses,
        warehouseStock,
        chartOfAccounts,
        journalVouchers,
        cashTransactions,
        salesOrders,
        deliveryChallans,
        salesInvoices,
        purchaseOrders,
        grns,
        purchaseInvoices,
        weighbridgeLogs,
        importHeaders,
        tenders,
        projects,
        approvals,
        auditLogs,
        leads,
        opportunities,
        budgets,
        employees,
        payrollEntries,
        notifications,

        addParty,
        addItem,
        addJournalVoucher,
        postJournalVoucher,
        addCashTransaction,
        postCashTransaction,
        addSalesOrder,
        addDeliveryChallan,
        addSalesInvoice,
        postSalesInvoice,
        addPurchaseOrder,
        addGRN,
        addPurchaseInvoice,
        postPurchaseInvoice,
        addWeighbridgeLog,
        processApproval,
        addTender,
        addLead,
        markNotificationRead,

        formatBDT,
        exportToCSV,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
