export type UserRole =
  | 'managing_director'
  | 'finance_accountant'
  | 'sales_manager'
  | 'purchase_manager'
  | 'inventory_manager'
  | 'warehouse_staff'
  | 'crm_marketing'
  | 'tender_officer'
  | 'auditor'
  | 'super_admin';

export type DocumentStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'posted'
  | 'dispatched'
  | 'received'
  | 'rejected'
  | 'closed'
  | 'cancelled';

export interface Company {
  company_id: string;
  company_code: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  base_currency_id: string;
  bin_no: string;
  tin_no: string;
  is_active: boolean;
  created_at: string;
}

export interface Branch {
  branch_id: string;
  company_id: string;
  branch_code: string;
  branch_name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

export interface AppUser {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch_id: string;
  is_active: boolean;
  last_login_at?: string;
}

export interface PartyMaster {
  party_id: string;
  party_type: 'customer' | 'supplier' | 'importer' | 'transporter' | 'gov_dept';
  party_code: string;
  trade_name: string;
  legal_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  division: string;
  district: string;
  bin_no?: string;
  credit_allowed: boolean;
  credit_limit: number;
  payment_terms_days: number;
  outstanding_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface ChartOfAccount {
  account_id: string;
  account_code: string;
  account_name: string;
  account_group: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'COGS' | 'Operating Expenses';
  parent_code?: string;
  is_control_account: boolean;
  allow_posting: boolean;
  current_balance: number;
  is_active: boolean;
}

export interface JournalLine {
  journal_line_id: string;
  account_id: string;
  account_code: string;
  account_name: string;
  party_id?: string;
  party_name?: string;
  debit_amount: number;
  credit_amount: number;
  narration: string;
}

export interface JournalVoucher {
  journal_id: string;
  voucher_no: string;
  voucher_type: 'Journal' | 'Payment' | 'Receipt' | 'Sales' | 'Purchase';
  voucher_date: string;
  narration: string;
  total_debit: number;
  total_credit: number;
  is_posted: boolean;
  status: DocumentStatus;
  lines: JournalLine[];
  created_by: string;
  created_at: string;
  posted_by?: string;
  posted_at?: string;
}

export interface CashTransaction {
  cash_transaction_id: string;
  voucher_no: string;
  transaction_type: 'Customer Collection' | 'Supplier Payment' | 'Depot Expense' | 'Bank Transfer';
  account_id: string;
  account_name: string;
  party_id?: string;
  party_name?: string;
  payment_method: 'Bank Transfer' | 'Cheque' | 'Cash' | 'RTGS' | 'LC';
  amount: number;
  cheque_no?: string;
  cheque_date?: string;
  transaction_date: string;
  narration: string;
  status: DocumentStatus;
  is_posted: boolean;
}

export interface Unit {
  unit_id: string;
  unit_code: string;
  unit_name: string;
  decimal_places: number;
}

export interface ItemCategory {
  category_id: string;
  category_code: string;
  category_name: string;
  parent_category?: string;
}

export interface Item {
  item_id: string;
  category_id: string;
  category_name: string;
  unit_id: string;
  unit_code: string;
  item_code: string;
  item_name: string;
  specification: string;
  standard_cost: number; // WAC BDT
  sales_price: number; // BDT
  reorder_level: number;
  total_stock: number;
  is_active: boolean;
}

export interface Warehouse {
  warehouse_id: string;
  warehouse_code: string;
  warehouse_name: string;
  branch_id: string;
  location: string;
  is_active: boolean;
}

export interface WarehouseStock {
  id: string;
  warehouse_id: string;
  warehouse_code: string;
  warehouse_name: string;
  item_id: string;
  item_code: string;
  item_name: string;
  quantity: number;
  average_cost: number;
  total_valuation: number;
}

export interface StockLedgerEntry {
  stock_ledger_id: string;
  transaction_date: string;
  warehouse_id: string;
  warehouse_name: string;
  item_id: string;
  item_name: string;
  document_type: 'GRN' | 'Delivery Challan' | 'Transfer In' | 'Transfer Out' | 'Stock Adjustment';
  document_no: string;
  in_qty: number;
  out_qty: number;
  unit_cost: number;
  balance_qty: number;
  created_at: string;
}

export interface StockTransfer {
  transfer_id: string;
  transfer_no: string;
  from_warehouse_id: string;
  from_warehouse_name: string;
  to_warehouse_id: string;
  to_warehouse_name: string;
  transfer_date: string;
  items: {
    item_id: string;
    item_name: string;
    unit_code: string;
    quantity: number;
  }[];
  status: DocumentStatus;
  notes: string;
}

export interface StockAdjustment {
  adjustment_id: string;
  adjustment_no: string;
  warehouse_id: string;
  warehouse_name: string;
  adjustment_date: string;
  reason: string;
  items: {
    item_id: string;
    item_name: string;
    book_quantity: number;
    physical_quantity: number;
    variance_quantity: number;
    unit_cost: number;
  }[];
  status: DocumentStatus;
}

export interface WeighbridgeLog {
  weighbridge_log_id: string;
  scale_ticket_no: string;
  truck_no: string;
  driver_name: string;
  driver_phone: string;
  item_id: string;
  item_name: string;
  port_or_depot: string;
  gross_weight: number; // tons
  tare_weight: number; // tons
  net_weight: number; // tons
  weight_date: string;
  reference_type: 'Import Shipment' | 'Purchase Order' | 'Sales Challan';
  reference_no: string;
  operator_name: string;
}

export interface ImportHeader {
  import_header_id: string;
  import_ref_no: string;
  supplier_id: string;
  supplier_name: string;
  port_station: string;
  lc_no: string;
  lc_date: string;
  commercial_invoice_no: string;
  shipment_status: 'LC Opened' | 'In Transit' | 'Port Customs Clearance' | 'Discharging' | 'Completed';
  total_fob_usd: number;
  exchange_rate: number;
  total_landed_cost_bdt: number;
  items: {
    item_id: string;
    item_name: string;
    hs_code: string;
    declared_tonnage: number;
    received_tonnage: number;
    unit_price_usd: number;
  }[];
  landed_costs: {
    cost_head: string;
    amount_bdt: number;
    vendor_name: string;
  }[];
}

export interface Lead {
  lead_id: string;
  lead_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  assigned_to: string;
  estimated_value: number;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted' | 'Lost';
  notes: string;
  created_at: string;
}

export interface Opportunity {
  opportunity_id: string;
  lead_id?: string;
  opportunity_name: string;
  party_id: string;
  party_name: string;
  stage: 'Prospecting' | 'Technical Evaluation' | 'Commercial Quotation' | 'Contract Negotiation' | 'Closed Won' | 'Closed Lost';
  estimated_amount: number;
  expected_close_date: string;
  assigned_to: string;
}

export interface SalesQuotation {
  quotation_id: string;
  quotation_no: string;
  party_id: string;
  party_name: string;
  quotation_date: string;
  valid_until: string;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    unit_code: string;
    unit_price: number;
    line_total: number;
  }[];
  grand_total: number;
  status: DocumentStatus;
  terms: string;
}

export interface SalesOrder {
  sales_order_id: string;
  order_no: string;
  quotation_id?: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  order_date: string;
  delivery_deadline: string;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    unit_code: string;
    unit_price: number;
    line_total: number;
  }[];
  grand_total: number;
  delivered_quantity: number;
  status: DocumentStatus;
}

