import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = (status || '').toLowerCase().replace(/_/g, ' ');

  // Banking standard status tokens:
  // Success: Emerald Green (#059669 text, #D1FAE5 light green bg, #A7F3D0 border)
  // Warning: Amber Orange (#D97706 text, #FEF3C7 light amber bg, #FDE68A border)
  // Neutral: Slate (#475569 text, #F1F5F9 bg, #E2E8F0 border)
  let colorClasses = 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';

  if (
    norm === 'posted' ||
    norm === 'approved' ||
    norm === 'awarded' ||
    norm === 'active' ||
    norm === 'closed won' ||
    norm === 'received' ||
    norm === 'completed'
  ) {
    colorClasses = 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]';
  } else if (
    norm === 'pending approval' ||
    norm === 'pending' ||
    norm === 'under review' ||
    norm === 'pending sign' ||
    norm === 'overdue'
  ) {
    colorClasses = 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
  } else if (norm === 'draft' || norm === 'new' || norm === 'published') {
    colorClasses = 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
  } else if (norm === 'dispatched' || norm === 'in transit' || norm === 'in progress') {
    colorClasses = 'bg-blue-50 text-[#1E40AF] border-blue-200';
  } else if (norm === 'rejected' || norm === 'closed lost' || norm === 'exceeded') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (norm === 'port customs clearance' || norm === 'boq analyzed') {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold border rounded uppercase tracking-wider ${px} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {norm}
    </span>
  );
};
