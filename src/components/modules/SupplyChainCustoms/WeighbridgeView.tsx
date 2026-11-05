import React, { useState, useEffect } from 'react';
import { Plus, Scale, Printer, Truck, AlertCircle, CheckCircle, Link2, FileCheck, ShieldCheck } from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { WeighbridgeLog } from '../../../types/erp';

interface WeighbridgeViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const WeighbridgeView: React.FC<WeighbridgeViewProps> = ({ onOpenPrintModal }) => {
  const {
    weighbridgeLogs,
    items,
    importHeaders,
    purchaseOrders,
    deliveryChallans,
    addWeighbridgeLog,
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [truckNo, setTruckNo] = useState('WB-57-D-9901');
  const [driverName, setDriverName] = useState('Bikash Chandra');
  const [driverPhone, setDriverPhone] = useState('+91 9832 110022');
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.item_id || '');
  const [portStation, setPortStation] = useState('Bhomra Port Scale Station #1');
  const [grossWeight, setGrossWeight] = useState<number>(49.5);
  const [tareWeight, setTareWeight] = useState<number>(14.1);

  // Strict Polymorphic Relational Link
  const [refType, setRefType] = useState<'Import Shipment' | 'Purchase Order' | 'Sales Challan'>('Import Shipment');
  const [selectedRefNo, setSelectedRefNo] = useState<string>(importHeaders[0]?.import_ref_no || '');

  // Derived Net Weight & Invariant Check
  const netWeight = Number((grossWeight - tareWeight).toFixed(2));
  const isValidWeight = grossWeight > 0 && tareWeight > 0 && netWeight > 0.05;

  // Sync relational defaults when reference type changes
  useEffect(() => {
    if (refType === 'Import Shipment') {
      const defaultImport = importHeaders[0];
      if (defaultImport) {
        setSelectedRefNo(defaultImport.import_ref_no);
        if (defaultImport.items[0]?.item_id) {
          setSelectedItemId(defaultImport.items[0].item_id);
        }
      }
    } else if (refType === 'Purchase Order') {
      const defaultPO = purchaseOrders[0];
      if (defaultPO) {
        setSelectedRefNo(defaultPO.po_no);
        if (defaultPO.items[0]?.item_id) {
          setSelectedItemId(defaultPO.items[0].item_id);
        }
      }
    } else if (refType === 'Sales Challan') {
      const defaultChallan = deliveryChallans[0];
      if (defaultChallan) {
        setSelectedRefNo(defaultChallan.challan_no);
        setTruckNo(defaultChallan.truck_no);
        setDriverName(defaultChallan.driver_name);
        setDriverPhone(defaultChallan.driver_phone);
        if (defaultChallan.items[0]?.item_id) {
          setSelectedItemId(defaultChallan.items[0].item_id);
        }
      }
    }
  }, [refType, importHeaders, purchaseOrders, deliveryChallans]);

  const handleRefSelectionChange = (refNo: string) => {
    setSelectedRefNo(refNo);
    if (refType === 'Sales Challan') {
      const ch = deliveryChallans.find((c) => c.challan_no === refNo);
      if (ch) {
        setTruckNo(ch.truck_no);
        setDriverName(ch.driver_name);
        setDriverPhone(ch.driver_phone);
        if (ch.items[0]?.item_id) {
          setSelectedItemId(ch.items[0].item_id);
        }
      }
    } else if (refType === 'Import Shipment') {
      const imp = importHeaders.find((i) => i.import_ref_no === refNo);
      if (imp && imp.items[0]?.item_id) {
        setSelectedItemId(imp.items[0].item_id);
      }
    } else if (refType === 'Purchase Order') {
      const po = purchaseOrders.find((p) => p.po_no === refNo);
      if (po && po.items[0]?.item_id) {
        setSelectedItemId(po.items[0].item_id);
      }
    }
  };

  const handleRecordWeight = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Invariant Validations
    if (!isValidWeight) {
      setErrorMessage('Tare weight must be strictly less than Gross weight. Net cargo must be greater than 0.05 MT.');
      return;
    }

    if (!selectedRefNo) {
      setErrorMessage('A verified relational reference document (Import Shipment, PO, or Challan) must be linked.');
      return;
    }

    const itm = items.find((i) => i.item_id === selectedItemId);
    const ticketNo = `BHM-WB-2026-${String(weighbridgeLogs.length + 14905)}`;

    addWeighbridgeLog({
      scale_ticket_no: ticketNo,
      truck_no: truckNo.toUpperCase().trim(),
      driver_name: driverName.trim(),
      driver_phone: driverPhone.trim(),
      item_id: itm ? itm.item_id : 'itm-01',
      item_name: itm ? itm.item_name : 'Pakur Black Stone 20mm',
      port_or_depot: portStation,
      gross_weight: grossWeight,
      tare_weight: tareWeight,
      net_weight: netWeight,
      weight_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reference_type: refType,
      reference_no: selectedRefNo,
      operator_name: 'M. Shafiqul Islam (Certified Weighmaster)',
    });

