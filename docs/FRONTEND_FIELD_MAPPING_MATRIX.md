# SKA NEXUS ERP v4.2.0 — Field-Level Frontend Mapping Matrix

**Enterprise:** Ska Trading & Logistics  
**Architecture:** Canonical 73-Table Schema Integration  
**Accounting Engine:** Double Entry (Balanced Debits & Credits)  
**Valuation Method:** Weighted Average Cost (WAC) per Depot  

---

## Field Specifications Summary Across Key Entities

### 1. `company`
- `company_id` (UUID): System generated PK, Read-only.
- `company_code` (VARCHAR): Unique code (e.g. `SKA-01`), Required.
- `company_name` (VARCHAR): Legal entity name (`Ska Trading & Logistics`), Required.
- `address` (TEXT): Corporate headquarters address (Dhaka, Bangladesh).
- `base_currency_id` (UUID): FK to `currency` (`BDT`), Read-only after setup.

### 2. `branch` & `warehouse`
- `branch_id`, `warehouse_id` (UUID): Unique PKs.
- `warehouse_code`: `BHM-01` (Bhomra Port Depot), `NPR-01` (Noapara River Depot), `MGL-01` (Mongla Terminal Yard), `SYL-01` (Sylhet Shingle Yard).
- `location`: Geo & physical coordinates.

### 3. `chart_of_account`
- `account_code`: Canonical numbering:
  - `1000` Assets: `1110` Cash on Hand, `1120` Prime Bank Ltd (A/C: 104-582), `1130` Islami Bank BD Ltd, `1200` Accounts Receivable (Customers), `1300` Inventory Valuation.
  - `2000` Liabilities: `2100` Accounts Payable (Suppliers), `2200` VAT & Tax Payable.
  - `3000` Equity: `3100` Share Capital, `3200` Retained Earnings.
  - `4000` Revenue: `4100` Stone Aggregate Sales, `4200` River Sand Sales, `4300` Rebar Sales.
  - `5000` Cost of Goods Sold (COGS): `5100` Stone Aggregate COGS, `5200` Freight & Port Charges.
  - `6000` Operating Expenses: `6100` Depot Yard Handling, `6200` Salaries, `6300` Weighbridge Fees.

### 4. `item`
- `item_code`: `PKR-20MM` (Pakur Black Stone 20mm), `PKR-16MM` (Pakur Stone 16mm), `BTN-BLD` (Bhutan River Boulder), `SYL-SNG` (Sylhet River Shingle 3/4"), `SND-2.5` (River Sand FM 2.5), `RBR-500W` (BSRM 500W Rebar).
- `standard_cost`: BDT per Ton/CFT (WAC authoritative).
- `sales_price`: Benchmark BDT sales quotation rate.
- `reorder_level`: Metric tonnage threshold for automatic replenishment alerts.

### 5. `weighbridge_log`
- `truck_no`: e.g. `DHAKA-METRO-TA-14-8921`
- `gross_weight`: Scale gross tonnage input.
- `tare_weight`: Truck empty weight.
- `net_weight`: `gross_weight - tare_weight` (Auto-calculated, strictly positive).

### 6. `journal` & `journal_line`
- `voucher_no`: Auto-sequenced (e.g. `JV-2026-00142`).
- `is_posted`: Boolean. Strict condition: `sum(debit) === sum(credit)`.
- Immutability: Once posted, direct editing is locked.

### 7. `sales_invoice` vs `purchase_invoice`
- Fully segregated models:
  - `sales_invoice`: Generates Debit to Customer AR (`1200`), Credit to Sales Revenue (`4100`), Credit to Output VAT (`2200`). Reduces stock via Delivery Challan.
  - `purchase_invoice`: Generates Debit to Inventory/Expense (`1300`), Credit to Supplier AP (`2100`), Debit to Input VAT (`2200`).