export interface DeliveryChallan {
  delivery_challan_id: string;
  challan_no: string;
  sales_order_id: string;
  sales_order_no: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  challan_date: string;
  truck_no: string;
  driver_name: string;
  driver_phone: string;
  items: {
    item_id: string;
    item_name: string;
    dispatched_quantity: number;
    unit_code: string;
  }[];
  status: DocumentStatus;
}

export interface SalesInvoice {
  sales_invoice_id: string;
  invoice_no: string;
  sales_order_id?: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  status: DocumentStatus;
  is_posted: boolean;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    unit_code: string;
    unit_price: number;
    vat_pct: number;
    line_total: number;
  }[];
}

export interface PurchaseOrder {
  purchase_order_id: string;
  po_no: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  po_date: string;
  expected_delivery: string;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    unit_code: string;
    unit_price: number;
    line_total: number;
  }[];
  grand_total: number;
  status: DocumentStatus;
}

export interface GoodsReceivedNote {
  grn_id: string;
  grn_no: string;
  purchase_order_id: string;
  purchase_order_no: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  receipt_date: string;
  supplier_challan_no: string;
  truck_no: string;
  items: {
    item_id: string;
    item_name: string;
    received_quantity: number;
    accepted_quantity: number;
    rejected_quantity: number;
    unit_code: string;
  }[];
  status: DocumentStatus;
}

