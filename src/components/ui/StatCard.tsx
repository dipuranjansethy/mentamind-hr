import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

export default function StatCard({ title, value, icon, change, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
              {change && (
                <dd className="flex items-baseline">
                  <p
                    className={`text-sm font-semibold ${
                      change.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {change.positive ? '↑' : '↓'} {change.value}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">from last month</p>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
