import React, { useState, useMemo } from 'react';
import {
  Plus,
  Printer,
  Truck,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Eye,
  X,
  Check,
  Building2,
  Phone,
  User,
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { DataGrid, Column } from '../../common/DataGrid';
import { StatusBadge } from '../../common/StatusBadge';
import { DeliveryChallan } from '../../../types/erp';

interface DeliveryChallansViewProps {
  onOpenPrintModal: (docType: any, data: any) => void;
}

export const DeliveryChallansView: React.FC<DeliveryChallansViewProps> = ({ onOpenPrintModal }) => {
  const {
    deliveryChallans,
    salesOrders,
    weighbridgeLogs,
    warehouseStock,
    warehouses,
    items,
    addDeliveryChallan,
    addWeighbridgeLog,
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewChallan, setViewChallan] = useState<DeliveryChallan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Weighbridge verification mode
  const [weighMode, setWeighMode] = useState<'ticket' | 'manual'>('ticket');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(salesOrders[0]?.sales_order_id || '');
  const [scaleTicketNo, setScaleTicketNo] = useState<string>('');
  const [truckNo, setTruckNo] = useState<string>('DHAKA-METRO-TA-14-8921');
  const [driverName, setDriverName] = useState<string>('Md. Selim Reza');
  const [driverPhone, setDriverPhone] = useState<string>('+880 1718 901234');
  const [securitySealNo, setSecuritySealNo] = useState<string>('SL-2026-9921');
  
  // Gross & Tare Scale Weights (MT)
  const [grossWeight, setGrossWeight] = useState<number>(51.4);
  const [tareWeight, setTareWeight] = useState<number>(15.6);
  const netWeight = useMemo(() => {
    const val = Number((grossWeight - tareWeight).toFixed(2));
    return val > 0 ? val : 0;
  }, [grossWeight, tareWeight]);

  // Selected Sales Order & Item Details
  const selectedOrder = useMemo(
    () => salesOrders.find((so) => so.sales_order_id === selectedOrderId),
    [salesOrders, selectedOrderId]
  );

  const orderItem = selectedOrder?.items[0];
  const orderTargetTonnage = orderItem?.quantity || 1000;
  const alreadyDelivered = selectedOrder?.delivered_quantity || 0;
  const remainingOrderTonnage = Math.max(0, orderTargetTonnage - alreadyDelivered);
  const projectedDeliveredTonnage = alreadyDelivered + netWeight;
  const isOverDelivery = netWeight > remainingOrderTonnage;
  const overDeliveryAmount = Math.max(0, netWeight - remainingOrderTonnage);

  // Available Depot Stock Check
  const availableDepotStock = useMemo(() => {
    if (!selectedOrder?.warehouse_id || !orderItem?.item_id) return 0;
    const stockRecord = warehouseStock.find(
      (ws) => ws.warehouse_id === selectedOrder.warehouse_id && ws.item_id === orderItem.item_id
    );
    return stockRecord ? stockRecord.quantity : 0;
  }, [warehouseStock, selectedOrder, orderItem]);

  const hasStockDeficit = netWeight > availableDepotStock;

  // Handle Scale Ticket Selection
  const handleScaleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    const log = weighbridgeLogs.find((w) => w.weighbridge_log_id === ticketId);
    if (!log) return;

    setScaleTicketNo(log.scale_ticket_no);
    setTruckNo(log.truck_no);
    setDriverName(log.driver_name);
    setDriverPhone(log.driver_phone);
    setGrossWeight(log.gross_weight);
    setTareWeight(log.tare_weight);

    // Auto-match sales order if reference matches or if truck is assigned
    if (log.reference_no) {
      const matchedOrder = salesOrders.find(
        (so) => so.order_no === log.reference_no || so.sales_order_id === log.reference_no
      );
      if (matchedOrder) setSelectedOrderId(matchedOrder.sales_order_id);
    }
  };

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedOrder) {
      setErrorMessage('Please select a valid destination Sales Order.');
      return;
    }

    if (grossWeight <= tareWeight) {
      setErrorMessage(
        `Scale Error: Gross Weight (${grossWeight} MT) must be strictly greater than Truck Tare Weight (${tareWeight} MT).`
      );
      return;
    }

    if (netWeight < 0.1) {
      setErrorMessage('Computed Net Weight must be at least 0.1 MT (100 kg) for aggregate dispatch.');
      return;
    }

    if (!truckNo || truckNo.trim().length < 5) {
      setErrorMessage('A valid BRTA truck license plate number is required.');
      return;
    }

    if (!driverName || driverName.trim().length < 3) {
      setErrorMessage('Driver full legal name is required.');
      return;
    }

    const challanNo = `CH-2026-${String(deliveryChallans.length + 451).padStart(5, '0')}`;
    const whRecord = warehouses.find((w) => w.warehouse_id === selectedOrder.warehouse_id);
    const generatedScaleTicket =
      scaleTicketNo || `WB-${whRecord?.warehouse_code || 'DEPOT'}-${Date.now().toString().slice(-6)}`;

    // If manual weighbridge entry was used, also register it in weighbridgeLogs for audit trail
    if (weighMode === 'manual') {
      addWeighbridgeLog({
        scale_ticket_no: generatedScaleTicket,
        truck_no: truckNo,
        driver_name: driverName,
        driver_phone: driverPhone,
        item_id: orderItem ? orderItem.item_id : 'itm-01',
        item_name: orderItem ? orderItem.item_name : 'Pakur Black Stone 20mm',
        port_or_depot: selectedOrder.warehouse_name,
        gross_weight: grossWeight,
        tare_weight: tareWeight,
        net_weight: netWeight,
        weight_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reference_type: 'Sales Challan',
        reference_no: challanNo,
        operator_name: 'Outbound Scale Operator',
      });
    }

    addDeliveryChallan({
      challan_no: challanNo,
      sales_order_id: selectedOrder.sales_order_id,
      sales_order_no: selectedOrder.order_no,
      party_id: selectedOrder.party_id,
      party_name: selectedOrder.party_name,
      warehouse_id: selectedOrder.warehouse_id,
      warehouse_name: selectedOrder.warehouse_name,
      challan_date: new Date().toISOString().split('T')[0],
      truck_no: truckNo.toUpperCase(),
      driver_name: driverName,
      driver_phone: driverPhone,
      status: 'dispatched',
      items: [
        {
          item_id: orderItem ? orderItem.item_id : 'itm-01',
          item_name: orderItem ? orderItem.item_name : 'Pakur Black Stone 20mm',
          dispatched_quantity: netWeight,
          unit_code: orderItem ? orderItem.unit_code : 'MT',
        },
      ],
    });

    setSuccessMessage(
      `Delivery Challan ${challanNo} issued successfully. Scale Ticket ${generatedScaleTicket} verified (${netWeight} MT dispatched to ${selectedOrder.party_name}).`
    );
    setIsModalOpen(false);
  };

  const columns: Column<DeliveryChallan>[] = [
    {
      key: 'challan_no',
      header: 'Challan & Gate Pass #',
      className: 'font-mono font-bold text-blue-900',
    },
    {
      key: 'sales_order_no',
      header: 'Sales Order Ref',
      render: (row) => (
        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
          {row.sales_order_no}
        </span>
      ),
    },
    {
      key: 'party_name',
      header: 'Customer / Consignee',
      className: 'font-semibold',
    },
    {
      key: 'truck_no',
      header: 'Truck License Plate',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {row.truck_no}
        </span>
      ),
    },
    {
      key: 'driver_name',
      header: 'Driver & Contact',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-900 block">{row.driver_name}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.driver_phone}</span>
        </div>
      ),
    },
    {
      key: 'warehouse_name',
      header: 'Depot Yard Gate',
    },
    {
      key: 'items',
      header: 'Net Payload (Scale)',
      render: (row) => (
        <div className="font-mono">
          <span className="font-bold text-blue-900">
            {row.items[0]?.dispatched_quantity.toLocaleString()} {row.items[0]?.unit_code}
          </span>
          <span className="block text-[10px] text-slate-500">
            {row.items[0]?.item_name}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Gate Exit Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewChallan(row)}
            className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            title="Inspect Challan Gate Pass & Scale Verification"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenPrintModal('Delivery Challan', row)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Print Official Delivery Challan Gate Pass"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Real-time Notification Banners */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center justify-between text-xs animate-fadeIn shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-xs animate-fadeIn shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Operational Policy Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-[11px]">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Outbound Logistics — Delivery Challans & Gate Passes</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed max-w-3xl">
            Strict Physical Yard Invariant: No aggregate cargo truck may exit a depot gate without a certified{' '}
            <strong className="text-white">Weighbridge Scale Ticket</strong> verifying gross and tare weights. Dispatched tonnage decrements yard inventory and feeds the commercial billing engine.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Dispatched Challans</div>
            <div className="font-mono font-bold text-white text-xs">
              {deliveryChallans.length}
            </div>
          </div>
          <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Tonnage Dispatched</div>
            <div className="font-mono font-bold text-emerald-400 text-xs">
              {deliveryChallans.reduce((acc, c) => acc + (c.items[0]?.dispatched_quantity || 0), 0).toFixed(1)} MT
            </div>
          </div>
        </div>
      </div>

      {/* DataGrid */}
      <DataGrid
        title="Delivery Challans & Security Gate Passes"
        subtitle="Manage aggregate truck dispatch authorization, weighbridge scale tickets, driver identity, and gate exit releases."
        columns={columns}
        data={deliveryChallans}
        searchKeys={['challan_no', 'sales_order_no', 'party_name', 'truck_no', 'driver_name']}
        statusKey="status"
        statusOptions={['draft', 'dispatched', 'received']}
        exportFileName="DeliveryChallans"
        actionButton={
          <button
            onClick={() => {
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Delivery Challan</span>
          </button>
        }
      />

      {/* Inspect Challan Gate Pass Modal */}
      {viewChallan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Delivery Gate Pass: {viewChallan.challan_no}</h3>
              </div>
              <button onClick={() => setViewChallan(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Header Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Customer</span>
                  <span className="font-bold text-slate-900">{viewChallan.party_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sales Order Ref</span>
                  <span className="font-mono font-bold text-blue-800">{viewChallan.sales_order_no}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Dispatch Date</span>
                  <span className="font-mono text-slate-800">{viewChallan.challan_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Truck Plate #</span>
                  <span className="font-mono font-bold text-slate-900">{viewChallan.truck_no}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Driver Name</span>
                  <span className="font-medium text-slate-800">{viewChallan.driver_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Driver Phone</span>
                  <span className="font-mono text-slate-700">{viewChallan.driver_phone}</span>
                </div>
              </div>

              {/* Cargo Dispatched Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-blue-800 uppercase font-bold block">Dispatched Aggregate Material</span>
                  <span className="font-bold text-slate-900 text-sm">{viewChallan.items[0]?.item_name}</span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">Depot Yard: {viewChallan.warehouse_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-800 uppercase font-bold block">Certified Scale Weight</span>
                  <span className="font-mono font-bold text-blue-900 text-lg">
                    {viewChallan.items[0]?.dispatched_quantity.toLocaleString()} {viewChallan.items[0]?.unit_code}
                  </span>
                </div>
              </div>

              {/* Gate Pass Security & Regulatory Stamp */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs">Security Gate Pass Clearance</span>
                    <span className="text-[10px] text-emerald-700">
                      Weighbridge gross & tare weights verified. Gate Pass barcode stamped for exit clearance.
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-700 text-white font-mono text-[11px] font-bold">
                  CLEARED
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    onOpenPrintModal('Delivery Challan', viewChallan);
                    setViewChallan(null);
                  }}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Gate Pass (3 Copies)</span>
                </button>
                <button
                  onClick={() => setViewChallan(null)}
                  className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Delivery Challan Modal with Weighbridge & Scale Ticket Verification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Issue Delivery Challan & Scale Gate Pass</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChallan} className="p-5 space-y-4 text-xs overflow-y-auto">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Weighbridge Verification Source Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="block text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  Weighbridge Scale Binding Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWeighMode('ticket')}
                    className={`p-2 rounded text-left border transition-all ${
                      weighMode === 'ticket'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <Scale className="w-3.5 h-3.5 text-blue-600" />
                      <span>Link Scale Ticket</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Select certified weighbridge log
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeighMode('manual')}
                    className={`p-2 rounded text-left border transition-all ${
                      weighMode === 'manual'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <Truck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Direct Gross / Tare Entry</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Weighbridge operator live reading
                    </span>
                  </button>
                </div>

                {/* Linked Ticket Selector */}
                {weighMode === 'ticket' && (
                  <div className="pt-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Select Outbound Scale Ticket (Weighbridge) *
                    </label>
                    <select
                      value={selectedTicketId}
                      onChange={(e) => handleScaleTicketSelect(e.target.value)}
                      required
                      className="w-full p-2 rounded border border-blue-300 bg-white text-slate-900 font-medium"
                    >
                      <option value="">-- Choose Weighbridge Scale Ticket --</option>
                      {weighbridgeLogs.map((log) => (
                        <option key={log.weighbridge_log_id} value={log.weighbridge_log_id}>
                          {log.scale_ticket_no} — {log.truck_no} ({log.net_weight} MT Net | {log.driver_name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Destination Sales Order Reference */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Destination Sales Order Reference *
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  required
                  className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white"
                >
                  {salesOrders.map((so) => (
                    <option key={so.sales_order_id} value={so.sales_order_id}>
                      {so.order_no} — {so.party_name} ({so.items[0]?.item_name} @ {so.warehouse_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Fulfillment & Stock Status Card */}
              {selectedOrder && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Contract Fulfillment Status: {selectedOrder.order_no}
                    </span>
                    <span className="font-mono text-slate-600">
                      Depot Available: {availableDepotStock.toLocaleString()} MT
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono border-t border-slate-200 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Order Total</span>
                      <span className="font-bold text-slate-800">{orderTargetTonnage.toLocaleString()} MT</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Delivered Prior</span>
                      <span className="font-bold text-slate-700">{alreadyDelivered.toLocaleString()} MT</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Remaining Balance</span>
                      <span className="font-bold text-blue-900">{remainingOrderTonnage.toLocaleString()} MT</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">This Truck Payload</span>
                      <span className="font-bold text-emerald-800">{netWeight.toLocaleString()} MT</span>
                    </div>
                  </div>

                  {isOverDelivery && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>
                        Notice: This truck exceeds the remaining order quota by {overDeliveryAmount.toFixed(2)} MT.
                        Ensure commercial tolerance approval before exit.
                      </span>
                    </div>
                  )}

                  {hasStockDeficit && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>
                        Warning: Available yard stockpile ({availableDepotStock.toLocaleString()} MT) is less than this truck's payload ({netWeight.toLocaleString()} MT).
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Truck & Driver Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Truck License Plate (BRTA Format) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHAKA-METRO-TA-14-8921"
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value.toUpperCase())}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Security Gate Seal Number
                  </label>
                  <input
                    type="text"
                    value={securitySealNo}
                    onChange={(e) => setSecuritySealNo(e.target.value)}
                    placeholder="e.g. SL-2026-9921"
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Driver Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Driver Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Weighbridge Gross, Tare, and Net Scale Calculations */}
              <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-700" /> Certified Weighbridge Scale Weights
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Net = Gross (Loaded) - Tare (Empty)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Gross Weight (MT) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Tare Weight (MT) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      required
                      value={tareWeight}
                      onChange={(e) => setTareWeight(Number(e.target.value))}
                      className="w-full p-2 rounded border border-slate-300 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Net Dispatched (MT)
                    </label>
                    <div className="w-full p-2 rounded border border-blue-300 bg-white text-blue-900 font-mono font-bold text-sm text-right">
                      {netWeight.toFixed(2)} MT
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grossWeight <= tareWeight || netWeight < 0.1}
                  className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Authorize & Issue Gate Pass</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
