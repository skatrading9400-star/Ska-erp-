import React from 'react';
import { X, Printer } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'Sales Invoice' | 'Purchase Order' | 'Delivery Challan' | 'Weighbridge Ticket' | 'Journal Voucher';
  data: any;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType,
  data,
}) => {
  const { company, formatBDT } = useERP();

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Action Header */}
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Print Document Preview
            </span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-white font-mono">
              {data.invoice_no || data.po_no || data.challan_no || data.scale_ticket_no || data.voucher_no}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 text-xs font-sans print:p-0">
          {/* Company Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-bold text-sm px-2 py-1 tracking-wider rounded">
                  SKA
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                  {company.company_name}
                </h1>
              </div>
              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed max-w-md">
                {company.address}
                <br />
                Phone: {company.phone} · Email: {company.email}
                <br />
                BIN: <span className="font-semibold text-slate-800">{company.bin_no}</span> · TIN:{' '}
                <span className="font-semibold text-slate-800">{company.tin_no}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 font-bold uppercase tracking-widest text-xs rounded">
                {documentType}
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Date:{' '}
                <span className="font-semibold text-slate-900">
                  {data.invoice_date || data.po_date || data.challan_date || data.weight_date || data.voucher_date}
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                Doc Ref:{' '}
                <span className="font-bold text-slate-900 font-mono">
                  {data.invoice_no || data.po_no || data.challan_no || data.scale_ticket_no || data.voucher_no}
                </span>
              </p>
              <div className="mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                  STATUS: {data.status || (data.is_posted ? 'POSTED' : 'DRAFT')}
                </span>
              </div>
            </div>
          </div>

          {/* Party / Entity Section */}
          <div className="grid grid-cols-2 gap-6 p-3 bg-slate-50 border border-slate-200 rounded mb-6 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {documentType.includes('Sales') ? 'Billed To (Customer)' : 'Party / Consignee'}
              </span>
              <p className="font-bold text-slate-900 text-sm">{data.party_name || data.supplier_name || 'Internal'}</p>
              {data.warehouse_name && (
                <p className="text-slate-600 mt-0.5">
                  Depot / Site: <span className="font-medium text-slate-800">{data.warehouse_name}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Logistics & Transport
              </span>
              {data.truck_no && (
                <p className="text-slate-700 font-mono">
                  Truck: <span className="font-bold text-slate-900">{data.truck_no}</span>
                </p>
              )}
              {data.driver_name && (
                <p className="text-slate-600">
                  Driver: {data.driver_name} {data.driver_phone && `(${data.driver_phone})`}
                </p>
              )}
              {data.port_or_depot && <p className="text-slate-600">Station: {data.port_or_depot}</p>}
            </div>
          </div>

          {/* Lines Table */}
          {documentType === 'Weighbridge Ticket' ? (
            <div className="border border-slate-300 rounded overflow-hidden my-4">
              <div className="bg-slate-100 p-3 font-semibold text-slate-800 text-center border-b border-slate-300">
                CERTIFIED SCALE WEIGHT MEASUREMENT
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-300 text-center p-4 bg-white">
                <div>
                  <span className="text-xs text-slate-500 uppercase block">Gross Weight</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{data.gross_weight} MT</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase block">Tare Weight</span>
                  <span className="text-xl font-bold font-mono text-slate-700">{data.tare_weight} MT</span>
                </div>
                <div className="bg-blue-50/50">
                  <span className="text-xs text-blue-700 font-bold uppercase block">Net Cargo Weight</span>
                  <span className="text-2xl font-bold font-mono text-blue-900">{data.net_weight} MT</span>
                </div>
              </div>
            </div>
          ) : documentType === 'Journal Voucher' ? (
            <div className="border border-slate-200 rounded overflow-hidden mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-2">Account Code & Name</th>
                    <th className="p-2">Narration</th>
                    <th className="p-2 text-right">Debit (৳ BDT)</th>
                    <th className="p-2 text-right">Credit (৳ BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.lines?.map((line: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono">
                        <span className="font-bold">{line.account_code}</span> - {line.account_name}
                      </td>
                      <td className="p-2 text-slate-600">{line.narration}</td>
                      <td className="p-2 text-right font-mono font-semibold">
                        {line.debit_amount > 0 ? formatBDT(line.debit_amount) : '—'}
                      </td>
                      <td className="p-2 text-right font-mono font-semibold">
                        {line.credit_amount > 0 ? formatBDT(line.credit_amount) : '—'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="p-2 text-right uppercase">
                      Balanced Totals:
                    </td>
                    <td className="p-2 text-right font-mono text-slate-900">{formatBDT(data.total_debit)}</td>
                    <td className="p-2 text-right font-mono text-slate-900">{formatBDT(data.total_credit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-slate-200 rounded overflow-hidden mb-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-right">Quantity</th>
                    {data.items?.[0]?.unit_price !== undefined && (
                      <th className="p-2.5 text-right">Rate (৳ BDT)</th>
                    )}
                    {data.items?.[0]?.line_total !== undefined && (
                      <th className="p-2.5 text-right">Amount (৳ BDT)</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.items?.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2.5 text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-medium text-slate-900">{item.item_name}</td>
                      <td className="p-2.5 text-right font-mono">
                        {item.quantity || item.dispatched_quantity || item.received_quantity} {item.unit_code}
                      </td>
                      {item.unit_price !== undefined && (
                        <td className="p-2.5 text-right font-mono">{formatBDT(item.unit_price)}</td>
                      )}
                      {item.line_total !== undefined && (
                        <td className="p-2.5 text-right font-mono font-semibold">{formatBDT(item.line_total)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {data.grand_total !== undefined && (
                  <tfoot>
                    <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <td
                        colSpan={data.items?.[0]?.unit_price !== undefined ? 3 : 2}
                        className="p-2.5 text-right uppercase"
                      >
                        Grand Total:
                      </td>
                      <td colSpan={2} className="p-2.5 text-right font-mono text-sm text-blue-900">
                        {formatBDT(data.grand_total)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {/* Terms & Signatures */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-[11px] text-slate-600">
            <div>
              <div className="border-t border-slate-300 pt-2 font-semibold">Prepared By</div>
              <p className="text-[10px] text-slate-400">{data.created_by || 'Executive Desk'}</p>
            </div>
            <div>
              <div className="border-t border-slate-300 pt-2 font-semibold">Verified / Inspected By</div>
              <p className="text-[10px] text-slate-400">Yard & Accounts Division</p>
            </div>
            <div>
              <div className="border-t border-slate-300 pt-2 font-semibold text-slate-900">
                Authorised Signatory
              </div>
              <p className="text-[10px] text-slate-400">For Ska Trading & Logistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
