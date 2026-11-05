# SKA NEXUS ERP v4.2.0 — Canonical 73-Table Frontend Implementation Matrix

**Enterprise:** Ska Trading & Logistics  
**Architecture:** React 19 + TypeScript + Vite + Tailwind CSS  
**Currency:** Bangladeshi Taka (৳ BDT)  
**Standard:** Microsoft Dynamics 365 / SAP Enterprise UI Guideline  

---

## 1. Domain 1: Core Organization & Security (Tables 1–10)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 1 | `company` | `company_id` | System Governance > Company Profile | Form & Detail Card | View, Edit, Save, Company Settings | `admin:company:write` |
| 2 | `branch` | `branch_id` | System Governance > Branches | DataGrid & Modal Form | New Branch, Edit, Activate/Deactivate | `admin:branch:write` |
| 3 | `role` | `role_id` | System Governance > Roles | DataGrid & Matrix | Create Role, Edit, Assign Permissions | `admin:role:write` |
| 4 | `permission` | `permission_id` | System Governance > Permission Matrix | Dense Grid | View, Search, Filter by Module | `admin:permission:read` |
| 5 | `app_user` | `user_id` | System Governance > User Management | DataGrid & Form | Create User, Edit, Assign Role, Lock/Unlock | `admin:user:write` |
| 6 | `role_permission` | `role_permission_id` | System Governance > Role Permissions | Matrix Checkbox Grid | Assign, Revoke, Save Matrix | `admin:role:write` |
| 7 | `user_session` | `session_id` | System Governance > Active Sessions | Read-only DataGrid | View Sessions, Revoke Session, Force Logout | `admin:session:manage` |
| 8 | `document_sequence` | `sequence_id` | System Governance > Document Numbering | Configuration Grid | Configure Prefix, Preview Next Number | `admin:system:write` |
| 9 | `system_setting` | `setting_id` | System Governance > System Settings | Key-Value Editor | Search, Edit Value, Save, Restore Default | `admin:system:write` |
| 10 | `audit_log` | `audit_id` | System Governance > Audit Trail | Read-only Audit Grid | View Details, Filter by Table/User, Export CSV | `audit:read` |

---

## 2. Domain 2: Status Engine & Approval Workflow (Tables 11–15)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 11 | `status_group` | `status_group_id` | Governance > Status Config | List & Form | Create Group, Edit, Activate | `admin:system:write` |
| 12 | `status_item` | `status_id` | Governance > Status Items | Ordered List | Add Status, Reorder, Activate/Deactivate | `admin:system:write` |
| 13 | `approval_workflow` | `workflow_id` | Governance > Approval Setup | Rule Builder | Create Workflow, Set Threshold Amount | `admin:approval:config` |
| 14 | `approval_request` | `approval_request_id` | Governance & TopBar > Approval Inbox | Centralized Inbox | Approve, Reject, Return for Correction, Preview | `approval:action` |
| 15 | `approval_step` | `approval_step_id` | Approval Request Drawer | Step Timeline | View History, Assigned Approver Status | `approval:read` |

---

## 3. Domain 3: Party Master & Geography (Tables 16–27)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 16 | `currency` | `currency_id` | Financial > Currency Master | Master Grid | View, Edit Rate, Set Base Currency | `finance:master:write` |
| 17 | `currency_rate` | `rate_id` | Financial > Exchange Rates | Historical Grid | Add Exchange Rate, View Rate Graph | `finance:master:write` |
| 18 | `fiscal_year` | `fiscal_year_id` | Financial > Fiscal Years | Period Manager | Create Fiscal Year, Close Year | `finance:admin:write` |
| 19 | `fiscal_period` | `period_id` | Financial > Fiscal Periods | Grid with Lock/Unlock | Open Period, Close Period, Period Lock | `finance:admin:write` |
| 20 | `account_group` | `account_group_id` | Financial > Account Groups | Tree Structure | Create Group, Edit, Assign Parent | `finance:coa:write` |
| 21 | `chart_of_account` | `account_id` | Financial > Chart of Accounts | Hierarchical Tree Grid | Create Account, View Ledger, Balance Drill-down | `finance:coa:read/write` |
| 22 | `party_type` | `party_type_id` | Master Data > Party Types | Master Table | Create Party Type, Assign Default GL Account | `commercial:master:write` |
| 23 | `division` | `division_id` | Master Data > Divisions | Master Table | Create Division, Edit, Activate | `admin:geo:write` |
| 24 | `district` | `district_id` | Master Data > Districts | Master Table | Create District, Map to Division | `admin:geo:write` |
| 25 | `gov_department` | `gov_department_id` | Executive > Gov Departments | Directory Grid | Add Department, Ministry Mapping | `tender:master:write` |
| 26 | `party_master` | `party_id` | Commercial & Supply Chain > PartyMaster | Master Form & Profile Tabs | Create Customer/Supplier, View Statement, Ledger | `commercial:party:write` |
| 27 | `contact_person` | `contact_id` | PartyMaster Details > Contacts | Embedded Grid | Add Contact, Set Primary Contact | `commercial:party:write` |

---