export interface PurchaseInvoice {
  purchase_invoice_id: string;
  invoice_no: string;
  purchase_order_id?: string;
  grn_id?: string;
  party_id: string;
  party_name: string;
  warehouse_id: string;
  warehouse_name: string;
  invoice_date: string;
  due_date: string;
  supplier_bill_no: string;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  status: DocumentStatus;
  is_posted: boolean;
  items: {
    item_id: string;
    item_name: string;
    quantity: number;
    unit_code: string;
    unit_price: number;
    line_total: number;
  }[];
}

export interface TenderRecord {
  tender_id: string;
  egp_tender_id: string;
  procuring_entity: string;
  ministry_name: string;
  project_name: string;
  work_description: string;
  closing_date: string;
  estimated_value: number; // BDT
  security_amount: number;
  materials_demanded: {
    item_name: string;
    estimated_qty_tons: number;
    target_rate_bdt: number;
  }[];
  status: 'Published' | 'BOQ Analyzed' | 'Quotation Prepared' | 'Bid Submitted' | 'Awarded' | 'Not Bidded';
}

export interface Project {
  project_id: string;
  project_code: string;
  project_name: string;
  gov_department: string;
  district: string;
  estimated_value: number;
  start_date: string;
  end_date: string;
  status: 'In Progress' | 'Mobilization' | 'Completed' | 'Pending Clearance';
  completion_pct: number;
  total_billed: number;
}

export interface ApprovalRequest {
  approval_request_id: string;
  document_type: 'Purchase Order' | 'Bank Payment' | 'Journal Voucher' | 'Sales Invoice' | 'Stock Adjustment';
  document_no: string;
  amount: number;
  requested_by: string;
  department: string;
  created_at: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  comments?: string;
  details: string;
}

export interface AuditLogEntry {
  audit_id: string;
  timestamp: string;
  user_name: string;
  action_type: 'CREATE' | 'UPDATE' | 'POST' | 'APPROVE' | 'REJECT';
  table_name: string;
  record_id: string;
  summary: string;
  client_ip: string;
}

export interface Budget {
  budget_id: string;
  budget_code: string;
  budget_name: string;
  fiscal_year: string;
  allocated_amount: number;
  utilized_amount: number;
  variance_pct: number;
  status: 'Active' | 'Under Review' | 'Exceeded';
}

export interface Employee {
  employee_id: string;
  employee_code: string;
  full_name: string;
  designation: string;
  department: string;
  branch_name: string;
  basic_salary: number;
  joining_date: string;
  phone: string;
  is_active: boolean;
}

export interface PayrollEntry {
  payroll_id: string;
  employee_id: string;
  employee_name: string;
  month: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_payable: number;
  disbursement_date: string;
  status: DocumentStatus;
  payment_method: string;
}