    setSuccessMessage(`Scale Ticket ${ticketNo} successfully certified and committed with Net Cargo: ${netWeight} MT.`);
    setIsModalOpen(false);
  };

  const columns: Column<WeighbridgeLog>[] = [
    {
      key: 'scale_ticket_no',
      header: 'Ticket #',
      className: 'font-mono font-bold text-slate-900',
    },
    {
      key: 'truck_no',
      header: 'Truck License',
      render: (row) => (
        <span className="font-mono font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
          {row.truck_no}
        </span>
      ),
    },
    {
      key: 'item_name',
      header: 'Cargo Material',
      className: 'font-semibold text-slate-900',
    },
    {
      key: 'gross_weight',
      header: 'Gross (MT)',
      render: (row) => <span className="font-mono text-slate-700">{row.gross_weight}</span>,
    },
    {
      key: 'tare_weight',
      header: 'Tare (MT)',
      render: (row) => <span className="font-mono text-slate-500">{row.tare_weight}</span>,
    },
    {
      key: 'net_weight',
      header: 'Net Cargo (MT)',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {row.net_weight} MT
        </span>
      ),
    },
    {
      key: 'port_or_depot',
      header: 'Scale Station',
      render: (row) => <span className="text-slate-600 text-xs">{row.port_or_depot}</span>,
    },
    {
      key: 'reference_no',
      header: 'Relational Linkage',
      render: (row) => {
        let badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
        if (row.reference_type === 'Purchase Order') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (row.reference_type === 'Sales Challan') badgeColor = 'bg-purple-50 text-purple-800 border-purple-200';

        return (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-slate-900 block">{row.reference_no}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badgeColor}`}>
              <Link2 className="w-2.5 h-2.5" />
              {row.reference_type}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => onOpenPrintModal('Weighbridge Ticket', row)}
          className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Print Certified Scale Ticket Slip"
        >
          <Printer className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Informational Guideline Banner */}
      <div className="bg-slate-900 text-slate-100 p-3.5 rounded border border-slate-800 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Certified Scale Calibration & Relational Tracking:</strong> Every weighbridge ticket is relationally
            bound to an active Import Consignment, Purchase Order, or Delivery Challan. Free-text orphaned scale slips are
            strictly disallowed to maintain border customs and GRN traceability.
          </span>
        </div>
      </div>

      {(errorMessage || successMessage) && (
        <div className="space-y-2">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      )}

      <DataGrid
        title="Weighbridge Certified Scale Station Logs"
        subtitle="Gross, Tare, and Net weight records for cross-border Indian aggregate trucks and domestic outbound dispatches."
        columns={columns}
        data={weighbridgeLogs}
        searchKeys={['scale_ticket_no', 'truck_no', 'driver_name', 'reference_no']}
        exportFileName="Weighbridge_Logs"
        actionButton={
          <button
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Scale Measurement</span>
          </button>
        }
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Certified Weighbridge Scale Measurement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordWeight} className="p-5 space-y-4 text-xs">
              {/* Relational Binding Section */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Link2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Relational Reference Document Linkage</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Document Category *</label>
                    <select
                      value={refType}
                      onChange={(e: any) => setRefType(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                    >
                      <option value="Import Shipment">Import Shipment (Bhomra LC)</option>
                      <option value="Purchase Order">Purchase Order (Quarry Contract)</option>
                      <option value="Sales Challan">Sales Challan (Outbound Dispatch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Validated Active Document *
                    </label>
                    <select
                      value={selectedRefNo}
                      onChange={(e) => handleRefSelectionChange(e.target.value)}
                      className="w-full p-2 bg-white rounded border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950"
                    >
                      {refType === 'Import Shipment' &&
                        importHeaders.map((imp) => (
                          <option key={imp.import_header_id} value={imp.import_ref_no}>
                            {imp.import_ref_no} — {imp.supplier_name} ({imp.port_station})
                          </option>
                        ))}

                      {refType === 'Purchase Order' &&
                        purchaseOrders.map((po) => (
                          <option key={po.purchase_order_id} value={po.po_no}>
                            {po.po_no} — {po.party_name} ({po.warehouse_name})
                          </option>
                        ))}

                      {refType === 'Sales Challan' &&
                        deliveryChallans.map((ch) => (
                          <option key={ch.delivery_challan_id} value={ch.challan_no}>
                            {ch.challan_no} — {ch.truck_no} ({ch.party_name})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Truck & Driver Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Truck License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WB-57-D-9901"
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scale Station Enclosure *</label>
                  <select
                    value={portStation}
                    onChange={(e) => setPortStation(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950"
                  >
                    <option value="Bhomra Port Scale Station #1">Bhomra Port Scale Station #1 (Inbound)</option>
                    <option value="Bhomra Outbound Scale #2">Bhomra Outbound Scale #2 (Discharge)</option>
                    <option value="Noapara River Scale #1">Noapara River Scale #1 (Ghat Terminal)</option>
                    <option value="Mongla Bulk Scale #1">Mongla Bulk Scale #1 (Port Basin)</option>
                    <option value="Sylhet Bholaganj Scale #1">Sylhet Bholaganj Scale #1 (Ropeway Yard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Driver Contact Mobile</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cargo Item / Material Aggregate *</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-950"
                >
                  {items.map((i) => (
                    <option key={i.item_id} value={i.item_id}>
                      {i.item_code} — {i.item_name} [{i.unit_code}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Sensor Weight Inputs */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Electronic Load Cell Readouts (Metric Tons)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Gross (MT) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={grossWeight || ''}
                      onChange={(e) => setGrossWeight(Math.max(0, Number(e.target.value)))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tare (MT) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={tareWeight || ''}
                      onChange={(e) => setTareWeight(Math.max(0, Number(e.target.value)))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-bold mb-1">Net Cargo Weight</label>
                    <div
                      className={`w-full p-2 rounded border font-mono font-bold text-sm ${
                        isValidWeight
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-800'
                      }`}
                    >
                      {netWeight > 0 ? `${netWeight} MT` : '0.00 MT'}
                    </div>
                  </div>
                </div>

                {!isValidWeight && (
                  <p className="text-[11px] text-rose-700 font-medium pt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Gross weight must exceed Tare weight. Net cargo cannot be zero or negative.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValidWeight}
                  className="px-4 py-1.5 rounded bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-xs"
                >
                  Certify & Issue Scale Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
