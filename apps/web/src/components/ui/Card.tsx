import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-gray-150 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800/80 transition-all duration-150',
        hoverable && 'hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
