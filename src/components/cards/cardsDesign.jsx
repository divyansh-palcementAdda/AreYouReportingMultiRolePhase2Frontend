import React from 'react';

// Color array for different card types
export const cardColors = {
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-green-700',
    numberColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-700',
    numberColor: 'text-orange-800',
    borderColor: 'border-orange-200'
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-700',
    numberColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-700',
    numberColor: 'text-red-800',
    borderColor: 'border-red-200'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-700',
    numberColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  }
};

// Icon array for different card types
export const cardIcons = {
  totalTasks: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  completed: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  pending: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  inProgress: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  overdue: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  approvals: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

// Reusable Card Component
export const CardDesign = ({ 
  icon, 
  title, 
  number, 
  secondaryText, 
  colorScheme = 'green',
  className = ''
}) => {
  const colors = cardColors[colorScheme] || cardColors.green;

  return (
    <div className={`rounded-xl border ${colors.borderColor} ${colors.bg} p-2 sm:p-3 md:p-2 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${colors.iconBg} ${colors.iconColor} p-1.5 sm:p-2 rounded-lg`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] sm:text-xs font-semibold ${colors.titleColor} uppercase tracking-wide`}>
            {title}
          </p>
          <p className={`text-lg sm:text-xl md:text-2xl font-bold ${colors.numberColor} mt-0.5 sm:mt-1`}>
            {number}
          </p>
          {secondaryText && (
            <p className={`text-[10px] sm:text-xs ${colors.titleColor} mt-0.5 sm:mt-1 opacity-75`}>
              {secondaryText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Specific Card Components
export const TotalTasksCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.totalTasks}
    title="Total Tasks"
    number={number}
    secondaryText={secondaryText}
    colorScheme="green"
    className={className}
  />
);

export const CompletedCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.completed}
    title="Completed"
    number={number}
    secondaryText={secondaryText}
    colorScheme="green"
    className={className}
  />
);

export const PendingCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.pending}
    title="Pending"
    number={number}
    secondaryText={secondaryText}
    colorScheme="orange"
    className={className}
  />
);

export const InProgressCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.inProgress}
    title="In Progress"
    number={number}
    secondaryText={secondaryText}
    colorScheme="blue"
    className={className}
  />
);

export const OverdueCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.overdue}
    title="Overdue"
    number={number}
    secondaryText={secondaryText}
    colorScheme="red"
    className={className}
  />
);

export const ApprovalsCard = ({ number, secondaryText, className = '' }) => (
  <CardDesign
    icon={cardIcons.approvals}
    title="Approvals"
    number={number}
    secondaryText={secondaryText}
    colorScheme="purple"
    className={className}
  />
);

