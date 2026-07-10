import React from 'react';

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-pending',
    accepted: 'badge-accepted',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
  };
  return (
    <span className={map[status] || 'bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium'}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
