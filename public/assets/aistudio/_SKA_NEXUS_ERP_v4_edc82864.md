তোমার আপলোড করা SKA NEXUS ERP v4.2.0 প্রজেক্টের ফাইল ও বর্তমান আর্কিটেকচার দেখে বলছি, আমি যদি এই ERP নিজের ব্যবসা Ska Trading & Logistics-এর জন্য তৈরি করতাম, তাহলে Frontend-কে শুধু সুন্দর Dashboard হিসেবে বানাতাম না।

আমি এটাকে এমন একটি Enterprise Business Control System হিসেবে ডিজাইন করতাম, যেখানে প্রতিদিনের ব্যবসা পরিচালনা, হিসাব, স্টক, ক্রয়, বিক্রয়, আমদানি এবং সিদ্ধান্ত নেওয়ার কাজ দ্রুত ও নির্ভুলভাবে করা যায়।

তোমার বর্তমান React, TypeScript, PostgreSQL এবং বিদ্যমান ERP structure রেখেই কাজ করতাম। নতুন করে ERP বানাতাম না।

## **১. আমার পছন্দের Frontend Design**

[Microsoft Dynamics 365 Finance \&amp; Operations \| ERP Dubai](https://images.openai.com/static-rsc-4/3yJSptYJYw1QsQVYOiVT7kAL-Hvbm2_j4PCqBYUETvuZMnGKRgJ73iSNrnrVvVAZ00S4puJ_HyXMvr34XkJCavyzE-XboTQWxMMQurImHrFKUgVRQRdtWLNdMxkxqoKmMN0pQIpa_1frC33GHDrluayvZassqaXP65qxm7cRHYE?purpose=inline)  
[ERP Software India \| ERPNext Partner & Implementation Company \| Quantbit Technologies](https://images.openai.com/static-rsc-4/lRJEXjSRqX7QyshQ7W4v-eMQJqcMe7at40rMNTfybnU1-gCV_qs54fO8CfCGuLgulB5n4THZTY2v22rsu0441QuyHC8F-B_gcPO_Q6xkybSDlPaNIhOWc7c15STJ0yEv1NGfq_KJBrGy2OUAbgWoy4RANzkMZ2ER40IQfqsUXtQ?purpose=inline)  
[Compreo — Low-code ERP that runs your business as one flow](https://images.openai.com/static-rsc-4/qL68sNVlhXYygZxczoXiLHwB6ZhxQw1iLrA0N2e7AcGqQMkw98DNw1oOVR4RMzpAu52c0AWV_GuK3y2gZzWNMlrUHZeWUQE4H6pFOBI88rUR4JAn3sauYUY29k8dhzVZBR1SMVWOrE0bjQfXMT1ixaaLqRLlkprtoXtkR9kbRDM?purpose=inline)  
12

Design direction: Premium Enterprise \+ Practical Business UI

আমি Microsoft Dynamics 365, SAP এবং আধুনিক Enterprise SaaS-এর ভালো UX ধারণাগুলো অনুসরণ করতাম, কিন্তু তোমার ব্যবসার কাজ অনুযায়ী সহজ রাখতাম।

| UI Element | আমার সিদ্ধান্ত |
| ----- | ----- |
| Primary color | Deep Navy / Enterprise Blue |
| Background | Clean light gray |
| Cards | White, subtle border |
| Sidebar | Collapsible, fixed navigation |
| Header | Company, branch, user, notifications |
| Tables | Dense, professional, Excel-like |
| Currency | ৳ BDT |
| Language | English UI |
| Responsive | Desktop \+ Tablet \+ Mobile |

### **মূল Layout**

Conceptual layout, তোমার বর্তমান ERP-এর জন্য প্রস্তাবিত

SKA NEXUS ERP

Executive Workspace

Branch: All Branches · Fiscal Period: Current Month

System Online

Cash & Bank

# **৳ 24.8L**

Available balance

Sales This Month

# **৳ 38.4L**

Posted invoices only

Receivables

# **৳ 12.6L**

Outstanding customer dues

Inventory

# **৳ 84.2L**

Current stock valuation

Illustrative values only. Actual dashboard must use verified backend data.

Business Activity

Sales Invoice

New invoice, delivery, collection

Purchase & Goods Receipt

Purchase order, GRN, supplier invoice

Cash & Bank

Receipt, payment, expense

Pending Approvals

3 Pending

Purchase Orders · Payments · Journals

এটাই Dashboard-এর মূল ধারণা। তবে প্রত্যেক User-এর Dashboard আলাদা হবে।

## **২. Role-wise Dashboard**

আমি Dashboard-কে User Role অনুযায়ী পরিবর্তন করতাম।

| Role | Dashboard-এ যা থাকবে |
| ----- | ----- |
| Managing Director | Cash flow, profit, sales, purchases, pending approvals, business alerts |
| Finance / Accountant | Cash & bank, receivables, payables, journal, trial balance |
| Sales Manager | Sales target, quotations, orders, customer dues, delivery |
| Purchase Manager | Purchase orders, supplier rates, pending GRN, import status |
| Inventory Manager | Stock quantity, stock value, depot-wise stock, reorder alerts |
| Warehouse / Yard Staff | Receive goods, stock transfer, dispatch, stock count |
| CRM / Marketing | Leads, opportunities, customer follow-up, conversion |
| Tender Officer | e-GP tender deadlines, BOQ, project material demand |
| Auditor | Read-only reports, ledger, audit logs, reconciliation |

Super Admin আলাদা করে নতুন করে তৈরি করতাম না। তোমার বর্তমান System Administration এবং Super Admin structure-ই ব্যবহার করতাম।

একজন User যেন তার কাজের বাইরে অপ্রয়োজনীয় মেনু দেখতে না পায়।

## **৩. Frontend-এ যেসব Function অবশ্যই রাখতাম**

আমি Function-গুলো ৫টি স্তরে সাজাতাম।

### **A. Global Functions**

এগুলো ERP-এর প্রতিটি পেজে কাজ করবে।

Global Search

Customer, Supplier, Invoice, Item, Voucher, Tender নম্বর দিয়ে সার্চ।

Command Palette

Keyboard থেকে দ্রুত যেকোনো অনুমোদিত পেজ বা Action চালু করা।

Notification Center

Approval, overdue payment, low stock, tender deadline ও system alerts।

Recent Activity

সাম্প্রতিক খোলা পেজ, নিজের কার্যক্রম এবং গুরুত্বপূর্ণ পরিবর্তনের ইতিহাস।

Company / Branch Selector

অনুমোদিত Company, Branch, Warehouse ও Fiscal Period নির্বাচন।

### **B. Sales & CRM**

তোমার ERP-এর Sales এবং CRM-কে একসঙ্গে কাজ করাতাম, কিন্তু Accounting-এর সঙ্গে গুলিয়ে ফেলতাম না।

[PROVENDAS](https://images.openai.com/static-rsc-4/_muOwKaoonNjGE1PGDl6sWgsWO2ZNr6FMv-HhjT_QKYAOVKoMO5EkGHBBCrSqh0SMfLfrdaknf9vV1G-hh8s2j0DLZo1gJC-nh9ovR3P4-tUKTr4GO1_EyRZo5Ro6OK5f7XL8ki01hV3qhQKlafLBZHVdvC41Aoo6Eb1PZakGiw?purpose=inline)  
[Adding Backordered Items to Invoice \| Community](https://images.openai.com/static-rsc-4/WaUKHs9zXkfP97AVOlpe_mqQJrB5GwTTqUek6ysRvFf6EeP--Tc1PhtZ9YRcY6XoSaRvzZ6tYI1zgsjmmK_zQeBKG8r62A10JO6koM34_Tz4IW1F3b4ZSXsBTyKnTV-BwDeNEQtejVaPLabSqWnyu20MFw0ZqLemFZdDhXCMYO8?purpose=inline)  
[Accounting Module \| Discovery Solutions International Inc.](https://images.openai.com/static-rsc-4/_SFKoKTSvwSAdql9UZGQsfzodrUvyZduh2Nbm6YjaJ12Dl6aiR2JwlATKBq2o3gRhb3iCYGxhWSI1w98_TqWyothCpjhwqrS5T1s3cmmhRIPXcM0JREU6VjGeSexcV5f8TDTSGW5Zo7ilGGeyKjcPw_ZUrC2ZZmDPMin9pSpv1M?purpose=inline)  
10

Sales Functions:

* Customer / PartyMaster নির্বাচন  
* Quotation তৈরি এবং PDF Print  
* Quotation থেকে Sales Order  
* Sales Invoice তৈরি  
* Delivery Challan / Gate Pass  
* Customer Payment Receipt  
* Customer Ledger / Statement  
* Outstanding Receivables  
* Customer Credit Limit Warning  
* Sales Return / Credit Note  
* Sales Invoice Posting  
* Sales Profit & Margin Analysis  
* Customer-wise Sales History  
* Salesperson-wise Performance

CRM Functions:

* Lead Creation  
* Lead → Opportunity Conversion  
* Kanban Pipeline  
* Follow-up Reminder  
* Customer Contact History  
* Quotation Follow-up  
* Lost Opportunity Reason  
* Customer Visit / Meeting Log

CRM Lead এবং Opportunity যেন সরাসরি Sales Invoice তৈরি না করে। Commercial workflow সম্পন্ন হয়ে Sales Order ও Invoice তৈরি হবে।

### **C. Purchase & Import**

[ERP procurement solution for your business \| Xentral](https://images.openai.com/static-rsc-4/O1OJ-yYXye9Vyz7Esveh_WAOK5g6zohKT4POBupjX4R-B6x17A0AorQhL0ErFCGoIbcVxss1vahKzDFVzs72qkf9qqKNo9ySjc2WOxHfhut-4AwGsRmgdVl72h16ISlHTDAboH5KXLWGSm9uFnpQmjw9UPsmFvhG1eS-R4jOs5E?purpose=inline)  
[iCON](https://images.openai.com/static-rsc-4/C9kEahuWYtUiLaeQ4z1HEPV_BqKq65iUUqKOgsV6gDDREWTRMlulEHKfpIi6SIw6wIY12R50ksUCowRSqH9Hty51jx5_CL4zrw61lN6UTIsau7D-zPSLj3yUFQctutvq0QEomJg0ZjpIH4VUhQDrcwUz4gt5zskzmt-TfY3VcvQ?purpose=inline)  
10

Purchase Functions:

* Supplier / PartyMaster  
* Purchase Requisition  
* Purchase Quotation Comparison  
* Purchase Order  
* Purchase Approval  
* Goods Received Note (GRN)  
* Purchase Invoice  
* Supplier Payment  
* Purchase Return  
* Supplier Outstanding  
* Supplier Statement  
* Purchase Price History

Import Functions:

* Import Header / Import Shipment  
* LC Tracking  
* Supplier Proforma Invoice  
* HS Code Lookup  
* Customs Duty / Tax  
* Bhomra Port Clearance  
* Weighbridge Gross / Tare / Net Weight  
* Warehouse Bill  
* Freight & Transport Cost  
* Landed Cost Calculation  
* Import Document Attachment  
* Shipment Status Timeline

বিশেষ গুরুত্বপূর্ণ: Purchase Invoice এবং Sales Invoice আলাদা থাকবে। Purchase থেকে stock ও Accounts Payable তৈরি হবে, Sales থেকে revenue, receivable এবং stock/COGS posting হবে। কোনোটিই অন্যটির form বা accounting logic ব্যবহার করবে না।

### **D. Inventory & Warehouse**

[Inventory Management](https://images.openai.com/static-rsc-4/2d_hVglUY7krS9hSjnpAsqWta-zUHmiF5Xc8xZut1iP3cUNYNEiHdCpfsUzW8xQ1VPr1axMsQtbhS3di7hwNOdphVumIivH3N4FUobn5pmJwtexERmjn-pAVaru71S190rv33aT1hFi21WlB9ZqDYgbkk8-zLOBUPdGTvSwE8Vc?purpose=inline)  
[Krayin Inventory Transfer \| CRM Warehouse Product Export \- WebKul](https://images.openai.com/static-rsc-4/tV9B-gQHeqaaCxRBB8PhkfjDtb-Zt9iV4G_V69_Pm8E3xBD9H2ByxWe53avdll2aLykhWL4UShwCEyC6Totp5B67GHSziZ-2q-ixN-QU2XVcMAbYEcaDsTurSHBNIlRhdeI4e13DsU8xlQEOneyaQ8sdKnrYXqZq7fe6Q1liaqU?purpose=inline)  
[Custom AI Production & Logistics ERP Software \| Kanhasoft](https://images.openai.com/static-rsc-4/LEUBQx6SJHYRzr3UliVBVFYTA2RN4_CzbR2nzfieJ8Jzkp3vDTFLdiuO9dddZa3rGSnZIzjOHe0uDqWPgHqckaEJ8Ic2CobzYyRIC47Bkmbzbs03ZSk_oLsk7ppzGuhSanX5NMm1fTPkCgRZ0eegbsOo-ZGaAb1-4pnFNHisu1o?purpose=inline)  
9

এই Module-এ আমি সবচেয়ে বেশি গুরুত্ব দিতাম, কারণ তোমার ব্যবসায় হাজার হাজার টন পণ্য কেনাবেচা হয়।

Inventory Functions:

* Item Master  
* Item Category / Unit  
* Warehouse / Yard  
* Depot-wise Stock  
* Stock On Hand  
* Stock Ledger  
* Goods Receipt  
* Goods Issue  
* Stock Transfer  
* Stock Adjustment  
* Stock Count / Physical Verification  
* Stock Reservation  
* Low Stock Alert  
* Overstock Alert  
* Inventory Valuation  
* Weighted Average Cost (WAC)  
* Stock Movement History  
* Damaged / Lost Stock  
* Moisture / Weight Adjustment  
* Reorder Suggestions

Item Details Page:

একটি Item খুললে এক পেজেই দেখতে চাইতাম:

* Item Code ও Name  
* Unit  
* Current Quantity  
* Available / Reserved Quantity  
* Average Cost  
* Stock Value  
* Warehouse-wise Quantity  
* Purchase History  
* Sales History  
* Stock Ledger  
* Supplier List  
* Price History

উদাহরণ:

* Pakur Stone 20mm  
* Pakur Stone 16mm  
* Bhutan Boulder  
* Sylhet River Shingle  
* River Sand FM 2.5  
* Rebar 500W

সব Item, Unit, Category এবং Warehouse ডাটাবেস থেকে আসবে। Hardcoded dropdown রাখতাম না।

### **E. Finance & Accounting**

[M3 Experience Designer: General Ledger \- Administration \| Infor Marketplace](https://images.openai.com/static-rsc-4/OYYNpOTvrIqM4NiygQZ72TbDMdqY20UGZPNsw888mEvNHmSoISx3WfjBBdNv9nPdhav_2R_z6Zh-47vsZeUPFP8YVDs1Zf1nmeEG9WuZted-wDAas4KxLQWS51oJS3JimI26fLjTn0kecDgi0jFGZOc1zS3Qaei2zaWWeF-pekM?purpose=inline)  
[Accounting Reports \| OO Docs](https://images.openai.com/static-rsc-4/NDs-nQmiQBckzavTB7khAsJW7fYF_r19bq7nI8r3tr8NwYQsZrxwnx0qhhPPfT--ZD8YG_HaEQ1qQz-hyDhykHniiTeh4Nr8g-hRyB2Zggm6OSs-saL61zeOqygW0f4ueUDPw4tbizvMsjwln4_JVd_VsISevdh72WQzXjPF_94?purpose=inline)  
[Bank Reconciliation Automation \| Software Platform \| AccountsIQ](https://images.openai.com/static-rsc-4/RxNhCD7oEJgPYXXVZK7mpAFyVOeInRceguvBre1AcuzZdL4d323YtGMPWMLVsOTRrIsyz7bHxTvYvDOpYNHNsGRwsSq4gzovuutTIstAQ2WYB2E9Hvm34UuIM7tmAI2j7RP-fa4HWN5p36wWPecjtIllJECB6A9I45TO3hTP4Y4?purpose=inline)  
10

Finance Module-কে অত্যন্ত পরিষ্কার ও নিয়ন্ত্রিত রাখতাম।

Finance Functions:

* Chart of Accounts  
* Journal Voucher  
* Cash Receipt  
* Cash Payment  
* Bank Receipt  
* Bank Payment  
* Customer Collection  
* Supplier Payment  
* Business Expense  
* Bank Reconciliation  
* Accounts Receivable  
* Accounts Payable  
* Customer / Supplier Ledger  
* Trial Balance  
* Profit & Loss  
* Balance Sheet  
* Cash Flow Statement  
* General Ledger  
* Budget vs Actual  
* VAT / Tax Reports  
* Accounting Period Closing

Accounting UI-তে গুরুত্বপূর্ণ নিয়ম:

1. Draft এবং Posted document আলাদা।  
2. Posted Voucher সরাসরি Edit/Delete করা যাবে না।  
3. Correction করতে Reversal / Adjustment workflow ব্যবহার করতে হবে।  
4. Debit এবং Credit balance না হলে Posting বন্ধ থাকবে।  
5. Approval ছাড়া restricted financial transaction হবে না।  
6. Stock এবং GL posting একই transaction-এর অংশ হিসেবে backend-এ সম্পন্ন হতে হবে।  
7. Frontend কখনো নিজে থেকে হিসাবের final balance নির্ধারণ করবে না।

তোমার আগের audit অনুযায়ী Bank 1120 negative balance এবং treasury payment restriction ছিল। তাই Finance UI-তে শুধু সবুজ Success দেখানোর পরিবর্তে প্রকৃত reconciliation ও balance warning দেখাতাম।

## **৪. Data Table Design: ERP-এর সবচেয়ে গুরুত্বপূর্ণ UI**

আমি ERP-এর প্রতিটি তালিকাকে Excel-এর মতো ব্যবহারযোগ্য করতাম।

Sales Invoices

Commercial Operations / Sales  
Draft

Search invoice, customer, reference...

All Status  
Draft  
Approved  
Posted

| Invoice | Customer | Amount | Status |
| :---- | :---- | :---- | :---- |
| INV-001 | ABC Traders | ৳ 85,000 | Posted |
| INV-002 | XYZ Builders | ৳ 42,000 | Draft |

Illustrative table layout and sample records only.

প্রতিটি Data Grid-এ রাখতাম:

* Global search  
* Column-wise filters  
* Sort  
* Pagination  
* Column visibility  
* Column resizing  
* Row selection  
* Bulk actions  
* Export CSV / Excel  
* Print  
* Saved filters  
* Record count  
* Total amount / quantity  
* Row-level actions  
* View / Edit / Print  
* Status badges

### **Form Design**

ERP Form-কে ৩ ভাগে সাজাতাম:

Sales Invoice Form

Draft

1\. Customer & Document Information

Customer, Invoice Date, Warehouse, Payment Terms, Reference

2\. Item & Transaction Details

Item, Quantity, Unit, Rate, Discount, VAT, Total

3\. Payment & Accounting Summary

Subtotal, Tax, Net Total, Paid, Due

Total Amount

# **৳ 85,000**

Example form only, not actual ERP data.

Form-এর মধ্যে:

* Auto-generated document number  
* Dynamic FK dropdown  
* Auto-calculation  
* Validation message  
* Draft save  
* Save & Continue  
* Save & Print  
* Approval  
* Posting  
* Duplicate prevention  
* Unsaved changes warning

তবে Auto-generated number, tax, stock balance বা accounting calculation frontend-এ authoritative হবে না। Backend-ই final validation করবে।

## **৫. Workflow ও Approval Center**

তোমার বর্তমান `ApprovalWorkflowCenter.tsx` আরও কার্যকর করতাম।

[Introduction \| ExFlowDocs](https://images.openai.com/static-rsc-4/fEvO2qxJp2-SNPY3DwNliiAmJSnG-abmjNhW3RjOAfuscLde54hYuHQpgwa958bIYMdbbpZxrx8lPG9lJADSKjLpoa0pauiXO0j9VHN8at_aCkAdjgyY1IoNJohAJqO3BDu_8_GASklD6X-S3EmyFvF6lcc2mhBhR5phv4HS09c?purpose=inline)  
[How to monitor the audit trail for accounts payable?](https://images.openai.com/static-rsc-4/Qrxn7V9oLE1j2a2qMdBe8BQEpf6YV1fYtrQmDUBLWSHYQjohvRICTeqDf6JRhdvr_UNvXQuwYbvKosCDxAcUngtjy6ZQhwwmrqPHCG-NtRqmmQi9tHPk6S2Ui659uhDkmpRLWmBYsqEYrkjnY6u64ICs9_U4_qFkLDeaHiSIziM?purpose=inline)  
12

একটি কেন্দ্রীয় Approval Inbox থাকত:

| Document | Amount | Status |
| ----- | ----- | ----- |
| Purchase Order | ৳ 8,50,000 | Pending |
| Bank Payment | ৳ 3,00,000 | Pending |
| Journal Voucher | ৳ 1,20,000 | Pending |

Functions:

* Pending Approval Queue  
* Document Preview  
* Approve  
* Reject  
* Send Back for Correction  
* Approval History  
* Approval Rules  
* Approval Threshold  
* Delegation  
* Escalation  
* Maker / Checker Separation

Approve করার আগে সম্পূর্ণ Document, Supporting Documents, Accounting Impact এবং Stock Impact দেখা যাবে।

## **৬. Tender & Market Intelligence**

তোমার ব্যবসার জন্য এই অংশটি গুরুত্বপূর্ণ, কারণ তুমি শুধু পণ্য বিক্রি করো না, সরকারি প্রকল্পের চাহিদাও জানতে চাও।

[Find \- Features \- Bidrock](https://images.openai.com/static-rsc-4/KM8oORLRptz4sPl0CCjgS88dRnlc5egY9_Lr9-j1fR45B0zv-IPuZ8f6bE7w2q7IJvRkpzTMS8hTAupQrutpLBZcfqYhVd6nYWKA_ew58iJ69aTEDhlvGDJQXejVlnYkMVBUALxfLCLvjVMFzbAatDgjuN27O3t3Ezzr30z6RW0?purpose=inline)  
[STACK Reviews, Prices & Ratings \| GetApp UK 2026](https://images.openai.com/static-rsc-4/N3jnEfCXpUYmM_YN70vAUoJIHVXzJryBqoFdB2yiddPd49Zla_ElDU71EE9Ew4WDhg6JLAgwS1H7vH8BIL-RpsgfE7XX58WqQJe7dDE_TAuE9J7UIsxb_ezTIzaR8dQ2Hpk1D_roOaN0asd3ZGKURnKi-Y33NLBk2Xc-f3Ez3wo?purpose=inline)  
[Price Trends Analysis: Transforming Pricing Data into Market Insights \- Kemiex](https://images.openai.com/static-rsc-4/FYhGBDber6ViulogmGCLeUmW3jHLHTP0APWfdlJDoMn4LyeerVicItEUxVHyY0FGgKDpcsInRr0Fx1BGmsYI9sD7HJ67of4pOSY1d2JMNxh8GOXx2odv2NNlRm2-s52FRjMQOXVXTJBc6g1kX_LUn7matHzuKf6CFCu_O-g5ajg?purpose=inline)  
12

আমি এখানে রাখতাম:

* Government Tender Intelligence  
* e-GP Tender Register  
* Procuring Entity  
* Tender Deadline Calendar  
* Tender Document Attachment  
* Tender Qualification Checklist  
* BOQ Import / Extraction  
* BOQ Material Mapping  
* Item-to-BOQ Mapping  
* Project Material Demand  
* Market Price Comparison  
* Supplier Rate History  
* Landed Cost Estimation  
* Expected Profit Scenario  
* Tender Opportunity Pipeline

উদাহরণ workflow:

`Tender → BOQ → Material Mapping → Estimated Quantity → Supplier Price → Import/Landed Cost → Transport Cost → Profit Scenario → Tender Decision`

AI থাকলে সেটি তথ্য বিশ্লেষণ করবে, কিন্তু tender submission বা financial commitment নিজে থেকে করবে না।

## **৭. Mobile Frontend কেমন করতাম?**

তোমার ZIP-এ ইতোমধ্যে `MobileAppShell.tsx`, `MobileDashboard.tsx`, `MobileInventory.tsx`, `MobileSalesOrders.tsx` এবং Offline Sync রয়েছে।

আমি এগুলো বাদ দিতাম না। বরং Desktop ERP-এর সঙ্গে consistent করতাম।

[Logiks WMS \- Best Cloud-based WMS for SAPB1](https://images.openai.com/static-rsc-4/pvcB85i-Te8nzmQaLsFCyw_RGWhlGp__LGjhPM4IwIX_byieLw0Fx1u1VkYJ3KkfYe4ctPM2XuyxD3nw_6UuhoRVh1doiRQvtJ1a0KiS-yF7K1ozX2XcXehBC-__nEXKnjffK4p5b4vgoa1OoEKJbj1dB3b8B6Phq1O2y9RjZiA?purpose=inline)  
[Field Sales & Order Management Software for Indian Distributors \| Effortless](https://images.openai.com/static-rsc-4/Vhk-lLBNX8npwLI5A-X_QST1QLThyyMJCbt9ssWx-_-YJ47NKS7pXEYshQ4KBSWs3sjQAk8D5OTDgS6RyfG8Y9IgUntATFMACMhM6acO3ZbmRMJqEGQTtyA37zsOmN23BzZgco3cBjHsAoZ-h_hc4H0spMOvBApkz7rwu78tTws?purpose=inline)  
[Mobile Inventory UX for Barcode Scanning & Transfers by UITOP on Dribbble](https://images.openai.com/static-rsc-4/XO2LuXxzlJin6012p2sC_6zlfftdUMABMIvclje_ExmFx4PMFIPpPR7leQBs_RZAhac2fHronQFz5FRe5tth9cpaSa7kCVLBy66DXVbEm3skTCfmehFALTpXLjBEvA7GPwnG41rjU50DDubuRHWNL24J2h9YGzfYjF1LO-Fr1nY?purpose=inline)  
14

### **Mobile-এ মূলত রাখতাম**

* Dashboard  
* Customer Search  
* Sales Order  
* Customer Payment Collection  
* Stock Check  
* Goods Receipt  
* Stock Transfer  
* Delivery Confirmation  
* Barcode / QR Scanner  
* Photo Attachment  
* Offline Draft  
* Pending Sync  
* Approval Notification

Mobile-এ পূর্ণ Accounting বা বড় Data Grid দেখানোর চেষ্টা করতাম না। Mobile হবে field operation-এর জন্য, Desktop হবে comprehensive business management-এর জন্য।

Offline অবস্থায় কোনো financial posting বা stock movement final হবে না। Server synchronization এবং conflict validation সম্পন্ন হওয়ার আগে UI-তে Pending Sync দেখাবে।

## **৮. যেসব Function বাদ দিতাম বা পরিবর্তন করতাম**

আমি নতুন Feature যোগ করার চেয়ে অপ্রয়োজনীয় complexity কমাতে বেশি গুরুত্ব দিতাম।

| বর্তমান / সম্ভাব্য সমস্যা | আমার সিদ্ধান্ত |
| ----- | ----- |
| একই module-এর একাধিক নাম | একটি canonical navigation route |
| Duplicate dashboard | একটি Role-based dashboard engine |
| একই form বিভিন্ন জায়গায় | Shared reusable form components |
| Hardcoded dropdown | Database-driven options |
| Fake analytics / demo data | Production-এ নিষিদ্ধ |
| Duplicate notifications | Unified Notification Center |
| অপ্রয়োজনীয় animation | বাদ |
| Auto-repair UI state | নিরাপদ error recovery |
| Frontend accounting logic | Backend authoritative |
| Duplicate Sentinel indicators | একটি system health indicator |
| অপ্রয়োজনীয় nested menus | সহজ navigation |

তোমার বর্তমান ৫টি Hub architecture বজায় রাখতাম:

1. Executive & Intelligence  
2. Commercial Operations  
3. Supply Chain & Customs  
4. Financial Management  
5. System Administration & Governance

এগুলোকে আবার ১৫-২০টি নতুন Hub-এ ভাগ করতাম না।

## **৯. তোমার বর্তমান ERP-এ আমি প্রথমে কী কাজ করতাম?**

আমার মতে, এখনই নতুন UI তৈরি শুরু করা ঠিক হবে না। তোমার প্রজেক্টে অনেক UI এবং module ইতোমধ্যে আছে।

আমি নিচের ক্রমে কাজ করতাম।

Phase 1

Frontend Audit

বর্তমান সব Page, Module, Route, Component এবং API mapping যাচাই। কোন পেজ কাজ করে, কোনটি duplicate, কোনটি incomplete তা প্রমাণসহ চিহ্নিত।  
Phase 2

Design System

Sidebar, Header, Typography, Colors, Buttons, Form, Data Grid, Modal, Notification একীভূত করা।  
Phase 3

Executive & Role Dashboards

Existing backend data থেকে role-wise dashboard, KPI, approval এবং business alerts।  
Phase 4

Business Workflow UI

Sales, Purchase, GRN, Inventory, Finance এবং Approval workflow end-to-end যাচাই।  
Phase 5

Production UX Audit

Responsive, permissions, loading, empty states, error handling, accessibility এবং real-data verification।

### **একটি গুরুত্বপূর্ণ Audit সতর্কতা**

তোমার ZIP-এর `docs/audit/API_FORM_CONTRACT_MATRIX.md`\-এ কিছু Sales, Purchase এবং Inventory CRUD endpoint-এর জন্য `optionalAuthenticate` উল্লেখ আছে।

এটি Production ERP-এর জন্য বিশেষভাবে যাচাই করা দরকার।

Frontend-এ RoleGuard থাকলেই API নিরাপদ হয় না। Backend-এ প্রতিটি sensitive read/write operation-এ authentication, permission, company isolation এবং transaction validation নিশ্চিত করতে হবে।

তোমার Sentinel-এর “Self-Healing” থাকলেও কোনো accounting, inventory বা authorization error স্বয়ংক্রিয়ভাবে পরিবর্তন করে ঠিক করা উচিত নয়। UI recovery এবং business data correction আলাদা রাখতে হবে।

## **১০. আমার চূড়ান্ত Design Philosophy**

আমি তোমার ERP-কে এই ৫টি নীতির ওপর তৈরি করতাম:

* Simple: কম ক্লিক, কম অপ্রয়োজনীয় পেজ।  
* Fast: প্রতিদিনের ব্যবসার কাজ দ্রুত সম্পন্ন।  
* Reliable: কোনো fake data, ভুল balance বা অননুমোদিত transaction নয়।  
* Consistent: Sales, Purchase, Inventory ও Finance-এর মধ্যে একটিমাত্র verified business workflow।  
* Data-Driven: তোমার canonical database ও verified API থেকেই UI তৈরি হবে।

একটি ERP-এর সফলতা শুধু Dashboard সুন্দর হওয়ার ওপর নির্ভর করে না। একজন Sales Officer যেন দ্রুত invoice করতে পারে, Warehouse Staff যেন সঠিক stock দেখতে পারে, Accountant যেন নির্ভুল হিসাব পায় এবং Managing Director যেন বাস্তব ব্যবসার অবস্থা বুঝতে পারে, সেটাই আসল।

## **এখন Copilot AI-কে দেওয়ার জন্য আমার প্রস্তাবিত Master Prompt**

তুমি চাইলে এই Prompt দিয়ে তোমার বর্তমান ERP-এর Frontend উন্নয়ন শুরু করতে পারো।

# **SKA NEXUS ERP v4.2.0 — Frontend Architecture & UX Engineering Master Prompt**

Act as a Principal ERP Frontend Architect, Senior React/TypeScript Engineer, Enterprise UX Designer, and ERP Workflow Auditor.

Your responsibility is to audit and improve the EXISTING SKA NEXUS ERP frontend for Ska Trading & Logistics.

## **1\. Project Context**

* Existing React \+ TypeScript \+ Vite application.  
* Existing PostgreSQL and Express backend.  
* Existing canonical ERP schema and business modules.  
* Existing authentication, RBAC, approval workflows, accounting, inventory, CRM, procurement, import, tender intelligence, and reporting.  
* Existing 5-Hub navigation architecture.  
* Existing desktop and mobile components.

## **2\. Absolute Restrictions**

* DO NOT rebuild the ERP from scratch.  
* DO NOT create a new ERP architecture.  
* DO NOT introduce new database tables or business domains.  
* DO NOT replace existing canonical modules with duplicate implementations.  
* DO NOT invent API endpoints, database fields, or business rules.  
* DO NOT introduce mock/demo data into production workflows.  
* DO NOT modify accounting or inventory business logic without evidence.  
* DO NOT remove existing working functionality.  
* DO NOT claim files were changed or tests passed without executing and verifying them.

## **3\. First Action: Read and Audit**

Read the existing project files, including:

* PROJECT\_STATE.md  
* docs/IMPLEMENTATION\_ROADMAP.md  
* docs/audit/API\_FORM\_CONTRACT\_MATRIX.md  
* docs/audit/FORM\_DATABASE\_ALIGNMENT\_MATRIX.md  
* docs/audit/MOBILE\_RESPONSIVE\_DEFECT\_REGISTER.md  
* docs/audit/SECURITY\_VERIFICATION\_REPORT.md  
* docs/audit/ACCOUNTING\_INTEGRITY\_REPORT.md  
* src/App.tsx  
* src/config/navigation.ts  
* Existing dashboard, module, form, table, and mobile components.

Create an evidence-based inventory of:

1. Existing frontend pages.  
2. Existing routes.  
3. Existing modules.  
4. Existing API connections.  
5. Duplicate or overlapping components.  
6. Missing or broken functionality.  
7. UI consistency problems.  
8. Responsive defects.  
9. Authorization and data integrity risks.

Do not start redesigning before completing the audit.

## **4\. Frontend Design Direction**

Create a premium, professional, practical enterprise ERP interface.

Design references:

* Microsoft Dynamics 365\.  
* SAP enterprise usability.  
* Modern enterprise SaaS dashboards.

Use:

* Clean light enterprise background.  
* Deep navy and professional blue.  
* White cards with subtle borders.  
* Compact, readable data grids.  
* Consistent typography.  
* Collapsible sidebar.  
* Functional top header.  
* Breadcrumbs.  
* Unified notification center.  
* Global search and command palette.  
* Responsive desktop, tablet, and mobile layouts.

Keep English-only UI labels and Bangladeshi Taka (৳ / BDT).

## **5\. Navigation**

Preserve the existing canonical 5-Hub navigation:

1. Executive & Intelligence  
2. Commercial Operations  
3. Supply Chain & Customs  
4. Financial Management  
5. System Administration & Governance

Remove duplicate navigation entries only after confirming their route and functionality are safely consolidated.

Do not create a separate Super Admin module if it already exists.

## **6\. Role-Based Dashboard**

Improve the existing dashboard system.

Managing Director:

* Cash and bank position.  
* Sales and purchase summaries.  
* Receivables and payables.  
* Inventory valuation.  
* Profit and cash flow.  
* Pending approvals.  
* Operational alerts.

Finance:

* Cash and bank.  
* Receivables.  
* Payables.  
* Journal vouchers.  
* Reconciliation.  
* Accounting reports.

Sales:

* Quotations.  
* Sales orders.  
* Sales invoices.  
* Customer collections.  
* Customer credit exposure.  
* Sales performance.

Procurement:

* Purchase orders.  
* Supplier comparison.  
* Goods receipt.  
* Import status.  
* Supplier outstanding.

Inventory:

* Stock on hand.  
* Warehouse stock.  
* Stock movements.  
* Reorder alerts.  
* Inventory valuation.

Tender Officer:

* Tender deadlines.  
* BOQ mapping.  
* Material demand.  
* Market prices.  
* Tender opportunity status.

Auditor:

* Read-only reports.  
* Ledger.  
* Audit history.  
* Reconciliation evidence.

All dashboards must use verified backend data and respect RBAC.

## **7\. ERP Functional UX**

Improve existing modules without duplicating them:

* Sales and CRM.  
* Purchase and Procurement.  
* Import and Customs.  
* Goods Receipt.  
* Inventory and Warehouse.  
* Finance and Accounting.  
* Master Data.  
* Tender Intelligence.  
* BOQ and Material Mapping.  
* Workflow and Approval.  
* Reports and Analytics.  
* System Administration.

Ensure Sales Invoice and Purchase Invoice remain completely separate.

## **8\. Data Grid Requirements**

Standardize existing grids with:

* Search.  
* Filtering.  
* Sorting.  
* Pagination.  
* Column visibility.  
* Column resizing.  
* Row selection.  
* Permission-aware bulk actions.  
* CSV/Excel export where supported.  
* Print.  
* Record count.  
* Loading, empty, and error states.

Avoid excessive UI density and horizontal overflow.

## **9\. Form Requirements**

Create consistent forms with:

* Clear sections.  
* Database-driven foreign-key dropdowns.  
* Correct validation.  
* Dynamic calculations.  
* Draft saving where supported.  
* Unsaved-change warnings.  
* Document status.  
* Approval status.  
* Audit history.  
* Permission-aware actions.

Frontend calculations must not replace backend authoritative accounting, stock, tax, or financial validation.

## **10\. Security and Accounting Integrity**

* Enforce authorization in the backend.  
* Treat frontend RoleGuard as supplementary protection.  
* Verify company and branch isolation.  
* Never expose restricted actions to unauthorized users.  
* Never allow direct editing of posted financial documents.  
* Respect reversal and correction workflows.  
* Never auto-repair financial or stock records.  
* Verify API contracts before connecting UI components.

## **11\. Performance and Reliability**

* Use existing React architecture and dependencies where appropriate.  
* Avoid unnecessary dependencies.  
* Prevent duplicate API requests.  
* Implement controlled loading and error states.  
* Use caching only with correct invalidation and company/user isolation.  
* Avoid stale financial or inventory data.  
* Preserve existing Sentinel monitoring.  
* Do not claim automatic recovery unless it is actually implemented and verified.

## **12\. Execution Method**

Work in small, reviewed batches.

For each batch:

1. Identify exact files.  
2. Explain the existing defect with evidence.  
3. Propose the smallest safe change.  
4. Implement only approved changes.  
5. Run TypeScript and relevant tests.  
6. Verify affected API contracts.  
7. Check accounting, inventory, authorization, and responsive behavior.  
8. Report modified files and actual test results.

## **Final Objective**

Deliver a stable, professional, fast, responsive, and reliable enterprise frontend for SKA NEXUS ERP.

The objective is to FINISH and STABILIZE the existing ERP, not redesign it into another system.

Prioritize business correctness, usability, consistency, and verified production readiness over visual effects or unnecessary new features.

আমার ব্যক্তিগত সুপারিশ: প্রথমে তোমার বর্তমান ERP-এর একটি পূর্ণ Frontend Audit করাও। তারপর শুধু যেসব UI সত্যিই দুর্বল বা অসম্পূর্ণ, সেগুলো উন্নত করো। এতে তোমার ইতোমধ্যে তৈরি কাজ নষ্ট হওয়ার ঝুঁকি কমবে এবং ERP বাস্তবে ব্যবহারযোগ্য হওয়ার দিকে এগোবে।

টেবলি আনুযায়ী কিকি অপশাসন তাকা উচিৎ  
Worked for 1m 9s

তোমার আপলোড করা SKA NEXUS ERP v4.2.0-এর `TABLE_RESPONSIBILITY_REGISTER.md` এবং 73টি Canonical Table অনুযায়ী এবার নির্দিষ্ট করে বলছি।

তুমি জানতে চাচ্ছো, প্রতিটি Database Table অনুযায়ী Frontend-এ কী কী Option, Button, Action এবং Function থাকা উচিত।

এখানে একটি গুরুত্বপূর্ণ বিষয়: 73টি Database Table মানেই 73টি আলাদা UI Page নয়। কিছু Table-এর নিজস্ব Page থাকবে, কিছু Parent Form-এর ভিতরে Line Item হিসেবে থাকবে, আর কিছু Table শুধু System-এর Backend-এ কাজ করবে।

আমি নিচের কাঠামো অনুসরণ করতাম:

* Master Tables: Create, View, Edit, Activate/Deactivate  
* Transaction Tables: Create, View, Edit Draft, Approve, Post, Print  
* Ledger Tables: View, Filter, Export, Drill-down  
* Workflow Tables: Configure, Approve, Reject, History  
* Security Tables: Manage, Assign, Revoke, Audit

## **১. Core Organization & Security**

Database Tables 1–10

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_company` | Company Profile | View, Edit, Company Settings |
| `tbl_branch` | Branch Management | Create, Edit, View, Activate/Deactivate |
| `tbl_app_user` | User Management | Create User, Edit, Assign Role, Reset Password, Lock/Unlock |
| `tbl_role` | Role Management | Create Role, Edit, Assign Permissions |
| `tbl_permission` | Permission Matrix | View, Search, Configure Permission |
| `tbl_role_permission` | Role Permission Assignment | Assign, Revoke, View Permission Matrix |
| `tbl_user_session` | Active Sessions | View Sessions, Revoke Session, Force Logout |
| `tbl_document_sequence` | Document Numbering | View, Configure Prefix, Reset Period Sequence, Preview |
| `tbl_system_setting` | System Settings | View, Edit, Search, Save, Restore Previous Value |
| `tbl_audit_log` | Audit Trail | View, Filter, Search, Export, Record Details |

বিশেষ নিয়ম: User Management-এ Delete-এর পরিবর্তে Deactivate ব্যবহার করতাম। Audit Log কখনো Edit বা Delete করা যাবে না।

## **২. Status Engine & Approval Workflow**

Database Tables 11–15

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_status_group` | Status Group Configuration | Create, Edit, View, Activate |
| `tbl_status_item` | Status Configuration | Add Status, Edit Label, Set Sequence, Activate |
| `tbl_approval_workflow` | Approval Workflow Setup | Create Workflow, Configure Rules, Activate/Deactivate |
| `tbl_approval_request` | Approval Inbox | View Request, Approve, Reject, Return for Correction |
| `tbl_approval_step` | Approval Step Details | View Step, Assign Approver, Approve/Reject, View History |

### **Approval Request-এর বিশেষ Options**

* Document Preview  
* Request Details  
* Supporting Documents  
* Approval History  
* Approve  
* Reject  
* Return for Correction  
* Approval Timeline

Approve করার আগে সংশ্লিষ্ট Document এবং Accounting/Inventory Impact দেখাতে হবে।

## **৩. Party Master & Geography**

Database Tables 16–21

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_sub_account_type` | Party Type Management | Create, Edit, Activate |
| `tbl_division` | Division Management | View, Create, Edit, Activate |
| `tbl_district` | District Management | View, Create, Edit, Division Mapping |
| `tbl_gov_department` | Government Department | Create, Edit, Search, Activate |
| `tbl_sub_account` | PartyMaster | Create Party, Edit, View Ledger, Statement, Activate |
| `tbl_contact_person` | Party Contact Management | Add Contact, Edit, Set Primary Contact, Deactivate |

### **PartyMaster-এর ভিতরে কী কী Option থাকবে?**

* Customer  
* Supplier  
* Importer  
* Transporter  
* Government Department  
* Other Business Party  
* Contact Persons  
* Address  
* Customer Credit Limit  
* Payment Terms  
* Customer Ledger  
* Supplier Ledger  
* Sales History  
* Purchase History  
* Outstanding Balance  
* Statement Print

Customer এবং Supplier-এর জন্য আলাদা আলাদা Master Table বানানোর দরকার নেই। তোমার `tbl_sub_account` এবং `tbl_sub_account_type` অনুযায়ী একক PartyMaster থাকবে। তবে Customer ও Supplier-এর নিজস্ব Transaction এবং Ledger আলাদা থাকবে।

## **৪. General Ledger & Accounting**

Database Tables 22–31

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_currency` | Currency Master | View, Edit, Activate |
| `tbl_currency_rate` | Exchange Rate | Add Rate, Edit Draft, View Rate History |
| `tbl_fiscal_year` | Fiscal Year | Create, Configure, Open/Close |
| `tbl_fiscal_period` | Accounting Period | View, Open, Close, Period Lock |
| `tbl_account_group` | Account Group | Create, Edit, View |
| `tbl_chart_of_account` | Chart of Accounts | Create Account, Edit, View Ledger, Activate |
| `tbl_journal` | Journal Voucher | Create, Edit Draft, Approve, Post, Print |
| `tbl_journal_line` | Journal Entry Lines | Add Line, Edit Draft Line, Remove Draft Line |
| `tbl_general_ledger` | General Ledger | View, Filter, Drill-down, Export |
| `tbl_bank_reconciliation` | Bank Reconciliation | Import Statement, Match, Reconcile, Review Differences |

### **Chart of Accounts-এর Options**

* Account Code  
* Account Name  
* Account Group  
* Parent Account  
* Account Type  
* Control Account  
* Opening Balance  
* Ledger View  
* Account Activity  
* Activate / Deactivate

### **Journal Voucher-এর Options**

* New Journal  
* Save Draft  
* Add Debit Line  
* Add Credit Line  
* Select GL Account  
* Select Party  
* Attach Document  
* Validate Balance  
* Submit for Approval  
* Approve  
* Post  
* Print Voucher  
* View Audit History

Journal Line আলাদা Navigation Page হওয়া উচিত নয়। Journal Voucher Form-এর ভিতরে Editable Line Grid হবে।

Posted Journal সরাসরি Edit/Delete করা যাবে না।

## **৫. Treasury & Cash / Bank**

Database Tables 32–35

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_payment_method` | Payment Method | Create, Edit, Activate |
| `tbl_cash_transaction_type` | Transaction Type | Configure, View, Activate |
| `tbl_cash_transaction` | Cash & Bank Transactions | Create Receipt, Payment, View, Approve, Post, Print |
| `tbl_payment_allocation` | Payment Allocation | Allocate, Reallocate Draft, View Allocation |

### **Cash & Bank Dashboard**

* Cash In  
* Cash Out  
* Bank Receipt  
* Bank Payment  
* Customer Collection  
* Supplier Payment  
* Expense Payment  
* Payment Allocation  
* Cash Book  
* Bank Book  
* Bank Reconciliation  
* Transaction History  
* Receipt / Voucher Print

Customer Payment, Supplier Payment এবং Business Expense একই Cash/Bank Transaction Engine ব্যবহার করতে পারে, কিন্তু Transaction Type এবং Accounting Rules আলাদা থাকবে।

## **৬. Cash Flow & Budget**

Database Tables 36–38

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_budget_header` | Budget Management | Create Budget, Edit Draft, Submit, Approve, Lock |
| `tbl_budget_line` | Budget Details | Add Line, Edit Draft, View Category-wise Budget |
| `tbl_budget_variance_approval` | Budget Variance Approval | Review Variance, Approve Exception, Reject, History |

### **Budget Dashboard**

* Annual Budget  
* Monthly Budget  
* Branch-wise Budget  
* Expense Category Budget  
* Actual vs Budget  
* Budget Variance  
* Budget Utilization  
* Budget Approval  
* Variance Alert  
* Budget Print / Export

Budget-এর Actual Value সরাসরি Journal এবং Ledger থেকে আসবে। আলাদা করে হাতে Actual Expense লিখে Profit/Loss তৈরি করা যাবে না।

## **৭. Inventory & Multi-Depot Logistics**

Database Tables 39–45

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_unit` | Unit of Measurement | Create, Edit, Activate |
| `tbl_item_category` | Item Category | Create, Edit, Parent Category, Activate |
| `tbl_item` | Item Master | Create Item, Edit, View Stock, View History, Activate |
| `tbl_warehouse` | Warehouse / Depot | Create, Edit, View Stock, Activate |
| `tbl_stock_ledger` | Stock Ledger | View, Filter, Item History, Warehouse History, Export |
| `tbl_stock_transfer` | Stock Transfer | Create, Edit Draft, Approve, Dispatch, Receive, Print |
| `tbl_stock_transfer_line` | Transfer Line Items | Add Item, Edit Draft, Remove Draft Line |

### **Item Master-এর ভিতরে Options**

* Item Code  
* Item Name  
* Item Category  
* Unit  
* Purchase Rate  
* Sales Rate  
* Reorder Level  
* Item Description  
* Purchase Account  
* Sales Account  
* Inventory Account  
* COGS Account  
* Stock on Hand  
* Stock by Warehouse  
* Purchase History  
* Sales History  
* Stock Ledger  
* Activate / Deactivate

### **Warehouse / Depot Options**

* Warehouse Details  
* Branch Mapping  
* Warehouse Stock  
* Stock In  
* Stock Out  
* Stock Transfer  
* Stock Count  
* Stock Valuation  
* Movement History

তোমার ব্যবসার জন্য Warehouse/Depot-wise stock দেখা খুব গুরুত্বপূর্ণ। Bhomra, Noapara, Mongla বা অন্যান্য বাস্তব Depot-এর তথ্য DB থেকে আসবে।

## **৮. Stock Audit & Adjustments**

Database Tables 46–47

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_stock_adjustment` | Stock Adjustment | Create Draft, Review, Approve, Post, Print |
| `tbl_stock_adjustment_line` | Adjustment Details | Add Item, Record Count, Enter Variance, View Difference |

### **Stock Adjustment-এর Options**

* Adjustment Number  
* Warehouse  
* Item  
* System Quantity  
* Physical Quantity  
* Difference  
* Reason  
* Supporting Document  
* Approval  
* Post Adjustment  
* Stock Ledger Impact  
* Audit History

Stock Adjustment সরাসরি stock balance Edit করার পদ্ধতি হবে না। এটি অনুমোদিত Adjustment Transaction তৈরি করবে, যা Stock Ledger-এ প্রভাব ফেলবে।

## **৯. Import Operations & Weighbridge**

Database Tables 48–53

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_port_station` | Port / Station Master | Create, Edit, Activate |
| `tbl_customs_tariff_hs` | HS Code & Customs Tariff | Create, Edit, Search, Tariff History |
| `tbl_import_header` | Import Management | Create Import, Edit Draft, Track, Close |
| `tbl_import_line` | Import Item Details | Add Item, HS Code, Quantity, Rate, Edit Draft |
| `tbl_import_landed_cost` | Landed Cost Management | Add Cost, Allocate, Calculate, Review |
| `tbl_weighbridge_log` | Weighbridge | Record Weighing, Print Slip, View History |

### **Import Header-এর Details Page**

* Import Reference  
* Supplier  
* Port / Station  
* LC Reference  
* Shipment Date  
* Arrival Date  
* Clearance Status  
* Customs Status  
* Warehouse  
* Import Items  
* HS Code  
* Customs Duty  
* VAT / Tax  
* Freight  
* Port Charges  
* Warehouse Charges  
* Transport Cost  
* Landed Cost  
* Document Attachment  
* Shipment Timeline

### **Weighbridge Options**

* Truck Number  
* Driver  
* Gross Weight  
* Tare Weight  
* Net Weight  
* Item  
* Import Reference  
* Warehouse  
* Weight Slip  
* Re-weigh  
* Weight History

Weighbridge Record তৈরি করার পর তার history রাখা হবে। ইতোমধ্যে Stock Ledger বা GRN-এ প্রভাব পড়ে থাকলে Weight Correction-এর জন্য controlled workflow দরকার।

## **১০. Commercial Sales & CRM**

Database Tables 54–62

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_lead` | Lead Management | Create, Edit, Assign, Convert, Close |
| `tbl_opportunity` | Sales Pipeline | Create, Edit, Move Stage, Convert, Close |
| `tbl_activity` | Activity Timeline | Add Activity, View, Filter, History |
| `tbl_follow_up` | Follow-up Management | Create Reminder, Reschedule, Complete, Cancel |
| `tbl_sales_quotation` | Sales Quotation | Create, Edit Draft, Submit, Approve, Print |
| `tbl_sales_quotation_line` | Quotation Items | Add Item, Edit Draft, Remove Draft Line |
| `tbl_sales_order` | Sales Order | Create, Edit Draft, Approve, Confirm, Cancel Draft, Print |
| `tbl_sales_order_line` | Sales Order Items | Add Item, Edit Draft, View Availability |
| `tbl_delivery_challan` | Delivery Challan | Create, Approve, Dispatch, Confirm Delivery, Print |

### **CRM Dashboard Options**

* New Lead  
* Lead Assignment  
* Lead Pipeline  
* Opportunity Stage  
* Follow-up Calendar  
* Customer Activity  
* Salesperson Performance  
* Quotation Follow-up  
* Lost Opportunity Report  
* Convert Lead to Opportunity  
* Convert Approved Opportunity to Quotation

### **Sales Order Options**

* Create Sales Order  
* Customer  
* Item  
* Quantity  
* Rate  
* Warehouse  
* Expected Delivery  
* Approval  
* Delivery Status  
* Pending Quantity  
* Sales Order History  
* Print Sales Order

CRM-এর Lead, Opportunity এবং Follow-up মূলত Sales Pipeline-এর জন্য। এগুলো সরাসরি Stock বা GL Posting করবে না।

## **১১. Invoicing & Billing**

Database Tables 63–65

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_delivery_challan_line` | Delivery Details | Add Delivered Item, Record Quantity, Confirm Draft |
| `tbl_sales_invoice` | Sales Invoice | Create, Edit Draft, Approve, Post, Print, View Ledger |
| `tbl_sales_invoice_line` | Sales Invoice Items | Add Item, Edit Draft, Remove Draft Line |

### **Sales Invoice-এর Options**

* New Invoice  
* Customer  
* Sales Order Reference  
* Delivery Challan Reference  
* Item  
* Quantity  
* Unit  
* Rate  
* Discount  
* VAT  
* Subtotal  
* Grand Total  
* Paid Amount  
* Due Amount  
* Payment Terms  
* Attach Documents  
* Save Draft  
* Submit for Approval  
* Approve  
* Post  
* Print Invoice  
* Sales Return / Credit Note  
* Customer Statement  
* Audit History

Sales Invoice Post হলে backend-এর নির্ধারিত workflow অনুযায়ী Revenue, Receivable, VAT, Stock এবং COGS-এর প্রভাব পড়বে।

## **১২. Procurement & Goods Receipt**

Database Tables 66–69

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_supplier_quote` | Supplier Quotation | Create, Edit, Compare, Select, Reject |
| `tbl_purchase_order` | Purchase Order | Create, Edit Draft, Submit, Approve, Confirm, Print |
| `tbl_purchase_order_line` | Purchase Order Items | Add Item, Edit Draft, Remove Draft Line |
| `tbl_goods_received_note` | Goods Receipt Note | Create GRN, Verify, Approve, Post, Print |

### **Purchase Order Options**

* New Purchase Order  
* Supplier  
* Warehouse  
* Expected Delivery  
* Item  
* Quantity  
* Purchase Rate  
* Discount  
* Total  
* Approval  
* Supplier Quotation Reference  
* GRN Status  
* Purchase History  
* Print

### **Goods Receipt Note Options**

* GRN Number  
* Purchase Order Reference  
* Supplier  
* Warehouse  
* Truck Number  
* Challan Reference  
* Ordered Quantity  
* Received Quantity  
* Accepted Quantity  
* Rejected Quantity  
* Weight Verification  
* Attach Documents  
* Approve  
* Post Receipt  
* Print GRN

Purchase Order তৈরি করলেই Stock বাড়বে না। Goods Receipt বা নির্ধারিত Stock Receipt workflow সম্পন্ন হলে Inventory-তে পরিমাণ যুক্ত হবে।

## **১৩. Vendor Invoicing, Projects & HR**

Database Tables 70–73

| Table | Frontend Page / Option | প্রধান Actions |
| ----- | ----- | ----- |
| `tbl_goods_received_note_line` | GRN Item Details | Add Received Item, Verify Quantity, Record Rejection |
| `tbl_purchase_invoice` | Purchase Invoice | Create, Edit Draft, Match GRN, Approve, Post, Print |
| `tbl_purchase_invoice_line` | Purchase Invoice Items | Add Item, Edit Draft, Match Received Quantity |
| `tbl_project` | Project Management | Create, Edit, Assign, View Budget, Track Status, Close |

### **Purchase Invoice Options**

* New Purchase Invoice  
* Supplier  
* Purchase Order Reference  
* GRN Reference  
* Supplier Invoice Number  
* Invoice Date  
* Item  
* Received Quantity  
* Purchase Rate  
* VAT  
* Discount  
* Grand Total  
* Payment Terms  
* Attach Supplier Invoice  
* Save Draft  
* Submit Approval  
* Approve  
* Post  
* Print  
* Supplier Ledger

Purchase Invoice এবং Sales Invoice সম্পূর্ণ আলাদা থাকবে।

### **Project Management Options**

* Project Code  
* Project Name  
* Customer / Government Department  
* Project Location  
* Project Manager  
* Start Date  
* End Date  
* Budget  
* Project Status  
* Material Requirements  
* Purchase References  
* Sales References  
* Project Expenses  
* Project Profitability  
* Project Documents  
* Project Timeline  
* Close Project

তোমার Table Register-এ `tbl_project` আছে। তাই Project Management UI থাকলে সেটি এই existing table ও verified workflow-এর সঙ্গে যুক্ত হবে, নতুন Project Tables তৈরি করা হবে না।

# **১৪. প্রতিটি Table-এর জন্য Common Options**

উপরের Table-specific Actions ছাড়াও ERP-তে কিছু Common Option থাকবে। তবে সব Table-এ সব Option দেখানো হবে না।

| Option | কোন ধরনের Table-এ থাকবে |
| ----- | ----- |
| View Details | সব User-accessible Table |
| Create / New | Master ও Transaction Table |
| Edit | Editable Master ও Draft Transaction |
| Activate / Deactivate | Master Table |
| Search | বড় Master ও Transaction List |
| Filter | List, Ledger, Report |
| Export Excel / CSV | অনুমোদিত List ও Report |
| Print | Invoice, Voucher, Challan, GRN, Report |
| Approve / Reject | Approval-enabled Transaction |
| Post | Financial ও Stock-impacting Transaction |
| Reverse / Correct | Posted Transaction-এর অনুমোদিত Correction Workflow |
| View History | গুরুত্বপূর্ণ Master ও Transaction |
| Audit Trail | গুরুত্বপূর্ণ Business Record |
| Attach Documents | প্রাসঙ্গিক Transaction |
| Refresh | Data List ও Dashboard |

## **১৫. কোন Table-এর আলাদা Page হবে, আর কোনটি Form-এর ভিতরে থাকবে?**

এটাই Frontend Architecture-এর গুরুত্বপূর্ণ সিদ্ধান্ত।

| Table Type | UI Structure |
| ----- | ----- |
| Master Table | আলাদা Management Page |
| Transaction Header | আলাদা Transaction List \+ Form |
| Transaction Line | Parent Form-এর ভিতরে Grid |
| Ledger Table | Read-only Ledger Page |
| Approval Table | Approval Center |
| Audit Table | Read-only Audit Page |
| Configuration Table | System Configuration Page |
| Session Table | Security / Session Management |
| Allocation Table | Parent Transaction-এর Allocation Section |

### **তোমার 73 Table-এর জন্য আমার Final UI Rule**

যেসব Table-এর আলাদা Page থাকা উচিত:

Company, Branch, User, Role, PartyMaster, Item, Warehouse, Chart of Accounts, Sales Invoice, Purchase Invoice, Sales Order, Purchase Order, GRN, Cash & Bank, Import, Weighbridge, Stock Transfer, Stock Adjustment, CRM Lead, Opportunity, Budget, Project, Approval Center, Audit Trail, General Ledger, Bank Reconciliation।

যেসব Table Parent Form-এর ভিতরে থাকবে:

* `tbl_journal_line` → Journal Voucher  
* `tbl_stock_transfer_line` → Stock Transfer  
* `tbl_stock_adjustment_line` → Stock Adjustment  
* `tbl_import_line` → Import Header  
* `tbl_sales_quotation_line` → Sales Quotation  
* `tbl_sales_order_line` → Sales Order  
* `tbl_delivery_challan_line` → Delivery Challan  
* `tbl_sales_invoice_line` → Sales Invoice  
* `tbl_purchase_order_line` → Purchase Order  
* `tbl_goods_received_note_line` → GRN  
* `tbl_purchase_invoice_line` → Purchase Invoice  
* `tbl_budget_line` → Budget

এভাবে 73টি Table ব্যবহার করেও Frontend অপ্রয়োজনীয়ভাবে বড় হবে না।

## **আমার শেষ সুপারিশ**

তোমার ERP-এর জন্য আমি একটি Table-to-UI Action Matrix তৈরি করতাম। সেখানে প্রতিটি Table-এর জন্য থাকবে:

`Database Table → Frontend Page → Field → Button → Permission → API → Validation → Business Workflow → Test Case`

এটি তৈরি হলে Copilot আর অনুমান করে নতুন Button, Form বা API বানাতে পারবে না।

একটি বিষয়ও মনে রাখতে হবে: তোমার 73-Table Register-এ Tender Intelligence, BOQ Mapping এবং Marketing-এর পূর্ণ dedicated tables নেই। তাই এগুলোর UI তৈরি করার আগে existing canonical table ও verified API-তে বাস্তব data support আছে কি না পরীক্ষা করতে হবে। শুধু Navigation-এ Module আছে বলে সেটি সম্পূর্ণ কার্যকর ধরে নেওয়া যাবে না।

আমি পরবর্তী ধাপে তোমার 73টি Table-এর জন্য পূর্ণ `TABLE → PAGE → FIELD → BUTTON → PERMISSION → API` Matrix তৈরি করব। এটি হবে Copilot-এর জন্য বাস্তব Frontend implementation specification, যাতে প্রতিটি Table অনুযায়ী সঠিক Option ও Button তৈরি করা যায়।

next step

এবার পরবর্তী ধাপে তোমার SKA NEXUS ERP-এর 73টি Canonical Database Table অনুযায়ী সম্পূর্ণ Frontend Implementation Matrix তৈরি করব।

এটি হবে তোমার ERP Frontend-এর বাস্তব নির্মাণ পরিকল্পনা। Copilot বা অন্য AI Developer Agent এই Specification অনুসরণ করে কাজ করতে পারবে, অনুমান করে নতুন Table, API বা Module তৈরি করবে না।

# **SKA NEXUS ERP**

## **Frontend Implementation Specification**

### **১. প্রতিটি Table-এর জন্য নির্ধারিত কাঠামো**

প্রতিটি Table-এর জন্য নিচের তথ্য নির্ধারণ করতে হবে:

| Specification | কী নির্ধারণ হবে |
| ----- | ----- |
| Database Table | Canonical Table Name |
| Frontend Page | কোন Page-এ থাকবে |
| UI Type | List, Form, Detail, Grid, Dashboard |
| Fields | কোন Field দেখাবে বা Edit করবে |
| Buttons | Create, Save, Approve, Post, Print |
| Permissions | কোন Role কী করতে পারবে |
| API | কোন Verified Endpoint ব্যবহার করবে |
| Validation | কোন Business Rule প্রযোজ্য |
| Workflow | Draft থেকে Final পর্যন্ত |
| Test Cases | কীভাবে যাচাই হবে |

## **প্রথমে ZIP-এর প্রকৃত Schema যাচাই**

তোমার আপলোড করা ZIP-এর `database/migrations/20261029000000_init_canonical_schema.sql` এবং `docs/TABLE_RESPONSIBILITY_REGISTER.md` মিলিয়ে একটি গুরুত্বপূর্ণ বিষয় পেয়েছি।

দুটি ফাইলে Table Structure পুরোপুরি এক নয়।

| বিষয় | Schema Migration | Responsibility Register |
| ----- | ----- | ----- |
| Table Count | 73 | 73 দাবি করা হয়েছে |
| Database Naming | `company`, `party_master` ইত্যাদি | `tbl_company`, `tbl_sub_account` ইত্যাদি |
| CRM Activity | নেই | `tbl_activity` আছে |
| CRM Follow-up | নেই | `tbl_follow_up` আছে |
| Employee | আছে | Register-এ নেই |
| Payroll Entry | আছে | Register-এ নেই |
| Tender / BOQ Tables | Migration-এ নেই | Register-এর মধ্যে কিছু অতিরিক্ত Table উল্লেখ আছে |

এখানে গুরুত্বপূর্ণ হলো, 73টি Table-এর সংখ্যা ঠিক হলেও দুই ফাইলের Table Mapping মিলছে না।

তাই নিচের Matrix-এ Migration-এর বাস্তব Table Name ব্যবহার করব। নতুন Table তৈরি করার পরামর্শ দেব না।

# **Part 1: Canonical Table → Frontend Page → Options Matrix**

এই Matrix-এ তোমার ZIP-এর Migration অনুযায়ী বাস্তব Table Name ব্যবহার করছি। Register-এর পুরোনো `tbl_` নামগুলোকে সরাসরি API বা Database Name হিসেবে ব্যবহার করা যাবে না।

## **Domain 1: Organization & Security**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 1 | `company` | Company Profile | View, Edit, Save, Company Settings |
| 2 | `branch` | Branch Management | New Branch, Edit, Activate/Deactivate |
| 3 | `role` | Role Management | Create Role, Edit, View, Assign Permissions |
| 4 | `permission` | Permission Matrix | View, Search, Permission Details |
| 5 | `app_user` | User Management | Create User, Edit, Assign Role, Lock/Unlock |
| 6 | `role_permission` | Role Permission Assignment | Assign, Revoke, Save, View Matrix |
| 7 | `user_session` | Session Management | View Sessions, Revoke, Force Logout |
| 8 | `document_sequence` | Document Numbering | View, Configure, Preview, Save |
| 9 | `system_setting` | System Settings | Search, Edit, Save, Restore |
| 10 | `audit_log` | Audit Trail | View, Filter, Search, Export |

## **Domain 2: Status & Approval**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 11 | `status_group` | Status Group Management | Create, Edit, Activate |
| 12 | `status_item` | Status Configuration | Add Status, Edit, Set Order |
| 13 | `approval_workflow` | Workflow Configuration | Create, Edit, Configure Steps, Activate |
| 14 | `approval_request` | Approval Inbox | View, Approve, Reject, Return |
| 15 | `approval_step` | Approval History | View Step, Assign Approver, View History |

## **Domain 3: Party Master & Geography**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 16 | `currency` | Currency Master | View, Edit, Activate |
| 17 | `currency_rate` | Exchange Rate | Add Rate, Edit Draft, History |
| 18 | `fiscal_year` | Fiscal Year | Create, Edit, Open, Close |
| 19 | `fiscal_period` | Fiscal Period | Open, Close, Lock, View |
| 20 | `account_group` | Account Group | Create, Edit, Activate |
| 21 | `chart_of_account` | Chart of Accounts | Create Account, Edit, View Ledger |
| 22 | `party_type` | Party Type Management | Create, Edit, Activate |
| 23 | `division` | Division Management | Create, Edit, Activate |
| 24 | `district` | District Management | Create, Edit, Division Mapping |
| 25 | `gov_department` | Government Department | Create, Edit, Search, Activate |
| 26 | `party_master` | PartyMaster | Create Party, Edit, View, Ledger, Statement |
| 27 | `contact_person` | Party Contacts | Add Contact, Edit, Set Primary, Deactivate |

PartyMaster-এর মধ্যে Customer, Supplier, Importer, Transporter এবং অন্যান্য Party Type থাকবে। একই Party-কে একাধিক business relationship-এ ব্যবহারের আগে বর্তমান Schema-এর relationship ও validation যাচাই করতে হবে।

## **Domain 4: General Ledger & Finance**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 28 | `journal` | Journal Voucher | New, Draft, Approve, Post, Print, Reverse |
| 29 | `journal_line` | Journal Entry Grid | Add Line, Edit Draft, Remove Draft Line |
| 30 | `general_ledger` | General Ledger | View, Filter, Drill-down, Export |
| 31 | `bank_reconciliation` | Bank Reconciliation | Import Statement, Match, Reconcile, Review |

## **Domain 5: Treasury & Cash Management**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 32 | `payment_method` | Payment Method | Create, Edit, Activate |
| 33 | `cash_transaction_type` | Transaction Type | Configure, View, Activate |
| 34 | `cash_transaction` | Cash & Bank | Receipt, Payment, Approve, Post, Print |
| 35 | `payment_allocation` | Payment Allocation | Allocate, View Allocation, Reconcile |

## **Domain 6: Budget**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 36 | `budget_header` | Budget Management | Create, Edit Draft, Submit, Approve, Lock |
| 37 | `budget_line` | Budget Detail Grid | Add Line, Edit Draft, View Utilization |
| 38 | `budget_variance_approval` | Budget Variance Approval | Review, Approve Exception, Reject, History |

## **Domain 7: Inventory & Warehouse**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 39 | `unit` | Unit of Measurement | Create, Edit, Activate |
| 40 | `item_category` | Item Categories | Create, Edit, Parent Mapping |
| 41 | `item` | Item Master | Create, Edit, View Stock, History |
| 42 | `warehouse` | Warehouse / Depot | Create, Edit, View Stock |
| 43 | `stock_ledger` | Stock Ledger | View, Filter, Item History, Export |
| 44 | `stock_transfer` | Stock Transfer | Create, Approve, Dispatch, Receive |
| 45 | `stock_transfer_line` | Transfer Item Grid | Add Item, Edit Draft, Remove Draft |

## **Domain 8: Stock Audit & Adjustment**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 46 | `stock_adjustment` | Stock Adjustment | Create, Review, Approve, Post |
| 47 | `stock_adjustment_line` | Adjustment Item Grid | Add Item, Physical Count, Variance |

## **Domain 9: Import & Weighbridge**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 48 | `port_station` | Port / Station Master | Create, Edit, Activate |
| 49 | `customs_tariff_hs` | HS Code & Tariff | Search, View, Edit, Tariff History |
| 50 | `import_header` | Import Management | Create, Edit Draft, Track, Close |
| 51 | `import_line` | Import Item Grid | Add Item, HS Code, Quantity, Rate |
| 52 | `import_landed_cost` | Landed Cost | Add Cost, Allocate, Calculate, Review |
| 53 | `weighbridge_log` | Weighbridge | Record Weight, Re-weigh, Print Slip, History |

## **Domain 10: CRM & Sales**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 54 | `lead` | Lead Management | Create, Edit, Assign, Convert, Close |
| 55 | `opportunity` | Sales Pipeline | Create, Edit, Move Stage, Convert |
| 56 | `sales_quotation` | Sales Quotation | Create, Edit Draft, Submit, Approve, Print |
| 57 | `sales_quotation_line` | Quotation Item Grid | Add Item, Edit Draft, Remove |
| 58 | `sales_order` | Sales Order | Create, Approve, Confirm, Print |
| 59 | `sales_order_line` | Sales Order Item Grid | Add Item, Edit Draft, View Availability |
| 60 | `delivery_challan` | Delivery Challan | Create, Approve, Dispatch, Confirm Delivery |
| 61 | `delivery_challan_line` | Delivery Item Grid | Add Item, Record Quantity, Confirm |
| 62 | `sales_invoice` | Sales Invoice | Create, Approve, Post, Print, View Ledger |
| 63 | `sales_invoice_line` | Sales Invoice Item Grid | Add Item, Edit Draft, Remove |

## **Domain 11: Procurement & Purchase**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 64 | `supplier_quote` | Supplier Quotation | Create, Edit, Compare, Select |
| 65 | `purchase_order` | Purchase Order | Create, Submit, Approve, Confirm, Print |
| 66 | `purchase_order_line` | Purchase Order Item Grid | Add Item, Edit Draft, Remove |
| 67 | `goods_received_note` | Goods Receipt Note | Create, Verify, Approve, Post, Print |
| 68 | `goods_received_note_line` | GRN Item Grid | Add Item, Verify Quantity, Record Rejection |
| 69 | `purchase_invoice` | Purchase Invoice | Create, Match GRN, Approve, Post, Print |
| 70 | `purchase_invoice_line` | Purchase Invoice Item Grid | Add Item, Match Quantity, Edit Draft |

## **Domain 12: Projects & Workforce**

| \# | Database Table | Frontend Page | UI Options |
| ----- | ----- | ----- | ----- |
| 71 | `project` | Project Management | Create, Edit, Assign, Track, Close |
| 72 | `employee` | Employee Management | Create, Edit, Assign Role/Branch, Activate |
| 73 | `payroll_entry` | Payroll Management | Create Draft, Review, Approve, Process, Print |

Payroll-এর জন্য আগে Schema ও Accounting Workflow যাচাই করতে হবে। Employee বা Payroll Table থাকলেই Salary Posting, Tax Deduction বা Payroll Accounting কার্যকর আছে বলে ধরে নেওয়া যাবে না।

# **১৫. প্রতিটি Page-এর Standard Action Bar**

সব Page-এ একই Button দেখানো হবে না। Document Status ও Permission অনুযায়ী Button পরিবর্তন হবে।

| Document Status | Available Actions |
| ----- | ----- |
| Draft | Edit, Save, Delete Draft, Submit |
| Pending Approval | View, Approve, Reject, Return |
| Approved | View, Post, Print |
| Posted | View, Print, Ledger, Audit History |
| Cancelled | View, History |
| Reversed | View Original, View Reversal |

এটি একটি প্রস্তাবিত UX Pattern। বাস্তব Status Transition অবশ্যই বর্তমান Backend Workflow অনুযায়ী যাচাই করতে হবে।

## **১৬. Copilot-এর জন্য পরবর্তী Implementation Prompt**

# **SKA NEXUS ERP — Canonical 73-Table Frontend Implementation Matrix**

Act as a Principal ERP Frontend Architect and Senior React/TypeScript Engineer.

## **Objective**

Create a complete, evidence-based frontend implementation matrix for the existing SKA NEXUS ERP project.

The matrix must map:

Database Table → Frontend Page → UI Fields → Buttons → Permissions → API → Validation → Workflow → Test Cases.

## **Mandatory Source Files**

Read the uploaded project ZIP and inspect:

* docs/TABLE\_RESPONSIBILITY\_REGISTER.md  
* database/migrations/20261029000000\_init\_canonical\_schema.sql  
* Existing React frontend source.  
* Existing API routes and service implementations.  
* Existing RBAC and approval workflows.  
* Existing form/database alignment documents.

## **Critical Schema Rule**

The canonical migration contains 73 tables.

Use actual table names from the migration, including:

company, branch, app\_user, party\_master, chart\_of\_account, journal, cash\_transaction, item, warehouse, stock\_ledger, import\_header, sales\_invoice, purchase\_invoice, employee, payroll\_entry, and all other existing canonical tables.

Do not blindly use older tbl\_\* names.

Do not add tables to reconcile documentation discrepancies.

Identify mismatches between the Responsibility Register and the actual migration before implementation.

## **Required Matrix Columns**

For each of the 73 tables, document:

1. Exact Database Table Name.  
2. Primary Key.  
3. Foreign Key Relationships.  
4. Frontend Page.  
5. Parent Page, if applicable.  
6. UI Component Type.  
7. Display Fields.  
8. Editable Fields.  
9. Read-only Fields.  
10. Required Buttons.  
11. Role Permissions.  
12. Existing API Endpoint.  
13. Request/Response Contract.  
14. Validation Rules.  
15. Business Workflow.  
16. Accounting Impact.  
17. Inventory Impact.  
18. Audit Requirements.  
19. Loading/Error/Empty States.  
20. Test Cases.

## **UI Action Rules**

Master Data:  
Create, View, Edit, Activate/Deactivate.

Draft Transactions:  
Create, Save Draft, Edit, Submit, Cancel Draft.

Approval Transactions:  
View, Approve, Reject, Return for Correction.

Posted Transactions:  
View, Print, Ledger Drill-down, Audit History.

Ledger Tables:  
Read-only access, filters, search, export.

Transaction Line Tables:  
Use editable grids inside their respective parent forms.

Audit Tables:  
Read-only, append-only display.

## **Frontend Standards**

* Preserve existing React and TypeScript architecture.  
* Preserve canonical navigation.  
* Reuse existing components.  
* Avoid duplicate pages and routes.  
* Use database-driven foreign-key dropdowns.  
* Keep Sales Invoice and Purchase Invoice completely separate.  
* Keep backend accounting and stock calculations authoritative.  
* Enforce permission-aware actions.  
* Use BDT (৳).  
* Use English-only UI labels.  
* Do not invent API endpoints.  
* Do not introduce demo data into production workflows.

## **Execution Method**

First generate the full matrix as documentation.

Do not modify source code during the initial audit.

Identify discrepancies, missing API contracts, and unsupported UI actions.

Then propose implementation batches for review.

For each implementation batch, identify exact files, explain the changes, run tests, and report actual verification results.

Do not claim completion without evidence.

## **Final Deliverable**

Create:

docs/FRONTEND\_IMPLEMENTATION\_MATRIX.md

The document must cover all 73 actual canonical tables and their complete frontend responsibilities.

The goal is to stabilize and complete the existing SKA NEXUS ERP, not redesign or rebuild it.

### **আমার পরবর্তী সুপারিশ**

এই Matrix-এর পর সবচেয়ে গুরুত্বপূর্ণ কাজ হবে প্রতিটি Table-এর Field-Level UI Mapping।

কারণ Button ও Page নির্ধারণ করা হয়েছে, কিন্তু এখনো প্রতিটি Field-এর জন্য কোনটি:

* দেখানো হবে  
* Edit করা যাবে  
* Auto-calculated হবে  
* Backend থেকে আসবে  
* Required হবে  
* কোন Permission লাগবে

এসব নির্ধারণ করা বাকি।

এটাই পরবর্তী ধাপ, এবং এটি সম্পন্ন হলে তোমার ERP-এর Frontend Implementation অনেক বেশি নির্ভুলভাবে করা

এবার আমরা পরবর্তী ধাপে যাচ্ছি: 73টি Canonical Database Table অনুযায়ী Field-Level Frontend Specification।

আগের ধাপে নির্ধারণ করেছি কোন Table-এর জন্য কোন Page, Button ও Function থাকবে। এবার নির্ধারণ করব প্রতিটি Form-এর ভিতরে:

* কোন Field থাকবে  
* কোন Field Required হবে  
* কোন Field Read-only হবে  
* কোন Field Auto-calculated হবে  
* কোন Field Database থেকে আসবে  
* কোন Field-এর জন্য Permission লাগবে  
* কোন Validation প্রযোজ্য হবে

এটি হবে তোমার SKA NEXUS ERP-এর Frontend Form & Field Implementation Blueprint।

একটি গুরুত্বপূর্ণ নিয়ম: Database-এর প্রকৃত Column Name, Data Type, FK এবং Constraint যাচাই না করে কোনো Field-কে Canonical বলে ধরে নেওয়া যাবে না। নিচের UI Specification-টি সেই নিয়মে তৈরি করার ভিত্তি।

# **SKA NEXUS ERP**

## **Field-Level Frontend Specification**

## **Part 1: Organization, Security, Approval ও PartyMaster**

নিচের Field Name-গুলো তোমার ZIP-এর Canonical Migration থেকে নেওয়া। UI Label-গুলো সহজবোধ্যভাবে সাজানো হয়েছে।

### **১. Company Profile**

Table: `company`

| Database Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `company_id` | Company ID | Read-only |
| `company_code` | Company Code | Required |
| `company_name` | Company Name | Required |
| `address` | Address | Editable |
| `phone` | Phone | Editable |
| `email` | Email | Email validation |
| `base_currency_id` | Base Currency | Currency dropdown |
| `is_active` | Active | Permission-controlled toggle |
| `created_at` | Created At | Read-only |

Buttons: Edit, Save, Cancel, View History

### **২. Branch Management**

Table: `branch`

| Database Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `branch_id` | Branch ID | Read-only |
| `company_id` | Company | FK dropdown |
| `branch_code` | Branch Code | Required |
| `branch_name` | Branch Name | Required |
| `address` | Address | Editable |
| `phone` | Phone | Editable |
| `is_active` | Active | Toggle |

Buttons: New Branch, Edit, Save, Activate/Deactivate

### **৩. Role Management**

Table: `role`

| Database Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `role_id` | Role ID | Read-only |
| `role_code` | Role Code | Required |
| `role_name` | Role Name | Required |
| `description` | Description | Optional |
| `is_active` | Active | Toggle |

Buttons: Create Role, Edit, Permission Assignment, Activate/Deactivate

### **৪. Permission Management**

Table: `permission`

| Database Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `permission_id` | Permission ID | Read-only |
| `module_code` | Module | DB-driven |
| `permission_code` | Permission Code | Required |
| `permission_name` | Permission Name | Required |
| `is_active` | Active | Toggle |

Buttons: View, Search, Configure, Activate/Deactivate

Permission Code অবশ্যই Backend-এর বাস্তব Permission Registry-এর সঙ্গে মিলতে হবে।

### **৫. User Management**

Table: `app_user`

| Database Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `user_id` | User ID | Read-only |
| `username` | Username | Required, Unique |
| `password_hash` | Password Hash | Never display |
| `full_name` | Full Name | Required |
| `email` | Email | Email validation |
| `phone` | Phone | Editable |
| `role_id` | Role | FK dropdown |
| `branch_id` | Branch | FK dropdown |
| `is_active` | Active | Toggle |
| `last_login_at` | Last Login | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Create User, Edit, Assign Role, Lock/Unlock, Reset Password

Password Hash কখনো Frontend-এ পাঠানো যাবে না।

### **৬. Role Permission Assignment**

Table: `role_permission`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `role_permission_id` | ID | Read-only |
| `role_id` | Role | Dropdown |
| `permission_id` | Permission | Dropdown |
| `can_view` | View | Checkbox |
| `can_create` | Create | Checkbox |
| `can_edit` | Edit | Checkbox |
| `can_delete` | Delete | Checkbox |
| `can_post` | Post | Checkbox |

Buttons: Save Permissions, Reset, View Permission Matrix

### **৭. User Session**

Table: `user_session`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `session_id` | Session ID | Read-only |
| `user_id` | User | User lookup |
| `session_token` | Session Token | Never expose |
| `ip_address` | IP Address | Read-only |
| `user_agent` | Device / Browser | Read-only |
| `expires_at` | Expiry | Read-only |
| `is_revoked` | Revoked | Read-only status |
| `created_at` | Login Time | Read-only |

Buttons: View Session, Revoke Session, Force Logout

### **৮. Document Numbering**

Table: `document_sequence`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `sequence_id` | Sequence ID | Read-only |
| `company_id` | Company | FK dropdown |
| `document_type` | Document Type | Existing type selector |
| `prefix` | Prefix | Editable |
| `current_number` | Current Number | Restricted |
| `is_active` | Active | Toggle |

Buttons: Configure, Preview Next Number, Save

Sequence Number Reset সাধারণ User-এর জন্য থাকবে না।

### **৯. System Settings**

Table: `system_setting`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `setting_id` | Setting ID | Read-only |
| `setting_key` | Setting Key | Restricted |
| `setting_value` | Setting Value | Type-aware editor |
| `setting_group` | Setting Group | Filter |
| `is_active` | Active | Toggle |

Buttons: Edit, Save, Restore Previous Value

Sensitive Setting হলে masked value ব্যবহার করতে হবে।

### **১০. Audit Log**

Table: `audit_log`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `audit_id` | Audit ID | Read-only |
| `user_id` | User | User lookup |
| `action_type` | Action | Filter |
| `table_name` | Table | Filter |
| `record_id` | Record ID | Search |
| `old_values` | Previous Values | JSON viewer |
| `new_values` | New Values | JSON viewer |
| `client_ip` | IP Address | Read-only |
| `timestamp` | Timestamp | Read-only |

Buttons: View Details, Filter, Export

Audit Log-এর কোনো Edit বা Delete Button থাকবে না।

### **১১. Status Group**

Table: `status_group`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `status_group_id` | ID | Read-only |
| `status_group_code` | Group Code | Required |
| `status_group_name` | Group Name | Required |
| `is_active` | Active | Toggle |

Buttons: Create, Edit, Activate/Deactivate

### **১২. Status Item**

Table: `status_item`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `status_id` | Status ID | Read-only |
| `status_group_id` | Status Group | FK dropdown |
| `status_code` | Status Code | Required |
| `status_name` | Status Name | Required |
| `is_terminal` | Final Status | Checkbox |
| `display_order` | Display Order | Numeric |
| `is_active` | Active | Toggle |

Buttons: Add Status, Edit, Reorder, Activate/Deactivate

Status পরিবর্তন করলে পুরোনো Transaction-এর Status স্বয়ংক্রিয়ভাবে পরিবর্তন করা যাবে না।

### **১৩. Approval Workflow**

Table: `approval_workflow`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `workflow_id` | Workflow ID | Read-only |
| `document_type` | Document Type | Existing type selector |
| `document_name` | Workflow Name | Required |
| `threshold_amount` | Approval Threshold | BDT numeric |
| `is_active` | Active | Toggle |

Buttons: Create Workflow, Edit, Configure, Activate

### **১৪. Approval Request**

Table: `approval_request`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `approval_request_id` | Request ID | Read-only |
| `workflow_id` | Workflow | Read-only / lookup |
| `document_type` | Document Type | Read-only |
| `record_id` | Source Record | Drill-down |
| `document_no` | Document Number | Read-only |
| `amount` | Amount | BDT |
| `requested_by` | Requested By | User lookup |
| `current_step` | Current Step | Read-only |
| `total_steps` | Total Steps | Read-only |
| `status` | Approval Status | Read-only |
| `comments` | Comments | Action-specific |
| `created_at` | Created At | Read-only |
| `approved_at` | Approved At | Read-only |

Buttons: View Document, Approve, Reject, Return, View History

### **১৫. Approval Step**

Table: `approval_step`

| Field | UI Label | UI Behavior |
| ----- | ----- | ----- |
| `approval_step_id` | Step ID | Read-only |
| `approval_request_id` | Approval Request | Read-only |
| `step_order` | Step Order | Read-only |
| `step_name` | Step Name | Read-only |
| `required_role_id` | Required Role | Role lookup |
| `approver_user_id` | Approver | User lookup |
| `status` | Status | Read-only |
| `comments` | Comments | Action input |
| `action_timestamp` | Action Time | Read-only |

Buttons: Approve, Reject, Return for Correction

# **Part 2: Currency, Accounting ও PartyMaster**

## **১৬. Currency**

Table: `currency`

| Database Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `currency_id` | Currency ID | Read-only |
| `currency_code` | Currency Code | Required, 3 characters |
| `currency_name` | Currency Name | Required |
| `symbol` | Symbol | Editable |
| `decimal_places` | Decimal Places | Numeric |
| `is_base_currency` | Base Currency | Restricted |
| `is_active` | Active | Toggle |

Buttons: Create Currency, Edit, Activate/Deactivate

## **১৭. Currency Rate**

Table: `currency_rate`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `rate_id` | Rate ID | Read-only |
| `currency_id` | Currency | FK dropdown |
| `rate_date` | Rate Date | Date picker |
| `rate` | Exchange Rate | Numeric |
| `source_name` | Rate Source | Editable |
| `created_at` | Created At | Read-only |

Buttons: Add Rate, View History, Filter by Currency

Rate পরিবর্তনের আগে সংশ্লিষ্ট Import বা Financial Transaction-এর প্রভাব যাচাই করতে হবে।

## **১৮. Fiscal Year**

Table: `fiscal_year`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `fiscal_year_id` | Fiscal Year ID | Read-only |
| `company_id` | Company | FK dropdown |
| `year_name` | Fiscal Year Name | Required |
| `start_date` | Start Date | Date picker |
| `end_date` | End Date | Date picker |
| `is_closed` | Closed | Restricted |

Buttons: Create Fiscal Year, Edit, Close, View Periods

Validation: Start Date অবশ্যই End Date-এর আগে হতে হবে।

## **১৯. Fiscal Period**

Table: `fiscal_period`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `period_id` | Period ID | Read-only |
| `fiscal_year_id` | Fiscal Year | FK dropdown |
| `period_name` | Period Name | Required |
| `period_no` | Period Number | Numeric |
| `start_date` | Start Date | Date picker |
| `end_date` | End Date | Date picker |
| `is_closed` | Closed | Restricted |

Buttons: Create Period, Edit, Close Period, View Transactions

Closed Period-এ নতুন Posting অনুমোদিত হবে না।

## **২০. Account Group**

Table: `account_group`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `account_group_id` | Group ID | Read-only |
| `group_code` | Group Code | Required |
| `group_name` | Group Name | Required |
| `account_class` | Account Class | Controlled selector |
| `parent_group_id` | Parent Group | FK dropdown |
| `is_active` | Active | Toggle |

Buttons: Create Group, Edit, View Accounts

## **২১. Chart of Accounts**

Table: `chart_of_account`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `account_id` | Account ID | Read-only |
| `account_group_id` | Account Group | FK dropdown |
| `account_code` | Account Code | Required |
| `account_name` | Account Name | Required |
| `parent_account_id` | Parent Account | FK dropdown |
| `is_control_account` | Control Account | Restricted |
| `allow_posting` | Allow Posting | Permission-controlled |
| `is_active` | Active | Toggle |

Buttons: Create Account, Edit, View Ledger, View Balance, Activate/Deactivate

Control Account-এ Direct Posting বন্ধ থাকবে, যদি না Backend Policy স্পষ্টভাবে অনুমতি দেয়।

## **২২. Party Type**

Table: `party_type`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `party_type_id` | Party Type ID | Read-only |
| `type_code` | Type Code | Required |
| `type_name` | Type Name | Required |
| `default_account_id` | Default Account | Account dropdown |
| `description` | Description | Optional |
| `is_active` | Active | Toggle |

Buttons: Create Party Type, Edit, Activate/Deactivate

## **২৩. Division**

Table: `division`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `division_id` | Division ID | Read-only |
| `division_name` | Division Name | Required |
| `is_active` | Active | Toggle |

Buttons: Create Division, Edit, Activate/Deactivate

## **২৪. District**

Table: `district`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `district_id` | District ID | Read-only |
| `division_id` | Division | FK dropdown |
| `district_name` | District Name | Required |
| `division_name` | Division Name | Existing column, read-only / consistency check |
| `is_active` | Active | Toggle |

Buttons: Create District, Edit, Division Mapping

`division_name` এবং `division_id`\-এর মধ্যে consistency নিশ্চিত করতে Backend validation দরকার।

## **২৫. Government Department**

Table: `gov_department`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `gov_department_id` | Department ID | Read-only |
| `department_code` | Department Code | Required |
| `department_name` | Department Name | Required |
| `ministry_name` | Ministry | Editable |
| `is_active` | Active | Toggle |

Buttons: Create Department, Edit, Search, Activate/Deactivate

Tender Intelligence এবং Project Management-এ এই Master ব্যবহার হবে।

## **২৬. PartyMaster**

Table: `party_master`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `party_id` | Party ID | Read-only |
| `party_type_id` | Party Type | FK dropdown |
| `chart_of_account_id` | Linked Account | Controlled FK |
| `party_code` | Party Code | Required, Unique |
| `trade_name` | Trade Name | Required |
| `legal_name` | Legal Name | Editable |
| `contact_person` | Contact Person | Editable |
| `phone` | Phone | Validation |
| `email` | Email | Validation |
| `address` | Address | Editable |
| `division_id` | Division | FK dropdown |
| `district_id` | District | Division-dependent dropdown |
| `gov_department_id` | Government Department | Optional FK |
| `tax_id` | Tax ID | Editable |
| `bin_no` | BIN Number | Editable |
| `credit_allowed` | Credit Allowed | Permission-controlled |
| `credit_limit` | Credit Limit | Numeric, BDT |
| `payment_terms_days` | Payment Terms | Integer |
| `is_active` | Active | Toggle |
| `created_at` | Created At | Read-only |

Buttons:

* Create Party  
* Edit Party  
* View Party Profile  
* View Customer Ledger  
* View Supplier Ledger  
* View Outstanding  
* View Sales History  
* View Purchase History  
* View Contacts  
* Print Statement  
* Activate/Deactivate

PartyMaster Details Page Tabs:

`Overview | Contacts | Ledger | Sales | Purchases | Outstanding | Documents | Activity`

একটি Party Customer এবং Supplier উভয় হিসেবেই ব্যবহৃত হতে পারে কি না, তা `party_type` এবং Backend-এর অনুমোদিত Business Rules দিয়ে নির্ধারণ করতে হবে।

## **২৭. Contact Person**

Table: `contact_person`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `contact_id` | Contact ID | Read-only |
| `party_id` | Party | FK dropdown |
| `full_name` | Full Name | Required |
| `designation` | Designation | Editable |
| `phone` | Phone | Validation |
| `email` | Email | Validation |
| `is_primary` | Primary Contact | Checkbox |
| `created_at` | Created At | Read-only |

Buttons: Add Contact, Edit, Set Primary, Deactivate

একটি Party-এর একাধিক Contact Person থাকতে পারবে। Primary Contact পরিবর্তনের সময় Backend-এ একই Party-এর অন্য Primary Contact থাকলে সেটি সঠিকভাবে reconcile করতে হবে।

# **Part 3: Finance, Treasury, Budget ও Inventory**

## **২৮. Journal Voucher**

Table: `journal`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `journal_id` | Journal ID | Read-only |
| `company_id` | Company | FK |
| `branch_id` | Branch | FK |
| `voucher_no` | Voucher Number | Backend-generated |
| `voucher_type` | Voucher Type | Existing type selector |
| `voucher_date` | Voucher Date | Date picker |
| `source_type` | Source Type | Read-only / controlled |
| `source_id` | Source Reference | Drill-down |
| `narration` | Narration | Required |
| `is_posted` | Posted | Read-only |
| `posted_by` | Posted By | Read-only |
| `posted_at` | Posted At | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Journal, Save Draft, Submit Approval, Approve, Post, Print, View Ledger

## **২৯. Journal Line**

Table: `journal_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `journal_line_id` | Line ID | Read-only |
| `journal_id` | Journal | Parent reference |
| `chart_of_account_id` | Account | FK dropdown |
| `party_id` | Party | Conditional FK |
| `debit_amount` | Debit | Numeric |
| `credit_amount` | Credit | Numeric |
| `narration` | Line Narration | Editable in Draft |

UI: Journal Voucher-এর ভিতরে Editable Grid।

Buttons: Add Line, Remove Draft Line, Validate Balance

Validation: একটি Line-এ Debit ও Credit উভয়ই একসঙ্গে Positive হতে পারবে না। Journal-এর মোট Debit ও Credit সমান না হলে Post বন্ধ থাকবে।

## **৩০. General Ledger**

Table: `general_ledger`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `ledger_id` | Ledger ID | Read-only |
| `journal_line_id` | Journal Line | Drill-down |
| `chart_of_account_id` | Account | Filter |
| `party_id` | Party | Filter |
| `posting_date` | Posting Date | Filter |
| `debit_amount` | Debit | Read-only |
| `credit_amount` | Credit | Read-only |
| `running_balance` | Running Balance | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Search, Filter, Account Drill-down, Voucher Details, Export

## **৩১. Bank Reconciliation**

Table: `bank_reconciliation`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `reconciliation_id` | ID | Read-only |
| `account_id` | Bank Account | Account FK |
| `statement_date` | Statement Date | Date picker |
| `statement_balance` | Statement Balance | Numeric |
| `gl_balance` | GL Balance | Backend-calculated |
| `unreconciled_difference` | Difference | Backend-calculated |
| `reconciled_by` | Reconciled By | Read-only |
| `status` | Status | Workflow-controlled |
| `created_at` | Created At | Read-only |

Buttons: Start Reconciliation, Match Transactions, Review Difference, Reconcile, Export

Difference শূন্য না হলে Final Reconciliation বন্ধ থাকবে, যদি না অনুমোদিত exception workflow থাকে।

## **৩২. Payment Method**

Table: `payment_method`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `payment_method_id` | ID | Read-only |
| `method_code` | Method Code | Required |
| `method_name` | Payment Method | Required |
| `default_account_id` | Default Account | FK |
| `is_active` | Active | Toggle |

Buttons: Create, Edit, Activate/Deactivate

## **৩৩. Cash Transaction Type**

Table: `cash_transaction_type`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `transaction_type_id` | ID | Read-only |
| `type_code` | Type Code | Required |
| `type_name` | Transaction Type | Required |
| `is_receipt` | Receipt Type | Controlled |

Buttons: Create Type, Edit, Activate/Deactivate

Receipt এবং Payment Type-এর Accounting Mapping Backend-এ যাচাই করতে হবে।

## **৩৪. Cash Transaction**

Table: `cash_transaction`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `cash_transaction_id` | Transaction ID | Read-only |
| `company_id` | Company | FK |
| `branch_id` | Branch | FK |
| `voucher_no` | Voucher Number | Backend-generated |
| `transaction_type_id` | Transaction Type | FK |
| `account_id` | Cash / Bank Account | FK |
| `party_id` | Party | Conditional FK |
| `payment_method_id` | Payment Method | FK |
| `amount` | Amount | Required, Numeric |
| `cheque_no` | Cheque Number | Conditional |
| `cheque_date` | Cheque Date | Conditional |
| `transaction_date` | Transaction Date | Required |
| `narration` | Narration | Required |
| `is_posted` | Posted | Read-only |
| `posted_at` | Posted At | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Receipt, Payment, Save Draft, Submit Approval, Approve, Post, Print

Customer Collection, Supplier Payment ও Expense-এর UI একই Transaction Engine ব্যবহার করতে পারে, কিন্তু Transaction Type অনুযায়ী workflow এবং accounting rules আলাদা থাকবে।

## **৩৫. Payment Allocation**

Table: `payment_allocation`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `allocation_id` | Allocation ID | Read-only |
| `cash_transaction_id` | Payment Transaction | Parent |
| `document_type` | Document Type | Controlled |
| `document_id` | Invoice Reference | Lookup |
| `allocated_amount` | Allocated Amount | Numeric |
| `created_at` | Created At | Read-only |

Buttons: Allocate, Remove Draft Allocation, View Invoice Balance

Validation: Allocation Amount যেন Payment Amount এবং সংশ্লিষ্ট Invoice-এর Outstanding Balance অতিক্রম না করে।

## **৩৬. Budget Header**

Table: `budget_header`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `budget_id` | Budget ID | Read-only |
| `company_id` | Company | FK |
| `fiscal_year_id` | Fiscal Year | FK |
| `budget_code` | Budget Code | Required |
| `budget_name` | Budget Name | Required |
| `total_allocated_amount` | Total Budget | Calculated / verified |
| `is_approved` | Approved | Read-only |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Create Budget, Edit Draft, Submit, Approve, Print

## **৩৭. Budget Line**

Table: `budget_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `budget_line_id` | Line ID | Read-only |
| `budget_id` | Budget | Parent |
| `chart_of_account_id` | Account | FK |
| `allocated_amount` | Allocated Amount | Numeric |
| `utilized_amount` | Utilized Amount | Backend-calculated |
| `warning_threshold_pct` | Warning Threshold | Numeric |

Buttons: Add Budget Line, Edit Draft, View Actual, View Variance

## **৩৮. Budget Variance Approval**

Table: `budget_variance_approval`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `variance_approval_id` | ID | Read-only |
| `budget_line_id` | Budget Line | FK |
| `requested_amount` | Requested Amount | Numeric |
| `justification` | Justification | Required |
| `approved_by` | Approved By | Read-only |
| `status` | Status | Workflow-controlled |
| `created_at` | Created At | Read-only |

Buttons: Request Variance, Review, Approve, Reject, View History

## **৩৯. Unit of Measurement**

Table: `unit`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `unit_id` | Unit ID | Read-only |
| `unit_code` | Unit Code | Required |
| `unit_name` | Unit Name | Required |
| `decimal_places` | Decimal Places | Numeric |
| `is_active` | Active | Toggle |

Buttons: Create Unit, Edit, Activate/Deactivate

## **৪০. Item Category**

Table: `item_category`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `category_id` | Category ID | Read-only |
| `category_code` | Category Code | Required |
| `category_name` | Category Name | Required |
| `parent_category_id` | Parent Category | Optional FK |
| `is_active` | Active | Toggle |

Buttons: Create Category, Edit, Parent Mapping, Activate/Deactivate

## **৪১. Item Master**

Table: `item`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `item_id` | Item ID | Read-only |
| `category_id` | Category | FK |
| `unit_id` | Unit | FK |
| `item_code` | Item Code | Required |
| `item_name` | Item Name | Required |
| `specification` | Specification | Editable |
| `inventory_account_id` | Inventory Account | Account FK |
| `sales_account_id` | Sales Account | Account FK |
| `purchase_account_id` | Purchase Account | Account FK |
| `cogs_account_id` | COGS Account | Account FK |
| `standard_cost` | Standard Cost | Numeric |
| `sales_price` | Sales Price | Numeric |
| `reorder_level` | Reorder Level | Numeric |
| `is_active` | Active | Toggle |
| `created_at` | Created At | Read-only |

Buttons: Create Item, Edit, View Stock, View Stock Ledger, Purchase History, Sales History

তোমার ব্যবসার Item Code, Item Category, Unit ও Account Mapping Database থেকে আসবে। Frontend-এ Pakur Stone বা River Sand-এর জন্য আলাদা hardcoded logic থাকবে না।

## **৪২. Warehouse**

Table: `warehouse`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `warehouse_id` | Warehouse ID | Read-only |
| `branch_id` | Branch | FK |
| `warehouse_code` | Warehouse Code | Required |
| `warehouse_name` | Warehouse Name | Required |
| `location` | Location | Editable |
| `is_default` | Default Warehouse | Restricted |
| `is_active` | Active | Toggle |

Buttons: Create Warehouse, Edit, View Stock, Activate/Deactivate

## **৪৩. Stock Ledger**

Table: `stock_ledger`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `stock_ledger_id` | Ledger ID | Read-only |
| `warehouse_id` | Warehouse | Filter |
| `item_id` | Item | Filter |
| `transaction_date` | Transaction Date | Filter |
| `document_type` | Source Type | Read-only |
| `document_id` | Source Reference | Drill-down |
| `document_no` | Document Number | Read-only |
| `in_qty` | Stock In | Read-only |
| `out_qty` | Stock Out | Read-only |
| `unit_cost` | Unit Cost | Read-only |
| `total_cost` | Total Cost | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Filter, Item History, Warehouse History, Source Document, Export

Stock Ledger-এর কোনো Create, Edit বা Delete Button থাকবে না। এটি verified stock transaction থেকে তৈরি হবে।

## **৪৪. Stock Transfer**

Table: `stock_transfer`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `transfer_id` | Transfer ID | Read-only |
| `transfer_no` | Transfer Number | Backend-generated |
| `from_warehouse_id` | Source Warehouse | FK |
| `to_warehouse_id` | Destination Warehouse | FK |
| `transfer_date` | Transfer Date | Date picker |
| `status` | Status | Workflow-controlled |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Transfer, Save Draft, Submit, Approve, Dispatch, Receive, Print

## **৪৫. Stock Transfer Line**

Table: `stock_transfer_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `transfer_line_id` | Line ID | Read-only |
| `transfer_id` | Transfer | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quantity` | Transfer Quantity | Numeric |

Buttons: Add Item, Edit Draft Quantity, Remove Draft Line

Source Warehouse-এ পর্যাপ্ত Available Stock না থাকলে Dispatch বন্ধ থাকবে।

## **৪৬. Stock Adjustment**

Table: `stock_adjustment`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `adjustment_id` | Adjustment ID | Read-only |
| `adjustment_no` | Adjustment Number | Backend-generated |
| `warehouse_id` | Warehouse | FK |
| `adjustment_date` | Adjustment Date | Date picker |
| `reason` | Reason | Required |
| `status` | Status | Workflow-controlled |
| `approved_by` | Approved By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Adjustment, Save Draft, Submit, Approve, Post, Print

## **৪৭. Stock Adjustment Line**

Table: `stock_adjustment_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `adjustment_line_id` | Line ID | Read-only |
| `adjustment_id` | Adjustment | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `book_quantity` | System Quantity | Read-only |
| `physical_quantity` | Physical Quantity | Numeric |
| `variance_quantity` | Variance | Calculated |

Buttons: Add Item, Enter Physical Count, Review Variance

Variance Quantity Backend-এ পুনরায় যাচাই করতে হবে।

## **৪৮. Port / Station**

Table: `port_station`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `port_id` | Port ID | Read-only |
| `port_code` | Port Code | Required |
| `port_name` | Port Name | Required |
| `port_type` | Port Type | Controlled selector |
| `district_id` | District | FK |
| `is_active` | Active | Toggle |

Buttons: Create Port, Edit, Activate/Deactivate

## **৪৯. Customs Tariff / HS Code**

Table: `customs_tariff_hs`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `tariff_id` | Tariff ID | Read-only |
| `hs_code` | HS Code | Required |
| `description` | Description | Required |
| `customs_duty_pct` | Customs Duty % | Numeric |
| `regulatory_duty_pct` | Regulatory Duty % | Numeric |
| `supplementary_duty_pct` | Supplementary Duty % | Numeric |
| `vat_pct` | VAT % | Numeric |
| `advance_tax_pct` | Advance Tax % | Numeric |
| `is_active` | Active | Toggle |

Buttons: Search HS Code, Add Tariff, Edit, View History

Tax rates কেবল অনুমোদিত ও যাচাইকৃত Customs/NBR তথ্য থেকে আপডেট করতে হবে।

## **৫০. Import Header**

Table: `import_header`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `import_header_id` | Import ID | Read-only |
| `party_id` | Supplier / Importer | FK |
| `port_id` | Port | FK |
| `currency_id` | Currency | FK |
| `lc_no` | LC Number | Editable |
| `lc_date` | LC Date | Date picker |
| `commercial_invoice_no` | Commercial Invoice | Editable |
| `exchange_rate` | Exchange Rate | Controlled |
| `shipment_status` | Shipment Status | Workflow |
| `total_fob_foreign` | Total FOB | Calculated |
| `total_landed_cost_bdt` | Landed Cost | Calculated |
| `created_at` | Created At | Read-only |

Buttons: New Import, Save Draft, Add Items, Attach Documents, Track Shipment, Calculate Landed Cost, Close Import

## **৫১. Import Line**

Table: `import_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `import_line_id` | Line ID | Read-only |
| `import_header_id` | Import Header | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `tariff_id` | HS Tariff | FK |
| `declared_tonnage` | Declared Quantity | Numeric |
| `received_tonnage` | Received Quantity | Numeric |
| `unit_price_foreign` | Foreign Unit Price | Numeric |
| `total_fob_foreign` | Total FOB | Calculated |

Buttons: Add Import Item, Edit Draft, Record Received Quantity

## **৫২. Import Landed Cost**

Table: `import_landed_cost`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `landed_cost_id` | Cost ID | Read-only |
| `import_header_id` | Import | Parent |
| `cost_head` | Cost Head | Existing / controlled |
| `amount_bdt` | Amount BDT | Numeric |
| `is_capitalized` | Capitalized Cost | Controlled |
| `vendor_party_id` | Vendor | FK |

Buttons: Add Cost, Edit Draft, Allocate Cost, View Calculation

Cost Capitalization ও Inventory Valuation Backend-এর নির্ধারিত policy অনুযায়ী হবে।

## **৫৩. Weighbridge Log**

Table: `weighbridge_log`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `weighbridge_log_id` | Log ID | Read-only |
| `import_header_id` | Import | FK |
| `port_id` | Port | FK |
| `scale_ticket_no` | Scale Ticket | Required |
| `truck_no` | Truck Number | Required |
| `gross_weight` | Gross Weight | Numeric |
| `tare_weight` | Tare Weight | Numeric |
| `net_weight` | Net Weight | Calculated |
| `weight_date` | Weight Date | Date |
| `scale_master_user_id` | Operator | User FK |
| `created_at` | Created At | Read-only |

Buttons: Record Weight, Re-weigh, Print Slip, View History

Validation:

`Net Weight = Gross Weight - Tare Weight`

Net Weight negative হতে পারবে না। Correction হলে Audit History রাখতে হবে।

# **Part 4: CRM, Sales, Purchase, GRN, Project ও Payroll**

## **৫৪. Lead Management**

Table: `lead`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `lead_id` | Lead ID | Read-only |
| `lead_name` | Lead Name | Required |
| `company_name` | Company Name | Editable |
| `phone` | Phone | Validation |
| `email` | Email | Validation |
| `status` | Lead Status | Controlled |
| `assigned_user_id` | Assigned User | User FK |
| `created_at` | Created At | Read-only |

Buttons: New Lead, Edit, Assign, Convert, Close, Follow-up

## **৫৫. Opportunity**

Table: `opportunity`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `opportunity_id` | Opportunity ID | Read-only |
| `lead_id` | Lead | FK |
| `party_id` | Customer / Party | FK |
| `opportunity_name` | Opportunity Name | Required |
| `estimated_amount` | Estimated Value | Numeric |
| `stage` | Pipeline Stage | Controlled |
| `close_date` | Expected Close Date | Date |
| `assigned_user_id` | Assigned User | User FK |
| `created_at` | Created At | Read-only |

Buttons: Create Opportunity, Edit, Move Stage, Convert, Close

## **৫৬. Sales Quotation**

Table: `sales_quotation`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `quotation_id` | Quotation ID | Read-only |
| `party_id` | Customer | FK |
| `quotation_no` | Quotation Number | Backend-generated |
| `quotation_date` | Quotation Date | Date |
| `valid_until` | Valid Until | Date |
| `grand_total` | Grand Total | Calculated |
| `status` | Status | Workflow |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Quotation, Save Draft, Submit, Approve, Print, Convert to Sales Order

## **৫৭. Sales Quotation Line**

Table: `sales_quotation_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `quotation_line_id` | Line ID | Read-only |
| `quotation_id` | Quotation | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quantity` | Quantity | Numeric |
| `unit_price` | Unit Price | Numeric |
| `line_total` | Line Total | Calculated |

Buttons: Add Item, Edit Draft, Remove Draft Line

## **৫৮. Sales Order**

Table: `sales_order`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `sales_order_id` | Order ID | Read-only |
| `party_id` | Customer | FK |
| `warehouse_id` | Warehouse | FK |
| `order_no` | Order Number | Backend-generated |
| `order_date` | Order Date | Date |
| `quotation_id` | Quotation Reference | FK |
| `grand_total` | Grand Total | Calculated |
| `status` | Order Status | Workflow |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Order, Save Draft, Submit, Approve, Confirm, Print, Create Delivery

## **৫৯. Sales Order Line**

Table: `sales_order_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `sales_order_line_id` | Line ID | Read-only |
| `sales_order_id` | Sales Order | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quantity` | Order Quantity | Numeric |
| `unit_price` | Unit Price | Numeric |
| `line_total` | Line Total | Calculated |

Buttons: Add Item, Edit Draft, Remove Draft Line, Check Availability

## **৬০. Delivery Challan**

Table: `delivery_challan`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `delivery_challan_id` | Challan ID | Read-only |
| `sales_order_id` | Sales Order | FK |
| `party_id` | Customer | FK |
| `warehouse_id` | Warehouse | FK |
| `challan_no` | Challan Number | Backend-generated |
| `challan_date` | Challan Date | Date |
| `truck_no` | Truck Number | Editable |
| `driver_name` | Driver Name | Editable |
| `driver_phone` | Driver Phone | Validation |
| `status` | Delivery Status | Workflow |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: Create Challan, Approve, Dispatch, Confirm Delivery, Print

## **৬১. Delivery Challan Line**

Table: `delivery_challan_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `challan_line_id` | Line ID | Read-only |
| `delivery_challan_id` | Challan | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `dispatched_quantity` | Dispatched Quantity | Numeric |

Buttons: Add Item, Edit Draft, Confirm Quantity

## **৬২. Sales Invoice**

Table: `sales_invoice`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `sales_invoice_id` | Invoice ID | Read-only |
| `party_id` | Customer | FK |
| `warehouse_id` | Warehouse | FK |
| `sales_order_id` | Sales Order | FK |
| `invoice_no` | Invoice Number | Backend-generated |
| `invoice_date` | Invoice Date | Date |
| `due_date` | Due Date | Date |
| `subtotal` | Subtotal | Calculated |
| `tax_amount` | Tax Amount | Calculated |
| `discount_amount` | Discount | Controlled |
| `grand_total` | Grand Total | Calculated |
| `paid_amount` | Paid Amount | Backend-derived |
| `status` | Status | Workflow |
| `is_posted` | Posted | Read-only |
| `posted_at` | Posted At | Read-only |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Invoice, Save Draft, Submit Approval, Approve, Post, Print, View Ledger, View Payment

## **৬৩. Sales Invoice Line**

Table: `sales_invoice_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `sales_invoice_line_id` | Line ID | Read-only |
| `sales_invoice_id` | Sales Invoice | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `delivery_challan_id` | Delivery Reference | FK |
| `quantity` | Quantity | Numeric |
| `unit_price` | Unit Price | Numeric |
| `line_total` | Line Total | Calculated |

Buttons: Add Item, Edit Draft, Remove Draft Line

Invoice Posting-এর আগে Backend-এ Stock Availability, Credit Policy, VAT, Revenue এবং COGS validation করতে হবে।

## **৬৪. Supplier Quotation**

Table: `supplier_quote`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `quote_id` | Quote ID | Read-only |
| `party_id` | Supplier | FK |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quote_no` | Supplier Quote Number | Editable |
| `unit_price` | Unit Price | Numeric |
| `lead_time_days` | Lead Time | Integer |
| `is_active` | Active | Toggle |
| `created_at` | Created At | Read-only |

Buttons: Add Supplier Quote, Edit, Compare Prices, Select Supplier

## **৬৫. Purchase Order**

Table: `purchase_order`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `purchase_order_id` | PO ID | Read-only |
| `party_id` | Supplier | FK |
| `warehouse_id` | Warehouse | FK |
| `po_no` | PO Number | Backend-generated |
| `po_date` | PO Date | Date |
| `grand_total` | Grand Total | Calculated |
| `status` | Status | Workflow |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New PO, Save Draft, Submit, Approve, Confirm, Print, Create GRN

## **৬৬. Purchase Order Line**

Table: `purchase_order_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `po_line_id` | Line ID | Read-only |
| `purchase_order_id` | Purchase Order | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quantity` | Ordered Quantity | Numeric |
| `unit_price` | Purchase Rate | Numeric |
| `line_total` | Line Total | Calculated |

Buttons: Add Item, Edit Draft, Remove Draft Line

## **৬৭. Goods Received Note**

Table: `goods_received_note`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `grn_id` | GRN ID | Read-only |
| `purchase_order_id` | Purchase Order | FK |
| `party_id` | Supplier | FK |
| `warehouse_id` | Warehouse | FK |
| `grn_no` | GRN Number | Backend-generated |
| `receipt_date` | Receipt Date | Date |
| `challan_no` | Supplier Challan | Editable |
| `status` | GRN Status | Workflow |
| `received_by` | Received By | User FK |
| `created_at` | Created At | Read-only |

Buttons: New GRN, Save Draft, Verify, Approve, Post Receipt, Print

## **৬৮. GRN Line**

Table: `goods_received_note_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `grn_line_id` | Line ID | Read-only |
| `grn_id` | GRN | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `received_quantity` | Received Quantity | Numeric |
| `accepted_quantity` | Accepted Quantity | Numeric |
| `rejected_quantity` | Rejected Quantity | Numeric |

Buttons: Add Item, Verify Quantity, Record Rejection

Validation: Accepted Quantity এবং Rejected Quantity-এর যোগফল Received Quantity-এর সঙ্গে মিলতে হবে।

## **৬৯. Purchase Invoice**

Table: `purchase_invoice`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `purchase_invoice_id` | Invoice ID | Read-only |
| `party_id` | Supplier | FK |
| `warehouse_id` | Warehouse | FK |
| `purchase_order_id` | Purchase Order | FK |
| `invoice_no` | Supplier Invoice Number | Editable |
| `invoice_date` | Invoice Date | Date |
| `due_date` | Due Date | Date |
| `grand_total` | Grand Total | Calculated |
| `paid_amount` | Paid Amount | Backend-derived |
| `status` | Status | Workflow |
| `is_posted` | Posted | Read-only |
| `posted_at` | Posted At | Read-only |
| `created_by` | Created By | Read-only |
| `created_at` | Created At | Read-only |

Buttons: New Purchase Invoice, Save Draft, Match GRN, Submit Approval, Approve, Post, Print, View Supplier Ledger

## **৭০. Purchase Invoice Line**

Table: `purchase_invoice_line`

| Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `purchase_invoice_line_id` | Line ID | Read-only |
| `purchase_invoice_id` | Purchase Invoice | Parent |
| `item_id` | Item | FK |
| `unit_id` | Unit | FK |
| `quantity` | Quantity | Numeric |
| `unit_price` | Purchase Rate | Numeric |
| `line_total` | Line Total | Calculated |

Buttons: Add Item, Edit Draft, Remove Draft Line, Match Received Quantity

Purchase Invoice Posting-এর আগে Supplier, PO, GRN, Accounts Payable এবং Stock/Expense Impact যাচাই করতে হবে।

## **৭১. Project Management**

Table: `project`

| Database Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `project_id` | Project ID | Read-only |
| `procuring_entity_id` | Procuring Entity | FK, schema যাচাই প্রয়োজন |
| `gov_department_id` | Government Department | FK dropdown |
| `district_id` | District | FK dropdown |
| `project_code` | Project Code | Required |
| `project_name` | Project Name | Required |
| `estimated_value` | Estimated Value | BDT numeric |
| `start_date` | Start Date | Date picker |
| `end_date` | End Date | Date picker |
| `status` | Project Status | Workflow |
| `created_at` | Created At | Read-only |

Buttons:

* New Project  
* Edit  
* Assign Project  
* View Project  
* View Budget  
* View Material Requirements  
* View Sales/Purchase References  
* View Profitability  
* Close Project

Important: `procuring_entity_id`\-এর FK target প্রকৃত Schema থেকে যাচাই করতে হবে। Column name দেখে কোনো নতুন Master Table অনুমান করা যাবে না।

## **৭২. Employee Management**

Table: `employee`

| Database Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `employee_id` | Employee ID | Read-only |
| `party_id` | Party Reference | FK |
| `branch_id` | Branch | FK dropdown |
| `employee_code` | Employee Code | Required |
| `full_name` | Full Name | Required |
| `designation` | Designation | Editable |
| `department` | Department | Editable |
| `basic_salary` | Basic Salary | Restricted |
| `joining_date` | Joining Date | Date picker |
| `is_active` | Active | Toggle |
| `created_at` | Created At | Read-only |

Buttons:

* Create Employee  
* Edit Employee  
* View Employee Profile  
* Assign Branch  
* View Payroll History  
* Activate/Deactivate

Employee-এর Salary Information কেবল অনুমোদিত HR/Finance Role দেখতে পারবে।

## **৭৩. Payroll Entry**

Table: `payroll_entry`

| Database Field | UI Label | Behavior |
| ----- | ----- | ----- |
| `payroll_id` | Payroll ID | Read-only |
| `employee_id` | Employee | FK dropdown |
| `fiscal_period_id` | Fiscal Period | FK dropdown |
| `salary_amount` | Salary Amount | Restricted numeric |
| `disbursement_date` | Disbursement Date | Date picker |
| `payment_method_id` | Payment Method | FK dropdown |
| `journal_id` | Journal Reference | Read-only / drill-down |
| `status` | Payroll Status | Workflow |
| `created_at` | Created At | Read-only |

Buttons:

* Create Payroll Draft  
* Select Employee  
* Calculate Salary  
* Review Payroll  
* Submit Approval  
* Approve  
* Process Payment  
* View Journal  
* Print Payroll Statement

Payroll Processing-এর আগে Salary Calculation, Payment Method, Accounting Posting এবং Employee Authorization Backend-এ যাচাই করতে হবে।

# **১৭. সব 73 Table-এর Field Behavior Standard**

এটি Copilot-এর জন্য সবচেয়ে গুরুত্বপূর্ণ অংশ।

| Field Type | Frontend Behavior |
| ----- | ----- |
| Primary Key | Read-only |
| Foreign Key | DB-driven dropdown / lookup |
| Required Field | Validation বাধ্যতামূলক |
| Numeric Amount | BDT formatting \+ numeric validation |
| Quantity | Unit-aware numeric input |
| Date | Date picker \+ business date validation |
| Status | Workflow-controlled |
| Created By | Backend-generated |
| Created At | Read-only |
| Posted At | Read-only |
| Calculated Amount | Backend authoritative |
| Password / Token | Never exposed |
| Audit Field | Read-only |
| Ledger Field | Read-only |
| Boolean Flag | Checkbox / controlled toggle |

## **১৮. Copilot-কে Field-Level Implementation করার জন্য Prompt**

# **SKA NEXUS ERP — Field-Level Frontend Implementation Prompt**

Act as a Principal ERP Frontend Architect and Senior React/TypeScript Engineer.

## **Objective**

Implement the existing SKA NEXUS ERP frontend based on the verified 73-table PostgreSQL canonical schema.

The current task is FIELD-LEVEL UI MAPPING and FORM IMPLEMENTATION.

## **Source of Truth**

Use the actual canonical migration:

database/migrations/20261029000000\_init\_canonical\_schema.sql

Inspect existing:

* React components  
* API routes  
* DTOs and validation schemas  
* RBAC implementation  
* Form/database alignment documentation  
* Existing business workflows

## **Required Field Mapping**

For every existing table, identify:

* Exact column name  
* Database data type  
* Primary key  
* Foreign key  
* Required / nullable status  
* Default value  
* Unique constraints  
* Check constraints  
* UI label  
* UI input type  
* Editable / read-only status  
* Field permission  
* Validation rule  
* API request field  
* API response field

## **UI Rules**

* Primary keys are read-only.  
* Foreign keys use verified database-backed selectors.  
* Password hashes and session tokens must never be exposed.  
* Audit and ledger records are read-only.  
* Posted financial documents cannot be directly edited.  
* Calculated values must remain backend-authoritative.  
* Transaction lines belong inside their parent forms.  
* Sales Invoice and Purchase Invoice must remain completely separate.  
* All UI labels must be English.  
* Currency display must use BDT (৳).  
* Existing canonical routes and navigation must be preserved.

## **Critical Restrictions**

Do not invent database fields.

Do not invent API endpoints.

Do not create new database tables.

Do not replace existing business rules with frontend calculations.

Do not change accounting, inventory, VAT, or approval logic without verified evidence.

Do not modify source code during the initial schema and API audit.

## **Implementation Process**

1. Read the canonical migration.  
2. Extract all 73 actual tables and columns.  
3. Compare existing frontend forms with database fields.  
4. Identify missing fields and unsupported UI actions.  
5. Produce a field-level mapping document.  
6. Implement in small reviewed batches.  
7. Run TypeScript, lint, and relevant tests.  
8. Verify actual API behavior.  
9. Report changed files and test results.

## **Deliverable**

Create:

docs/FRONTEND\_FIELD\_MAPPING\_MATRIX.md

The document must include all 73 actual tables, their exact fields, UI controls, permissions, validation, and API mapping.

The objective is to complete and stabilize the existing ERP, not rebuild it.

## **এখন তোমার ERP-এর পরবর্তী বাস্তব ধাপ**

Field-Level Mapping শেষ হলে আমি পরবর্তী ধাপে এই তিনটি বিষয় যাচাই করতাম:

1. Field → API Mapping: প্রতিটি Field কোন Existing API দিয়ে Save/Load হবে।  
2. Role → Permission Mapping: কোন Role কোন Field দেখতে, Edit করতে বা Post করতে পারবে।  
3. Form → Business Workflow: Draft থেকে Approval, Posting, Ledger এবং Final Status পর্যন্ত সম্পূর্ণ Workflow।

এই তিনটি সম্পন্ন হলে তোমার ERP-এর Frontend Development অনেক বেশি নির্ভুল হবে।

একটি সতর্কতা: এই Specification-এ UI Field এবং Options নির্ধারণ করা হয়েছে। এটি Database Migration বা Production Release Approval নয়। তোমার বর্তমান Schema, API এবং Business Rules-এর সঙ্গে মিলিয়ে Implementation করতে হবে।

