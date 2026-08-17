// Utilities for formatted dynamic current timestamps
export const getLiveCurrentDateStr = (offsetHours: number = 0): string => {
  const now = new Date(Date.now() - offsetHours * 3600000);
  return now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getLiveCurrentDateTimeStr = (offsetHours: number = 0): string => {
  const now = new Date(Date.now() - offsetHours * 3600000);
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${date} ${time}`;
};

export const getLiveRelativeTime = (offsetHours: number = 0): string => {
  if (offsetHours < 1) {
    const mins = Math.max(2, Math.floor((offsetHours || 0.1) * 60));
    return `${mins}m ago`;
  }
  if (offsetHours < 24) {
    return `${Math.floor(offsetHours)}h ago`;
  }
  const days = Math.floor(offsetHours / 24);
  return `${days}d ago`;
};

/**
 * Formats an event timestamp with current live time representation
 * e.g., "10:35 AM", "12m ago", or "Today, 02:45 PM"
 */
export const formatLiveEventTime = (input?: string | Date | number): string => {
  if (!input) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const d = new Date(input);
  const now = Date.now();
  const diffMs = now - d.getTime();

  // If timestamp is invalid or from future, default to now
  if (isNaN(d.getTime()) || diffMs < 0) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffMins < 60) {
    return `${Math.max(1, diffMins)}m ago • ${timeStr}`;
  }

  if (diffHours < 24) {
    return `Today • ${timeStr}`;
  }

  if (diffHours < 48) {
    return `Yesterday • ${timeStr}`;
  }

  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • ${timeStr}`;
};

/**
 * Formats a review timestamp relative to current date (e.g., "Today", "Yesterday", "14 Aug")
 */
export const formatLiveReviewDate = (input?: string | Date | number): string => {
  if (!input) {
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  const d = new Date(input);
  const now = new Date();

  if (isNaN(d.getTime())) {
    return now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  const isSameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return `Today, ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
  }

  const yesterday = new Date(now.getTime() - 86400000);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Yesterday, ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
  }

  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

/**
 * Formats a project added date / lifetime
 */
export const formatLiveProjectAge = (lifetimeDays?: number, dateAdded?: string): string => {
  if (typeof lifetimeDays === 'number') {
    if (lifetimeDays <= 0) return 'Today (New)';
    if (lifetimeDays === 1) return '1 day ago';
    return `${lifetimeDays} days ago`;
  }
  if (dateAdded) {
    const d = new Date(dateAdded);
    if (!isNaN(d.getTime())) {
      const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (diffDays <= 0) return 'Today (New)';
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    }
  }
  return 'Today';
};