## 4. Domain 4: General Ledger & Accounting (Tables 28–31)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 28 | `journal` | `journal_id` | Financial > Journal Vouchers | Transaction Form & List | New Voucher, Save Draft, Submit, Approve, Post, Print | `finance:journal:write/post` |
| 29 | `journal_line` | `journal_line_id` | Journal Voucher Form | Balanced Line Grid | Add Line (DR/CR), Auto-Check Balance | `finance:journal:write` |
| 30 | `general_ledger` | `ledger_id` | Financial > General Ledger | Audit & Drill-down Grid | Filter Date/Account/Party, Drill to Voucher, Export | `finance:gl:read` |
| 31 | `bank_reconciliation` | `reconciliation_id` | Financial > Bank Reconciliation | Side-by-Side Matching | Match Statements, Review Unreconciled, Finalize | `finance:bank:reconcile` |

---

## 5. Domain 5: Treasury & Cash Management (Tables 32–35)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 32 | `payment_method` | `payment_method_id` | Financial > Payment Methods | Master Grid | Create Method (Cash, Cheque, RTGS, LC), Activate | `finance:treasury:write` |
| 33 | `cash_transaction_type` | `transaction_type_id` | Financial > Transaction Types | Master Grid | Add Receipt/Payment Type, GL Mapping | `finance:treasury:write` |
| 34 | `cash_transaction` | `cash_transaction_id` | Financial > Cash & Bank | Voucher Form & Log | Receive Money, Make Payment, Post, Print Receipt | `finance:treasury:write/post` |
| 35 | `payment_allocation` | `allocation_id` | Cash Transaction Modal | Invoice Allocation Grid | Allocate against Invoices, Prevent Over-allocation | `finance:treasury:write` |

---

## 6. Domain 6: Budgets & Variance (Tables 36–38)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 36 | `budget_header` | `budget_id` | Financial > Budget Planning | Budget Sheet & Header | Create Annual/Monthly Budget, Approve, Lock | `finance:budget:manage` |
| 37 | `budget_line` | `budget_line_id` | Budget Planning Sheet | Line-by-Line Allocation | Assign Account Budget, View Actual vs Budget | `finance:budget:write` |
| 38 | `budget_variance_approval`| `variance_approval_id`| Financial > Budget Variances | Exception Approval Queue | Request Over-budget Exception, Approve, Reject | `finance:budget:override` |

---

## 7. Domain 7: Inventory & Multi-Depot Logistics (Tables 39–45)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 39 | `unit` | `unit_id` | Supply Chain > Units of Measure | Master Table | Create Unit (Ton, CFT, KG, Bag), Decimal Places | `inventory:master:write` |
| 40 | `item_category` | `category_id` | Supply Chain > Item Categories | Tree Selector | Create Category (Stone, Sand, Cement, Steel) | `inventory:master:write` |
| 41 | `item` | `item_id` | Supply Chain > Item Master | Catalog & Details Card | Create Item, Standard Cost, Sales Rate, Reorder Level | `inventory:item:write` |
| 42 | `warehouse` | `warehouse_id` | Supply Chain > Warehouses/Depots| Multi-Depot Overview | Add Depot (Bhomra, Noapara, Mongla, Sylhet), View Stock | `inventory:warehouse:write`|
| 43 | `stock_ledger` | `stock_ledger_id` | Supply Chain > Stock Ledger | Immutable Audit Grid | Filter Item/Depot, Track In/Out Qty & Cost, Export | `inventory:stock:read` |
| 44 | `stock_transfer` | `transfer_id` | Supply Chain > Stock Transfers | Depot Transfer Form | New Transfer, Approve, Dispatch, Receive, Print Gate Pass | `inventory:transfer:manage` |
| 45 | `stock_transfer_line` | `transfer_line_id` | Transfer Form | Line Item Table | Add Items, Check Depot Availability | `inventory:transfer:write` |

---

## 8. Domain 8: Stock Audit & Adjustments (Tables 46–47)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 46 | `stock_adjustment` | `adjustment_id` | Supply Chain > Stock Adjustments | Audit & Variance Form | Physical Stock Count, Submit Variance, Post to Ledger | `inventory:adjust:write` |
| 47 | `stock_adjustment_line`| `adjustment_line_id` | Stock Adjustment Form | Reconciliation Grid | Record System vs Physical Count, Calc Gain/Loss | `inventory:adjust:write` |

---

## 9. Domain 9: Import Operations & Weighbridge (Tables 48–53)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 48 | `port_station` | `port_id` | Supply Chain > Ports & Stations | Master Table | Add Land Port / Sea Port (Bhomra, Benapole, Mongla) | `import:master:write` |
| 49 | `customs_tariff_hs` | `tariff_id` | Supply Chain > HS Codes & Tariffs | Searchable Directory | HS Code Lookup, Duty %, Regulatory Duty %, VAT % | `import:master:write` |
| 50 | `import_header` | `import_header_id` | Supply Chain > Import Shipments | Shipment Dossier & Form | Create Shipment, LC Tracking, Bill of Entry, Close | `import:shipment:manage` |
| 51 | `import_line` | `import_line_id` | Import Shipment Dossier | Imported Goods Table | Add HS Code, Declared Tonnage, Foreign Unit Cost | `import:shipment:write` |
| 52 | `import_landed_cost` | `landed_cost_id` | Import Shipment Dossier | Cost Capitalization Grid | Add Customs, Port, Freight, Transport, Calc Landed Cost| `import:costing:write` |
| 53 | `weighbridge_log` | `weighbridge_log_id` | Supply Chain > Weighbridge Station | Scale Interface & Ticket | Record Gross/Tare, Auto Calc Net Weight, Print Slip | `inventory:scale:record` |

