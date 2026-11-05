import React, { useState, useMemo } from 'react';
import { Search, Download, Printer, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataGridProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T)[];
  statusKey?: keyof T;
  statusOptions?: string[];
  onRowClick?: (row: T) => void;
  actionButton?: React.ReactNode;
  exportFileName?: string;
  onPrint?: () => void;
  pageSize?: number;
}

export function DataGrid<T extends { [key: string]: any }>({
  title,
  subtitle,
  columns,
  data,
  searchKeys = [],
  statusKey,
  statusOptions = [],
  onRowClick,
  actionButton,
  exportFileName = 'export',
  onPrint,
  pageSize = 10,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusKey && selectedStatus !== 'all') {
        const itemStatus = String(item[statusKey]).toLowerCase();
        if (itemStatus !== selectedStatus.toLowerCase()) return false;
      }
      // Search term
      if (searchTerm.trim() && searchKeys.length > 0) {
        const query = searchTerm.toLowerCase();
        return searchKeys.some((k) => {
          const val = item[k];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        });
      }
      return true;
    });
  }, [data, searchTerm, searchKeys, statusKey, selectedStatus]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = columns.map((col) => col.header);
    const rows = sortedData.map((row) =>
      columns.map((col) => {
        const val = row[col.key];
        return val !== undefined && val !== null ? String(val).replace(/"/g, '""') : '';
      })
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `${exportFileName}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-xs flex flex-col overflow-hidden">
      {/* Top Header & Actions Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">{title}</h2>
            <span className="text-xs text-[#64748B] font-semibold px-2 py-0.5 bg-slate-200/70 rounded">
              {filteredData.length} records
            </span>
          </div>
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {actionButton}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          {onPrint && (
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
              title="Print data view"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search within records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Status Filter Tabs */}
        {statusKey && statusOptions.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedStatus(opt);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                  selectedStatus.toLowerCase() === opt.toLowerCase()
                    ? 'bg-blue-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-semibold uppercase tracking-wider text-[11px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-2.5 px-3 font-semibold ${col.className || ''} ${
                    col.sortable !== false ? 'cursor-pointer select-none hover:bg-slate-200/60' : ''
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400 text-xs">
                  No matching records found in database.
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-2.5 px-3 text-slate-700 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key] !== undefined ? String(row[col.key]) : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{sortedData.length}</span> results
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
