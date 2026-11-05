import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { PrintDocumentModal } from './components/common/PrintDocumentModal';
import { ApprovalActionModal } from './components/common/ApprovalModal';

// Views
import { ExecutiveDashboard } from './components/dashboards/ExecutiveDashboard';
import { SalesInvoicesView } from './components/modules/CommercialOperations/SalesInvoicesView';
import { CustomerDirectoryView } from './components/modules/CommercialOperations/CustomerDirectoryView';
import { SalesOrdersView } from './components/modules/CommercialOperations/SalesOrdersView';
import { DeliveryChallansView } from './components/modules/CommercialOperations/DeliveryChallansView';
import { CrmLeadsView } from './components/modules/CommercialOperations/CrmLeadsView';
import { WeighbridgeView } from './components/modules/SupplyChainCustoms/WeighbridgeView';
import { PurchaseOrdersView } from './components/modules/SupplyChainCustoms/PurchaseOrdersView';
import { GrnView } from './components/modules/SupplyChainCustoms/GrnView';
import { PurchaseInvoicesView } from './components/modules/SupplyChainCustoms/PurchaseInvoicesView';
import { ImportOperationsView } from './components/modules/SupplyChainCustoms/ImportOperationsView';
import { DepotStockView } from './components/modules/SupplyChainCustoms/DepotStockView';
import { ItemsCatalogView } from './components/modules/SupplyChainCustoms/ItemsCatalogView';
import { JournalVouchersView } from './components/modules/FinancialManagement/JournalVouchersView';
import { ChartOfAccountsView } from './components/modules/FinancialManagement/ChartOfAccountsView';
import { CashBankTreasuryView } from './components/modules/FinancialManagement/CashBankTreasuryView';
import { ApprovalWorkflowCenterView } from './components/modules/SystemGovernance/ApprovalWorkflowCenterView';
import { AuditTrailView } from './components/modules/SystemGovernance/AuditTrailView';
import { TenderIntelligenceView } from './components/modules/ExecutiveIntelligence/TenderIntelligenceView';
import {
  CompanyBranchesView,
  UserManagementView,
  DocumentSequencesView,
  ProjectsView,
  BudgetsView,
} from './components/modules/SystemGovernance/SystemAdminViews';

function ERPAppContent() {
  const { activeHub, activeSubModule } = useERP();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Modal States
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    docType: any;
    data: any;
  }>({
    isOpen: false,
    docType: 'Sales Invoice',
    data: null,
  });

  const [approvalModalState, setApprovalModalState] = useState<{
    isOpen: boolean;
    request: any;
  }>({
    isOpen: false,
    request: null,
  });

  const handleOpenPrintModal = (docType: any, data: any) => {
    setPrintModalState({
      isOpen: true,
      docType,
      data,
    });
  };

  const handleOpenApprovalModal = (request: any) => {
    setApprovalModalState({
      isOpen: true,
      request,
    });
  };

  const renderActiveModule = () => {
    // Executive Hub
    if (activeHub === 'executive') {
      if (activeSubModule === 'tender_intelligence') return <TenderIntelligenceView />;
      if (activeSubModule === 'projects') return <ProjectsView />;
      return (
        <ExecutiveDashboard
          onOpenApprovalModal={handleOpenApprovalModal}
          onOpenPrintModal={handleOpenPrintModal}
        />
      );
    }

    // Commercial Hub
    if (activeHub === 'commercial') {
      if (activeSubModule === 'customers') return <CustomerDirectoryView />;
      if (activeSubModule === 'crm_leads') return <CrmLeadsView />;
      if (activeSubModule === 'sales_orders' || activeSubModule === 'sales_quotations')
        return <SalesOrdersView />;
      if (activeSubModule === 'delivery_challans')
        return <DeliveryChallansView onOpenPrintModal={handleOpenPrintModal} />;
      return <SalesInvoicesView onOpenPrintModal={handleOpenPrintModal} />;
    }

    // Supply Chain Hub
    if (activeHub === 'supply_chain') {
      if (activeSubModule === 'items') return <ItemsCatalogView />;
      if (
        activeSubModule === 'warehouse_stock' ||
        activeSubModule === 'stock_transfers' ||
        activeSubModule === 'stock_adjustments'
      )
        return <DepotStockView />;
      if (activeSubModule === 'purchase_orders')
        return <PurchaseOrdersView onOpenPrintModal={handleOpenPrintModal} />;
      if (activeSubModule === 'grn') return <GrnView />;
      if (activeSubModule === 'purchase_invoices')
        return <PurchaseInvoicesView onOpenPrintModal={handleOpenPrintModal} />;
      if (activeSubModule === 'import_operations') return <ImportOperationsView />;
      if (activeSubModule === 'weighbridge')
        return <WeighbridgeView onOpenPrintModal={handleOpenPrintModal} />;
      return <CustomerDirectoryView />; // for suppliers
    }

    // Financial Hub
    if (activeHub === 'financial') {
      if (activeSubModule === 'chart_of_accounts') return <ChartOfAccountsView />;
      if (activeSubModule === 'cash_bank') return <CashBankTreasuryView />;
      if (activeSubModule === 'budgets') return <BudgetsView />;
      return <JournalVouchersView onOpenPrintModal={handleOpenPrintModal} />;
    }

    // Governance Hub
    if (activeHub === 'governance') {
      if (activeSubModule === 'approval_center')
        return <ApprovalWorkflowCenterView onOpenApprovalModal={handleOpenApprovalModal} />;
      if (activeSubModule === 'company_branches') return <CompanyBranchesView />;
      if (activeSubModule === 'user_management') return <UserManagementView />;
      if (activeSubModule === 'document_sequences') return <DocumentSequencesView />;
      return <AuditTrailView />;
    }

    return (
      <ExecutiveDashboard
        onOpenApprovalModal={handleOpenApprovalModal}
        onOpenPrintModal={handleOpenPrintModal}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Content Canvas - Ultra-light Slate #F8FAFC */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">{renderActiveModule()}</div>
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <PrintDocumentModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState({ ...printModalState, isOpen: false })}
        documentType={printModalState.docType}
        data={printModalState.data}
      />

      <ApprovalActionModal
        isOpen={approvalModalState.isOpen}
        onClose={() => setApprovalModalState({ ...approvalModalState, isOpen: false })}
        request={approvalModalState.request}
      />
    </div>
  );
}

export default function App() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