---

## 10. Domain 10: Commercial Sales & CRM (Tables 54–63)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 54 | `lead` | `lead_id` | Commercial > CRM Leads | Kanban & List | Create Lead, Assign Sales Rep, Convert to Opportunity | `crm:lead:write` |
| 55 | `opportunity` | `opportunity_id` | Commercial > Sales Pipeline | Stage Kanban Board | Move Stage (Prospect -> Quote -> Won), Convert to Quote | `crm:opp:write` |
| 56 | `sales_quotation` | `quotation_id` | Commercial > Quotations | Quotation Form & Grid | Create Quotation, Submit Approval, Print PDF, Convert to SO | `sales:quote:write` |
| 57 | `sales_quotation_line`| `quotation_line_id` | Quotation Form | Line Items Grid | Item, Quantity, Unit Price, Line Total | `sales:quote:write` |
| 58 | `sales_order` | `sales_order_id` | Commercial > Sales Orders | Commercial Order Sheet | Create Order, Credit Check, Approve, Print, Dispatch | `sales:order:manage` |
| 59 | `sales_order_line` | `sales_order_line_id` | Sales Order Sheet | Line Items Table | Item, Depot, Tonnage, Delivery Schedule | `sales:order:write` |
| 60 | `delivery_challan` | `delivery_challan_id`| Commercial > Delivery Challans | Gate Pass & Challan | Create Challan, Driver & Truck Info, Confirm Delivery | `logistics:dispatch:write` |
| 61 | `delivery_challan_line`|`challan_line_id` | Delivery Challan Form | Dispatched Items Grid | Dispatched Tonnage, Tare/Net Weight Cross-check | `logistics:dispatch:write` |
| 62 | `sales_invoice` | `sales_invoice_id` | Commercial > Sales Invoices | Commercial Tax Invoice | New Invoice, Save Draft, Approve, Post to AR/GL, Print | `commercial:invoice:write/post` |
| 63 | `sales_invoice_line` | `sales_invoice_line_id`| Sales Invoice Form | Billable Line Grid | Item, Delivered Qty, Rate, Tax, Total BDT | `commercial:invoice:write` |

---

## 11. Domain 11: Procurement & Goods Receipt (Tables 64–70)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 64 | `supplier_quote` | `quote_id` | Supply Chain > Supplier Quotes | Comparison Matrix | Record Supplier Quotations, Compare Tonnage Rates | `purchase:quote:write` |
| 65 | `purchase_order` | `purchase_order_id` | Supply Chain > Purchase Orders | Purchase Order Sheet | Create PO, Approval Routing, Print PO, Generate GRN | `purchase:order:manage` |
| 66 | `purchase_order_line` | `po_line_id` | Purchase Order Sheet | Order Line Grid | Item, Target Depot, Quantity, Purchase Rate | `purchase:order:write` |
| 67 | `goods_received_note` | `grn_id` | Supply Chain > Goods Receipt (GRN)| Physical Receiving Slip | Create GRN, Supplier Challan Match, Approve, Post Stock | `inventory:grn:manage` |
| 68 | `goods_received_note_line`| `grn_line_id` | GRN Sheet | QA & Receiving Grid | Received Qty, Accepted Qty, Rejected Qty, Moisture Adj | `inventory:grn:write` |
| 69 | `purchase_invoice` | `purchase_invoice_id`| Supply Chain > Purchase Invoices | Vendor Bill Form | Match GRN/PO, Post to AP/GL, Record VAT Deduction | `purchase:bill:manage` |
| 70 | `purchase_invoice_line`| `purchase_invoice_line_id`| Purchase Invoice Form | Verified Billing Grid | Match Invoiced Tonnage against Accepted GRN | `purchase:bill:write` |

---

## 12. Domain 12: Projects, Workforce & Tenders (Tables 71–73)
| # | Database Table | Primary Key | Frontend Page | UI Component Type | Key Actions & Buttons | Permissions Required |
|---|---|---|---|---|---|---|
| 71 | `project` | `project_id` | Executive > Project Management | Project Workspace & Timeline | Create Project, Gov Entity Link, BOQ Demand, Profitability | `project:manage` |
| 72 | `employee` | `employee_id` | Governance > Workforce/Employees | Employee Records | Add Employee, Branch Assignment, Salary Profile | `hr:employee:manage` |
| 73 | `payroll_entry` | `payroll_id` | Financial > Payroll Management | Salary Sheet & Disbursement | Run Monthly Payroll, Approve, Post Salary Journal, Print | `hr:payroll:manage` |
