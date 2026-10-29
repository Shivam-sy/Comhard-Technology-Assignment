import React from 'react';

export function Card({ children, title, subtitle, action, className = '', noPadding = false }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-slate-900 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

export default Card;
